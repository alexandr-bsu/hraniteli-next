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
import { useCallback, useEffect, useMemo } from 'react';
import { ModalType } from '@/redux/slices/modal';

interface FilterData {
    label: string;
    id?: string;
}

interface FilterRequestProps {
    type: ModalType;
    callback: (e?: React.MouseEvent) => void;
    onSubmit: (data: FilterData[]) => void;
    open: [boolean, () => void];
    selectedFilters?: FilterData[];
}

export const FilterRequest:React.FC<FilterRequestProps> = ({onSubmit, type, callback, open: [isOpen, setOpen], selectedFilters }) => {

    const items = useMemo(() => [
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
    ] as const, []);

    const FormSchema = z.object({
        items: z.array(z.string()),
    })

    const methods = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: selectedFilters?.map(filter => items.find(item => item.label === filter.label)?.id || '') || []
        },
    })

    const { handleSubmit: formHandleSubmit, watch, setValue, control } = methods;

    useEffect(() => {
        const newItems = selectedFilters?.map(filter => items.find(item => item.label === filter.label)?.id || '') || [];
        if (JSON.stringify(methods.getValues('items')) !== JSON.stringify(newItems)) {
            setValue('items', newItems);
        }
    }, [selectedFilters, items, setValue, methods]);

    const onFormSubmit = useCallback((data: z.infer<typeof FormSchema>) => {
        const selectedItems: FilterData[] = [];
        data.items.forEach((id) => {
            const match = items.find(item => item.id === id);
            if (match) {
                selectedItems.push({ label: match.label, id: match.id });
            }
        });
        onSubmit(selectedItems);
        setOpen();
        callback();
    }, [items, onSubmit, setOpen, callback]);

    const handleCheckboxCheck = watch('items');

    return (
        <ModalWindow className='max-[425px]:h-[400px]' open={isOpen} closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">Выберите запросы:</DialogTitle>
                <DialogClose onClick={callback} className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <Form {...methods}>
                <form onSubmit={formHandleSubmit(onFormSubmit)} className="flex flex-col gap-[20px]">
                    <FormField
                        control={control}
                        name="items"
                        render={() => (
                            <FormItem className='gap-[20px] overflow-auto max-lg:max-h-[200px]'>
                            {items.map((item) => (
                                <FormField
                                key={item.id}
                                control={control}
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
                                                const newValue = checked
                                                    ? [...(field.value || []), item.id]
                                                    : (field.value || []).filter((value) => value !== item.id);
                                                field.onChange(newValue);
                                                const result: FilterData[] = [];
                                                newValue.forEach((id) => {
                                                    const match = items.find(item => item.id === id);
                                                    if (match) {
                                                        result.push({ label: match.label, id: match.id });
                                                    }
                                                });
                                                onSubmit(result);
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