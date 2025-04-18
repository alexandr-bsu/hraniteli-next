
import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { ModalState } from '@/redux/store';
import { getTimeDifference } from '@/features/utils';
import clsx from 'clsx';
import { selectSlots, selectSlotsObjects } from '@/redux/slices/modal';

type Props = {
    callback: () => void;
}
type FilterSelectButtonDate = {
    select: boolean;
    id: string,
    time: string,
}

export const TimeStage:React.FC<Props> = ({callback}) => {
    const dispatch = useDispatch();

    const selectedPsychologist = useSelector<ModalState>(state => state.modal.selectedPsychologist) as any;

    const [ timeTabs, setTimeTabs ] = useState<FilterSelectButtonDate[]>();
    const [ todayTabs, setTodayTabs ] = useState<FilterSelectButtonDate[]>();

    const isOpen = useSelector<ModalState>(state => state.modal.isOpen);

    const [ tomorrow, setTomorrow ] = useState() as any;
    const [ tomorrowTabs, setTomorrowTabs ] = useState<FilterSelectButtonDate[]>();

    const [ today, setToday ] = useState() as any;

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

    useEffect(() => {
        if (isOpen === true) {
            getData();
        }
    },[isOpen, selectedPsychologist])

    const getData = useCallback(() => {
        
            const timeDifference = getTimeDifference()
    
            const apiUrl = `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur?utm_psy=${selectedPsychologist}&userTimeOffsetMsk=${timeDifference}`;
                
            const Today = {
                day: String(new Date().getDate() + 2).padStart(2, '0'),
                month: String(new Date().getMonth() + 1).padStart(2, '0'),
            }
            const Tomorrow = {
                day: String(new Date().getDate() + 3).padStart(2, '0'),
                month: String(new Date().getMonth() + 1).padStart(2, '0'),
            }
    
            console.log(Today)
            console.log(Tomorrow)
    
            axios.get(apiUrl).then((resp) => {
                const allData = resp.data;
    
                console.log(allData)
                
                const dates = [] as  any;
    
                allData[0].items.map((item: any) => {
                    const dayDate = item.pretty_date;
    
                    const slots = [] as any;
    
                    [item.slots].map((element: any) => {                 
                        for (let index = 0; index < Object.keys(element).length; index++) {
                            const slot = element[hours[index]]
    
                            if (slot !== undefined && slot !== null && slot.length > 0)
                            {
                                slots.push(slot);
                                return element;
                            }
                        }
                    })
    
                    dates.push({
                        dayDate: dayDate,
                        slots: {
                            ...slots[0]
                        }
                    })
                })
                console.log(dates)
                const todayData = dates.find((item : any) => item.dayDate === `${Today.day}.${Today.month}`);
                const tomorrowData = dates.find((item : any) => item.dayDate === `${Tomorrow.day}.${Tomorrow.month}`);
    
                setTomorrow(tomorrowData)
                setToday(todayData)
            });
    },[selectedPsychologist, isOpen]) 
   

    useEffect(() => {
        if (today != undefined) {
            console.log(today)
            setTodayTabs(Object?.entries(today.slots).map(([ key, val ] : any) => {
                return {
                    select: false,
                    id: val.id,
                    time: `${val.time}`
                }
            }))
        }
    },[today])

    useEffect(() => {
        if (tomorrow != undefined) {
            setTomorrowTabs(Object?.entries(tomorrow.slots).map(([ key, val ] : any) => {
                return {
                    select: false,
                    id: val.id,
                    time: `${val.time}`
                }
            }))
        }
    },[tomorrow])

    const handleClickTomorrow = useCallback(({findIndex, value} : any) => {
        if (tomorrowTabs != undefined) {
            setTomorrowTabs((prev: any) => Object?.entries(prev).map(([ key, val ] : any) => {
                
                if (key === findIndex) {
                    return {
                        select: !val.select,
                        id: val.id,
                        time: `${val.time}`
                    }
                }
                else {
                    return {
                        select: val.select,
                        id: val.id,
                        time: `${val.time}`
                    }
                }
            }))      
        }
    },[tomorrow,isOpen])

    const handleClickToday = useCallback(({findIndex, value} : any) => {
        if (todayTabs != undefined) {
            setTodayTabs((prev: any) => Object?.entries(prev).map(([ key, val ] : any) => {
                console.log(value)
                if (key === findIndex) {
                    return {
                        select: !val.select,
                        id: val.id,
                        time: val.time,
                    }
                }
                else {
                    return {
                        select: val.select,
                        id: val.id,
                        time: val.time,
                    }
                }
            }))
        }
    },[today, isOpen])

    useEffect(() => {
        const todayResult = todayTabs?.filter(item => item.select === true).map((item) => {
            return {
                time: item.time,
            }
        })

        const tomorrowResult = tomorrowTabs?.filter(item => item.select === true).map((item) => {
            return {
                time: item.time,
            }
        })

        const todayResultObject = todayTabs?.filter(item => item.select === true).map((item) => {
            return {
                id: item.id,
            }
        })

        const tomorrowResultObject = tomorrowTabs?.filter(item => item.select === true).map((item) => {
            return {
                id: item.id,
            }
        })


        const result = [todayResult, tomorrowResult];
        const resultObject = [todayResultObject, tomorrowResultObject];
        dispatch(selectSlots(result))
        dispatch(selectSlotsObjects(resultObject))
    },[todayTabs, tomorrowTabs, isOpen])


    return (
        <ModalWindow onOpenChange={getData} type='Time'>
            <DialogHeader className="flex flex-row">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">Выберите время сеанса с хранителем</DialogTitle>
            </DialogHeader>

            <span className="text-[18px] leading-[25px] font-normal text-[#151515] flex gap-[10px] max-lg:flex-col max-lg:text-[14px]">
                Часовой пояс:
                <span className="text-[#116466]">
                    Asia/Yekaterinburg ( MSK + 2)
                </span>
            </span>

            <span className="font-semibold text-[18px] leading-[25px] mt-[5px] max-lg:text-[14px]">
                Сегодня:
            </span>

            <ul className="flex gap-[15px] mt-[20px] max-lg:mt-[10px] overflow-auto min-w-full">     
                {
                    today !== undefined && Object?.entries(today?.slots).map(([ key, val ] : any) => (
                        <li key={key} className={
                            clsx(`max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center`,
                            {
                                ['border-none bg-[#116466] text-[white]']: todayTabs?.[key]?.select === true
                            }
                        )}>
                            <button onClick={() => handleClickToday({findIndex:key,value:val})} className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                {
                                    val?.time
                                }
                            </button> 
                        </li>
                    ))
                }
            </ul>

            <span className="font-semibold text-[18px] leading-[25px] mt-20px] max-lg:text-[14px]">
                Завтра:
            </span>

            <ul className="flex gap-[15px] mt-[20px] max-lg:mt-[10px] overflow-auto min-w-full mb-[25px]">
                {
                    tomorrow !== undefined && Object?.entries(tomorrow?.slots).map(([ key, val ] : any) => (
                        <li key={key} className={
                            clsx(`max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center`,
                            {
                                ['border-none bg-[#116466] text-[white]']: tomorrowTabs?.[key]?.select === true
                            }
                        )}>
                            <button onClick={() => handleClickTomorrow({findIndex:key,value:val})} className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                {
                                    val?.time
                                }
                            </button> 
                        </li>
                    ))
                }
            </ul>
            
            <DialogFooter>
                <Button onClick={callback} className="cursor-pointer w-full hover:bg-[#116466] bg-[#116466] rounded-[50px] text-[white] py-[25px] font-normal  text-[18px] leading-[25px]" type="button">Далее</Button>
            </DialogFooter>
        </ModalWindow>
    );
};