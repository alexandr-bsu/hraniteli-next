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
import { fill_diseasesPsychologist } from "@/redux/slices/application_form_data"

const FormSchema = z.object({
    diseases: z.enum(["diseases1", "diseases2", 'nothing'], {
    required_error: "Вы не заполнили обязательное поле",
  }),
})

export const DiseasesPsychologistStage = () => {
    const dispatch = useDispatch();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    const diseases = {
        ['diseases1'] : ['Есть диагностированное психическое заболевание'],
        ['diseases2'] : ['Есть диагностированное психиатрическое заболевание'],
        ['nothing'] : ['Не имеет значения']
    } as const

    function handleSubmit(data: z.infer<typeof FormSchema>) {
        dispatch(toNextStage('gratitude')) 
        dispatch(fill_diseasesPsychologist(diseases[data.diseases]))
    }
  return (
    <div className='px-[50px] max-lg:px-[20px] flex-col min-h-full h-full  flex w-full grow'>
        <span className="my-[20px] w-full  min-lg:w-[494px] max-lg:text-[14px]">Идеальный психолог по вашим параметрам не найден, то если вы измените формы ( 2 )</span>

        <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className=" border-[#D4D4D4] w-full flex flex-col h-[100%] grow">
            <FormField
            control={form.control}
            name="diseases"
            render={({ field }) => (
                <div className='grow mb-[20px]'>
                <FormItem  className=' grow p-[25px] max-lg:p-[15px] border-[1px] rounded-[25px]  '>
                    <FormLabel className=' max-lg:text-[16px] max-lg:leading-[22px] font-semibold text-[20px] leading-[27px]'>Есть ли у вас диагностированные психические/
                        <br />
                        психиатрические заболевания?</FormLabel>
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
                                <RadioGroupItem className="h-[30px] w-[30px]" value="diseases1" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px]">
                                    Есть диагностированное психическое заболевание
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl> 
                                <RadioGroupItem className="h-[30px] w-[30px]" value="diseases2" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px]">
                                    Есть диагностированное психиатрическое заболевание
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center gap-[15px]">
                                <FormControl> 
                                <RadioGroupItem className="h-[30px] w-[30px]" value="nothing" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px]">
                                    Не имеет значения
                                </FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                </div>
            )}
            />
            <div className="shrink-0  pb-[50px] flex gap-[10px]">
                <button type='submit' onClick={() => dispatch(toNextStage('psychologist'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
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
