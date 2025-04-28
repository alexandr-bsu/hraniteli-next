'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setActions } from '@/redux/slices/application_form_data';
import { useDispatch } from 'react-redux';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { COLORS } from '@/shared/constants/colors';

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
          condition: savedConditions
        }
      })

      useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('app_conditions', JSON.stringify(value.condition || []))
    })
    return () => subscription.unsubscribe()
  }, [form.watch])
    

    const handleSubmit = (data: FormData) => {
        const selectedConditions = data.condition
          .reduce<string[]>((acc, conditionId) => {
            const condition = CONDITIONS.find(item => item.id === conditionId);
            if (condition?.label) {
              acc.push(condition.label);
            }
            return acc;
          }, []);
        dispatch(setActions(selectedConditions));
        dispatch(setApplicationStage('traumatic'));
    };

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="condition"
                        render={() => (
                               <div className='grow h-[360px]'>
                                    <FormItem
                                        className='grow p-[30px] h-full max-h-[390px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel
                                        className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px] text-[${COLORS.text.primary}]'
                                    >
                                        Что из описанного ниже вы наблюдаете в своём состоянии в последнее время?
                                    </FormLabel>
                                    <FormDescription
                                        className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] text-[${COLORS.text.secondary}]'
                                    >
                                       Выберите все подходящие пункты или пропустите вопрос, если ничего из этого не наблюдается
                                    </FormDescription>
                                        <div className='flex justify-between mt-[10px] max-lg:flex-col  max-h-[150px] max-lg:max-h-none overflow-hidden'>
                                           <div className='flex flex-col gap-[10px] w-full max-h-[150px] max-lg:max-h-[200px] pb-[50px] overflow-x-auto'>
                                            {CONDITIONS.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="condition"
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
                                                        <FormLabel className={`text-[18px] leading-[25px] max-lg:text-[14px] font-normal text-[${COLORS.text.primary}]`}>
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
                    <div className="shrink-0 mt-[30px]  pb-[50px] flex gap-[10px]">
                        <button onClick={() => dispatch(setApplicationStage('request'))} className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}>
                            Назад
                        </button>

                        <button type='submit' className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}>
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ConditionStage;