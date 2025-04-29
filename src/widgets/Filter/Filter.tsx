'use client'
import Image from "next/image";
import {
    Select,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { openModal, closeModal, ModalType } from "@/redux/slices/modal";
import { FilterRequest, FilterData } from "./FilterRequest";
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
    findByVideo,
    findByFavorites
} from "@/redux/slices/filter";
import { Gender } from "@/shared/types/application.types";

interface DateFilterData {
    date: string;
    slots?: string[];
}

export const Filter = () => {
    const [isShow, setShow] = useState(true);
    const { isOpen, type: modalType } = useSelector((state: RootState) => state.modal);
    const currentGender = useSelector((state: RootState) => state.filter.gender) as Gender;
    const favorites = useSelector((state: RootState) => state.favorites.items);

    const [filterData, setFilterDate] = useState<{ date: string; slots?: string[] }[]>([]);
    const [filterPrice, setFilterPrice] = useState<string[]>([]);
    const [filterRequest, setFilterRequest] = useState<FilterData[]>([]);
    const [filterGender, setFilterGender] = useState<Gender | ''>('');
    const [showFavorites, setShowFavorites] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        if (currentGender !== 'other') {
            setFilterGender(currentGender);
        } else {
            setFilterGender('');
        }
    }, [currentGender]);

    useEffect(() => {
        if (showFavorites) {
            dispatch(findByFavorites({ 
                favoriteIds: favorites.map(item => item.id || '').filter(Boolean), 
                enabled: true 
            }));
        }
    }, [favorites, showFavorites, dispatch]);

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
                    <h2 className="font-semibold text-[20px] lg:text-[20px] md:text-[16px] leading-[27px]">
                        Фильтры
                    </h2>
                    <Image src='/filter.svg' height={18} width={18} alt="filter" />
                </div>

                <div className="min-lg:hidden w-full flex justify-between">
                    <div className="flex gap-[15px]">
                        <Image src='/filter.svg' height={18} width={18} alt="filter" />
                        <h2 className="font-semibold text-[20px] lg:text-[20px] md:text-[16px] leading-[27px]">
                            Фильтры
                        </h2>
                    </div>
                    <button 
                        onClick={() => setShow(prev => !prev)} 
                        className="text-[#116466] font-normal text-[14px] leading-[22px]"
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
                                open={[isOpen && modalType === 'FilterRequest', () => dispatch(closeModal())]}
                                selectedFilters={filterRequest}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterRequest')} 
                                open={isOpen && modalType === 'FilterRequest'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px]">
                                    <SelectValue placeholder="Выберите запросы" />
                                </SelectTrigger>
                            </Select>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {filterRequest?.map((item, i) => (
                                    <div 
                                        key={i} 
                                        className="flex items-center gap-2 px-4 py-2 bg-[#116466] text-white rounded-[10px] text-[14px]"
                                    >
                                        <span>{item.label}</span>
                                        <button 
                                            onClick={() => {
                                                const newFilters = filterRequest.filter((_, index) => index !== i);
                                                setFilterRequest(newFilters);
                                                dispatch(findByRequests(newFilters.map(item => item.label)));
                                            }}
                                            className="w-4 h-4 flex items-center justify-center hover:opacity-80 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterGender 
                                type={'FilterGender' as ModalType}
                                open={isOpen && modalType === 'FilterGender'}
                                currentGender={currentGender}
                                onSubmit={(data: Gender) => {
                                    setFilterGender(data);
                                    dispatch(findByGender(data));
                                }}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterGender')} 
                                open={isOpen && modalType === 'FilterGender'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px]">
                                    <SelectValue placeholder="Выберите пол хранителя" />
                                </SelectTrigger>
                            </Select>
                            {filterGender && filterGender !== 'other' && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-[#116466] text-white rounded-[10px] text-[14px]">
                                        <span>{filterGender === 'male' ? 'Мужской' : filterGender === 'female' ? 'Женский' : 'Не имеет значения'}</span>
                                        <button 
                                            onClick={() => {
                                                setFilterGender('other');
                                                dispatch(findByGender('other'));
                                            }}
                                            className="w-4 h-4 flex items-center justify-center hover:opacity-80 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterPrice 
                                type="FilterPrice" 
                                callback={handleModalClose}
                                onSubmit={(price: number) => {
                                    setFilterPrice([price.toString()]);
                                    dispatch(findByPrice(price));
                                }}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterPrice')} 
                                open={isOpen && modalType === 'FilterPrice'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px]">
                                    <SelectValue placeholder="Выберите стоимость" />
                                </SelectTrigger>
                            </Select>
                            {filterPrice.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-[#116466] text-white rounded-[10px] text-[14px]">
                                        <span>До {filterPrice[0]} ₽</span>
                                        <button 
                                            onClick={() => {
                                                setFilterPrice([]);
                                                dispatch(findByPrice(0));
                                            }}
                                            className="w-4 h-4 flex items-center justify-center hover:opacity-80 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterDate 
                                type="FilterDate" 
                                callback={handleModalClose}
                                open={isOpen && modalType === 'FilterDate'}
                                onSubmit={(dates) => {
                                    setFilterDate(dates);
                                    dispatch(findByDate(dates.map(d => d.date)));
                                }}
                                selectedDateInfo={filterData[0]}
                            />        
                            <Select 
                                onOpenChange={() => handleModalOpen('FilterDate')} 
                                open={isOpen && modalType === 'FilterDate'}
                            >
                                <SelectTrigger className="w-full min-h-[65px] font-normal border-none bg-[#FAFAFA] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px]">
                                    <SelectValue placeholder="Выберите дату сессии" />
                                </SelectTrigger>
                            </Select>
                            {filterData.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-[#116466] text-white rounded-[10px] text-[14px]">
                                        <span>
                                            {filterData[0].date}
                                            {filterData[0].slots && filterData[0].slots.length > 0 && (
                                                <> - {filterData[0].slots.join(', ')}</>
                                            )}
                                        </span>
                                        <button 
                                            onClick={() => {
                                                setFilterDate([]);
                                                dispatch(findByDate([]));
                                            }}
                                            className="w-4 h-4 flex items-center justify-center hover:opacity-80 cursor-pointer"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="w-full mt-[20px]">
                            <FilterTime 
                                type="FilterTime" 
                                onBack={handleModalClose}
                                selectedDate=""
                                open={isOpen && modalType === 'FilterTime'}
                                onSubmit={(times: string[]) => {
                                    dispatch(findByTime(times));
                                }}
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
                                className="font-normal text-[16px] lg:text-[16px] md:text-[13px] max-lg:text-[13px] leading-[22px]"
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
                                className="font-normal text-[16px] lg:text-[16px] md:text-[13px] max-lg:text-[13px] leading-[22px]"
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
                                className="font-normal text-[16px] lg:text-[16px] md:text-[13px] max-lg:text-[13px] leading-[22px]"
                            >
                                Принимаете ли вы медикаменты по назначению психиатра
                            </label>
                        </div>
                        
                        <div className="flex items-center gap-[15px] mt-[20px]">
                            <Checkbox 
                                className="w-[30px] h-[30px]" 
                                id="favorites"
                                checked={showFavorites}
                                onCheckedChange={(checked: boolean) => {
                                    setShowFavorites(checked);
                                    dispatch(findByFavorites({ 
                                        favoriteIds: favorites.map(item => item.id || '').filter(Boolean), 
                                        enabled: checked 
                                    }));
                                }}
                            />
                            <label
                                htmlFor="favorites"
                                className="font-normal text-[16px] lg:text-[16px] md:text-[13px] max-lg:text-[13px] leading-[22px] flex items-center gap-2"
                            >
                                Только избранные
                                <Image 
                                    src={'/card/heart-filled.svg'} 
                                    alt="Избранное" 
                                    height={18} 
                                    width={18}
                                />
                            </label>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};