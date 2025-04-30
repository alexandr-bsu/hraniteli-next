'use client'

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTimeDifference } from '@/features/utils';
import { closeModal, openModal, setSelectedSlots } from '@/redux/slices/modal';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';

interface Slot {
    date: string;
    time: string;
}

export const TimeStage = () => {
    const dispatch = useDispatch();
    const selectedPsychologist = useSelector((state: RootState) => state.modal.selectedPsychologist);
    const isOpen = useSelector((state: RootState) => state.modal.isOpen);
    const modalType = useSelector((state: RootState) => state.modal.type);
    const timeDifference = getTimeDifference();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadSlots = async () => {
        if (!selectedPsychologist || !isOpen || modalType !== 'Time') return;

        setIsLoading(true);
        try {
            const response = await axios.post(
                'https://n8n-v2.hrani.live/webhook/get-agregated-schedule-v2-test-contur',
                {
                    psychologist: selectedPsychologist,
                    userTimeOffsetMsk: timeDifference
                }
            );

            if (response.data?.items?.length) {
                const availableSlots: Slot[] = [];
                response.data.items.forEach((item: any) => {
                    if (item.slots) {
                        Object.entries(item.slots).forEach(([hour, slotArray]: [string, any]) => {
                            if (Array.isArray(slotArray) && slotArray.length > 0) {
                                availableSlots.push({
                                    date: item.pretty_date,
                                    time: hour
                                });
                            }
                        });
                    }
                });
                setSlots(availableSlots);
            }
        } catch (error) {
            console.error('Ошибка при загрузке слотов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadSlots();
    }, [isOpen, selectedPsychologist, timeDifference, modalType]);

    const handleSlotSelect = (slot: Slot) => {
        dispatch(setSelectedSlots([`${slot.date} ${slot.time}`]));
        dispatch(closeModal());
        dispatch(openModal('ContactForm'));
    };

    const handleNext = () => {
        dispatch(closeModal());
        dispatch(openModal('ContactForm'));
    };

    const renderTimeZone = () => (
        <span className="text-[18px] leading-[25px] font-normal text-[#151515] flex gap-[10px] max-lg:flex-col max-lg:text-[14px]">
            Часовой пояс:
            <span className="text-[#116466]">
                МСК {timeDifference !== 0 ? timeDifference > 0 ? ' + '+timeDifference : timeDifference : ''}
            </span>
        </span>
    );

    const renderSlots = () => (
        <div className="mt-[20px]">
            <h3 className="font-semibold text-[18px] leading-[25px] mb-[10px] max-lg:text-[14px]">
                Сегодня:
            </h3>
            <div className="flex flex-wrap gap-[10px]">
                {slots.length > 0 ? (
                    slots.map((slot, index) => (
                        <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            className="px-[15px] py-[10px] bg-[#FAFAFA] rounded-[10px] text-[16px] leading-[22px] hover:bg-[#116466] hover:text-white transition-colors"
                        >
                            {slot.date.split('.').slice(0, 2).join('.')}/{slot.time}
                        </button>
                    ))
                ) : (
                    <span className="text-[18px] leading-[25px] font-normal text-[#151515]">
                        У психолога пока нет свободного времени для записи
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <ModalWindow type="Time">
            <DialogHeader>
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">
                    Выберите время сеанса с хранителем
                </DialogTitle>
            </DialogHeader>

            {renderTimeZone()}

            {isLoading ? (
                <div className="flex items-center justify-center py-[30px]">
                    <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                renderSlots()
            )}

            <DialogFooter className="sm:justify-start">
                <Button
                    onClick={handleNext}
                    className="cursor-pointer w-full hover:bg-[#116466] bg-[#116466] rounded-[50px] text-[white] py-[25px] font-normal text-[18px] leading-[25px]"
                >
                    Далее
                </Button>
            </DialogFooter>
        </ModalWindow>
    );
}; 