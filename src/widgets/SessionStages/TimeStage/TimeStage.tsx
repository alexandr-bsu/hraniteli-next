'use client'

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTimeDifference } from '@/features/utils';
import { closeModal, openModal, setSelectedSlots, setSelectedSlot, setSlotsObjects } from '@/redux/slices/modal';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';
import { getSchedule } from '@/features/actions/getSchedule';

interface Slot {
    date: string;
    time: string;
}

interface GroupedSlots {
    [date: string]: Slot[];
}

export const TimeStage = () => {
    const dispatch = useDispatch();
    const selectedPsychologist = useSelector((state: RootState) => state.modal.selectedPsychologist);
    const selectedSlot = useSelector((state: RootState) => state.modal.selectedSlot);
    const isOpen = useSelector((state: RootState) => state.modal.isOpen);
    const modalType = useSelector((state: RootState) => state.modal.type);
    const timeDifference = getTimeDifference();
    const [groupedSlots, setGroupedSlots] = useState<GroupedSlots>({});
    const [allSchedule, setAllSchedule] = useState<any[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Загрузка общего расписания один раз
    const loadAllSchedule = async () => {
        setIsLoading(true);
        try {
            const data = await getSchedule();
            setAllSchedule(data);
        } catch (e) {
            // обработка ошибки
            setAllSchedule(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Загружаем расписание при открытии модального окна
    useEffect(() => {
        if (isOpen && modalType === 'Time' && !allSchedule) {
            loadAllSchedule();
        }
    }, [isOpen, modalType]);

    // Фильтрация по выбранному психологу
    useEffect(() => {
        if (!allSchedule || !selectedPsychologist) return;

        const grouped: GroupedSlots = {};
        allSchedule[0]?.items.forEach((item: any) => {
            if (item.slots) {
                const slots: Slot[] = [];
                Object.entries(item.slots).forEach(([_, slotArray]: [string, any]) => {
                    if (Array.isArray(slotArray) && slotArray.length > 0) {
                        slotArray
                            .filter((slot: any) => slot.psychologist === selectedPsychologist && slot.state === 'Свободен')
                            .forEach((slot: any) => {
                                slots.push({
                                    date: item.pretty_date,
                                    time: slot.time
                                });
                            });
                    }
                });
                if (slots.length > 0) {
                    grouped[item.pretty_date] = slots;
                }
            }
        });
        setGroupedSlots(grouped);
    }, [allSchedule, selectedPsychologist]);

    const handleSlotSelect = (slot: Slot) => {
        dispatch(setSelectedSlot(slot));
        // dispatch(setSlotsObjects())

    };

    const convertToLocalTime = (mskTime: string) => {
        const [hours, minutes] = mskTime.split(':').map(Number);
        const localHours = (hours + timeDifference + 24) % 24;
        return `${String(localHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const convertToMskTime = (localTime: string) => {
        const [hours, minutes] = localTime.split(':').map(Number);
        const mskHours = (hours - timeDifference + 24) % 24;
        return `${String(mskHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (selectedSlot) {
            // Конвертируем обратно в МСК время перед отправкой
            const mskSlot = {
                ...selectedSlot,
                time: convertToMskTime(selectedSlot.time)
            };
            dispatch(setSelectedSlots([`${mskSlot.date} ${mskSlot.time}`]));
            dispatch(closeModal());
            dispatch(openModal('ContactForm'));
        }
    };    

    const renderTimeZone = () => {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedTimeZone = timeZone.replace('_', '/').split('/').slice(-1)[0];

        return (
            <span className="text-[18px] leading-[25px] font-normal text-[#151515] flex gap-[10px] max-lg:text-[14px]">
                {/* Часовой пояс: <span className="text-[#116466]">{formattedTimeZone} ( МСК {timeDifference > 0 ? '+' : ''}{timeDifference} )</span> */}
                Часовой пояс: <span className="text-[#116466]">{formattedTimeZone}</span>

            </span>
        );
    };

    const renderSlots = () => {
        const dates = Object.keys(groupedSlots).sort((a, b) => {
            const dateA = new Date(a.split('.').reverse().join('-'));
            const dateB = new Date(b.split('.').reverse().join('-'));
            return dateA.getTime() - dateB.getTime();
        });

        if (dates.length === 0) {
            return (
                <div className="mt-[20px]">
                    <span className="text-[18px] leading-[25px] font-normal text-[#151515]">
                        У психолога пока нет свободного времени для записи
                    </span>
                </div>
            );
        }

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const formatDate = (date: Date) => {
            return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        };

        return (
            <>
                {dates.map((date) => {
                    const dateObj = new Date(date.split('.').reverse().join('-'));
                    const isToday = formatDate(today) === formatDate(dateObj);
                    const isTomorrow = formatDate(tomorrow) === formatDate(dateObj);
                    
                    const title = isToday ? 'Сегодня:' : isTomorrow ? 'Завтра:' : date;

                    return (
                        <div key={date} className="mt-[20px]">
                            <h3 className="font-semibold text-[18px] leading-[25px] mb-[10px] max-lg:text-[14px]">
                                {title}
                            </h3>
                            <div className="flex flex-wrap gap-[10px]">
                                {groupedSlots[date].map((slot, index) => {
                                    const localTime = convertToLocalTime(slot.time);
                                    const isSelected = selectedSlot?.date === slot.date && selectedSlot?.time === localTime;

                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleSlotSelect({...slot, time: localTime})}
                                            className={`px-[15px] py-[10px] rounded-[50px] cursor-pointer border-[1px] border-[#D4D4D4] text-[16px] leading-[22px] transition-colors ${
                                                isSelected 
                                                    ? 'bg-[#116466] text-white' 
                                                    : 'bg-[#FAFAFA] hover:bg-[#116466] hover:text-white'
                                            }`}
                                        >
                                            {date} / {localTime}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    };

    return (
        <ModalWindow type="Time">
            <DialogHeader>
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[14px] max-lg:leading-[22px]">
                    {/* Выберите время диагностической сессии */}
                    Выберите время сессии
                </DialogTitle>
                {/* <ul className='text-[#999999] flex space-x-[10px] flex-wrap'>
                    <li>Длительность - до 30 минут.</li>
                    <li>Формат - онлайн видеозвонок.</li>
                    <li>Стоимость - бесплатно</li>
                    
                    </ul> */}
            </DialogHeader>

            <div className="overflow-y-auto max-h-[60vh] pr-2">
                {renderTimeZone()}

                {isLoading ? (
                    <div className="flex items-center justify-center py-[30px]">
                        <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    renderSlots()
                )}
            </div>

            <DialogFooter className="sm:justify-start">
                <Button
                    onClick={handleNext}
                    disabled={!selectedSlot}
                    className={`cursor-pointer w-full rounded-[50px] py-[25px] font-normal text-[18px] leading-[25px] ${
                        selectedSlot 
                            ? 'hover:bg-[#116466] bg-[#116466] text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Далее
                </Button>
            </DialogFooter>
        </ModalWindow>
    );
}; 