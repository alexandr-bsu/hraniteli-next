'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toNextStage } from '@/redux/slices/application_form';
import { fill_conditions } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'

const ConditionStage = () => {
    const dispatch = useDispatch();

        const condition = [
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

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            condition: [],
        }
    })

    function handleSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(toNextStage('action')) 

        const result = []

        for (let index = 0; index < data.condition.length; index++) {
            const findElements = condition.find(item => item.id === data.condition[index])
            result.push(findElements?.label);
        }


        dispatch(fill_conditions(result))
    }
    return (
        <div className='px-[50px] max-lg:px-[20px]  flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[20px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="condition"
                        render={({  }) => (
                            <div className='grow '>
                                <FormItem className='grow p-[25px] max-lg:p-[15px] max-lg:max-h-none border-[1px] rounded-[25px]  max-h-[390px]'>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px] max-lg:w-full w-[541px] '>Что из описанного ниже вы наблюдаете в своём состоянии в последнее время?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] w-full font-normal text-[18px]  leading-[25px] mt-[10px]  '>
                                        Выберите все подходящие пункты или пропустите вопрос, если ничего из этого не наблюдается
                                    </FormDescription>
                                    <div className='flex justify-between mt-[25px] max-lg:flex-col min-h-full'>
                                        <div className='flex flex-col gap-[15px] w-full max-h-[150px] max-lg:max-h-[200px] overflow-x-auto'>
                                            {condition.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="condition"
                                                render={({ field }: any) => {
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
                                                                    (value: any) => value !== item.id
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="text-[18px] leading-[25px] max-lg:text-[14px]  font-normal">
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
                    <div className="shrink-0  pb-[50px] flex gap-[10px]  max-lg:mt-[20px]">
                        <button onClick={() => dispatch(toNextStage('request'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                            Назад
                        </button>

                        <button type='submit' className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ConditionStage;