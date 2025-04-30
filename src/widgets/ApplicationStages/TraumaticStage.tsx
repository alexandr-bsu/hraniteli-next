'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setActions, setHasMatchingError } from '@/redux/slices/application_form_data';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { COLORS } from '@/shared/constants/colors';
import { findByTraumatic } from '@/redux/slices/filter';
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
    const filtered_persons = useSelector((state: RootState) => state.filter.filtered_by_automatch_psy);
    const hasError = useSelector((state: RootState) => state.applicationFormData.has_matching_error);

    const savedTraumatic = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('app_traumatic') || '[]')
        : [];

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            traumatic: savedTraumatic
        }
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem('app_traumatic', JSON.stringify(value.traumatic || []));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const handleSubmit = (data: FormData) => {
        const selectedEvents = data.traumatic
            .reduce<string[]>((acc, eventId) => {
                const event = TRAUMATIC_EVENTS.find(item => item.id === eventId);
                if (event?.label) {
                    acc.push(event.label);
                }
                return acc;
            }, []);

        // Сначала проверяем подходящих психологов
        dispatch(findByTraumatic(selectedEvents));

        dispatch(setActions(selectedEvents));
        dispatch(setApplicationStage('diseases_psychologist'));
    };

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="traumatic"
                        render={() => (
                            <div className='grow h-[360px]'>
                                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel className='max-lg:text-[16px] font-semibold text-[20px] leading-[27px]'>
                                        Беспокоит ли вас травмирующее событие, с которым сложно справиться самостоятельно?
                                    </FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px]'>
                                        Выберите все подходящие пункты или пропустите вопрос, если ничего из этого не беспокоит
                                    </FormDescription>
                                    <div className='flex justify-between mt-[10px] max-lg:flex-col max-h-[150px] max-lg:max-h-none overflow-hidden'>
                                        <div className='flex flex-col gap-[10px] w-full max-h-[150px] max-lg:max-h-[200px] pb-[50px] overflow-x-auto'>
                                            {TRAUMATIC_EVENTS.map((item) => (
                                                <FormField
                                                    key={item.id}
                                                    control={form.control}
                                                    name="traumatic"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem
                                                                key={item.id}
                                                                className="flex flex-row items-center space-x-3 space-y-0"
                                                            >
                                                                <FormControl>
                                                                    <Checkbox
                                                                        className='h-[30px] w-[30px]'
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter(
                                                                                        (value: string) => value !== item.id
                                                                                    )
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className={`text-[18px] leading-[25px] max-lg:text-[16px] font-normal`}>
                                                                    {item.label}
                                                                </FormLabel>
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 mt-[30px] pb-[50px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('condition'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[16px] rounded-[50px]`}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[16px] rounded-[50px]`}
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