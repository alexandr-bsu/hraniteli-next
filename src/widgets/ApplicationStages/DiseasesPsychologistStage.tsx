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
import { setDiseases } from "@/redux/slices/application_form_data"
import { setHasMatchingError } from "@/redux/slices/application_form_data"
import { COLORS } from '@/shared/constants/colors'
import { RootState } from '@/redux/store'
import { useState, useEffect } from "react"
import { NoMatchError } from './NoMatchError'

const FormSchema = z.object({
    diseases: z.enum(["diseases1", "diseases2", 'nothing'], {
        required_error: "Вы не заполнили обязательное поле",
    }),
    medications: z.enum(['yes', 'no']).optional()
})

const diseases = {
    ['diseases1']: ['Есть диагностированное психическое заболевание'],
    ['diseases2']: ['Есть диагностированное психиатрическое заболевание'],
    ['nothing']: ['Не имеет значения']
}

export const DiseasesPsychologistStage = () => {
    const dispatch = useDispatch()
    const hasError = useSelector((state: RootState) => state.applicationFormData.has_matching_error)
    const [showNoMatch, setShowNoMatch] = useState(hasError)
    
    // 1. Загружаем сохраненные данные из localStorage
    const savedData = typeof window !== 'undefined'
        ? (() => {
            const data = localStorage.getItem('app_diseases_psychologist')
            try {
                return JSON.parse(data || '{}')
            } catch {
                // Если старый формат (просто строка)
                return { diseases: data || 'nothing' }
            }
        })()
        : { diseases: 'nothing' }

    const [showMedications, setShowMedications] = useState(savedData.diseases === 'diseases2')

    useEffect(() => {
        setShowNoMatch(hasError)
    }, [hasError])

    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            diseases: savedData.diseases || 'nothing',
            medications: savedData.medications
        }
    })

    // Следим за изменением diseases для показа/скрытия доп вопроса
    useEffect(() => {
        const subscription = form.watch((value) => {
            setShowMedications(value.diseases === 'diseases2')
            localStorage.setItem('app_diseases_psychologist', JSON.stringify(value))
        })
        return () => subscription.unsubscribe()
    }, [form.watch])

    // 4. Отправка формы
    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
        localStorage.setItem('app_diseases_psychologist', JSON.stringify(data))

        const result = [...diseases[data.diseases]]
        if (data.diseases === 'diseases2' && data.medications) {
            result.push(data.medications === 'yes' ? 'Принимает медикаменты' : 'Не принимает медикаменты')
        }

        dispatch(setDiseases(result))
        dispatch(setHasMatchingError(false))
        dispatch(setApplicationStage('promocode'))
    }

    const handleCloseNoMatch = () => {
        setShowNoMatch(false)
        dispatch(setHasMatchingError(false))
    }

    if (showNoMatch) {
        return <NoMatchError onClose={handleCloseNoMatch} />
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow max-lg:overflow-y-auto'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col min-h-min mt-[30px]">
                    <FormField
                        control={form.control}
                        name="diseases"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className={`grow p-[30px] max-lg:max-h-[400px] max-lg:p-[15px] border-[1px] rounded-[25px] max-h-[370px] ${showMedications ? 'overflow-hidden overflow-y-auto' : ''}`}>
                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                                        Есть ли у вас диагностированные психиатрические заболевания?
                                    </FormLabel>
                                    <FormDescription className='text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
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
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="nothing" />
                                                </FormControl>
                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                    Нет
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="diseases2" />
                                                </FormControl>
                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                    Да
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    {showMedications && (
                                        <FormField
                                            control={form.control}
                                            name="medications"
                                            render={({ field: medicationsField }) => (
                                                <>
                                                    <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold block mt-[20px] max-lg:mt-[16px] mb-[10px]'>
                                                        Принимаете ли вы медикаменты по назначению психиатра?
                                                    </FormLabel>
                                                    <FormDescription className='text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                                                        Выберите один вариант ответа
                                                    </FormDescription>
                                                    <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                                        <RadioGroup
                                                            onValueChange={medicationsField.onChange}
                                                            defaultValue={medicationsField.value}
                                                            className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                                        >
                                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                                <FormControl>
                                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="no" />
                                                                </FormControl>
                                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                                    Нет
                                                                </FormLabel>
                                                            </FormItem>
                                                            <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                                <FormControl>
                                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="yes" />
                                                                </FormControl>
                                                                <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                                                    Да
                                                                </FormLabel>
                                                            </FormItem>
                                                        </RadioGroup>
                                                    </FormControl>
                                                </>
                                            )}
                                        />
                                    )}
                                    <FormMessage className="text-[16px] max-lg:text-[14px]" />
                                </FormItem>
                            </div>
                        )}
                    />

                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px] mt-[30px] max-lg:mt-[30px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('traumatic'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            disabled={hasError}
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] ${hasError ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
