'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toNextStage } from '@/redux/slices/application_form';
import { fill_promocode } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'

const PromocodeStage = () => {
    const dispatch = useDispatch();

    const FormSchema = z.object({
        request: z.string()
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            request: '',
        }
    })
    function handleSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(toNextStage('psychologist')) 
        dispatch(fill_promocode(data.request))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px]  flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[20px] w-full flex flex-col">
                    <FormField
                        
                        control={form.control}
                        name="request"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grow'>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>Введите промокод или номер подарочного сертификата</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[10px]'>
                                        Вы можете не указывать код, если у вас его нет
                                    </FormDescription>
                                    <div className='input__text_container mt-[30px] relative bg-[#FAFAFA] w-full h-[65px]'>
                                        <Input className='input__text placeholder:text-[18px] placeholder:text-[#9A9A9A] placeholder:max-lg:text-[14px] rounded-[10px] border-none w-full h-full' {...field} />
                                        <label className='input__text_label'>Введите промокод или номер подарочного сертификата</label>
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0  pb-[50px] flex gap-[10px]">
                        <button type='button' onClick={() => dispatch(toNextStage('diseases'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
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

export default PromocodeStage;