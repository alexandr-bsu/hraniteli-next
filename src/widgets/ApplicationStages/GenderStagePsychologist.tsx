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
import { toNextStage } from "@/redux/slices/application_form"
import { fill_gender_psychologist } from "@/redux/slices/application_form_data"

const FormSchema = z.object({
    gender: z.enum(["male", "female", 'nothing'], {
    required_error: "Вы не заполнили обязательное поле",
  }),
})

const sex_data = {
    ['male']: 'Мужчина',
    ['female']: 'Женщина',
    ['nothing']: 'Не имеет значения',
} 

export const GenderStagePsychologist = () => {


    const dispatch = useDispatch();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function handleSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(toNextStage('request')) 
        dispatch(fill_gender_psychologist(sex_data[data.gender]))
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
                        Мы учитываем ваш пол при подборе психолога
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
                                <FormLabel className="font-normal text-[18px]">
                                    Мужской
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl> 
                                <RadioGroupItem className="h-[30px] w-[30px]" value="nothing" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px]">
                                    Женский
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl> 
                                <RadioGroupItem className="h-[30px] w-[30px]" value="female" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px]">
                                    Не имеет значения
                                </FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    {
                        !form.formState.errors.gender && <span className='mt-[10px] max-lg:text-[12px] font-normal text-[14px] leading-[100%] text-[#9A9A9A]'>
                            ! Поле обязательное для заполнения
                        </span>
                    }
                    <FormMessage />
                </FormItem>
                </div>
            )}
            />
            <div className="shrink-0  pb-[50px] flex gap-[10px]">
                <button type='submit' onClick={() => dispatch(toNextStage('preferences'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                    Назад
                </button>

                <button type='submit' className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                    Продолжить
                </button>
            </div>
        </form>
        </Form>
    </div>
  )
}
