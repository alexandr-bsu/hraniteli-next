'use client'
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setAge } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'
import { COLORS } from '@/shared/constants/colors';
import styles from './AgeStage.module.scss'

const FormSchema = z.object({
    age: z.string()
        .nonempty("Вы не заполнили обязательное поле")
        .regex(/^\d+$/, "Возраст должен быть числом")
        .refine(val => {
            const num = parseInt(val);
            return num >= 18 && num <= 100;
        }, "Возраст должен быть от 18 до 100 лет")
});

type FormData = z.infer<typeof FormSchema>;

const AgeStageApplication = () => {
    const dispatch = useDispatch();

    // 1. Загружаем сохраненное имя при инициализации
    const savedAge = typeof window !== 'undefined' 
    ? localStorage.getItem('app_age') || ''
    : ''

    //Настраиваем форму
    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            age: savedAge,
        }
    })

    const handleSubmit = (data: FormData) => {
        localStorage.setItem('app_age', data.age) // Сохраняем в localStorage
        dispatch(setAge(data.age)) // Сохраняем в Redux (если нужно)
        dispatch(setApplicationStage('gender')) // Переход на следующую страницу
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col mt-[30px]">
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <div className='grow'>
                                <FormItem className='grow max-[425px]:mb-[30px]'>
                                    <FormLabel className={`text-[18px] leading-[25px] max-lg:text-[16px] font-normal text-[${COLORS.text.primary}]`}>
                                        Сколько вам лет?
                                    </FormLabel>
                                    <FormDescription className={`max-lg:text-[16px] font-normal text-[18px] leading-[25px] text-[${COLORS.text.secondary}]`}>
                                        Мы учитываем ваш возраст при подборе психолога
                                    </FormDescription>
                                    <div className={styles.input__text_container}>
                                        <Input
                                            {...field}
                                            placeholder=" "
                                            className={`${styles.input__text} placeholder:text-[#9A9A9A] text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px] rounded-[10px] border-none w-full h-full`}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                localStorage.setItem('app_age', e.target.value)
                                            }}
                                        />
                                        <label className={styles.input__text_label}>
                                            Введите ваш возраст
                                        </label>
                                    </div>
                                    {!form.formState.errors.age &&
                                        <span className={`mt-[10px] max-lg:text-[16px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]`}>
                                            ! Поле обязательное для заполнения
                                        </span>
                                    }
                                    <FormMessage className='mt-[10px] max-lg:text-[16px]'/>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0 pb-[50px] flex gap-[10px]">
                        <button 
                            type='button' 
                            onClick={() => dispatch(setApplicationStage('name'))} 
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[16px] rounded-[50px]`}
                        >
                            Назад
                        </button>

                        <button 
                            type='submit' 
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[16px] rounded-[50px]`}
                        >
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default AgeStageApplication;