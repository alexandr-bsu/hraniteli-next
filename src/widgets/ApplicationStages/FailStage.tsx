"use client"
import Image from "next/image"

export const FailStage = () => {
  return (
    <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] justify-between  flex w-full grow'>
        <div className="w-full flex justify-end ">
            <button type="button" className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]">
                <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
            </button>
        </div>

        <div className=" flex h-full w-full justify-center items-center flex-col px-[30px] gap-[30px]">
            <div className="grow w-full flex flex-col items-center">
                <div className="flex flex-col items-center gap-[10px]">
                    <h2 className="font-semibold text-[26px] max-lg:text-[16px] max-lg:leading-[22px]">Ой, что-то пошло не так</h2>
                </div>
            </div>
        </div>
    </div>
  )
}
