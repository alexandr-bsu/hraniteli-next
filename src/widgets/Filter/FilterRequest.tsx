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
import { useDispatch, useSelector } from 'react-redux';
import { findByRequests } from '@/redux/slices/filter';
import { RootState } from '@/redux/store';

export interface FilterData {
    label: string;
    id: string;
}

type FilterItem = FilterData;

interface FilterRequestProps {
    type: ModalType;
    callback: (e?: React.MouseEvent) => void;
    onSubmit: (data: FilterData[]) => void;
    open: [boolean, () => void];
    selectedFilters?: FilterData[];
}

export const FilterRequest:React.FC<FilterRequestProps> = ({onSubmit, type, callback, open: [isOpen, setOpen], selectedFilters }) => {
    const dispatch = useDispatch();
    const availableRequests = useSelector((state: RootState) => state.filter.available_requests);

    const items = useMemo(() => 
        availableRequests.map((request: string, index: number): FilterItem => ({
            id: `query${index + 1}`,
            label: request,
        }))
    , [availableRequests]);

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
        dispatch(findByRequests(selectedItems.map(item => item.label)));
        setOpen();
        callback();
    }, [items, onSubmit, setOpen, callback, dispatch]);

    const handleCheckboxChange = (checked: boolean | string, item: FilterItem, field: any) => {
        const newValue = Boolean(checked)
            ? [...(field.value || []), item.id]
            : (field.value || []).filter((value: string) => value !== item.id);
        field.onChange(newValue);
        const result: FilterData[] = [];
        newValue.forEach((id: string) => {
            const match = items.find(item => item.id === id);
            if (match) {
                result.push({ label: match.label, id: match.id });
            }
        });
        
        onSubmit(result);
        dispatch(findByRequests(result.map(item => item.label)));
    };

    const handleCheckboxCheck = watch('items');

    return (
        <ModalWindow className='max-[425px]:h-[400px] max-lg:p-[16px]' open={isOpen} closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center max-lg:mb-[16px]">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] max-lg:leading-[22px]">Выберите запросы:</DialogTitle>
                <DialogClose onClick={callback} className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <Form {...methods}>
                <form onSubmit={formHandleSubmit(onFormSubmit)} className="flex flex-col gap-[20px] max-lg:gap-[16px]">
                    <FormField
                        control={control}
                        name="items"
                        render={() => (
                            <FormItem className='flex flex-col gap-[20px] max-lg:gap-[16px] h-[400px] max-lg:h-[300px] overflow-y-auto pr-[10px]'>
                            <div className='flex flex-col gap-[20px] max-lg:gap-[16px]'>
                            {items.map((item) => (
                                <FormField
                                key={item.id}
                                control={control}
                                name="items"
                                render={({ field }) => {
                                    return (
                                    <FormItem
                                        key={item.id}
                                        className="flex flex-row items-start gap-[14px] max-lg:gap-[12px]"
                                    >
                                        <FormControl>
                                        <Checkbox 
                                            className='h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px] shrink-0'
                                            checked={field.value?.includes(item.id)}
                                            onCheckedChange={(checked) => {
                                                handleCheckboxChange(checked, item, field);
                                            }}
                                        />
                                        </FormControl>
                                        <FormLabel className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] font-normal cursor-pointer">
                                        {item.label}
                                        </FormLabel>
                                    </FormItem>
                                    )
                                }}
                                />
                            ))}
                            </div>
                            <FormMessage className="text-[14px]" />
                            </FormItem>
                        )}
                        />
                </form>
            </Form>

            <style jsx global>{`
                .overflow-y-auto::-webkit-scrollbar {
                    width: 4px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-track {
                    background: #F5F5F5;
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb {
                    background: #D4D4D4;
                    border-radius: 2px;
                }
                
                .overflow-y-auto::-webkit-scrollbar-thumb:hover {
                    background: #116466;
                }

                .overflow-x-auto::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </ModalWindow>
    );
};