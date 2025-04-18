'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toNextStage } from '@/redux/slices/application_form';
import { fill_username } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'

const NameStageApplication = () => {
    const dispatch = useDispatch();

    const FormSchema = z.object({
        username: z.string().nonempty("Вы не заполнили обязательное поле")
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
        }
    })

    function handleSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(toNextStage('age')) 
        dispatch(fill_username(data.username))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px]  flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full mt-[20px] flex flex-col">
                    <FormField
                        
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <div className='grow  max-h-[100%]'>
                                <FormItem className='grow max-[425px]:mb-[30px]'>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>Как вас зовут?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[10px]'>
                                        Вы можете не указывать имя, если пока не готовы
                                    </FormDescription>
                                    <div className='input__text_container mt-[30px] relative bg-[#FAFAFA] w-full h-[65px]'>
                                        <Input className='input__text placeholder:text-[18px] placeholder:text-[#9A9A9A] placeholder:max-lg:text-[14px] rounded-[10px] border-none w-full h-full' {...field} />
                                        <label className='input__text_label'>Введите ваше имя или псевдоним</label>
                                    </div>
                                    {
                                        !form.formState.errors.username && <span className='mt-[10px] max-lg:text-[12px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                                        ! Поле обязательное для заполнения
                                    </span>
                                    }
                                    <FormMessage />
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0  pb-[50px] flex gap-[10px]">
                        <button className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
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

export default NameStageApplication;