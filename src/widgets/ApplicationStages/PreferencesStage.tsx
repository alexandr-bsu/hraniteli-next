'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toNextStage } from '@/redux/slices/application_form';
import { fill_custom_preferences, fill_preferences } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { z } from 'zod'

const PreferencesStage = () => {
    const dispatch = useDispatch();

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
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            preferences: [

            ],
            customPreferences: '',
        }
    })

    function handleSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(toNextStage('gender_psychologist')) 

        const result = []


        for (let index = 0; index < data.preferences.length; index++) {
            const findElements = preferences.find(item => item.id === data.preferences[index])
            result.push(findElements?.label);
        }

        dispatch(fill_preferences(result))

        dispatch(fill_custom_preferences(data.customPreferences))
    }

    return (
        <div className='px-[50px] max-lg:px-[20px]  flex w-full grow'>
            <Form {...form} >
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[20px] border-[#D4D4D4] w-full flex flex-col">
                    <FormField
                        control={form.control}
                        name="preferences"
                        render={({ field }) => (
                            <div className='grow '>
                                <FormItem className='grow p-[25px] max-h-[320px] max-lg:max-h-none max-lg:p-[15px] border-[1px] rounded-[25px]  '>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>Что вам важно в психологе?</FormLabel>
                                    <FormDescription className='max-lg:text-[14px] font-normal text-[18px]  leading-[25px] mt-[10px]'>
                                        Опыт, образование и личная терапия - по умолчанию. Если предпочтений нет - можете пропустить
                                    </FormDescription>
                                    <div className='flex justify-between mt-[25px] max-lg:flex-col  max-h-[150px] max-lg:max-h-none overflow-hidden'>
                                        <div className='flex flex-col gap-[15px] w-full max-h-[150px]  max-lg:max-h-[200px] pb-[50px] overflow-x-auto'>
                                            {preferences.map((item) => (
                                                <FormField
                                                key={item.id}
                                                control={form.control}
                                                name="preferences"
                                                render={({  } : any) => {
                                                    return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-center space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                        <Checkbox
                                                            className='h-[30px] w-[30px]'
                                                            checked={field.value?.includes(item.id)}
                                                            onCheckedChange={(checked) => {
                                                            return checked
                                                                ? field.onChange([...field.value, item.id])
                                                                : field.onChange(
                                                                    field.value?.filter(
                                                                    (value: any) => value !== item.id
                                                                    )
                                                                )
                                                            }}
                                                        />
                                                        </FormControl>
                                                        <FormLabel className="text-[18px] leading-[25px] max-lg:text-[14px]  font-normal">
                                                        {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                    )
                                                }}
                                                />
                                            ))}
                                        </div>
                                        <div>
                                        <FormField
                                            control={form.control}
                                            name="customPreferences"
                                            render={({ field }) => (
                                            <FormControl>
                                                <Textarea
                                                {...field} 
                                                placeholder="Введите свой вариант ответа"
                                                className="w-[361px] bg-[#FAFAFA] border-none h-[190px] min-h-[190px] max-h-[190px] max-lg:mt-[25px] max-lg:w-full"
                                                />
                                            </FormControl>
                                            )}/>
                                        </div>
                                    </div>
                                </FormItem>
                            </div>
                        )}
                    />
                    <div className="shrink-0  pb-[50px] flex gap-[10px]  max-lg:mt-[20px]">
                        <button onClick={() => dispatch(toNextStage('gender'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                            Назад
                        </button>

                        <button type='submit' className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                            Продолжить
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default PreferencesStage;