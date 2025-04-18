import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { open, openNext } from '@/redux/slices/modal';
import clsx from 'clsx';
import axios from 'axios'
import { ModalState } from '@/redux/store';
import { fillDatesPsychologists, fillHourAndDate } from '@/redux/slices/filter';
import { getTimeDifference } from '@/features/utils';

type Props = {
    callback: () => void;
    onSubmit: (data: any) => void;
    type: string;
}

type FilterSelectButtonDate = {
    select: boolean;
    id: string,
    text: string,
}

export const FilterDate:React.FC<Props> = ({ type, onSubmit }) => {
    const dispatch = useDispatch();

    const [ dateFilter, setDateFilter ] = useState<FilterSelectButtonDate[]>();

    const psychologists = useSelector<ModalState>(state => state.filter.data_name_psychologist) as [];

    const [ datePsychologists, setDatePsychologists ] = useState<any[]>();

    const hours = [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
    ]

    const handleClick = useCallback((findIndex: number = 0) => {
        setDateFilter((prev: any) => prev?.map((item: any, i: any) => {
            if (i === findIndex) {
                return {
                    select: !item.select,
                    id: item.id,
                    text: item.text,
                }
            }
            else {
                return {
                    select: item.select,
                    id: item.id,
                    text: item.text,
                }
            }
        }))
    },[])

    useEffect(() => {
        const timeDifference = getTimeDifference();

        for (let index = 0; index < [psychologists]?.length; index++) {
            const apiUrl = `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur?utm_psy=${psychologists[index]}&userTimeOffsetMsk=${timeDifference}`;
            
            axios.get(apiUrl).then((resp) => {
                const allData = resp.data;
                setDatePsychologists((prev: any) => 
                    {
                        if (prev === undefined || prev === null) {
                            return [...allData[0].items]
                        }
                        return [...prev, ...allData[0].items].filter(item => item != undefined)
                    }
                )
            });
        }
    },[psychologists])

    useEffect(() => {
        console.log(datePsychologists)

        const notDublicate = [] as any

        datePsychologists?.forEach(element => {
            console.log(element.slots)
            if(!notDublicate.includes(element.pretty_date)) {
                notDublicate.push(element.pretty_date);         
            }
        }); 

        setDateFilter(notDublicate?.map((item: any) => {
            return {
                select: false,
                id: '',
                text: item,
            } 
        }))
        const result = [] as any;
        
        [psychologists]?.forEach((element1: any) => {
            datePsychologists?.map((item) => {
                hours.forEach((hour) => {
                    [item.slots[hour]].forEach((element: any) => {
                        if (element[0]?.psychologist === element1)
                        {
                            result.push({
                                element1,
                                hour,
                                pretty_date:item.pretty_date})
                            }
                        })
                    }) 
                })
        })


        dispatch(fillHourAndDate(result))
        dispatch(fillDatesPsychologists(datePsychologists));

    },[datePsychologists])

    useEffect(() => {
        if(dateFilter !== undefined && dateFilter !== null) {
            onSubmit(dateFilter.filter(item => item.select === true).map((item: any) =>
            {
                return {
                    id: item.id,
                    text: item.text,
                }
            }))
        }
    },[dateFilter])


    return (
        <ModalWindow className='max-[425px]:h-[519px]' maxWidth='max-w-[960px]' closeButton={false} type={type}>
            <DialogHeader className="flex flex-row items-center">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">Выберите подходящую для Вас дату:</DialogTitle>
                <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </DialogClose>
            </DialogHeader>

            <ul className="max-lg:w-full max-lg:grid-cols-[repeat(auto-fit,_minmax(64px,_1fr))] grid gap-[10px] grid-cols-10 mt-[5px] w-fit overflow-auto ">
                {
                    dateFilter != undefined && dateFilter?.map((item: FilterSelectButtonDate, i: number) => 
                        <li key={i} className={
                            clsx(`max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center`,
                            {
                                ['border-none bg-[#116466] text-[white]']: dateFilter?.[i].select === true
                            }
                        )}>
                            <button onClick={() => handleClick(i)} className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                {item.text}
                            </button> 
                        </li>
                    )
                }
            </ul>

            <button onClick={() => {
                dispatch(open())
                dispatch(openNext('FilterTime'));
            }} className='w-[81px] h-[53px] bg-[#116466] p-[14px] rounded-[50px] text-[#FFFFFF]'>
                Далее
            </button>
        </ModalWindow>
    );
};