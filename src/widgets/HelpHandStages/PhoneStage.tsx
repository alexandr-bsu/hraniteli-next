
'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setPhone, setHasMatchingError } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { z } from 'zod';
import { COLORS } from '@/shared/constants/colors';
import styles from '@/styles/input.module.scss';
import { IMaskInput } from 'react-imask';
import { RootState } from '@/redux/store';
import { NoMatchError } from './NoMatchError';
import { submitQuestionnaire, getFilteredPsychologists } from '@/features/actions/getPsychologistSchedule';
import { submitHelpHandQuestionnaire } from '@/features/actions/HelpHand'
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter';
import axios from 'axios';
import useYandexMetrika from '@/components/yandex/useYandexMetrika'

import { setIsRequestSend } from '@/redux/slices/application_form';

const phoneRegex = /^\+7\d{10}$/;

const FormSchema = z.object({
    phone: z.string().nonempty("Вы не заполнили обязательное поле").regex(phoneRegex, 'Введите корректный номер телефона')
});

export const PhoneStage = () => {
    const isRequestSend = useSelector<RootState, boolean>(state => state.applicationForm.is_request_send);
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    const { reachGoal } = useYandexMetrika(102105189)


    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Контакты клиента", ticket_id: ticketID },
        });

        reachGoal('svyaz')
    }, [])

    const formData = useSelector((state: RootState) => state.applicationFormData);
    const [showNoMatch, setShowNoMatch] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // 1. Загружаем сохраненные данные из localStorage
    const savedData = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('app_phone') || '{}')
        : {}

    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            phone: savedData.phone || '',
        }
    })

    // 3. Сохраняем данные при изменении
    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem('app_phone', JSON.stringify(value.phone));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const handleCloseNoMatch = () => {
        setShowNoMatch(false);
        dispatch(setHasMatchingError(false));
    };

    // 4. Отправка формы
    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (isRequestSend) return; // Не отправляем повторно
        setIsLoading(true);
        dispatch(setIsRequestSend(true));
        localStorage.setItem('app_phone', JSON.stringify(data.phone));
        dispatch(setPhone(data.phone));

        try {
            // Отправляем анкету и получаем расписание
            const formRequestResult = await submitHelpHandQuestionnaire({
                ...formData,
                phone: data.phone
            });

            dispatch(setHasMatchingError(false));
            reachGoal('submit_help_hand_form')

            dispatch(setApplicationStage('gratitude'));


        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            dispatch(setHasMatchingError(true));
            setShowNoMatch(true);
        } finally {
            setIsLoading(false);
            dispatch(setIsRequestSend(false));
        }
    }

    if (showNoMatch) {
        return <NoMatchError onClose={handleCloseNoMatch} />;
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[15px] w-full flex flex-col relative">

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Оставьте ваш контакт для связи
                                    </FormLabel>
                                    <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Рекламу не присылаем. Ваш контакт видит только психолог, который выбрал вашу заявку
                                    </FormDescription>
                                    <div className={styles.input__text_container}>
                                        <IMaskInput
                                            mask="+70000000000"
                                            value={value}
                                            unmask={false}
                                            onAccept={(value) => onChange(value)}
                                            placeholder=" "
                                            className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                        />
                                        <label className={`${styles.input__text_label} text-[14px]`}>
                                            Введите номер телефона
                                        </label>
                                    </div>
                                    {form.formState.errors.phone && (
                                        <span className="text-[#FF0000] text-[14px] mt-[5px]">
                                            {form.formState.errors.phone.message}
                                        </span>
                                    )}
                                </FormItem>
                            </div>
                        )}
                    />

                    <div className="shrink-0 mt-[30px] pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('psychologist_price'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}