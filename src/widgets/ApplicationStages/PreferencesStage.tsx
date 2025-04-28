'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { setApplicationStage } from '@/redux/slices/application_form'
import { setPreferences, setCustomPreferences } from '@/redux/slices/application_form_data'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { z } from 'zod'
import { COLORS } from '@/shared/constants/colors'

// Данные чекбоксов
const preferences = [
  {
    id: "preferences",
    label: "Чуткость, мягкость, умение выслушивать",
  },
  {
    id: "preferences1",
    label: "Прямолинейность, строгость, серьезность",
  },
  {
    id: "preferences2",
    label: "Опыт работы в эзотерике",
  },
  {
    id: "preferences3",
    label: "Научность, доказательная база подхода, без эзотерики",
  },
  {
    id: "preferences4",
    label: "Опыт семейной жизни, собственные дети",
  },
  {
    id: "preferences5",
    label: "Знание более 1 метода терапии (модальности)",
  },
] as const

const FormSchema = z.object({
  preferences: z.array(z.string()),
  customPreferences: z.string(),
})

export const PreferencesStage = () => {
  const dispatch = useDispatch()

  // 1. Загружаем сохраненные данные из localStorage
  const loadSavedData = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_preferences')
      return saved ? JSON.parse(saved) : { preferences: [], customPreferences: '' }
    }
    return { preferences: [], customPreferences: '' }
  }

  // 2. Настраиваем форму с начальными значениями
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: loadSavedData()
  })

  // 3. Сохраняем данные при изменении
  const saveData = (data: z.infer<typeof FormSchema>) => {
    localStorage.setItem('app_preferences', JSON.stringify(data))
  }

  // Подписываемся на изменения формы
  useEffect(() => {
    const subscription = form.watch((value) => {
      saveData(value as z.infer<typeof FormSchema>)
    })
    return () => subscription.unsubscribe()
  }, [form.watch])

  // 4. Отправка формы
  const handleSubmit = (data: z.infer<typeof FormSchema>) => {
    const selectedLabels = preferences
      .filter(pref => data.preferences.includes(pref.id))
      .map(pref => pref.label)
    
    dispatch(setPreferences(selectedLabels))
    dispatch(setCustomPreferences(data.customPreferences))
    dispatch(setApplicationStage('gender_psychologist'))
  }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="preferences"
                        render={({ field }) => (
                            <div className='grow h-[360px]'>
                                <FormItem className='grow p-[30px] h-full max-h-[390px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]  '>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>Что вам важно в психологе?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px]'>
                                        Опыт, образование и личная терапия - по умолчанию. Если предпочтений нет - можете пропустить
                                    </FormDescription>
                                    <div className='flex justify-between max-lg:flex-col max-h-[160px] max-lg:max-h-none overflow-hidden'>
                                        <div className='flex flex-col mt-[10px] gap-[10px] w-full max-h-[160px] max-lg:max-h-[200px] pb-[50px] overflow-x-auto'>
                                            {preferences.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="preferences"
                                                render={() => (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-center space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            className='h-[30px] w-[30px]'
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                              const newValue = checked
                                                                ? [...field.value, item.id]
                                                                : field.value?.filter((value) => value !== item.id)
                                                              field.onChange(newValue)
                                                              saveData({ ...form.getValues(), preferences: newValue })
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="text-[18px] leading-[25px] max-lg:text-[14px]  font-normal">
                                                        {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                )}
                                                />
                                            ))}
                                        </div>
                                        <div className='ml-[30px]'>
                                          <FormField
                                              control={form.control}
                                              name="customPreferences"
                                              render={({ field }) => (
                                              <FormControl>
                                                <Textarea
                                                    {...field}
                                                    placeholder="Введите свой вариант ответа"
                                                    className="textarea__text"
                                                  />
                                              </FormControl>
                                            )}/>
                                        </div>
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0  pb-[50px] flex gap-[10px] mt-[30px]  max-lg:mt-[30px]">
                        <button 
                            type='button'
                            onClick={() => dispatch(setApplicationStage('gender'))} 
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
    );
};

export default PreferencesStage;