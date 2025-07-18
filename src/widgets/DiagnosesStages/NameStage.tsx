'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { setApplicationStage } from '@/redux/slices/application_form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { setUsername } from '@/redux/slices/application_form_data'
import styles from '@/styles/input.module.scss'
import axios from 'axios'
const FormSchema = z.object({
  username: z.string().optional()
})

export default function NameStageApplication() {
  const dispatch = useDispatch()
  const ticketID = useSelector<RootState, string>(
          state => state.applicationFormData.ticketID
      );
  

  // 1. Загружаем сохраненное имя при инициализации
  const savedName = typeof window !== 'undefined'
    ? localStorage.getItem('app_username') || ''
    : ''

  // 2. Настраиваем форму
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: savedName
    }
  })

  // 3. Сохраняем данные
  const handleSubmit = (data: { username?: string }) => {
    if (data.username) {
      localStorage.setItem('app_username', data.username)
      dispatch(setUsername(data.username))
    }
    dispatch(setApplicationStage('age'))
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log('Данные локалстореж')
    }

    axios({
      url: 'https://n8n-v2.hrani.live/webhook/step-analytics',
      method: 'PUT',
      data: { ticketID, field: 'client_name', value: data.username }
      }
    )
  }

  return (
    <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full mt-[15px] flex flex-col">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <div className='grow max-h-[100%]'>
                <FormItem className='grow p-[30px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]'>
                  <FormLabel className='text-[20px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold'>
                    Как вас зовут?
                  </FormLabel>
                  <FormDescription className='text-neutral-500 dark:text-neutral-400 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal'>
                    Вы можете не указывать имя, если пока не готовы
                  </FormDescription>
                  <div className={styles.input__text_container}>
                    <Input
                      {...field}
                      placeholder=" "
                      className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                      onChange={(e) => {
                        field.onChange(e)
                        localStorage.setItem('app_username', e.target.value)
                      }}
                    />
                    <label className={`${styles.input__text_label} text-[14px]`}>
                      Введите ваше имя или псевдоним
                    </label>
                  </div>
                  <FormMessage className='mt-[10px] max-lg:mt-[8px]' />
                </FormItem>
              </div>
            )}
          />
          <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
            <button
              type="submit"
              className="cursor-pointer grow border-[1px] bg-[#116466] min-lg:p-[12px] text-[white] font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]"
            >
              Продолжить
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}