"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { setApplicationStage } from "@/redux/slices/application_form"
import { setPriceSession, setHasMatchingError } from "@/redux/slices/application_form_data"
import { Price } from "@/shared/types/application.types"
import { COLORS } from '@/shared/constants/colors';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';
import { shouldShowKeeperLabels } from '@/shared/utils/utm';
import useYandexMetrika from '@/components/yandex/useYandexMetrika';
import { submitHelpHandQuestionnaire } from '@/features/actions/HelpHand';

const FormSchema = z.object({
    price_session: z.enum(['free', '300', '500', '1000', '1500', '2000', '3000'], {
        required_error: "Вы не заполнили обязательное поле",
    }),
})

export const PriceSessionStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );
    // Получаем все данные анкеты из Redux
    const formData = useSelector((state: RootState) => state.applicationFormData);
    
    const [showKeeperLabels, setShowKeeperLabels] = useState(false);
    const { reachGoal } = useYandexMetrika(102105189);
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Сумма за сессию", ticket_id: ticketID },
        });

        setShowKeeperLabels(shouldShowKeeperLabels());
    }, [])

    const savedPriceSession = typeof window !== 'undefined'
        ? localStorage.getItem('app_price_session') || '300'
        : 'free'

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            price_session: savedPriceSession as 'free' | '300' | '500' | '1000' | '1500' | '2000' | '3000' || undefined,
        }
    })

    // Полная отправка анкеты
    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        if (isLoading) return;
        
        setIsLoading(true);
        
        try {
            // 1. Сохраняем выбранный price_session
            localStorage.setItem('app_price_session', data.price_session);
            dispatch(setPriceSession(data.price_session));

            // 2. Отправляем аналитику шага
            await axios({
                url: 'https://n8n-v2.hrani.live/webhook/step-analytics',
                method: 'PUT',
                data: { 
                    ticketID, 
                    field: 'psychologist_category', 
                    value: data.price_session 
                }
            });

            // 3. Формируем и отправляем ПОЛНУЮ анкету
            const fullFormData = {
                ...formData,
                price_session: data.price_session
            };
            
            await submitHelpHandQuestionnaire(fullFormData);

            // 4. Трекаем успешную отправку
            if (typeof reachGoal === 'function') {
                reachGoal('submit_help_hand_form');
            }

            // 5. Сбрасываем ошибки (если были) и переходим
            dispatch(setHasMatchingError(false));
            dispatch(setApplicationStage('gratitude'));

        } catch (error) {
            console.error('Ошибка при отправке анкеты:', error);
            dispatch(setHasMatchingError(true));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col mt-[15px]">
                    <FormField
                        control={form.control}
                        name="price_session"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grid gap-2 grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px] min-lg:h-[300px] overflow-y-auto'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Какую сумму вы готовы выделить на каждую сессию?
                                    </FormLabel>
                                    <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Вознаграждение влияет на опыт работы и скорость подбора психолога - оно должно быть комфортным для всех сторон.
                                    </FormDescription>
                                    <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                        >
                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="free" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}] flex flex-wrap`}>
                                                    Бесплатно - обучающиеся психологи (до 1 года практики)
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="500" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}] flex flex-wrap`}>
                                                    500 рублей - обучающиеся психологи (до 1 года практики)
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="1000" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}] flex flex-wrap`}>
                                                    1000 рублей - начинающие психологи (до 5 лет практики)
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="1500" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}] flex flex-wrap`}>
                                                    1500 рублей - начинающие психологи (до 5 лет практики)
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="2000" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}] flex flex-wrap`}>
                                                    2000 рублей - опытные психологи (более 5 лет практики)
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="3000" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}] flex flex-wrap`}>
                                                    3000 рублей - опытные психологи (более 5 лет практики)
                                                </FormLabel>
                                            </FormItem>

                                        </RadioGroup>
                                    </FormControl>
                                    {!form.formState.errors.price_session &&
                                        <span className='mt-[10px] max-lg:text-[14px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                                            Поле обязательное для заполнения
                                        </span>
                                    }
                                    <FormMessage className="mt-[10px] max-lg:text-[14px]" />
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('request'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                            disabled={isLoading}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            disabled={isLoading}
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px] ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? 'Отправка...' : 'Продолжить'}
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}