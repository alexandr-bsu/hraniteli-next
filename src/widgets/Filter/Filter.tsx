'use client'
import Image from "next/image";
import {
    Select,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { openModal, closeModal, ModalType } from "@/redux/slices/modal";
import { FilterRequest } from "./FilterRequest";
import { FilterGender } from "./FilterGender";
import { FilterPrice } from "./FilterPrice";
import { FilterDate } from "./FilterDate";
import { FilterTime } from "./FilterTime";
import { 
    findByDate, 
    findByGender, 
    findByMental_Illness, 
    findByMental_Illness2, 
    findByPrice, 
    findByRequests, 
    findByTime, 
    findByVideo 
} from "@/redux/slices/filter";
import { Gender } from "@/shared/types/application.types";

interface FilterData {
    label: string;
    id?: string;
}

interface DateFilterData {
    date: string;
    slots?: string[];
}

export const Filter = () => {
    const [isShow, setShow] = useState(true);
    const { isOpen, type: modalType } = useSelector((state: RootState) => state.modal);

    const [filterData, setFilterDate] = useState<DateFilterData[]>([]);
    const [filterPrice, setFilterPrice] = useState<string[]>([]);
    const [filterRequest, setFilterRequest] = useState<FilterData[]>([]);
    const [filterGender, setFilterGender] = useState<string>('');

    const dispatch = useDispatch();

    const handleModalOpen = (type: ModalType) => {
        dispatch(openModal(type));
    };

    const handleModalClose = () => {
        dispatch(closeModal());
    };

    return (
        <>
            <div className="w-[100%] bg-[#FFFFFF] rounded-[20px] p-[20px]">
                <div className="max-lg:hidden w-full flex justify-between">
                    <h2 className="font-semibold text-[20px] leading-[27px]">
                        Фильтры
                    </h2>
                    <Image src='/filter.svg' height={18} width={18} alt="filter" />
                </div>

                <div className="min-lg:hidden w-full flex justify-between">
                    <div className="flex gap-[15px]">
                        <Image src='/filter.svg' height={18} width={18} alt="filter" />
                        <h2 className="font-semibold text-[20px] leading-[27px]">
                            Фильтры
                        </h2>
                    </div>
                    <button 
                        onClick={() => setShow(prev => !prev)} 
                        className="text-[#116466]"
                    >
                        {isShow ? 'Свернуть' : 'Развернуть'}
                    </button>
                </div>

                {isShow && (
                    <>
                        <div className="w-full mt-[20px]">
                            <FilterRequest 
                                type="FilterRequest" 
                                callback={handleModalClose}
                                onSubmit={(data: FilterData[]) => {
                                    setFilterRequest(data);
                                    dispatch(findByRequests(data.map(item => item.label)));
                                }}
                                open={isOpen && modalType === 'FilterRequest'}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterRequest')} 
                                open={isOpen && modalType === 'FilterRequest'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] leading-[25px]">
                                    <SelectValue placeholder="Выберите запросы" />
                                </SelectTrigger>
                            </Select>
                            {filterRequest?.map((item, i) => (
                                <div key={i}>
                                    <p>{item.label}</p>      
                                </div>
                            ))}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterGender 
                                type="FilterGender" 
                                callback={handleModalClose}
                                onSubmit={(data: Gender) => {
                                    setFilterGender(data);
                                    dispatch(findByGender(data));
                                }}
                                open={isOpen && modalType === 'FilterGender'}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterGender')} 
                                open={isOpen && modalType === 'FilterGender'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] leading-[25px]">
                                    <SelectValue placeholder="Выберите пол хранителя" />
                                </SelectTrigger>
                            </Select>
                            {filterGender}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterPrice 
                                type="FilterPrice" 
                                callback={handleModalClose}
                                onSubmit={(price: number) => {
                                    setFilterPrice([price.toString()]);
                                    dispatch(findByPrice(price));
                                }}
                                open={isOpen && modalType === 'FilterPrice'}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterPrice')} 
                                open={isOpen && modalType === 'FilterPrice'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] leading-[25px]">
                                    <SelectValue placeholder="Выберите стоимость" />
                                </SelectTrigger>
                            </Select>
                            {filterPrice}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterDate 
                                type="FilterDate" 
                                callback={handleModalClose}
                                onSubmit={(dates: DateFilterData[]) => {
                                    setFilterDate(dates);
                                    dispatch(findByDate(dates.map(d => d.date)));
                                }}
                                open={isOpen && modalType === 'FilterDate'}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterDate')} 
                                open={isOpen && modalType === 'FilterDate'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] leading-[25px]">
                                    <SelectValue placeholder="Выберите дату сессии" />
                                </SelectTrigger>
                            </Select>
                            {filterData?.map((item, i) => (
                                <div key={i}>{item.date}</div>
                            ))}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterTime 
                                type="FilterTime" 
                                callback={handleModalClose}
                                onSubmit={(times: string[]) => {
                                    dispatch(findByTime(times));
                                }}
                                open={isOpen && modalType === 'FilterTime'}
                            />        
                        </div>

                        <div className="flex items-center gap-[15px] mt-[30px]">
                            <Checkbox 
                                className="w-[30px] h-[30px]" 
                                id="video"
                                onCheckedChange={(checked: boolean) => {
                                    dispatch(findByVideo(checked));
                                }}
                            />
                            <label
                                htmlFor="video"
                                className="font-normal text-[16px] leading-[22px]"
                            >
                                Есть видеовизитка
                            </label>
                        </div>

                        <div className="flex items-center gap-[15px] mt-[15px]">
                            <Checkbox 
                                className="w-[30px] h-[30px]" 
                                id="mental_illnesses"
                                defaultChecked={false}
                                onCheckedChange={(checked: boolean) => {
                                    dispatch(findByMental_Illness(checked));
                                }}
                            />
                            <label
                                htmlFor="mental_illnesses"
                                className="font-normal text-[16px] leading-[22px]"
                            >
                                Работает с психическими заболеваниями (РПП, СДВГ и др)
                            </label>
                        </div>

                        <div className="flex items-center gap-[15px] mt-[15px]">
                            <Checkbox 
                                className="w-[30px] h-[30px]" 
                                id="mental_illnesses2"
                                defaultChecked={false}
                                onCheckedChange={(checked: boolean) => {
                                    dispatch(findByMental_Illness2(checked));
                                }}
                            />
                            <label
                                htmlFor="mental_illnesses2"
                                className="font-normal text-[16px] leading-[22px]"
                            >
                                Принимаете ли вы медикаменты по назначению психиатра
                            </label>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};