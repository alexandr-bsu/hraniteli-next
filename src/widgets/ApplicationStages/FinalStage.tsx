"use client"
import Image from "next/image"

export const FinalStage = () => {
  return (
    <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between  flex w-full grow'>
        <div className="w-full flex justify-end ">
            <button type="button" className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]">
                <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
            </button>
        </div>

        <div className=" flex h-full w-full justify-center items-center flex-col px-[30px] gap-[30px]">
            <div className="grow w-full flex flex-col items-center">
                <Image className="max-lg:w-[140px] max-lg:j-[140px]"  src={'/card/thanks.svg'} alt="" height={210} width={210} />

                <div className="flex flex-col items-center gap-[10px]">
                    <h2 className="font-semibold text-[26px] max-lg:text-[16px] max-lg:leading-[22px]">Спасибо!</h2>

                    <span className="font-normal text-[18px] leading-[25px] text-center max-lg:text-[14px]">Горячая линия Центра экстренной психологической
                    <br /> 
                    помощи МЧС России +7 495 989-50-50</span>
                </div>

                <div className="border-[#D4D4D4] border-[1px] p-[20px] rounded-[30px] max-lg:text-[14px] mt-[30px] flex justify-center items-center text-[18px] leading-[25px] font-normal w-full">
                    Для бронирования выбранного слота, обязательно запустите телеграм бот
                </div>
            </div>
        
            
        </div>

        <button className="w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px] ">
                Перейти в telegram bot
        </button>
    </div>
  )
}
