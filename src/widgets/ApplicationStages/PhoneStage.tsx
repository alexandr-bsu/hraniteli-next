/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
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
import { submitQuestionnaire, getFilteredPsychologists } from '@/features/actions/getPsychologistSchedule';
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter';
import { useSearchParams } from 'next/navigation'


const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

const FormSchema = z.object({
    phone: z.string().nonempty("Вы не заполнили обязательное поле").regex(phoneRegex, 'Введите корректный номер телефона')
});

export const PhoneStage = () => {
    const dispatch = useDispatch();

    const searchParams = useSearchParams()
    // Проверяем, перешли ли мы из иммледовательской формы
    const isResearchRedirect = searchParams.get('research') == 'true'

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
        setIsLoading(true);
        localStorage.setItem('app_phone', JSON.stringify(data.phone));
        dispatch(setPhone(data.phone));

        try {
            // Отправляем анкету и получаем расписание
            const schedule = await submitQuestionnaire({
                ...formData,
                phone: data.phone
            });

            // Проверяем наличие слотов
            let hasSlots = false;
            if (schedule[0]?.items) {
                hasSlots = schedule[0].items.some((day: any) => {
                    if (!day.slots) return false;
                    return Object.entries(day.slots).some(([time, slots]) => {
                        if (!Array.isArray(slots)) return false;
                        return slots.some(slot => slot.state === 'Свободен');
                    });
                });
            }

            // Получаем список психологов
            const result = await getFilteredPsychologists();

            // Если нет слотов вообще - показываем ошибку
            if (!hasSlots) {
                dispatch(setHasMatchingError(true));
                setShowNoMatch(true);
                return;
            }

            // Собираем все id психологов из слотов и их расписания
            const psychologistSchedules = new Map<string, any>();
            schedule[0].items.forEach((day: any) => {
                if (!day.slots) return;
                Object.entries(day.slots).forEach(([time, slots]) => {
                    if (!Array.isArray(slots)) return;
                    slots.forEach((slot: any) => {
                        if (slot.psychologist) {
                            if (!psychologistSchedules.has(slot.psychologist)) {
                                const psychologistSchedule: { [date: string]: { [time: string]: any } } = {};
                                schedule[0].items.forEach((d: any) => {
                                    if (d.slots) {
                                        psychologistSchedule[d.pretty_date] = {};
                                        Object.entries(d.slots).forEach(([t, s]) => {
                                            if (Array.isArray(s)) {
                                                const psychologistSlots = s.filter(sl => sl.psychologist === slot.psychologist && sl.state === 'Свободен');
                                                if (psychologistSlots.length > 0) {
                                                    psychologistSchedule[d.pretty_date][t] = psychologistSlots[0];
                                                }
                                            }
                                        });
                                    }
                                });
                                psychologistSchedules.set(slot.psychologist, psychologistSchedule);
                            }
                        }
                    });
                });
            });

            // Фильтруем психологов у которых есть слоты
            const psychologistsWithSlots = result.items.map((psy: any) => {
                const schedule = psychologistSchedules.get(psy.name);
                return {
                    ...psy,
                    schedule: schedule
                };
            }).filter((psy: any) => {
                const schedule = psychologistSchedules.get(psy.name);
                if (!schedule) return false;
                return Object.values(schedule).some((daySlots: any) =>
                    // @ts-expect-error
                    Object.values(daySlots).some(slot => slot && slot.state === 'Свободен')
                );
            });

            if (psychologistsWithSlots.length === 0) {
                dispatch(setHasMatchingError(true));
                setShowNoMatch(true);
                return;
            }

            dispatch(fill_filtered_by_automatch_psy(psychologistsWithSlots));
            dispatch(setHasMatchingError(false));
            dispatch(setApplicationStage('psychologist'));
        } catch (error) {
            console.error('Ошибка при подборе психологов:', error);
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
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[15px] w-full flex flex-col relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50 rounded-[10px]">
                            <div className="flex flex-col items-center gap-[10px]">
                                <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[18px] text-[#116466] max-lg:text-[14px]">Подбираем психологов...</span>
                            </div>
                        </div>
                    )}

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
                                        Рекламу не присылаем. Психологи не видят ваши контакты. Только вы решаете кому их показать после сессии
                                    </FormDescription>
                                    <div className={styles.input__text_container}>
                                        <IMaskInput
                                            mask="+7 (000) 000-00-00"
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
                            onClick={() => isResearchRedirect ? dispatch(setApplicationStage('diseases_psychologist')) : dispatch(setApplicationStage('promocode'))}
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