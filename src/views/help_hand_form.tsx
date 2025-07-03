'use client'

import { generateTicketId } from "@/redux/slices/application_form_data";
import { RootState, store } from "@/redux/store";
import AgeStageApplication from "@/widgets/HelpHandStages/AgeStage";
import ConditionStage from "@/widgets/HelpHandStages/ConditionStage";
import TraumaticStage from "@/widgets/HelpHandStages/TraumaticStage";
import { DiseasesPsychologistStage } from "@/widgets/HelpHandStages/DiseasesPsychologistStage";
import { FinalStage } from "@/widgets/HelpHandStages/FinalStage";
import { GenderStageApplication } from "@/widgets/HelpHandStages/GenderStage";
import { PriceSessionStage } from "@/widgets/HelpHandStages/PriceSessionStage";
import NameStageApplication from "@/widgets/HelpHandStages/NameStage";
import { PreferencesStage } from "@/widgets/HelpHandStages/PreferencesStage";
import {ExperienceStage} from "@/widgets/HelpHandStages/ExperienceStage";
import RequestStage from "@/widgets/HelpHandStages/RequestStage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStage } from '@/redux/slices/application_form';
import { PhoneStage } from "@/widgets/HelpHandStages/PhoneStage";
import { NoMatchError } from "@/widgets/HelpHandStages/NoMatchError";

import { useSearchParams } from "next/navigation";
import { clearStorage } from "@/features/utils";

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
] as const satisfies readonly ApplicationStage[];

export default function HelpHandForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const prevStage = useRef<ApplicationStage | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const currentStage = useSelector<RootState, ApplicationStage>(
        state => state.applicationForm.application_stage
    );
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );
    const filtered_by_automatch_psy = useSelector<RootState, any[]>(
        state => state.filter.filtered_by_automatch_psy
    );
    const hasError = useSelector<RootState, boolean>(
        state => state.applicationFormData.has_matching_error
    );
    const formData = useSelector((state: RootState) => state.applicationFormData);

    const searchParams = useSearchParams()
        // Проверяем, перешли ли мы из иммледовательской формы
        const isResearchRedirect = searchParams.get('research') == 'true'
    

    useEffect(() => {
            clearStorage(isResearchRedirect)
        }, [])

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId('hh_'));
            localStorage.setItem('matching_attempts', '0');
        }
    }, [dispatch, ticketID]);  


    const handleClose = () => {
        router.push('/');
    };

    const getProgressPercentage = () => {
        const stagesArray = STAGES_WITH_PROGRESS as readonly string[];
        const currentIndex = stagesArray.indexOf(currentStage);
        if (currentIndex === -1) return 0;
        return Math.round(((currentIndex + 1) / stagesArray.length) * 100);
    };

    const renderStage = (stage: ApplicationStage) => {
        switch (stage) {
            case 'name':
                return <NameStageApplication />;
            case 'age':
                return <AgeStageApplication />;
            case 'gender':
                return <GenderStageApplication />;
            case 'experience':
                return <ExperienceStage />;
            case 'preferences':
                return <PreferencesStage />;
            case 'diseases_psychologist':
                return <DiseasesPsychologistStage />;
            case 'condition':
                return <ConditionStage />;
            case 'traumatic':
                return <TraumaticStage />;
            case 'request':
                return <RequestStage />;
           case 'psychologist_price':
                return <PriceSessionStage />;
            case 'phone':
                return <PhoneStage />;
            case 'gratitude':
                return <FinalStage />;
            case 'error':
                return <NoMatchError onClose={handleClose} />;
            default:
                return null;
        }
    };

    const showProgress = (STAGES_WITH_PROGRESS as readonly string[]).includes(currentStage) && !hasError;

    return (
        <div className="w-full overflow-hidden h-full bg-[white] flex flex-col relative">
            {currentStage !== 'gratitude' && currentStage !== 'error' && (
                <div className="w-full min-lg:rounded-[30px] pt-[30px] shrink-0">
                    <div className="w-full flex justify-between min-lg:px-[50px] max-lg:px-[20px]">
                        <div className="flex flex-col md:gap-[10px] justify-center">
                            <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                                Заявка на подбор психолога в проекте «Рука помощи от Хранителей»
                            </h2>
                            <span className="font-normal text-[18px] hidden md:block max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
                                Среднее время заполнения заявки - 5 минут
                            </span>
                        </div>
                    </div>

                    {showProgress && (
                        <>
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
                        </>
                    )}

                    <hr className="w-full border-t-[2px] border-dotted mt-[15px]" />
                </div>
            )}

            {renderStage(currentStage)}
        </div>
    );
}