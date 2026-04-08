"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

import axios from 'axios';
import { useEffect } from 'react';
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from 'react-redux';
import { FinalStageBotButtons } from '@/widgets/shared/FinalStageBotButtons';

export const FinalStage = () => {
  const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Заявка отправлена", ticket_id:ticketID },
        });
    }, [])

  const router = useRouter()
  const ticketId = useSelector((state: RootState) => state.applicationFormData.ticketID)

  const handleClose = () => {
    // Очищаем localStorage
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('app_')) {
          localStorage.removeItem(key)
        }
      })
    }
    
    // Возвращаемся на главную
    router.push('/')
  }

  return (
    <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between  flex w-full grow'>
        <div className="w-full flex justify-end ">
            {/* <button 
                type="button" 
                onClick={handleClose}
                className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]"
            >
                <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
            </button> */}
        </div>

        <div className=" flex h-full w-full justify-center items-center flex-col px-[30px] gap-[30px]">
            <div className="grow w-full flex flex-col items-center justify-center">
                <Image className="max-lg:w-[140px] max-lg:h-[140px]"  src={'/card/thanks.svg'} alt="Спасибо" height={210} width={210} />

                <div className="flex flex-col items-center gap-[10px]">
                    <h2 className="font-semibold text-[26px] max-lg:text-[14px] max-lg:leading-[22px]">Перейдите в чат-бот по кнопке ниже</h2>

                    <span className="font-normal text-[18px] leading-[25px] text-center max-lg:text-[14px]">Для того, чтобы подтвердить заявку, выберите удобный чат-бот, - так психолог увидит вашу заявку. Перейдите в VK бот или ТГ бот
                    {/* <br />  */}
                    </span>
                </div>

                <div className="border-[#D4D4D4] border-[2px] p-[20px] text-center rounded-[30px] max-lg:text-[14px] mt-[30px] flex justify-center items-center text-[18px] leading-[25px] font-normal w-full">
                    В боте вы также получите подтверждение записи и ссылку на первую сессию с психологом
                </div>
            </div>
        
            
        </div>

        <FinalStageBotButtons
          ticketId={ticketId}
          analyticsSource="help_hand"
          className="max-w-[400px] max-w-full w-full"
        />
    </div>
  )
}
