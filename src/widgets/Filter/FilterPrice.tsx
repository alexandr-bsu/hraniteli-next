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
import { ModalType } from '@/redux/slices/modal';

type Props = {
    callback: () => void;
    onSubmit: (data: any) => void;
    type: ModalType;
}

export const FilterPrice:React.FC<Props> = ({onSubmit, type }) => {
    const FormSchema = z.object({
        price: z.enum(["1000", "2000", "3000"]).optional(),
    })

    const { handleSubmit, watch, control, ...form } = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            price: undefined
        }
    })
     
    const handleCheckboxCheck = watch('price'); 

    useEffect(() => {
        if (handleCheckboxCheck) {
            onSubmit(Number(handleCheckboxCheck));
        }
    },[handleCheckboxCheck])

    return (
        <ModalWindow className='max-[425px]:h-[240px] max-lg:p-[16px]' closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center max-lg:mb-[16px]">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] max-lg:leading-[22px]">Выберите минимальную стоимость сессии</DialogTitle>
                <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <Form {...form} control={control} watch={watch} handleSubmit={handleSubmit}>
                <form className="w-2/3 space-y-6 max-lg:w-full max-lg:space-y-4">
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
                                <RadioGroupItem colorRadio={'#116466'} className='w-[30px] h-[30px] max-lg:w-[24px] max-lg:h-[24px]' value="1000" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px]">
                                    От 1000 ₽
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem colorRadio='#116466' className='w-[30px] h-[30px] max-lg:w-[24px] max-lg:h-[24px]' value="2000" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px]">
                                    От 2000 ₽
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem colorRadio='#116466' className='w-[30px] h-[30px] max-lg:w-[24px] max-lg:h-[24px]' value="3000" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px]">
                                    От 3000 ₽
                                </FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage className="text-[14px]" />
                        </FormItem>
                    )}
                    />
                </form>
            </Form>
        </ModalWindow>
    );
};