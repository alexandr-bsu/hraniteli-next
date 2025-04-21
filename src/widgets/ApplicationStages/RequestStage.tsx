'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toNextStage } from '@/redux/slices/application_form';
import { fill_requests } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'

const FormSchema = z.object({
    request: z.string(),
  })

const RequestStage = () => {
   const dispatch = useDispatch()
   
     // 1. Загружаем сохраненные данные из localStorage
     const loadSavedData = () => {
       if (typeof window !== 'undefined') {
         const saved = localStorage.getItem('app_request')
         return saved ? JSON.parse(saved) : { request: '' }
       }
       return { request: '' }
     }
   
     // 2. Настраиваем форму с начальными значениями
     const form = useForm<z.infer<typeof FormSchema>>({
       resolver: zodResolver(FormSchema),
       defaultValues: loadSavedData()
     })
   
     // 3. Сохраняем данные при изменении
     const saveData = (data: z.infer<typeof FormSchema>) => {
       localStorage.setItem('app_request', JSON.stringify(data))
     }
   
     // Подписываемся на изменения формы
     useEffect(() => {
       const subscription = form.watch((value) => {
         saveData(value as z.infer<typeof FormSchema>)
       })
       return () => subscription.unsubscribe()
     }, [form.watch])
   
     // 4. Отправка формы
     const handleSubmit = (data: z.infer<typeof FormSchema>) => {
       
       dispatch(fill_requests(data.request))
       dispatch(toNextStage('condition'))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px]  flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[20px] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="request"
                        render={({ field }) => (
                            <div className='grow max-[425px]:mb-[30px]'>
                                <FormItem className='grow gap-0'>
                                    <FormLabel className='max-lg:text-[16px] font-semibold text-[20px] leading-[27px]'>Опишите свой запрос к психологу: что беспокоит,<br></br> чего ожидаете, к чему хотите прийти?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[10px]'>
                                        Не знаете ответов — это нормально, напишите, как <br></br> чувствуете. Можете пропустить если не готовы
                                    </FormDescription>
                                    <div className='input__text_container mt-[30px] relative bg-[#FAFAFA] w-full h-[246px] max-lg:h-[177px]'>
                                    <Textarea
                                        className='input__text placeholder:text-[18px] placeholder:text-[#9A9A9A] rounded-[10px] border-none w-full h-full p-[20px] text-left align-top
                                                max-lg:text-[14px] max-lg:placeholder:text-[14px]'
                                        style={{
                                        resize: 'none',
                                        lineHeight: '1.5'
                                        }}
                                        {...field}
                                        placeholder="Введите свой вариант ответа"
                                    />
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0  pb-[50px] flex gap-[10px]">
                        <button type='submit' onClick={() => dispatch(toNextStage('gender_psychologist'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
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

export default RequestStage;