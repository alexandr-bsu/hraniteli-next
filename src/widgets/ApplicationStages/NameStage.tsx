'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { setApplicationStage } from '@/redux/slices/application_form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch } from 'react-redux'
import { setUsername } from '@/redux/slices/application_form_data'

const FormSchema = z.object({
  username: z.string().nonempty("Вы не заполнили обязательное поле")
})

export default function NameStageApplication() {
  const dispatch = useDispatch()
  
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
  const handleSubmit = (data: { username: string }) => {
    localStorage.setItem('app_username', data.username) // Сохраняем в localStorage
    dispatch(setUsername(data.username)) // Сохраняем в Redux (если нужно)
    dispatch(setApplicationStage('age')) // Переход на следующую страницу
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log('Данные локалстореж')
    }
  }

  return (
    <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full mt-[30px] flex flex-col">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <div className='grow max-h-[100%]'>
                <FormItem className='grow max-[425px]:mb-[30px]'>
                  <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>
                    Как вас зовут?
                  </FormLabel>
                  <FormDescription className='max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[10px]'>
                    Вы можете не указывать имя, если пока не готовы
                  </FormDescription>
                  <div className='input__text_container max-lg:mt-[10px] mt-[30px] relative bg-[#FAFAFA] w-full h-[65px]'>
                    <Input
                      {...field}
                      className='input__text placeholder:text-[#9A9A9A] rounded-[10px] border-none w-full h-full'
                      onChange={(e) => {
                        field.onChange(e) // Обновляем значение в форме
                        localStorage.setItem('app_username', e.target.value) // Сразу сохраняем
                      }}
                    />
                    <label className='input__text_label'>Введите ваше имя или псевдоним</label>
                  </div>
                  {!form.formState.errors.username && (
                    <span className='mt-[10px] max-lg:text-[12px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                      Это обязательное поле
                    </span>
                  )}
                  <FormMessage className='mt-[10px]'/>
                </FormItem>
              </div>
            )}
          />
          <div className="shrink-0 pb-[50px] flex gap-[10px]">
            <button 
              type="button" 
              className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]"
            >
              Назад
            </button>
            <button 
              type="submit" 
              className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]"
            >
              Продолжить
            </button>
          </div>
        </form>
      </Form>
    </div>
  )
}