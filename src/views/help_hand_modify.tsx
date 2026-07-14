'use client'

import { useSearchParams } from "next/navigation";
import { RegistrationForm } from "@/widgets/HelpHandModifyStages/RegistrationForm";

export default function HelpHandModify() {
    const searchParams = useSearchParams();
    const linkId = searchParams.get('link_id');

    return (
        <div className="w-full min-h-full bg-[white] flex flex-col relative overflow-x-hidden">
            <div className="w-full min-lg:rounded-[30px] pt-[30px] shrink-0">
                <div className="w-full flex justify-between min-lg:px-[50px] max-lg:px-[20px]">
                    <div className="flex flex-col md:gap-[10px] justify-center">
                        <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                            Редактирование анкеты «Рука помощи»
                        </h2>
                        <span className="font-normal text-[18px] hidden md:block max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
                            Проверьте и при необходимости измените данные анкеты
                        </span>
                    </div>
                </div>

                <hr className="w-full border-t-[2px] border-dotted mt-[15px]" />
            </div>

            <div className="flex-1 pb-[50px]">
                {!linkId ? (
                    <div className="flex flex-col items-center justify-center h-full p-[30px]">
                        <span className="text-[18px] max-lg:text-[14px] text-[#9A9A9A] text-center">
                            Для загрузки анкеты укажите параметр <b>link_id</b> в URL
                        </span>
                    </div>
                ) : (
                    <RegistrationForm linkId={linkId} />
                )}
            </div>
        </div>
    );
}
