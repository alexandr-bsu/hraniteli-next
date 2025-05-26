'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setCity } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { COLORS } from '@/shared/constants/colors';
import styles from '@/styles/input.module.scss'

import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';

const FormSchema = z.object({
    city: z.string()
        .nonempty("Вы не заполнили обязательное поле")

});

type FormData = z.infer<typeof FormSchema>;

const CityStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Город клиента", ticket_id: ticketID },
        });

        if (typeof window !== 'undefined' && window.ym) {
            window.ym(102105189, 'reachGoal', "city");
        }

    }, [])

    // 1. Загружаем сохраненный при инициализации
    const savedCity = typeof window !== 'undefined'
        ? localStorage.getItem('app_city') || ''
        : ''

    //Настраиваем форму
    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            city: savedCity,
        }
    })

    const handleSubmit = (data: FormData) => {
        localStorage.setItem('app_city', data.city) // Сохраняем в localStorage
        dispatch(setCity(data.city)) // Сохраняем в Redux (если нужно)
        dispatch(setApplicationStage('psychologist_education')) // Переход на следующую страницу
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col mt-[15px]">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Из какого вы города?
                                    </FormLabel>
                                    {/* <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Это важно для психолога, который знакомится с вашей заявкой
                                    </FormDescription> */}
                                    <div className={styles.input__text_container}>
                                        <Input
                                            {...field}
                                            placeholder=" "
                                            className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                localStorage.setItem('app_city', e.target.value)
                                            }}
                                        />
                                        <label className={`${styles.input__text_label} text-[14px]`}>
                                            Введите ваш город
                                        </label>
                                    </div>
                                    {!form.formState.errors.city &&
                                        <span className={`mt-[10px] max-lg:text-[14px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]`}>
                                            Поле обязательное для заполнения
                                        </span>
                                    }
                                    <FormMessage className='mt-[10px] max-lg:text-[14px]' />
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
                        
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

export default CityStage;