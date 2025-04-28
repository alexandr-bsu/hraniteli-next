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
import { Gender } from '@/shared/types/application.types';
import { ModalType } from '@/redux/slices/modal';

interface FilterGenderProps {
  open?: boolean;
  type: ModalType;
  onSubmit: (data: Gender) => void;
  currentGender: Gender;
}

export const FilterGender:React.FC<FilterGenderProps> = ({onSubmit, type, open, currentGender }) => {

    const items = {
        ['male']: 'Мужской',
        ['female']: 'Женский',
        ['none']: 'Не имеет значения',
    } as const

    const FormSchema = z.object({
        gender: z.enum(["male", "female", "none"]).optional(),
    })

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            gender: currentGender === 'other' ? 'none' : currentGender === 'none' ? 'none' : currentGender
        }
    })

    const { control, setValue } = form;

    useEffect(() => {
        setValue('gender', currentGender === 'other' ? 'none' : currentGender === 'none' ? 'none' : currentGender);
    }, [currentGender, setValue]);
    
    const handleRadioChange = (value: string) => {
        const genderValue = value === 'none' ? 'other' : value as Gender;
        onSubmit(genderValue);
    }

    return (
        <ModalWindow className='max-[425px]:h-[240px] max-lg:p-[16px]' open={open} closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center max-lg:mb-[16px]">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] max-lg:leading-[22px]">С психологом какого пола вы готовы работать?</DialogTitle>
                <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <Form {...form}>
                <form className="w-2/3 space-y-6 max-lg:w-full max-lg:space-y-4">
                    <FormField
                    control={control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormControl>
                            <RadioGroup
                            defaultValue={field.value}
                            onValueChange={handleRadioChange}
                            className="flex flex-col gap-[40px] max-lg:gap-[20px]"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem colorRadio={'#116466'} className='w-[30px] h-[30px] max-lg:w-[24px] max-lg:h-[24px]' value="male" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px]">
                                Мужской
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem colorRadio='#116466' className='w-[30px] h-[30px] max-lg:w-[24px] max-lg:h-[24px]' value="female" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px]">
                                Женский
                                </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem colorRadio='#116466' className='w-[30px] h-[30px] max-lg:w-[24px] max-lg:h-[24px]' value="none" />
                                </FormControl>
                                <FormLabel className="font-normal text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px]">
                                    Не имеет значения
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