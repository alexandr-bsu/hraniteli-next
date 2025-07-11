'use client'
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ConfirmPsychologistForm } from "@/widgets/HelpHandConfirmStages/ConfirmPsychologistForm";
import React from "react";

const STAGES_WITH_PROGRESS = [
    'name',
    'age',
    'gender',
    'experience',
    'preferences',
    'diseases_psychologist',
    'condition',
    'traumatic',
    'request',
    'psychologist_price',
    'phone'
];

export default function HelpHandConfirm() {
    const currentStage = useSelector<RootState, string>(state => state.applicationForm.application_stage);
    const hasError = useSelector<RootState, boolean>(state => state.applicationFormData.has_matching_error);



    return (
        <div className="w-full overflow-hidden h-full bg-[white] flex flex-col relative">
            <div className="w-full min-lg:rounded-[30px] pt-[30px] shrink-0">
                <div className="w-full flex justify-between min-lg:px-[50px] max-lg:px-[20px]">
                    <div className="flex flex-col md:gap-[10px] justify-center">
                        <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                            Подтверждение слота психолога
                        </h2>
                        <span className="font-normal text-[18px] hidden md:block max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
                            Стоимость 8 сессий по цене, указаннной вами в заявке. Далее - по цене указанной в карточке психолога
                        </span>
                    </div>
                </div>
                {/* {showProgress && (
          <ul className="mt-[10px] min-lg:px-[50px] max-lg:px-[20px] gap-[10px] flex w-full justify-items-stretch">
            <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex grow justify-between items-center p-[20px]">
              <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                Заявка заполнена на:
              </span>
              <div className="bg-[#116466] max-lg:h-[39px] max-lg:text-[14px] p-[10px] rounded-[6px] font-normal text-[18px] text-[white]">
                {getProgressPercentage()}%
              </div>
            </li>
          </ul>
        )} */}
                <hr className="w-full border-t-[2px] border-dotted mt-[15px]" />
            </div>
            <ConfirmPsychologistForm />
        </div>
    );
} 