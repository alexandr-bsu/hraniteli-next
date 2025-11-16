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
import { setLastSessionPrice } from "@/redux/slices/application_form_data"
import { LastSessionPriceResearch, Price } from "@/shared/types/application.types"
import { COLORS } from '@/shared/constants/colors';

import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';

const FormSchema = z.object({
    last_session_price: z.enum(['free', '<1000', '<3000', '<5000', '5000+'], {
        required_error: "Вы не заполнили обязательное поле",
    }),
})

export const LastSessionPriceStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Сумма за сессию", ticket_id: ticketID },
        });
    }, [])

    const savedLastSessionPrice = typeof window !== 'undefined'
        ? localStorage.getItem('app_last_session_price') || 'free'
        : 'free'

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            last_session_price: savedLastSessionPrice as 'free' | '<1000' | '<3000' | '<5000' | '5000+' || undefined,
        }
    })

    const handleSubmit = (data: { last_session_price: LastSessionPriceResearch }) => {
        localStorage.setItem('app_last_session_price', data.last_session_price)
        dispatch(setLastSessionPrice(data.last_session_price))
        axios({
            url: 'https://n8n-v2.hrani.live/webhook/step-analytics',
            method: 'PUT',
            data: { ticketID, field: 'psychologist_category', value: data.last_session_price}
            }
          )

        if (localStorage.getItem('app_experience') == 'earlier') {
            dispatch(setApplicationStage('session_duration'))
        } else{
            dispatch(setApplicationStage('cancelation'))
        }
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col mt-[15px]">
                    <FormField
                        control={form.control}
                        name="last_session_price"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grid gap-2 grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px] min-lg:h-[300px] overflow-y-auto'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        {localStorage.getItem('app_experience') == 'earlier' ? 'Сколько стоила одна сессия?' : 'В какой ценовой категории специалиста вы искали?'}
                                    </FormLabel>
                                    <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Выберите один вариант ответа
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
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                    Бесплатно
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="<1000" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                    Меньше 1000 руб.
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="<3000" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                    Меньше 3000 руб.
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="<5000" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                    Меньше 5000 руб.
                                                </FormLabel>
                                            </FormItem>

                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="5000+" />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                    5000 руб. и более
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    {!form.formState.errors.last_session_price &&
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
                            onClick={() => dispatch(setApplicationStage('choose_preferences'))}
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
    )
}
