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
                        <span className="font-normal text-[18px] max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
                            {/* Стоимость 8 сессий по цене, указаннной вами в заявке. Далее - по цене указанной в карточке психолога */}
                            Стоимость 8 сессий по цене, указаннной вами в заявке. Далее - по цене психолога
                        </span>
                    </div>
                </div>
               
                <hr className="w-full border-t-[2px] border-dotted mt-[15px]" />
            </div>
            <ConfirmPsychologistForm />
        </div>
    );
} 