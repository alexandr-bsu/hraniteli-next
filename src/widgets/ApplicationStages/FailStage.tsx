"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setApplicationStage } from "@/redux/slices/application_form"

export const FailStage = () => {
  const router = useRouter()
  const dispatch = useDispatch()

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

  const handleRetry = () => {
    dispatch(setApplicationStage('name'))
  }

  return (
    <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between flex w-full grow'>
        <div className="w-full flex justify-end">
            <button 
                type="button" 
                onClick={handleClose}
                className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]"
            >
                <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
            </button>
        </div>

        <div className="flex h-full w-full justify-center items-center flex-col px-[30px] gap-[30px]">
            <div className="grow w-full flex flex-col items-center">
                <Image className="max-lg:w-[140px] max-lg:h-[140px]" src={'/card/error.svg'} alt="" height={210} width={210} />
                <div className="flex flex-col items-center gap-[10px]">
                    <h2 className="font-semibold text-[26px] max-lg:text-[16px] max-lg:leading-[22px]">
                        Ой, что-то пошло не так
                    </h2>
                    <span className="font-normal text-[18px] leading-[25px] text-center max-lg:text-[14px]">
                        Попробуйте заполнить форму еще раз
                    </span>
                </div>
            </div>
        </div>

        <button 
            onClick={handleRetry}
            className="w-full text-[#FFFFFF] p-[14px] max-lg:text-[14px] shrink-0 bg-[#116466] rounded-[50px] font-normal text-[18px] leading-[25px]"
        >
            Заполнить заново
        </button>
    </div>
  )
}
