'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setPhone, setHasMatchingError } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { COLORS } from '@/shared/constants/colors';
import styles from '@/styles/input.module.scss';
import { IMaskInput } from 'react-imask';
import { RootState } from '@/redux/store';
import { NoMatchError } from './NoMatchError';
import { getPsychologistSchedule } from '@/features/actions/getPsychologistSchedule';
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter';

const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const FormSchema = z.object({
    phone: z.string().regex(phoneRegex, 'Введите корректный номер телефона').or(z.literal(''))
});

export const PhoneStage = () => {
    const dispatch = useDispatch();
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
            localStorage.setItem('app_phone', JSON.stringify(value));
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const handleCloseNoMatch = () => {
        setShowNoMatch(false);
        dispatch(setHasMatchingError(false));
    };

    // 4. Отправка формы
    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        setIsLoading(true);
        localStorage.setItem('app_phone', JSON.stringify(data));
        dispatch(setPhone(data.phone));

        try {
            // Получаем список психологов с сервера
            const psychologists = await getPsychologistSchedule({
                ...formData,
                phone: data.phone
            });

            if (!psychologists?.length) {
                dispatch(setHasMatchingError(true));
                setShowNoMatch(true);
                return;
            }

            dispatch(fill_filtered_by_automatch_psy(psychologists));
            dispatch(setHasMatchingError(false));
            dispatch(setApplicationStage('psychologist'));
        } catch (error) {
            console.error('Failed to fetch psychologists:', error);
            dispatch(setHasMatchingError(true));
            setShowNoMatch(true);
        } finally {
            setIsLoading(false);
        }
    }

    if (showNoMatch) {
        return <NoMatchError onClose={handleCloseNoMatch} />;
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[20px] w-full flex flex-col relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-[10px]">
                            <div className="flex flex-col items-center gap-[10px]">
                                <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[18px] text-[#116466]">Подбираем психологов...</span>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col">
                        <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>
                            Оставьте ваш контакт для связи
                        </FormLabel>
                        <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px]'>
                            Рекламу не присылаем. Психологи не видят ваши контакты. Только вы решаете кому их показать после сессии
                        </FormDescription>
                    </div>

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <div className='grow'>
                                <FormItem className='grow'>
                                    <div className={styles.input__text_container}>
                                        <IMaskInput
                                            mask="+7 (000) 000-00-00"
                                            value={value}
                                            unmask={false}
                                            onAccept={(value) => onChange(value)}
                                            placeholder=" "
                                            className={`${styles.input__text} text-[18px] w-full h-full px-[20px] pt-[20px] pb-[10px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                        />
                                        <label className={styles.input__text_label}>
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

                    <div className="shrink-0 mt-[30px] pb-[50px] flex gap-[10px]">
                        <button 
                            type='button' 
                            onClick={() => dispatch(setApplicationStage('promocode'))} 
                            disabled={isLoading}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[16px] rounded-[50px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Назад
                        </button>

                        <button 
                            type='submit'
                            disabled={isLoading}
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[16px] rounded-[50px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Подбираем психологов...' : 'Продолжить'}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}; 