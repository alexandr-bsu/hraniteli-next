'use client'

import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { setApplicationStage, ApplicationStage } from '@/redux/slices/application_form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { setActions } from '@/redux/slices/application_form_data'
import { COLORS } from '@/shared/constants/colors'

const ACTIONS = [
  'Потеря близкого человека',
  'Развод',
  'Расставание', 
  'Потеря работы',
  'Переезд',
  'Тяжелая болезнь',
  'Финансовые трудности',
  'Конфликты в семье',
  'Проблемы на работе',
  'Другое'
]

const FormSchema = z.object({
  actions: z.array(z.string()).min(1, 'Выберите хотя бы один вариант')
})

type FormData = z.infer<typeof FormSchema>

export const ActionStage = () => {
  const dispatch = useDispatch()

  const savedActions = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('app_actions') || '[]')
    : []

  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      actions: savedActions
    }
  })

  const handleSubmit = (data: FormData) => {
    localStorage.setItem('app_actions', JSON.stringify(data.actions))
    dispatch(setActions(data.actions))
    dispatch(setApplicationStage('gratitude' as ApplicationStage))
  }

  return (
    <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] w-full flex flex-col">
          <FormField
            control={form.control}
            name="actions"
            render={({ field }) => (
              <div className='grow max-h-[100%]'>
                <FormItem className='grow max-[425px]:mb-[30px]'>
                  <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>
                    Отметьте травмирующие события, которые произошли с вами за последний год
                  </FormLabel>
                  
                  <div className='mt-[30px] flex flex-col gap-[15px]'>
                    {ACTIONS.map((action) => (
                      <label key={action} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          value={action}
                          checked={field.value?.includes(action)}
                          onChange={(e) => {
                            const value = e.target.value
                            const newValue = e.target.checked
                              ? [...(field.value || []), value]
                              : field.value?.filter((v) => v !== value) || []
                            field.onChange(newValue)
                          }}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span>{action}</span>
                      </label>
                    ))}
                  </div>

                  {form.formState.errors.actions && (
                    <span style={{ color: COLORS.error }}>
                      {form.formState.errors.actions.message}
                    </span>
                  )}
                </FormItem>
              </div>
            )}
          />

          <div className="shrink-0 pb-[50px] flex gap-[10px] mt-[30px]">
            <button 
              type="button"
              onClick={() => dispatch(setApplicationStage('diseases' as ApplicationStage))}
              className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]"
            >
              Назад
            </button>

            <button 
              type="submit"
              className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-white font-normal text-[18px] max-lg:text-[14px] rounded-[50px]"
            >
              Далее
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}