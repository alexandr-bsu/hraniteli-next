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
import { setDiseases } from "@/redux/slices/application_form_data"
import { useEffect, useState } from "react"
import { COLORS } from '@/shared/constants/colors'

const FormSchema = z.object({
    diseases: z.enum(["diseases2", 'nothing', 'no'], {
        required_error: "Вы не заполнили обязательное поле",
    }),
    isUnderTreatment: z.enum(["yes", "no"]).optional()
}).refine(data => {
    if (data.diseases === "diseases2") {
        return data.isUnderTreatment !== undefined;
    }
    return true;
}, {
    message: "Пожалуйста, укажите, находитесь ли вы на лечении",
    path: ["isUnderTreatment"]
});

export const DiseasesStage = () => {
    const dispatch = useDispatch();
    const [showAdditionalQuestion, setShowAdditionalQuestion] = useState(false);

    const diseases = {
        ['diseases2']: ['Есть диагностированное психиатрическое заболевание'],
        ['no']: ['Нет'],
        ['nothing']: ['Не имеет значения']
    }

    // 1. Загружаем сохраненные данные из localStorage
    const savedData = typeof window !== 'undefined' 
        ? JSON.parse(localStorage.getItem('app_diseases') || '{}')
        : {}

    // 2. Настраиваем форму
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: savedData
    })

    const diseasesValue = form.watch("diseases");

    // 3. Сохраняем данные при изменении
    useEffect(() => {
        setShowAdditionalQuestion(diseasesValue === "diseases2");
        if (diseasesValue !== "diseases2") {
            form.setValue("isUnderTreatment", undefined);
        }
        
        const subscription = form.watch((value) => {
            localStorage.setItem('app_diseases', JSON.stringify(value));
        });
        
        return () => subscription.unsubscribe();
    }, [diseasesValue, form]);

    // 4. Отправка формы
    const handleSubmit = (data: z.infer<typeof FormSchema>) => {
        localStorage.setItem('app_diseases', JSON.stringify(data));
        
        const diseasesData = [...diseases[data.diseases]];
        
        if (data.diseases === "diseases2" && data.isUnderTreatment) {
            const treatmentStatus = data.isUnderTreatment === "yes" ? "Принимаю медикаменты" : "Не принимаю медикаменты";
            diseasesData.push(treatmentStatus);
        }
        
        dispatch(setDiseases(diseasesData));
        dispatch(setApplicationStage('promocode'));
    }

    return (
        <div className='px-[50px] grow max-lg:px-[20px] flex-col flex w-full'>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[30px] border-[#D4D4D4] w-full flex flex-col grow">
                <FormField
                control={form.control}
                name="diseases"
                render={({ field }) => (
                    <div className='grow h-[347px] overflow-scroll'>
                    <FormItem className='grow p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]'>
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
                            className="flex flex-col"
                            >
                                <FormItem className="flex items-center gap-[15px]">
                                    <FormControl> 
                                    <RadioGroupItem className="h-[30px] w-[30px]" value="diseases2" />
                                    </FormControl>
                                    <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                        Есть диагностированное психиатрическое заболевание
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-[15px]">
                                    <FormControl> 
                                    <RadioGroupItem className="h-[30px] w-[30px]" value="no" />
                                    </FormControl>
                                    <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                       Нет
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-[15px]">
                                    <FormControl> 
                                    <RadioGroupItem className="h-[30px] w-[30px]" value="nothing" />
                                    </FormControl>
                                    <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                        Не имеет значения
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        {showAdditionalQuestion && (
                            <FormField
                            control={form.control}
                            name="isUnderTreatment"
                            render={({ field }) => (
                               <div>
                                    <FormLabel className='max-lg:text-[16px] max-lg:leading-[22px] mt-[30px] font-semibold text-[20px] leading-[27px]'>
                                        Принимаете ли вы медикаменты <br></br> по назначению психиатра?
                                    </FormLabel>
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
                                                <RadioGroupItem className="h-[30px] w-[30px]" value="yes" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                                    Да
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center gap-[15px]">
                                                <FormControl> 
                                                <RadioGroupItem className="h-[30px] w-[30px]" value="no" />
                                                </FormControl>
                                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                                   Нет
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </div>
                            )}
                            />
                        )}
                    </FormItem>
                    </div>
                )}
                />

                <div className="shrink-0 mt-[30px] pb-[50px] flex gap-[10px]">
                    <button 
                        type="button"
                        onClick={() => dispatch(setApplicationStage('action'))}
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