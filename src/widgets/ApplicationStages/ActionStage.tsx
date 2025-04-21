'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toNextStage } from '@/redux/slices/application_form';
import { fill_actions } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'


        const actions = [
        {
          id: "recents",
          label: "Утрата близкого",
        },
        {
            id: "recents1",
            label: "Болезни близкого",
        },
        {
            id: "recents2",
            label: "Диагностированное смертельное заболевание",
        },
        {
            id: "recents3",
            label: "Сексуальное насилие во взрослом возрасте",
        },
        {
            id: "recents4",
            label: "Сексуальное насилие в детстве",
        },
        {
            id: "recents5",
            label: "Ничего из вышеперечисленного",
        },
    ] as const

    const FormSchema = z.object({
        actions: z.array(z.string())
    });

    const ActionStage = () => {
        const dispatch = useDispatch();

        const savedActions = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('app_actions') || '[]')
        : []    

    const form = useForm<z.infer<typeof FormSchema>>({
            resolver: zodResolver(FormSchema),
            defaultValues: {
              actions: savedActions
            }
          })
          
          useEffect(() => {
              const subscription = form.watch((value) => {
                localStorage.setItem('app_actions', JSON.stringify(value.actions || []))
              })
              return () => subscription.unsubscribe()
            }, [form.watch])

  function handleSubmit(data: z.infer<typeof FormSchema>) {
          dispatch(toNextStage('diseases')) 
  
          const result = []
  
          for (let index = 0; index < data.actions.length; index++) {
              const findElements = actions.find(item => item.id === data.actions[index])
              result.push(findElements?.label);
          }
  
  
          dispatch(fill_actions(result))
      }

    return (
        <div className='px-[50px] max-lg:px-[20px]   flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="actions"
                        render={({  }) => (
                            <div className='grow h-[360px]'>
                                <FormItem className='grow p-[30px] h-full max-lg:p-[15px] max-lg:max-h-none border-[1px] rounded-[25px]  max-h-[390px]'>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px] max-lg:w-full'>Беспокоит ли вас травмирующее событие, с которым сложно справиться самостоятельно?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] max-lg:w-full font-normal text-[18px]  leading-[25px] mt-[10px]  '>
                                        Выберите все подходящие пункты или пропустите вопрос, если ничего из этого не беспокоит
                                    </FormDescription>
                                    <div className='flex justify-between mt-[10px] max-lg:flex-col  max-h-[150px] max-lg:max-h-none overflow-hidden'>
                                    <div className='flex flex-col gap-[15px] w-full max-h-[150px]  max-lg:max-h-[200px] pb-[50px] overflow-x-auto'>
                                            {actions.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="actions"
                                                render={({ field } : any) => {
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
                                                                    field?.value?.filter(
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
                    <div className="shrink-0  pb-[50px] flex gap-[10px]  mt-[30px]">
                        <button onClick={() => dispatch(toNextStage('condition'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                            Назад
                        </button>

                        <button type='submit' className="cursor-pointer grow border-[1px]  bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default ActionStage;