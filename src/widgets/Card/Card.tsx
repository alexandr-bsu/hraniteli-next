'use client'

import Image from "next/image";

import { ProfileCard } from "../ProfileCard/ProfileCard";
import { useEffect, useState } from "react";
import { FavoritesButton } from "../FavoritesButton/FavoritesButton";
import { TimeStage } from "../SessionStages/TimeStage/TimeStage.jsx";
import { ContactStage } from "../SessionStages/ContactStage/ContactStage";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";

import { open,close,openNext, selectPsychologist } from '../../redux/slices/modal'
import { ModalState } from "@/redux/store";
import { IPsychologist } from "@/entities/IPsychologist";

import axios from "axios";
import { IEducation } from "@/entities/IEducation";

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
                                        <ul className="font-normal  leading-[25px] text-[18px]  max-lg:text-[14px] gap-[0px] gap-[10px] flex text-[#151515] mt-[5px]">
                                            {                                        
                                                <li className="flex w-fit gap-[5px]">{data.additional_modals} <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} /></li>
                                            }
                                        </ul>
                                    </span>
                                </div>

                                <div className="flex gap-[20px] max-lg:mt-[20px]">
                                    <span className="text-[#9A9A9A] flex flex-col gap-[10px] font-normal text-[16px] leading-[22px] w-full max-lg:text-[14px] max-lg:mt-[5px]">
                                        Ближайшая запись:
                                        
                                        <ul className="flex gap-[14px] mt-[5px] overflow-auto min-w-full">
                                            <li className="max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[132px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal leading-[25px] text-[18px]  flex justify-center items-center">
                                                <button className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                                    28.01/ 13:00
                                                </button> 
                                            </li>
                                            <li className="max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[132px border-[1px] border-[#D4D4D4]  text-[#116466] font-normal leading-[25px] text-[18px] flex justify-center items-center">
                                                <button className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                                    28.01/ 13:00
                                                </button> 
                                            </li>
                                            <li className="max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[132px] border-[1px] border-[#D4D4D4]  text-[#116466] font-normal leading-[25px] text-[18px] flex justify-center items-center">
                                                <button className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                                    28.01/ 13:00
                                                </button> 
                                            </li>
                                        </ul>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-[5px] flex-col w-full mt-[30px] max-lg:mt-[30px]">
                            <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                                Запросы:
                            </span>   
                            <ul className="  min-w-fit gap-[10px] max-[425px]:gap-x-[120px]  grid-cols-[repeat(auto-full,_minmax(100px,_1fr))] w-initial mt-[5px] flex-wrap max-lg:grid-cols-[repeat(2,_minmax(100px,_1fr))] inline-grid w-fit overflow-auto">
                                {
                                    queries.map((item, i ) => <li key={i} className="max-lg:text-[14px] h-fit min-w-[200px] shrink-0 rounded-[20px]   max-lg:max-w-[300px] text-[18px] font-semibold w-fit  border-[1px] border-[#D4D4D4]  text-[#116466] leading-[25px] ">
                                        <button className="relative h-full w-full cursor-pointer p-[8px] flex justify-start">
                                        {
                                            item
                                        }
                                        </button>    
                                    </li>)
                                }
                                
                            </ul>
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
                        <div>
                            <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                                О хранителе
                            </span> 

                            <span className="overflow-hidden text-[#151515] max-lg:text-[14px] flex-col w-full justify-between font-normal text-[18px] leading-[25px] flex gap-[10px] mt-[5px]">
                                {data.short_description}
                                {
                                    isShowInfo && <span className="block max-lg:text-[14px]">
                                        ..................
                                    </span>
                                }
                            </span>

                            <button onClick={() => setShowInfo(prev => !prev)} className="text-[#116466] w-full flex justify-start cursor-pointer">
                                {
                                    isShowInfo ? 'Свернуть' : "Читать ещё"
                                }     
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

                            <ul className="flex w-full font-normal text-[14px] mt-[10px] overflow-auto gap-[20px]">
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

                        <ul className="mt-[30px] w-fit flex grid-cols-4 font-normal text-[18px] leading-[25px] gap-[30px] max-[425px]:grid-cols-2 max-[425px]:gap-[30px]">
                            <li>
                                <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                                    Личная терапия:
                                </span>
                                
                                <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px]">
                                    Да
                                    <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />

                                </span>
                            </li>

                            <li className="w-[200px]">
                                <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                                Посещает супервизию:
                                </span>
                                
                                <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px]">
                                    Да
                                    <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />

                                </span>
                            </li>
                            <li>
                                <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                                    Семейное положение
                                </span>
                                
                                <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px]">
                                    {
                                            data.sex === 'Мужчина' &&
                                            (data.is_married && data.has_children) && 'Женат, дети' 
                                    }
                                    {
                                            data.sex === 'Женщина' &&
                                            (data.is_married && data.has_children) && 'Замужем, дети' 
                                    }
                                    {
                                            data.sex === 'Мужчина' &&
                                            (data.is_married === false) && 'Не женат' 
                                    }
                                    {
                                            data.sex === 'Женщина' &&
                                            (data.is_married === false) && 'Не женат' 
                                    }
                                </span>
                            </li>
                            <li>
                                <span className="text-[#9A9A9A] text-[16px] leading-[22px] max-lg:text-[12px]">
                                    Есть дети:
                                </span>
                                
                                <span className="flex text-[#151515] gap-[10px] mt-[10px] max-lg:text-[14px]">
                                    {
                                        data.has_children ? 'Да' : 'Нет'
                                    }
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
