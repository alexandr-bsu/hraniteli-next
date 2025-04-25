import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getTimeDifference } from '@/features/utils';
import clsx from 'clsx';
import { selectSlots } from '@/redux/slices/modal';
import TimezoneIndicator from '@/components/timezone';

interface Props {
    callback: () => void;
}

interface TimeSlot {
    id: string;
    time: string;
    psychologist: string;
}

interface DaySlots {
    pretty_date: string;
    slots: Record<string, TimeSlot[]>;
}

interface FilterSelectButtonDate {
    select: boolean;
    id: string;
    time: string;
}

export const TimeStage: React.FC<Props> = ({ callback }) => {
    const dispatch = useDispatch();
    const modal = useSelector((state: RootState) => state.modal);
    const selectedPsychologist = modal.content as string;
    const isOpen = modal.isOpen;

    const [todayTabs, setTodayTabs] = useState<FilterSelectButtonDate[]>([]);
    const [tomorrowTabs, setTomorrowTabs] = useState<FilterSelectButtonDate[]>([]);
    const [today, setToday] = useState<DaySlots | null>(null);
    const [tomorrow, setTomorrow] = useState<DaySlots | null>(null);

    const hours = [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
        '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
        '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
        '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
    ];

    const getData = useCallback(async () => {
        if (!selectedPsychologist) return;

        const timeDifference = getTimeDifference();
        const apiUrl = `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur?utm_psy=${selectedPsychologist}&userTimeOffsetMsk=${timeDifference}`;

        try {
            const response = await axios.get(apiUrl);
            const data = response.data[0]?.items || [];
            
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const todayDate = today.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });
            const tomorrowDate = tomorrow.toLocaleDateString('ru', { day: '2-digit', month: '2-digit' });

            setToday(data.find((item: DaySlots) => item.pretty_date === todayDate));
            setTomorrow(data.find((item: DaySlots) => item.pretty_date === tomorrowDate));
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    }, [selectedPsychologist]);

    useEffect(() => {
        if (isOpen) {
            getData();
        }
    }, [isOpen, getData]);

    useEffect(() => {
        if (today?.slots) {
            const availableSlots = Object.entries(today.slots)
                .filter(([_, slots]) => slots.length > 0)
                .map(([hour, slots]) => ({
                    select: false,
                    id: slots[0]?.id || '',
                    time: hour
                }));
            setTodayTabs(availableSlots);
        }
    }, [today]);

    useEffect(() => {
        if (tomorrow?.slots) {
            const availableSlots = Object.entries(tomorrow.slots)
                .filter(([_, slots]) => slots.length > 0)
                .map(([hour, slots]) => ({
                    select: false,
                    id: slots[0]?.id || '',
                    time: hour
                }));
            setTomorrowTabs(availableSlots);
        }
    }, [tomorrow]);

    const handleClickSlot = useCallback((tabs: FilterSelectButtonDate[], setTabs: React.Dispatch<React.SetStateAction<FilterSelectButtonDate[]>>) => 
        (index: number) => {
            setTabs(prev => prev.map((item, i) => ({
                ...item,
                select: i === index ? !item.select : item.select
            })));
        }, []);

    useEffect(() => {
        const selectedSlots = [
            ...todayTabs.filter(tab => tab.select).map(tab => tab.time),
            ...tomorrowTabs.filter(tab => tab.select).map(tab => tab.time)
        ];
        dispatch(selectSlots(selectedSlots));
    }, [todayTabs, tomorrowTabs, dispatch]);

    return (
        <ModalWindow type='Time'>
            <DialogHeader className="flex flex-row">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">
                    Выберите время сеанса с хранителем
                </DialogTitle>
            </DialogHeader>

            <span className="text-[18px] leading-[25px] font-normal text-[#151515] flex gap-[10px] max-lg:flex-col max-lg:text-[14px]">
                Часовой пояс: <TimezoneIndicator />
            </span>

            <span className="font-semibold text-[18px] leading-[25px] mt-[5px] max-lg:text-[14px]">
                Сегодня:
            </span>

            <ul className="flex gap-[15px] mt-[20px] max-lg:mt-[10px] overflow-auto min-w-full">
                {todayTabs.map((slot, index) => (
                    <li key={`today-${slot.id}-${index}`} 
                        className={clsx(
                            'max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px] border-[1px] border-[#D4D4D4] text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center',
                            { 'border-none bg-[#116466] text-[white]': slot.select }
                        )}>
                        <button 
                            onClick={() => handleClickSlot(todayTabs, setTodayTabs)(index)}
                            className="relative h-full w-full cursor-pointer p-[8px] py-[8px]"
                        >
                            {slot.time}
                        </button>
                    </li>
                ))}
            </ul>

            <span className="font-semibold text-[18px] leading-[25px] mt-[20px] max-lg:text-[14px]">
                Завтра:
            </span>

            <ul className="flex gap-[15px] mt-[20px] max-lg:mt-[10px] overflow-auto min-w-full mb-[25px]">
                {tomorrowTabs.map((slot, index) => (
                    <li key={`tomorrow-${slot.id}-${index}`}
                        className={clsx(
                            'max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px] border-[1px] border-[#D4D4D4] text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center',
                            { 'border-none bg-[#116466] text-[white]': slot.select }
                        )}>
                        <button 
                            onClick={() => handleClickSlot(tomorrowTabs, setTomorrowTabs)(index)}
                            className="relative h-full w-full cursor-pointer p-[8px] py-[8px]"
                        >
                            {slot.time}
                        </button>
                    </li>
                ))}
            </ul>

            <DialogFooter>
                <Button 
                    onClick={callback}
                    className="cursor-pointer w-full hover:bg-[#116466] bg-[#116466] rounded-[50px] text-[white] py-[25px] font-normal text-[18px] leading-[25px]"
                >
                    Далее
                </Button>
            </DialogFooter>
        </ModalWindow>
    );
};