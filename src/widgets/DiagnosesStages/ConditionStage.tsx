'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setConditions, setHasMatchingError } from '@/redux/slices/application_form_data';
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { COLORS } from '@/shared/constants/colors';
import { findByConditions } from '@/redux/slices/filter';
import { RootState } from '@/redux/store';
import { submitQuestionnaire, getFilteredPsychologists } from "@/features/actions/getPsychologistSchedule"
import { fill_filtered_by_automatch_psy } from "@/redux/slices/filter"

const CONDITIONS = [
    {
      id: "condition",
      label: "Физические недомогания: постоянная усталость, бессонница, проблемы с питанием, проблемы с памятью, психосоматические реакции",
    },
    {
        id: "condition1",
        label: "Подавленное настроение, прокрастинация, ощущение бессмысленности существования, опустошенность, отверженность",
    },
    {
        id: "condition2",
        label: "Беременность, родительство, послеродовая депрессия, проблемы в отношениях с детьми до 18 лет",
    },
    {
        id: "condition3",
        label: "Абьюзивные отношения, домашнее насилие",
    },
    {
        id: "condition4",
        label: "Психологические зависимости: игровые, любовные, виртуальные и прочие",
    },
    {
        id: "condition5",
        label: "Состояние ужаса, панические атаки",
    },
    {
        id: "condition6",
        label: "Намерения или попытки суицида",
    },
    {
        id: "condition7",
        label: "Повышенная эмоциональность, эмоциональные всплески, приступы агрессии, поступки под действием эмоций, частые смены настроения",
    },
    {
        id: "condition8",
        label: "Сложности в сексуальной сфере",
    },
    {
        id: "condition9",
        label: "Проблемы с раскрытием женственности и сексуальности",
    },
    {
        id: "condition10",
        label: "Ничего из вышеперечисленного",
    },
] as const

const FormSchema = z.object({
    condition: z.array(z.string())
});

type FormData = z.infer<typeof FormSchema>;

export const ConditionStage = () => {
    const dispatch = useDispatch();

    const savedConditions = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('app_conditions') || '[]')
    : []

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            // Преобразуем label'ы в ID при загрузке
            condition: savedConditions.map((label: string) => 
                CONDITIONS.find(item => item.label === label)?.id || ''
            ).filter((id: string) => id !== '')
        }
    });

    useEffect(() => {
        const subscription = form.watch((value) => {
            // Преобразуем ID в label'ы перед сохранением
            const labels = value.condition?.map(id => {
                const condition = CONDITIONS.find(item => item.id === id);
                return condition?.label || '';
            }).filter(label => label !== '') || [];
            
            localStorage.setItem('app_conditions', JSON.stringify(labels));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);
    

    const handleSubmit = async (data: FormData) => {
        const selectedConditions = data.condition
          .reduce<string[]>((acc, conditionId) => {
            const condition = CONDITIONS.find(item => item.id === conditionId);
            if (condition?.label) {
              acc.push(condition.label);
            }
            return acc;
          }, []);

        // Сохраняем только в localStorage
        localStorage.setItem('app_conditions', JSON.stringify(selectedConditions));

        // Сохраняем в Redux
        dispatch(setConditions(selectedConditions));

        dispatch(setApplicationStage('traumatic'));
    };

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="condition"
                        render={() => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px] min-lg:h-[360px] overflow-y-auto'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Что из описанного ниже вы наблюдаете в своём состоянии в последнее время?
                                    </FormLabel>
                                    <FormDescription className='text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Выберите все подходящие пункты или пропустите вопрос, если ничего из этого не наблюдается
                                    </FormDescription>
                                    <div className='flex flex-col gap-[20px] max-lg:gap-[16px] mt-[20px] max-lg:mt-[16px]'>
                                        {CONDITIONS.map((item) => (
                                            <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="condition"
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
                            onClick={() => dispatch(setApplicationStage('gender_psychologist'))}
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

export default ConditionStage;