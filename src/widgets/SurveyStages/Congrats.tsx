"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStage } from "../../features/MultiStepForm/StageContext"

export const CongratsStage = () => {
  const {calculateTotalCoins} = useStage()
  const router = useRouter()
  const handleContinueClick = () => {
    router.push('/application_form/?research=true')
  }


  return (
    <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between  flex w-full grow'>
      <div className=" flex h-full w-full justify-center items-center flex-col px-[30px] gap-[30px]">
        <div className="grow w-full flex flex-col items-center justify-center">
          <Image className="max-lg:w-[140px] max-lg:h-[140px]" src={'/card/thanks.svg'} alt="Спасибо" height={210} width={210} />

          <div className="flex flex-col items-center gap-[10px]">
            <h2 className="font-semibold text-[26px] max-lg:text-[14px] max-lg:leading-[22px]">Спасибо! </h2>
          </div>

          
            <>
              <div className="border-[#D4D4D4] border-[2px] p-[20px] text-center rounded-[30px] max-lg:text-[14px] mt-[30px] flex justify-center items-center text-[18px] leading-[25px] font-normal w-full">
                <p> В знак благодарности мы обещали подарить бесплатную сессию с аналитическим психологом из Хранителей. Сессия - 55 минут, онлайн, по видеосвязи. <span className="font-bold text-[#116466]">Первая сессия - бесплатная, вторая и последующие - по цене психолога на карточке.</span> Готовы сейчас оставить запрос и выбрать время?</p>
              </div>
            </>
         
        </div>
      </div>
      
        <button
          onClick={handleContinueClick}
          className={`w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px]`}
        >
          Да
        </button>
      
    </div>
  )
}
