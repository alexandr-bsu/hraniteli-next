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
import { setCancelReason } from "@/redux/slices/application_form_data"
import { CancelReason } from "@/shared/types/application.types"
import { COLORS } from '@/shared/constants/colors';

import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';

const FormSchema =
    z.object({
        cancel_reason: z.enum(['solved', 'new_psychologist', 'full_cancel', 'expensive', 'uncomfortable', 'in_therapy', 'other', 'no trust'], {
            required_error: "Вы не заполнили обязательное поле",
        }),
    })

const CancelationStage = () => {
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Почему не ходили на сессию", ticket_id: ticketID },
        });
    }, [])

    const savedCancelReason = typeof window !== 'undefined'
        ? localStorage.getItem('app_cancel_reason') || 'solved'
        : 'solved'

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            cancel_reason: savedCancelReason as 'solved' | 'new_psychologist' | 'full_cancel' | 'expensive' | 'uncomfortable' | 'in_therapy' | 'other' | 'no trust' || undefined,
        }
    })

    const handleSubmit = (data: { cancel_reason: CancelReason }) => {
        localStorage.setItem('app_cancel_reason', data.cancel_reason)
        dispatch(setCancelReason(data.cancel_reason))
        dispatch(setApplicationStage('occupation'))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col mt-[15px]">
                    <FormField
                        control={form.control}
                        name="cancel_reason"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grid gap-2 grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px] min-lg:h-[300px] overflow-y-auto'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        {localStorage.getItem('app_experience') == 'earlier' ? 'Почему прекратили работать со специалистом?' : 'Почему решили не обращаться?'}
                                    </FormLabel>
                                    <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                        Выберите один вариант ответа
                                    </FormDescription>

                                    {localStorage.getItem('app_experience') == 'earlier' &&
                                        <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                            >
                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="solved" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Помогло, проблема была решена
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="new_psychologist" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Не помогло, выбрал(а) нового
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="full_cancel" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Не помогло, вообще прекратил(а)
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="expensive" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Дорого
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="uncomfortable" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Неудобно по времени/формату/месту
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="in_therapy" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Я всё еще в терапии
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    }

                                    {localStorage.getItem('app_experience') == 'supposed' &&
                                        <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                            >
                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="solved" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Проблемы сами разрешились
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="no trust" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Не было доверия
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="expensive" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Дорого
                                                    </FormLabel>
                                                </FormItem>

                                                <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="other" />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        Другая причина
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                    }
                                    {!form.formState.errors.cancel_reason &&
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
                            onClick={() => localStorage.getItem('app_experience') == 'earlier' ? dispatch(setApplicationStage('session_duration')) : dispatch(setApplicationStage('last_session_price'))}
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

export default CancelationStage