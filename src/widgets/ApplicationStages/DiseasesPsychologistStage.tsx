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

const FormSchema = z.object({
    diseases: z.enum(["diseases1", "diseases2", 'nothing'], {
    required_error: "Вы не заполнили обязательное поле",
  }),
})

const diseases = {
    ['diseases1']: ['Есть диагностированное психическое заболевание'],
    ['diseases2']: ['Есть диагностированное психиатрическое заболевание'],
    ['nothing']: ['Не имеет значения']
}

export const DiseasesPsychologistStage = () => {
    const dispatch = useDispatch()
    const filtered_persons = useSelector((state: RootState) => state.filter.filtered_by_automatch_psy)
    const hasError = useSelector((state: RootState) => state.applicationFormData.has_matching_error)

    // 1. Загружаем сохраненные данные из localStorage
    const savedDiseases = typeof window !== 'undefined' 
        ? localStorage.getItem('app_diseases_psychologist') || 'nothing'
        : 'nothing'

    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            diseases: savedDiseases as 'diseases1' | 'diseases2' | 'nothing'
        }
    })

    // 3. Сохраняем данные при изменении
    const handleDiseasesChange = (value: 'diseases1' | 'diseases2' | 'nothing') => {
        form.setValue('diseases', value)
        localStorage.setItem('app_diseases_psychologist', value)
    }

    // 4. Отправка формы
    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
        localStorage.setItem('app_diseases_psychologist', data.diseases)
        
        dispatch(setDiseases([...diseases[data.diseases]]))
        dispatch(setHasMatchingError(false))
        dispatch(setApplicationStage('promocode'))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex flex-col h-full'>
            {hasError && (
                <span className="mt-[20px] w-full max-lg:text-[14px] text-red-500 font-medium">
                    Идеальный психолог по вашим параметрам не найден, то если вы измените формы ( 2 )
                </span>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col mt-[30px] h-full">
                    <FormField
                        control={form.control}
                        name="diseases"
                        render={({ field }) => (
                            <div className='flex-1 mb-[20px]'>
                                <FormItem className='p-[25px] max-lg:p-[15px] border-[1px] rounded-[25px]'>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>
                                        Есть ли у вас диагностированные психические/
                                        <br />
                                        психиатрические заболевания?
                                    </FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[10px]'>
                                        Выберите один вариант ответа
                                    </FormDescription>
                                    <FormControl className="mt-[20px]">
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col gap-[15px]"
                                        >
                                            <FormItem className="flex items-center gap-[15px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px]" value="diseases1" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-[18px]">
                                                    Есть диагностированное психическое заболевание
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-[15px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px]" value="diseases2" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-[18px]">
                                                    Есть диагностированное психиатрическое заболевание
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-[15px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px]" value="nothing" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-[18px]">
                                                    Не имеет значения
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    {!form.formState.errors.diseases && (
                                        <span className='mt-[10px] max-lg:text-[12px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                                            Это обязательное поле
                                        </span>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => dispatch(setApplicationStage('traumatic'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            disabled={hasError}
                            className={`grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] ${hasError ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
