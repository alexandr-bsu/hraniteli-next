import { ModalState } from '@/redux/store';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

type Props = {
    data : any,
    index: number,
    onSubmit: (data: any) => void;
}
type FilterSelectButtonTime = {
    select: boolean,
    time: string,
    id?:'',
}
const PsychologistStageItem = ({data, index, onSubmit} : Props) => {
    const [ timeFilter, setTimeFilter ] = useState<FilterSelectButtonTime[]>();

    const activeIndex = useSelector<ModalState>(state => state.applicationFormData.index_phyc);

    const handleClick = useCallback((findIndex: number = 0) => {
        setTimeFilter((prev: any) => prev?.map((item: any, i: any) => {
            if (i === findIndex) {
                return {
                    select: !item.select,
                    id: item.id,
                    time: item.time,
                }
            }
            else {
                return {
                    select: item.select,
                    id: item.id,
                    time: item.time,
                }
            }
        }))
    },[])

    useEffect(() => {
        setTimeFilter(data?.slots?.map((item: any) =>{
            return {
                select: false,
                id:item.id,
                time: `${item.date.slice(5).replace('-','.')} / ${item.time} `,
            }
        }))
    },[data])

    useEffect(() => {
        if(timeFilter !== undefined && timeFilter !== null) {
            const result = timeFilter.filter(item => item.select === true).map((item: any) =>
            {
                return {
                    id: item.id,
                    text: item.time.replace('/',''),
                }
            })
            onSubmit(result)
        }
    },[timeFilter])

    return (
        <div className={clsx("border-[1px] border-[#D4D4D4] min-h-full p-[20px] rounded-[15px]",
            {
                ['block']: index === activeIndex,
                ['hidden']: index !== activeIndex,
            }
        )}>
            <div className="flex justify-between w-full items-center ">
                <div className="flex gap-[20px] items-center">
                    <Image className='rounded-full object-cover  max-lg:h-[52px]  max-lg:w-[52px]' src={'/images/person.png'} alt='person' height={80} width={80} />
                    
                    <div>
                        <h2 className="text-[18px]  font-semibold">{data.name}, {data.age} лет</h2>
                        <span className="text-[16px] leading-[22px] font-normal">6 месяцев в сообществе</span>
                    </div>
                </div>

                <Link href="/" className="text-[#116466] text-[18px] font-normal max-lg:hidden">Перейти на карточку психолога</Link>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(150px,_1fr))]  gap-[30px] mt-[30px]">
                <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                    Основной подход:
                    <span className="text-[#151515] leading-[25px] font-semibold text-[18px] max-lg:text-[14px] flex gap-[10px] mt-[5px]">
                        {data.main_modal}

                        <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                    </span>
                </span>
                <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                    Формат встречи:
                    <span className="text-[#151515] leading-[25px] font-semibold text-[18px] max-lg:text-[14px] flex gap-[10px] mt-[5px]">
                        Онлайн
                    </span>
                </span>
                <span className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">
                    Стоимость:
                    <span className="text-[#151515] leading-[25px] font-semibold text-[18px] max-lg:text-[14px] flex gap-[10px] mt-[5px]">
                        От {data.main_modal} ₽

                        <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                    </span>
                </span>
            </div>

            <div className="mt-[30px] overflow-hidden">
                <h2 className="text-[18px] leading-[25px] font-semibold max-lg:text-[14px]">Ближайшая запись:</h2>
                
                <ul className="max-lg:flex max-lg:w-full grid grid-cols-5 gap-[14px] mt-[10px] overflow-auto  w-fit">
                    {
                        timeFilter?.map((item: FilterSelectButtonTime, i: number) =>
                        <li key={i} onClick={() => handleClick(i)} className={clsx("max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[132px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal leading-[25px] text-[18px] leading-[25px] flex justify-center items-center",
                            {
                                ['border-none bg-[#116466] text-[white]']: timeFilter?.[i].select === true
                            }
                        )}>
                            <button className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                {
                                    item.time
                                }
                            </button> 
                        </li>)
                    }
                </ul>
            </div>
        </div>
    );
};

export default PsychologistStageItem;