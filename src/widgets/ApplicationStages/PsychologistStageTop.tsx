'use client'
import { decrement_index_psyc, increment_index_psyc } from "@/redux/slices/application_form_data";
import Image from "next/image";
import { useDispatch } from "react-redux";

export const PsychologistStageTop = () => {
    const dispatch = useDispatch();

    return (
        <>
            <div className="max-lg:hidden flex flex-col px-[50px]">
                <div className="grow">
                    <div className="flex justify-between ">
                        <div className="flex items-center gap-[19px]">
                            <button onClick={() => dispatch(increment_index_psyc())} className="cursor-pointer border-[1px] border-[#D4D4D4] w-[50px] h-[50px] flex justify-center items-center rounded-full">
                                <Image src={'/card/arrow_left.svg'} alt="arrow_left" height={24} width={24} />
                            </button>

                            <span className="font-normal text-[18px] leading-[25px] max-lg:text-[12px]">Предыдущий психолог</span>
                        </div>

                        <div className="flex items-center gap-[19px]">
                            <span className="font-normal text-[18px] leading-[25px] max-lg:text-[12px]"></span>

                            <button onClick={() => dispatch(decrement_index_psyc())} className="cursor-pointer border-[1px] border-[#D4D4D4] w-[50px] h-[50px] flex justify-center items-center rounded-full">
                                <Image src={'/card/arrow_right.svg'} alt="arrow_right" height={24} width={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};