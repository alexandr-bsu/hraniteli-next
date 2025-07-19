"use client"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import axios from 'axios';
import { useEffect } from 'react';

interface FinalStageProps {
  ticket_id: string;
}

export const FinalStage = ({ ticket_id }: FinalStageProps) => {
  const router = useRouter();

  useEffect(() => {
    if (ticket_id) {
      axios({
        method: "PUT",
        url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
        data: { step: "Заявка отправлена", ticket_id },
      });
    }
  }, [ticket_id]);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('app_')) {
          localStorage.removeItem(key)
        }
      })
    }
    router.push('/')
  }

  const handleTelegramClick = () => {
    window.open(`https://t.me/HraniLiveBot?start=${ticket_id}`, '_blank')
  }

  return (
    <div className='relative flex-col justify-between flex w-full grow'>
      <div className="w-full flex justify-end "></div>
      <div className="flex h-full w-full justify-center items-center flex-col p-[30px] gap-[30px] overflow-x-hidden">
        <div className="grow w-full flex flex-col items-center justify-center text-center max-w-[800px] mx-auto">
          <Image className="max-lg:w-[140px] max-lg:h-[140px]" src={'/card/thanks.svg'} alt="Спасибо" height={210} width={210} />
          <div className="flex flex-col items-center gap-[10px] max-w-[500px] w-full max-w-full">
            <h2 className="font-semibold text-[26px] max-lg:text-[14px] max-lg:leading-[22px]">Спасибо!</h2>
            <span className="font-normal text-[18px] leading-[25px] max-lg:text-[14px]">Мы получили ваш запрос и чтобы забронировать время запустите телеграм-бот. </span>
          </div>
          <div className="border-[#D4D4D4] border-[2px] p-[20px] rounded-[30px] max-lg:text-[14px] mt-[30px] flex justify-center items-center text-[18px] leading-[25px] font-normal w-full max-w-[500px] max-w-full">
            В боте вы также получите подтверждение записи и ссылку на первую сессию с психологом
          </div>
          <button 
            onClick={handleTelegramClick}
            className="w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px] mt-8 max-w-[400px] max-w-full"
          >
            Перейти в телеграм бот
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinalStage;
