'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setTraumatic, setHasMatchingError } from '@/redux/slices/application_form_data';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { COLORS } from '@/shared/constants/colors';
import axios from 'axios';
import { RootState } from '@/redux/store';

const TRAUMATIC_EVENTS = [
    {
        id: "traumatic1",
        label: "Утрата близкого",
    },
    {
        id: "traumatic2",
        label: "Болезни близкого",
    },
    {
        id: "traumatic3",
        label: "Диагностированное смертельное заболевание",
    },
    {
        id: "traumatic4",
        label: "Сексуальное насилие во взрослом возрасте",
    },
    {
        id: "traumatic5",
        label: "Сексуальное насилие в детстве",
    },
    {
        id: "traumatic6",
        label: "Ничего из вышеперечисленного",
    },
] as const;

const FormSchema = z.object({
    traumatic: z.array(z.string())
});

type FormData = z.infer<typeof FormSchema>;

export const TraumaticStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Травматическое событие", ticket_id:ticketID },
        });
    }, [])

    const savedTraumatic = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('app_traumatic') || '[]')
        : [];

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            traumatic: savedTraumatic.map((label: string) =>
                TRAUMATIC_EVENTS.find(item => item.label === label)?.id || ''
            ).filter((id: string) => id !== '')
        }
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            // Преобразуем ID в label'ы перед сохранением
            const labels = value.traumatic?.map(id => {
                const event = TRAUMATIC_EVENTS.find(item => item.id === id);
                return event?.label || '';
            }).filter(label => label !== '') || [];

            localStorage.setItem('app_traumatic', JSON.stringify(labels));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const handleSubmit = async (data: FormData) => {
        const selectedEvents = data.traumatic
            .reduce<string[]>((acc, eventId) => {
                const event = TRAUMATIC_EVENTS.find(item => item.id === eventId);
                if (event?.label) {
                    acc.push(event.label);
                }
                return acc;
            }, []);

        // Сохраняем только в localStorage
        localStorage.setItem('app_traumatic', JSON.stringify(selectedEvents));
        axios({
            url: 'https://n8n-v2.hrani.live/webhook/step-analytics',
            method: 'PUT',
            data: { ticketID, field: 'traumatic_events', value: selectedEvents }
            }
          )
        // Сохраняем в Redux
        dispatch(setTraumatic(selectedEvents));

        dispatch(setApplicationStage('diseases_psychologist'));
    };

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col min-h-min mt-[15px]">
                    <FormField
                        control={form.control}
                        name="traumatic"
                        render={() => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px] min-lg:h-[300px] overflow-y-auto'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Беспокоит ли вас травмирующее событие, с которым сложно справиться самостоятельно?
                                    </FormLabel>
                                    <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Выберите все подходящие пункты или пропустите вопрос, если ничего из этого не беспокоит
                                    </FormDescription>
                                    <div className='flex flex-col gap-[20px] max-lg:gap-[16px] mt-[20px] max-lg:mt-[16px]'>
                                        {TRAUMATIC_EVENTS.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="traumatic"
                                                render={({ field }) => {
                                                    return (
                                                        <FormItem
                                                            key={item.id}
                                                            className="flex flex-row items-start space-x-3 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={field.value?.includes(item.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        return checked
                                                                            ? field.onChange([...field.value, item.id])
                                                                            : field.onChange(
                                                                                field.value?.filter(
                                                                                    (value) => value !== item.id
                                                                                )
                                                                            )
                                                                    }}
                                                                    className='h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]'
                                                                />
                                                            </FormControl>
                                                            <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                                {item.label}
                                                            </FormLabel>
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        ))}
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px] mt-[30px] max-lg:mt-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('condition'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Назад
                        </button>
                        <button
                            type='submit'
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default TraumaticStage;