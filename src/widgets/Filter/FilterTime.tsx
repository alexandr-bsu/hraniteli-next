import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/redux/slices/modal';
import clsx from 'clsx';
import axios from 'axios'
import { RootState } from '@/redux/store';
import { setDatesPsychologists, setHourDates } from '@/redux/slices/filter';
import { IPsychologist } from '@/shared/types/psychologist.types';

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

export const FilterTime:React.FC<Props> = ({ type, onSubmit }) => {
    const dispatch = useDispatch();

    const [ timeFilter, setTimeFilter ] = useState<FilterSelectButtonDate[]>();

    const psychologists = useSelector<RootState>(state => state.filter.data_name_psychologist) as any;

    const [ datePsychologists, setDatePsychologists ] = useState<IPsychologist[]>([]);

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
        setTimeFilter((prev: any) => prev?.map((item: any, i: any) => {
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
        if (!psychologists?.length) return;

        const fetchData = async () => {
            const timeDifference = -2; // Хардкод временной зоны убрать потом
            const promises = psychologists.map(psychologist => {
                const apiUrl = `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur?utm_psy=${psychologist}&userTimeOffsetMsk=${timeDifference}`;
                return axios.get(apiUrl);
            });

            try {
                const responses = await Promise.all(promises);
                const allData = responses.flatMap(resp => resp.data[0].items).filter(Boolean);
                setDatePsychologists(allData);
            } catch (error) {
                console.error('Error fetching psychologist schedules:', error);
            }
        };

        fetchData();
    }, [psychologists]);

    useEffect(() => {
        if (datePsychologists && datePsychologists.length > 0) {
            const notDublicate: string[] = [];
            const result: any[] = [];

            psychologists?.forEach((element1: any) => {
                datePsychologists.forEach((item) => {
                    hours.forEach((hour) => {
                        const slots = item.slots?.[hour] || [];
                        slots.forEach((element: any) => {
                            if (element?.psychologist === element1) {
                                if (!notDublicate.includes(hour)) {
                                    notDublicate.push(hour);
                                }
                                result.push({
                                    element1,
                                    hour,
                                    pretty_date: item.pretty_date
                                });
                            }
                        });
                    });
                });
            });

            setTimeFilter(notDublicate.map((item) => ({
                select: false,
                id: '',
                text: item,
            })));

            dispatch(setHourDates(result));
            dispatch(setDatesPsychologists(datePsychologists));
        }
    }, [datePsychologists, psychologists, dispatch]);

    useEffect(() => {
        if(timeFilter !== undefined && timeFilter !== null) {
            onSubmit(timeFilter.filter(item => item.select === true).map((item: any) =>
            {
                return {
                    id: item.id,
                    text: item.text,
                }
            }))
        }
    },[timeFilter])


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
                    timeFilter != undefined && timeFilter?.map((item: FilterSelectButtonDate, i: number) => 
                        <li key={i} className={
                            clsx(`max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center`,
                            {
                                ['border-none bg-[#116466] text-[white]']: timeFilter?.[i].select === true
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
                dispatch(openModal('FilterTime'));
            }} className='w-[81px] h-[53px] bg-[#116466] p-[14px] rounded-[50px] text-[#FFFFFF]'>
                Далее
            </button>
        </ModalWindow>
    );
};