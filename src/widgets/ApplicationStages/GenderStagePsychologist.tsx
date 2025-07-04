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
import { useDispatch, useSelector } from "react-redux"
import { setApplicationStage } from "@/redux/slices/application_form"
import { setGenderPsychologist, setHasMatchingError } from "@/redux/slices/application_form_data"
import { Gender } from "@/shared/types/application.types"
import { COLORS } from '@/shared/constants/colors'
import { findByGender } from '@/redux/slices/filter'
import { RootState } from '@/redux/store'
import React, { useEffect } from 'react'
import { submitQuestionnaire, getFilteredPsychologists } from '@/features/actions/getPsychologistSchedule'
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter'
import axios from "axios"

const FormSchema = z.object({
    gender: z.enum(['male', 'female', 'other', 'none'], {
        required_error: "Вы не заполнили обязательное поле",
    }),
})

export const GenderStagePsychologist = () => {
    const dispatch = useDispatch()

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Пол психолога", ticket_id:ticketID },
        });
    }, [])

    const filtered_persons = useSelector((state: RootState) => state.filter.filtered_by_automatch_psy)
    const hasError = useSelector((state: RootState) => state.applicationFormData.has_matching_error)
    const formData = useSelector((state: RootState) => state.applicationFormData)

    // 1. Загружаем сохраненные данные из localStorage
    const savedData = typeof window !== 'undefined'
        ? localStorage.getItem('app_gender_psychologist')
        : null

    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gender: (savedData as Gender) || 'other'
        }
    })

    // 3. Сохраняем данные при изменении
    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.gender) {
                localStorage.setItem('app_gender_psychologist', value.gender)
            }
        })
        return () => subscription.unsubscribe()
    }, [form.watch])

    // 4. Отправка формы
    const handleSubmit = async (data: z.infer<typeof FormSchema>) => {
        // Проверяем подходящих психологов
        dispatch(findByGender(data.gender))
        
        // Сохраняем выбор пользователя
        dispatch(setGenderPsychologist(data.gender))
        axios({
            url: 'https://n8n-v2.hrani.live/webhook/step-analytics',
            method: 'PUT',
            data: { ticketID, field: 'psychologist_sex', value: data.gender }
            }
          )

        dispatch(setApplicationStage('request'))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col min-h-min mt-[15px]">
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Есть ли у вас предпочтения по полу психолога?
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
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="male" />
                                                </FormControl>
                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                    Мужчина
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="female" />
                                                </FormControl>
                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                    Женщина
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="other" />
                                                </FormControl>
                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                    Не имеет значения
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage className="text-[16px]" />
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('preferences'))}
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
