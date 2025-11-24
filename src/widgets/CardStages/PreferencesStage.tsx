'use client'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { setApplicationStage } from '@/redux/slices/application_form'
import { setPreferences, setCustomPreferences } from '@/redux/slices/application_form_data'
import { zodResolver } from '@hookform/resolvers/zod'

import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { COLORS } from '@/shared/constants/colors'

import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';

// UPDATE Изменение id у чекбоксов что важно в психологе
// Данные чекбоксов
const preferences = [
  {
    id: "Чуткость, мягкость, умение выслушивать",
    label: "Чуткость, мягкость, умение выслушивать",
  },
  {
    id: "Прямолинейность, строгость, серьезность",
    label: "Прямолинейность, строгость, серьезность",
  },
  {
    id: "Опыт работы в эзотерике",
    label: "Опыт работы в эзотерике",
  },
  {
    id: "Научность, доказательная база подхода, без эзотерики",
    label: "Научность, доказательная база подхода, без эзотерики",
  },
  {
    id: "Опыт семейной жизни, собственные дети",
    label: "Опыт семейной жизни, собственные дети",
  },
  {
    id: "Знание более 1 метода терапии (модальности)",
    label: "Знание более 1 метода терапии (модальности)",
  },
] as const

const FormSchema = z.object({
  preferences: z.array(z.string()),
  customPreferences: z.string(),
})

export const PreferencesStage = () => {
  const dispatch = useDispatch()

  const ticketID = useSelector<RootState, string>(
    state => state.applicationFormData.ticketID
  );

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Что важно в психологе", ticket_id: ticketID },
    });
  }, [])

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
    const res = data.preferences.join(';')+';'+data.customPreferences
    axios({
      url: 'https://n8n-v2.hrani.live/webhook/step-analytics',
      method: 'PUT',
      data: { ticketID, field: 'client_preferences', value: res }
      }
    )
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
    dispatch(setApplicationStage('request'))
  }

  return (
    <div className='px-[50px] max-lg:px-[20px] flex w-full grow  overflow-y-auto'>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col min-h-min mt-[15px]">
          <FormField
            control={form.control}
            name="preferences"
            render={({ field }) => (
              <div className='grow'>
                <FormItem className='grow p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px] min-lg:h-[300px] overflow-y-auto'>
                  <FormLabel className='text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                    Что вам важно в психологе?
                  </FormLabel>
                  <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                    Опыт, образование и личная терапия - по умолчанию. Если предпочтений нет - можете пропустить
                  </FormDescription>
                  <div className='flex flex-col gap-[20px] max-lg:gap-[16px] mt-[20px] max-lg:mt-[16px]'>
                    {preferences.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="preferences"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, item.id])
                                      : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== item.id
                                        )
                                      )
                                  }}
                                  className='h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]'
                                />
                              </FormControl>
                              <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                {item.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    <div className='ml-[30px] max-lg:ml-0 max-lg:mt-[15px]'>
                      <FormField
                        control={form.control}
                        name="customPreferences"
                        render={({ field }) => (
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Введите свой вариант ответа"
                              className="textarea__text text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] max-lg:min-h-[80px]"
                            />
                          </FormControl>
                        )} />
                    </div>
                  </div>
                </FormItem>
              </div>
            )}
          />
          <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px] mt-[30px] max-lg:mt-[10px]">
            <button
              type='button'
              onClick={() => dispatch(setApplicationStage('gender'))}
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