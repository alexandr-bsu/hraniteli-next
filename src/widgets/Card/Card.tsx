'use client'

import Image from "next/image";

import { ProfileCard } from "../ProfileCard/ProfileCard";
import { useEffect, useState } from "react";
import { FavoritesButton } from "../FavoritesButton/FavoritesButton";
import { TimeStage } from "../SessionStages/TimeStage/ETimeStage";
import { ContactStage } from "../SessionStages/ContactStage/ContactStage";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import { open,close,openNext, selectPsychologist } from '../../redux/slices/modal'
import { ModalState } from "@/redux/store";
import { IPsychologist } from "@/entities/IPsychologist";

import axios from "axios";
import { IEducation } from "@/entities/IEducation";
import React from "react";

type Props =  {
    data: IPsychologist
}

export const Card:React.FC<Props> = ({data}) => {
    const [isShow, setShow ] = useState(false);
    const [isShowInfo, setShowInfo ] = useState(false);

    const [education, setEducation] = useState<IEducation>(
        {
            educationItemProgramTitle:'',
            educationItemType:'',
            educationItemYear:0,
        }
    );

    const isOpenType = useSelector<ModalState>(state => state.modal.isOpenType)

    const dispatch = useDispatch()

    const works_with = data.works_with.split(';').map(function(item){
        return item.trimStart();
    });;
    const queries = data.queries.split(';').map(function(item){
        return item.trimStart();
    }); 

    useEffect(() => {
        const timeOutID = setTimeout(() => {
            dispatch(open());
        },100)

        return () => {
            clearTimeout(timeOutID);
        };
    },[isOpenType])

    useEffect(() => {
        const apiUrl = `https://n8n-v2.hrani.live/webhook/download-psychologist-education-test-contur?psychologist_id=${data.telegram_id}`;
        axios.get(apiUrl).then((resp) => {
            const data = resp.data;
            setEducation(data[0]);
        });
    },[])

    console.log('tlegram_id',data.link_photo)

    return (
        <>
            <div className="w-[100%] flex flex-col bg-[#FFFFFF] rounded-[20px] p-[20px]">
                <div className="w-full flex justify-between">
                    <div className="max-lg:w-full">
                        <div className="flex gap-[30px] max-lg:flex-col max-lg:w-full">
                            <ProfileCard />

                            <div className="flex flex-col justify-between max-lg:w-full">
                                <div className="flex flex-col gap-[10px]">
                                    <h2 className="font-semibold text-[20px] leading-[27px] max-lg:text-[18px] max-lg:leading-[25px]">
                                        {data.name}
                                    </h2>

                                    <h3 className=" flex max-lg:text-[16px] leading-[22px] gap-[10px]">
                                        {/* 6 месяцев в сообществе {data.verified ? (<Image src={'/card/check.svg'} alt="check" height={23} width={23} />) : ''} */}
                                        6 месяцев в сообществе <Image src={'/card/check.svg'} alt="check" height={23} width={23} />
                                    </h3>
                                </div>


                                <div className="flex gap-[30px] max-lg:flex-col max-lg:gap-[5px] max-lg:mt-[20px]">
                                    <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                                        Основной подход:
                                        <span className="text-[#151515] leading-[25px] font-normal text-[18px]  max-lg:text-[14px] flex gap-[10px] mt-[5px]">
                                            {data.main_modal}

                                            <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                                        </span>
                                    </span>

                                    <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px] max-lg:mt-[20px]">
                                        Стоимость:
                                        <span className="text-[#151515] leading-[25px] font-normal text-[18px]  max-lg:text-[14px] flex gap-[10px] mt-[5px]">
                                            От {data.min_session_price}

                                            <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                                        </span>
                                    </span>
                                </div>

                                <div className="w-full max-lg:mt-[20px]">
                                    <span className="text-[#9A9A9A] font-normal flex-col flex gap-[10px] text-[16px] leading-[22px] max-lg:text-[14px] w-full">
                                        Дополнительные подходы:
                                        <ul className="font-normal  leading-[25px] text-[18px]  max-lg:text-[14px] gap-[10px] flex text-[#151515] mt-[5px]">
                                            {                                        
                                               <li className="flex items-center gap-[10px] flex-wrap">
                                               {typeof data.additional_modals === 'string' ? (
                                                 <>
                                                   {data.additional_modals.split(';').map((item: string, index: number) => (
                                                     <span key={index} className="flex items-center">
                                                       {item.trim()}
                                                       <Image 
                                                         src="/card/hint.svg" 
                                                         alt="hint" 
                                                         width={23}
                                                         height={23}
                                                         className="ml-1"
                                                       />
                                                     </span>
                                                   ))}
                                                 </>
                                               ) : Array.isArray(data.additional_modals) ? (
                                                data.additional_modals.map((item: string, index: number) => (
                                                   <span key={index} className="flex items-center">
                                                     {item}
                                                     <Image 
                                                       src="/card/hint.svg" 
                                                       alt="hint" 
                                                       width={23}
                                                       height={23}
                                                       className="ml-1"
                                                     />
                                                   </span>
                                                 ))
                                               ) : null}
                                             </li>
                                            }
                                        </ul>
                                    </span>
                                </div>

                                <div className="flex gap-[20px] max-lg:mt-[20px]">
                                    <span className="text-[#9A9A9A] flex flex-col gap-[10px] font-normal text-[16px] leading-[22px] w-full max-lg:text-[14px] max-lg:mt-[5px]">
                                        Ближайшая запись:
                                        
                                        <ul className="flex gap-[10px] overflow-x-auto pb-2">
                                        {[1, 2, 3].map((_, i) => (
                                            <li key={i} className="shrink-0 rounded-[50px] w-[132px] max-lg:w-[109px] max-lg:text-[14px] border-[1px] border-[#D4D4D4] text-[#116466] font-normal leading-[25px] text-[18px] flex justify-center items-center">
                                            <button className="w-full h-full py-[8px] px-[12px]">
                                                28.01/ 13:00
                                            </button>
                                            </li>
                                        ))}
                                        </ul>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-[5px] flex-col w-full mt-[30px] max-lg:mt-[30px]">
                            <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                                Запросы:
                            </span>   
                            <div className="w-full">
                            {/* Мобильная версия (горизонтальный скролл) */}
                            <div className="lg:hidden overflow-x-auto pb-2 hide-scrollbar">
                                <ul className="flex gap-[10px] mt-[5px] w-max">
                                {queries.map((item, i) => (
                                    <li 
                                    key={i}
                                    className="
                                        min-w-[200px] text-[14px]
                                        rounded-[20px] border-[1px] border-[#D4D4D4]
                                        text-[#116466] font-semibold leading-[25px]
                                    "
                                    >
                                    <button className="w-full h-full p-[8px] text-left whitespace-normal">
                                        {item}
                                    </button>
                                    </li>
                                ))}
                                </ul>
                            </div>

                            {/* Десктоп версия (2 колонки) */}
                            <ul className="hidden lg:grid grid-cols-2 gap-[10px] mt-[5px]">
                                {queries.map((item, i) => (
                                <li 
                                    key={i}
                                    className="
                                    text-[18px] rounded-[20px]
                                    border-[1px] border-[#D4D4D4]
                                    text-[#116466] font-semibold leading-[25px]
                                    "
                                >
                                    <button className="w-full h-full p-[8px] text-left whitespace-normal">
                                    {item}
                                    </button>
                                </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                    </div>
                
                    <div className="h-[100%] flex items-start">
                        <FavoritesButton />
                    </div>
                </div>

                <div className="flex gap-[5px] flex-col w-full mt-[30px]">
                        <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                            Диагностированные заболевания:
                        </span>   
                        <ul className="gap-[10px] flex flex-col  mt-[5px]">
                            {
                                works_with.map((item, i) => <span key={i} className="text-[#151515] max-lg:text-[14px] w-full justify-between font-normal text-[18px] leading-[25px] flex gap-[10px] mt-[5px]">
                                    {
                                        item
                                    }

                                    <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                                </span>)
                            }
                        </ul>
                </div>

                {
                    isShow &&  <div className="flex gap-[5px] flex-col w-full mt-[30px]">
                       <div className="flex flex-col">
                            <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[14px]">
                                О хранителе
                            </span>

                            <div className="relative">
                                <p className={`text-[#151515] max-lg:text-[14px] font-normal text-[18px] leading-[25px] mt-[5px] ${isShowInfo ? '' : 'line-clamp-2'}`}>
                                {data.short_description}
                                </p>
                                
                                {!isShowInfo && (
                                <div className="absolute bottom-0 right-0 h-[25px] w-[80px] bg-gradient-to-l from-white to-transparent" />
                                )}
                            </div>

                            <button 
                                onClick={() => setShowInfo(prev => !prev)} 
                                className="text-[#116466] mt-1 text-left cursor-pointer hover:underline"
                            >
                                {isShowInfo ? 'Свернуть' : 'Читать ещё'}
                            </button>
                            </div>

                        <div className="mt-[30px]">
                            <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                                Образование
                            </span> 

                            <span className="text-[#151515] flex-col max-lg:text-[14px] w-full justify-between font-bold text-[18px] leading-[25px] flex gap-[10px] mt-[5px]">
                                {education.educationItemType},  {education.educationItemYear}
                            </span>
                            <span className="text-[#151515] flex-col max-lg:text-[14px] w-full justify-between font-normal text-[18px] leading-[25px] flex gap-[10px] mt-[5px]">
                                {education.educationItemProgramTitle}
                            </span>

                            <button className="text-[#116466] max-lg:text-[14px] w-full flex justify-start cursor-pointer mt-[10px]">
                                Смотреть все   
                            </button>       
                        </div>

                        <div className="mt-[30px] w-full">
                            <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                                Подробнее о хранителе
                            </span> 

                            <ul className="flex w-full font-normal text-[16px] max-lg:text-[14px] mt-[10px] overflow-auto gap-[20px] hide-scrollbar">
                                <li className="shrink-0 flex items-center justify-center gap-[15px]">
                                    <Image src={'/card/favorites_icon.svg'} alt="favorites" height={40} width={40} />
                                    <span>
                                        {
                                            data.vk
                                        }
                                    </span>
                                </li>
                                <li className="shrink-0 flex items-center justify-center gap-[15px]">
                                    <Image src={'/card/favorites_icon.svg'} alt="favorites" height={40} width={40} />
                                    <span>
                                        {
                                            data.site
                                        }
                                    </span>
                                </li>
                                <li className="shrink-0 flex items-center justify-center gap-[15px]">
                                    <Image src={'/card/favorites_icon.svg'} alt="favorites" height={40} width={40} />
                                    <span>
                                        {
                                            data.telegram
                                        }
                                    </span>
                                </li>
                            </ul>       
                        </div>


                        <ul className="mt-[30px] flex flex-wrap gap-x-[30px] gap-y-[20px] font-normal text-[18px] leading-[25px] max-lg:grid max-lg:grid-cols-2">
                        <li className="flex flex-col items-start whitespace-nowrap w-fit">
                            <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                            Личная терапия:
                            </span>
                            <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px] items-center">
                            Да
                            <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                            </span>
                        </li>

                        <li className="flex flex-col items-start whitespace-nowrap w-fit">
                            <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                            Посещает супервизию:
                            </span>
                            <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px] items-center">
                            Да
                            <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                            </span>
                        </li>

                        <li className="flex flex-col items-start whitespace-nowrap w-fit">
                            <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                            Семейное положение:
                            </span>
                            <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px] items-center">
                            {data.sex === 'Мужчина' && (data.is_married && data.has_children) && 'Женат, дети'}
                            {data.sex === 'Женщина' && (data.is_married && data.has_children) && 'Замужем, дети'}
                            {data.sex === 'Мужчина' && (data.is_married === false) && 'Не женат'}
                            {data.sex === 'Женщина' && (data.is_married === false) && 'Не замужем'}
                            </span>
                        </li>

                        <li className="flex flex-col items-start whitespace-nowrap w-fit">
                            <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                            Есть дети:
                            </span>
                            <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px] items-center">
                            {data.has_children ? 'Да' : 'Нет'}
                            </span>
                        </li>
                        </ul>
                    </div> 
                }

                <div className="flex gap-[25px] mt-[25px] max-[600px]:flex-col max-[600px]:w-[100%] ">
                    <button onClick={() => setShow(prev => !prev)} type="button" className="cursor-pointer shrink-0 text-[#116466] font-normal text-[18px] leading-[25px] border-[1px] rounded-[50px] border-[#116466] p-[12px]">
                        {
                            isShow ?  "Свернуть"  : 'Подробнее о хранителе'
                        }            
                    </button>

                    <Button onClick={() => {
                        dispatch(openNext('Time'));
                        dispatch(selectPsychologist(data.name))
                        dispatch(open())}} className="flex hover:bg-[#116466]  cursor-pointer grow h-full text-[#FFFFFF] font-normal text-[18px]  leading-[25px] border-[1px] rounded-[50px] bg-[#116466] p-[12px]">
                        Оставить заявку
                    </Button>

                    <TimeStage callback={ () => {
                        dispatch(close());
                        dispatch(openNext('Contact'));
                    }} />                    

                    <ContactStage callback={ () => {
                        dispatch(close());
                        dispatch(openNext('Contact'));
                    }} />
                </div>
            </div>
        </>
    );
};
