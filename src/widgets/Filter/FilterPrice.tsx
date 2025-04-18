
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useEffect } from 'react';

type Props = {
    callback: () => void;
    onSubmit: (data: any) => void;
    type: string;
}

export const FilterPrice:React.FC<Props> = ({onSubmit, type }) => {
    const FormSchema = z.object({
        price: z.enum(["1500", "2000", "3000"]).optional(),
    })

    const { handleSubmit, watch, control, ...form } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            price: '1500'
        }
    })
     
    const handleCheckboxCheck = watch('price'); 

    useEffect(() => {
        onSubmit(handleCheckboxCheck)
        console.log(handleCheckboxCheck);
        
    },[handleCheckboxCheck])

    return (
        <ModalWindow closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">С психологом какого пола вы готовы работать?</DialogTitle>
                <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <Form {...form} control={control} watch={watch} handleSubmit={handleSubmit}>
                <form className="w-2/3 space-y-6">
                    <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            defaultValue={field.value}
                            onValueChange={field.onChange}
                            className="flex flex-col gap-[40px] max-lg:gap-[20px]"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem  colorRadio={'#116466'} className='w-[30px] h-[30px] ' value="1500" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                    До 1500 ₽
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem   colorRadio='#116466' className='w-[30px] h-[30px]' value="2000" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                    До 2000₽
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem   colorRadio='#116466' className='w-[30px] h-[30px]' value="3000" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] max-lg:text-[14px]">
                                    До 3000 ₽
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </form>
            </Form>
        </ModalWindow>
    );
};