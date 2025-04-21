'use client'
import { IPsychologist } from "@/entities/IPsychologist";
import { getPsychologistAll } from "@/features/actions/getPsychologistAll";
import { toNextStage } from "@/redux/slices/application_form";
import { decrement_index_psyc, increment_index_psyc } from "@/redux/slices/application_form_data";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const PsychologistStageTop = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState<IPsychologist | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPsychologistAll();
                // Предполагаем, что API возвращает массив психологов
                // Берём первого психолога или реализуем свою логику выбора
                if (data && data.length > 0) {
                    setData(data[0]);
                }
            } catch (error) {
                console.error("Ошибка загрузки психологов:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <div className="max-lg:hidden flex mt-[30px] flex-col px-[50px]">
                <div className="grow">
                    <div className="flex justify-between ">
                        <div className="flex items-center gap-[19px]">
                            <button onClick={() => dispatch(increment_index_psyc())} className="cursor-pointer border-[1px] border-[#D4D4D4] w-[50px] h-[50px] flex justify-center items-center rounded-full">
                                <Image src={'/card/arrow_left.svg'} alt="arrow_left" height={24} width={24} />
                            </button>

                            <span className="font-normal text-[18px] leading-[25px] max-lg:text-[12px]">Предыдущий психолог</span>
                        </div>

                        <div className="flex items-center gap-[19px]">
                            <span className="font-normal text-[18px] leading-[25px] max-lg:text-[12px]">Показать еще 2 психолога</span>

                            <button onClick={() => dispatch(decrement_index_psyc())} className="cursor-pointer border-[1px] border-[#D4D4D4] w-[50px] h-[50px] flex justify-center items-center rounded-full">
                                <Image src={'/card/arrow_right.svg'} alt="arrow_right" height={24} width={24} />
                            </button>
                        </div>
                    </div>
                </div>
                 
                                    <div className="flex flex-col  grow p-[30px] h-full max-h-[390px] max-lg:max-h-none max-lg:p-[15px] mt-[30px] border-[1px] rounded-[25px]">
                                       
                                        <div className="flex flex-row justify-between">
                                            <div className="flex flex-row gap-[20px]">
                                                <div className="w-[80px] h-[80px] border-2 rounded-full">
                                                    
                                                </div>
                                                <div className="flex-flex-col">
                                                    <h2 className="max-lg:text-[14px] text-[18px] mt-[10px] font-semibold leading-[25px]">{data?.name}</h2>
                                                    <h3 className="flex max-lg:text-[16px] leading-[22px] mt-[10px] gap-[10px]">6 месяцев в сообществе</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <h2 className="text-[#116466] font-normal text-[18px] max-lg:text-[14px]">Перейти на карточку психолога</h2>
                                            </div>
                                        </div>

                                        <div className="flex flex-row mt-[30px]">
                                            <div className="flex flex-col">
                                                <h3 className="text-[#9A9A9A] font-normal text-[16px] leading-[22px] max-lg:text-[14px]">Основной подход:</h3>
                                                <span className="text-[#151515] leading-[25px] font-normal text-[18px]  max-lg:text-[14px] flex gap-[10px] mt-[10px]">
                                                    {data?.main_modal}
                                                    <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                                                </span>
                                            </div>
                                            <div className="flex flex-col">

                                            </div>
                                            <div className="flex flex-col">

                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0  pb-[50px] flex gap-[10px] mt-[30px]  max-lg:mt-[30px]">
                                        <button onClick={() => dispatch(toNextStage('promocode'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                                            Назад
                                        </button>
                
                                        <button type='submit' className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                                            Продолжить
                                        </button>
                                    </div>
            </div>

        </>
    );
};