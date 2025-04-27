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
import { useDispatch } from "react-redux"
import { setApplicationStage } from "@/redux/slices/application_form"
import { setGenderPsychologist } from "@/redux/slices/application_form_data"
import { Gender } from "@/shared/types/application.types"
import { COLORS } from '@/shared/constants/colors'

const FormSchema = z.object({
    gender: z.enum(["male", "female", 'no_matter'], {
    required_error: "Вы не заполнили обязательное поле",
  }),
})

const sex_data: Record<string, Gender> = {
    ['male']: 'male',
    ['female']: 'female',
    ['no_matter']: 'other',
} 

export const GenderStagePsychologist = () => {
    const dispatch = useDispatch()
  
    // 1. Загружаем сохраненные данные из localStorage
    const savedGender = typeof window !== 'undefined' 
      ? localStorage.getItem('app_psychologist_gender') || 'no_matter'
      : 'no_matter'
  
    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
      resolver: zodResolver(FormSchema),
      defaultValues: {
        gender: savedGender as 'male' | 'female' | 'no_matter'
      }
    })
  
    // 3. Сохраняем данные при изменении
    const handleGenderChange = (gender: 'male' | 'female' | 'no_matter') => {
      form.setValue('gender', gender)
      localStorage.setItem('app_psychologist_gender', gender)
    }
  
    // 4. Отправка формы
    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
      localStorage.setItem('app_psychologist_gender', data.gender) // Дублируем сохранение
      dispatch(setGenderPsychologist(sex_data[data.gender]))
      dispatch(setApplicationStage('request')) 
    }
  

  return (
    <div className='px-[50px] max-lg:px-[20px]  flex w-full grow'>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[20px] w-full flex flex-col">
            <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
                <div className='grow'>
                <FormItem className='grow max-[425px]:mb-[30px]'>
                    <FormLabel className=' max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px]  leading-[27px] '>С психологом какого пола вы готовы работать?</FormLabel>
                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[10px]'>
                        Выберите один вариант ответа
                    </FormDescription>
                    <FormControl className="mt-[20px]">
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col"
                        >
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl>
                                <RadioGroupItem className="h-[30px] w-[30px]" value="male" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                    Мужской
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl> 
                                <RadioGroupItem className="h-[30px] w-[30px]" value="female" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                    Женский
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl> 
                                <RadioGroupItem className="h-[30px] w-[30px]" value="no_matter" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                    Не имеет значения
                                </FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    {
                        !form.formState.errors.gender && <span className='mt-[10px] max-lg:text-[12px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                             Это обязательное поле
                        </span>
                    }
                    <FormMessage className="mt-[10px]"/>
                </FormItem>
                </div>
            )}
            />
            <div className="shrink-0  pb-[50px] flex gap-[10px]">
                <button 
                    type='button'
                    onClick={() => dispatch(setApplicationStage('preferences'))} 
                    className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}
                >
                    Назад
                </button>

                <button 
                    type='submit' 
                    className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}
                >
                    Продолжить
                </button>
            </div>
        </form>
        </Form>
    </div>
  )
}
