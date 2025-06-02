'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setPromocode, setHasMatchingError } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { z } from 'zod';
import { COLORS } from '@/shared/constants/colors';
import styles from '@/styles/input.module.scss';
import axios from 'axios';
import useYandexMetrika from '@/components/yandex/useYandexMetrika'


const FormSchema = z.object({
    promocode: z.string()
});

const PromocodeStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );
    const { reachGoal } = useYandexMetrika(102105189)


    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Промокод", ticket_id: ticketID },
        });

        reachGoal('promo')

    }, [])

    const filtered_persons = useSelector((state: RootState) => state.filter.filtered_by_automatch_psy);

    // 1. Загружаем сохраненные данные из localStorage
    const savedData = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('app_promocode') || '{}')
        : {}

    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            promocode: savedData.promocode || '',
        }
    })

    // 3. Сохраняем данные при изменении
    useEffect(() => {
        const subscription = form.watch((value) => {
            localStorage.setItem('app_promocode', JSON.stringify(value.promocode));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    // 4. Отправка формы
    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
        localStorage.setItem('app_promocode', JSON.stringify(data.promocode));
        dispatch(setPromocode(data.promocode));
        dispatch(setApplicationStage('phone'));
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[15px] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="promocode"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Введите промокод или номер подарочного сертификата
                                    </FormLabel>
                                    <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Вы можете не указывать код, если у вас его нет
                                    </FormDescription>
                                    <div className={styles.input__text_container}>
                                        <Input
                                            {...field}
                                            placeholder=" "
                                            className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                        />
                                        <label className={`${styles.input__text_label} text-[14px]`}>
                                            Введите промокод или номер подарочного сертификата
                                        </label>
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 mt-[30px] pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('diseases_psychologist'))}
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
};

export default PromocodeStage;