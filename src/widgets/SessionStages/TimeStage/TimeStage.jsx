
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


 // Удаляем первые пустые группы слотов (В эти даты мы не сможем записать клиентов на приём)
 function remove_first_n_empty_groups(groups) {
    // Группы слотов попадающие под ограничения дней недели
    let filtered_groups = [];
    for (let group of groups) {
      if (
        getDatesBetween(currDate, nextWeekBorders.sunday).includes(
          group.date
        ) &&
        group.date != currDate
      ) {
        filtered_groups.push(group);
      }
    }

    // Группы слотов не попадающие под ограничение (Есть хотя бы один свободный слот)
    let free_groups = [];
    for (let group of filtered_groups) {
      if (!checkDayIsBusy(group)) {
        free_groups.push(group);
      }
    }

    // Индекс группы слотов в исходном массиве прошедший фильтрацию
    let validFirstGroupIndex = groups.findIndex(
      (g) => g.date == free_groups[0]?.date
    );

    // Возвращаем все группы слотов начиная с validFirstGroupIndex индекса
    let result = groups.slice(validFirstGroupIndex);
    return result;
}

export const TimeStage = () => {
    const dispatch = useDispatch();
    const selectedPsychologist = useSelector(state => state.modal.selectedPsychologist) ;
    const isOpen = useSelector(state => state.modal.isOpen);
    const timeDifference = getTimeDifference()
    const [slots, setSlots] = useState([])

    function getData(){
        axios({
            url: `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur?utm_psy=${selectedPsychologist}&userTimeOffsetMsk=${timeDifference}`,
            method: 'GET'
        }).then(response => {
            console.log(response.data)
        })
    }

    useEffect(() => {
        if (isOpen === true) {
            getData();
        }
    },[isOpen, selectedPsychologist])

    
    return (
        <ModalWindow onOpenChange={() => {}} type='Time'>
            <DialogHeader className="flex flex-row">
                <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">Выберите время сеанса с хранителем</DialogTitle>
            </DialogHeader>

            <span className="text-[18px] leading-[25px] font-normal text-[#151515] flex gap-[10px] max-lg:flex-col max-lg:text-[14px]">
                Часовой пояс:
                <span className="text-[#116466]">
                    МСК {timeDifference != 0 ? timeDifference > 0 ? ' + '+timeDifference : timeDifference : ''}
                </span>
            </span>

            <span className="font-semibold text-[18px] leading-[25px] mt-[5px] max-lg:text-[14px]">
                Сегодня:
            </span>

            <ul className="flex gap-[15px] mt-[20px] max-lg:mt-[10px] overflow-auto min-w-full">     
                {
                    
                        <li className={
                            clsx(`max-lg:text-[14px] relative shrink-0 rounded-[50px] w-[74px]  border-[1px] border-[#D4D4D4]  text-[#116466] font-normal text-[18px] leading-[25px] flex justify-center items-center`)}>
                            <button onClick={() => {}} className="relative h-full w-full cursor-pointer p-[8px] py-[8px]">
                                09:00
                            </button> 
                        </li>
                  
                }
            </ul>
                       
            <DialogFooter>
                <Button onClick={callback} className="cursor-pointer w-full hover:bg-[#116466] bg-[#116466] rounded-[50px] text-[white] py-[25px] font-normal  text-[18px] leading-[25px]" type="button">Далее</Button>
            </DialogFooter>
        </ModalWindow>
    );
};