'use client'

import { generateTicketId } from "@/redux/slices/application_form_data";
import { RootState, store } from "@/redux/store";
import CityStage from "@/widgets/ResearchStages/CityStage";
import PsychologistEducationStage from "@/widgets/ResearchStages/PsychologistEducationStage";
import { ExperienceStage } from "@/widgets/ResearchStages/ExperienceStage";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStage, setApplicationStage } from '@/redux/slices/application_form';
import MeetingTypeStage from "@/widgets/ResearchStages/MeetingTypeStage";
import ChoosePreferencesStage from "@/widgets/ResearchStages/ChoosePreferencesStage";
import { LastSessionPriceStage } from "@/widgets/ResearchStages/PriceSessionStage";
import SessionDurationStage from "@/widgets/ResearchStages/SessionDurationStage";
import CancelationStage from "@/widgets/ResearchStages/CancelationStage";



const STAGES_WITH_PROGRESS = [
    'city',
    'psychologist_education',
    'experience',
    'meet_type',
    'choose_preferences',
    'last_session_price',
    'session_duration',
    'cancelation',
    'occupation',
] as const satisfies readonly ApplicationStage[];

export default function ResearchForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    const prevStage = useRef<ApplicationStage | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const currentStage = useSelector<RootState, ApplicationStage>(
        state => state.applicationForm.application_stage
    );

    useEffect(() => {
        dispatch(setApplicationStage('city'))
    }, [])

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );
   
    const hasError = useSelector<RootState, boolean>(
        state => state.applicationFormData.has_matching_error
    );
    const formData = useSelector((state: RootState) => state.applicationFormData);

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId(''));
            localStorage.setItem('matching_attempts', '0');
        }
    }, [dispatch, ticketID]);


    const getProgressPercentage = () => {
        const stagesArray = STAGES_WITH_PROGRESS as readonly string[];
        const currentIndex = stagesArray.indexOf(currentStage);
        if (currentIndex === -1) return 0;
        return Math.round(((currentIndex + 1) / stagesArray.length) * 100);
    };

    const renderStage = (stage: ApplicationStage) => {
        switch (stage) {
            case 'city':
                return <CityStage />
            case 'psychologist_education':
                return <PsychologistEducationStage />
            case 'experience':
                return <ExperienceStage/>
            case 'meet_type':
                return <MeetingTypeStage/>
            case 'choose_preferences':
                return <ChoosePreferencesStage/>
            case 'last_session_price':
                return <LastSessionPriceStage/>
            case 'session_duration':
                return <SessionDurationStage/>
            case 'cancelation':
                return <CancelationStage/>
            case 'occupation':
                return <></>
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
                                Анкета для исследования опыта работы с психологами
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