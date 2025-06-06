'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setRequests } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { COLORS } from '@/shared/constants/colors';
import styles from '@/styles/input.module.scss'

import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';

const FormSchema = z.object({
    request: z.string().nonempty('Поле обязательное для заполнения'),
})

const RequestStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Запрос клиента", ticket_id:ticketID },
        });
    }, [])

    // 1. Загружаем сохраненные данные из localStorage
    const loadSavedData = () => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('app_request')
            try {
                return saved ? JSON.parse(saved) : { request: '' }
            } catch {
                // Если старый формат (просто строка)
                return { request: saved || '' }
            }
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
        dispatch(setRequests([data.request]))
        dispatch(setApplicationStage('psychologist_price'))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col min-h-min mt-[15px]">
                    <FormField
                        control={form.control}
                        name="request"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px] overflow-y-auto'>
                                    <FormLabel className='flex items-center gap-2 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>Опишите свой запрос к психологу: что беспокоит, чего ожидаете, к чему хотите прийти?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px]'>
                                        Не знаете ответов — это нормально, напишите, как чувствуете. Этот блок нельзя пропустить поскольку он позволяет психологу лучше понять ваш запрос
                                    </FormDescription>
                                    <div className={styles.input__text_container}>
                                        <Textarea
                                            {...field}
                                            placeholder=" "
                                            className={`${styles.input__text} text-[18px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                            style={{
                                                resize: 'none',
                                                lineHeight: '1.5',
                                                wordBreak: 'break-word',
                                                whiteSpace: 'pre-wrap',
                                                overflowWrap: 'break-word',
                                                maxHeight: '180px',
                                                overflowY: 'auto'
                                            }}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                localStorage.setItem('app_request', e.target.value)
                                            }}
                                        />
                                        <label className={styles.input__text_label}>
                                            Опишите ваш запрос
                                        </label>
                                    </div>
                                    {!form.formState.errors.request &&
                                        <span className='mt-[10px] max-lg:text-[14px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                                            Поле обязательное для заполнения
                                        </span>
                                    }
                                    <FormMessage className="mt-[10px] max-lg:text-[14px]" />
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px] mt-[30px] max-lg:mt-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('traumatic'))}
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

export default RequestStage;