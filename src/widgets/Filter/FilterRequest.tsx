
import { Checkbox } from '@/components/ui/checkbox';
import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

import { z } from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import Image from 'next/image';
import { useCallback, useEffect } from 'react';
type Props = {
    callback: () => void;
    onSubmit: (data: any) => void;
    type: string;
}

export const FilterRequest:React.FC<Props> = ({onSubmit, type }) => {

    const items = [
        {
          id: "query",
          label: "Принимаете ли вы медикаменты по назначению психиатра",
        },
        {
          id: "query2",
          label: "Физические недомогания: постоянная усталость, бессонница, проблемы с питанием, проблемы с памятью, психосоматические реакции",
        },
        {
          id: "query3",
          label: "Подавленное настроение, прокрастинация, ощущение бессмысленности существования, опустошенность, отверженность",
        },
        {
          id: "query4",
          label: "Странные, кошмарные, повторяющиеся сны",
        },
        {
            id: "query5",
            label: "Страх будущего и неопределенности",
        },
        {
            id: "query6",
            label: "Беременность, родительство, послеродовая депрессия, проблемы в отношениях с детьми до 18 лет",
        },
    ] as const

    const FormSchema = z.object({
        items: z.array(z.string()),
    })

    const { handleSubmit, watch, ...form } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
            defaultValues: {
                items: []
            },
    })

    const handleSubmitData = useCallback((data: z.infer<typeof FormSchema>) => {
        const result: any = []
        for (let index = 0; index < data.items.length; index++) {
            const findItems = items.find(item => item.id === data.items[index]);  
            result.push(findItems) 
        }

        return result;
    },[])

    const handleCheckboxCheck = watch('items');

    useEffect(() => {
        const filterData = handleSubmitData({items: handleCheckboxCheck})

        onSubmit(filterData)
    },[handleCheckboxCheck])
    
    return (
        <ModalWindow className='max-[425px]:h-[400px]'  closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">Выберите запросы:</DialogTitle>
                <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <Form {...form} watch={watch} handleSubmit={handleSubmit}>
                <form  className="flex flex-col gap-[20px]">
                    <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem className='gap-[20px] overflow-auto max-lg:max-h-[200px]'>
                        {items.map((item) => (
                            <FormField
                            key={item.id}
                            control={form.control}
                            name="items"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-center gap-[14px]"
                                >
                                    <FormControl>
                                    <Checkbox 
                                        className='h-[30px] w-[30px]'
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                            return checked
                                            ?  field.onChange([...field.value, item.id])
                                            :  field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                ))
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="text-[18px] max-lg:text-[14px]  font-normal">
                                    {item.label}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                            />
                        ))}
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </form>
            </Form>
        </ModalWindow>
    );
};