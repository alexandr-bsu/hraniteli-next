'use client'

import { generateTicketId } from "@/redux/slices/application_form_data";
import { RootState } from "@/redux/store";
import AgeStageApplication from "@/widgets/ApplicationStages/AgeStage";
import ConditionStage from "@/widgets/ApplicationStages/ConditionStage";
import TraumaticStage from "@/widgets/ApplicationStages/TraumaticStage";
import { DiseasesPsychologistStage } from "@/widgets/ApplicationStages/DiseasesPsychologistStage";
import { FailStage } from "@/widgets/ApplicationStages/FailStage";
import { FinalStage } from "@/widgets/ApplicationStages/FinalStage";
import { GenderStageApplication } from "@/widgets/ApplicationStages/GenderStage";
import { GenderStagePsychologist } from "@/widgets/ApplicationStages/GenderStagePsychologist";
import NameStageApplication from "@/widgets/ApplicationStages/NameStage";
import PreferencesStage from "@/widgets/ApplicationStages/PreferencesStage";
import PromocodeStage from "@/widgets/ApplicationStages/PromocodeStage";
import { PsychologistStage } from "@/widgets/ApplicationStages/PsychologistStage";
import RequestStage from "@/widgets/ApplicationStages/RequestStage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStage } from '@/redux/slices/application_form';
import { PhoneStage } from "@/widgets/ApplicationStages/PhoneStage";
import { getPsychologistAll } from "@/features/actions/getPsychologistAll";
import { fill_filtered_by_automatch_psy } from "@/redux/slices/filter";

const STAGES_WITH_PROGRESS = [
    'name',
    'age',
    'gender',
    'preferences',
    'gender_psychologist',
    'request',
    'condition',
    'traumatic',
    'diseases_psychologist',
    'promocode',
    'phone'
] as const satisfies readonly ApplicationStage[];

export default function ApplicationForm() {
    const router = useRouter();
    const dispatch = useDispatch();
    
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

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId());
        }
    }, [dispatch, ticketID]);

    // Загружаем психологов при первой загрузке формы
    useEffect(() => {
        const loadPsychologists = async () => {
            try {
                const psychologists = await getPsychologistAll();
                if (psychologists?.length) {
                    dispatch(fill_filtered_by_automatch_psy(psychologists));
                }
            } catch (error) {
                console.error('Failed to fetch psychologists:', error);
            }
        };

        loadPsychologists();
    }, [dispatch]);

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
            case 'preferences':
                return <PreferencesStage />;
            case 'gender_psychologist':
                return <GenderStagePsychologist />;
            case 'request':
                return <RequestStage />;
            case 'condition':
                return <ConditionStage />;
            case 'traumatic':
                return <TraumaticStage />;
            case 'promocode':
                return <PromocodeStage />;
            case 'phone':
                return <PhoneStage />;
            case 'gratitude':
                return <FinalStage />;
            case 'error':
                return <FailStage />;
            case 'psychologist':
                return <PsychologistStage />;
            case 'diseases_psychologist':
                return <DiseasesPsychologistStage />;
            default:
                return null;
        }
    };

    const showProgress = (STAGES_WITH_PROGRESS as readonly string[]).includes(currentStage) && !hasError;
    const showDivider = currentStage === 'psychologist' || currentStage === 'diseases_psychologist';

    return (
        <div className="w-full overflow-hidden h-screen min-lg:max-w-[960px] min-lg:max-h-[800px] min-lg:rounded-[30px] bg-[white] flex flex-col">
            {currentStage !== 'gratitude' && currentStage !== 'error' && (
                <div className="w-full min-lg:rounded-[30px] pt-[50px] shrink-0">
                    <div className="w-full flex justify-between min-lg:px-[50px] pb-[20px] max-lg:px-[20px]">
                        <div className="flex flex-col gap-[10px]">
                            <h2 className="font-semibold text-[20px] max-lg:text-[16px] max-lg:leading-[22px] leading-[27px]">
                                Подбор психолога
                            </h2>
                            <span className="font-normal text-[18px] leading-[25px] max-[360px]:w-[192px] max-lg:text-[14px]">
                                Среднее время заполнения заявки - 5 минут
                            </span>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleClose}
                            className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]"
                        >
                            <Image src='/modal/cross.svg' alt="cross" height={15} width={15} />
                        </button>
                    </div>

                    {showProgress && (
                        <>
                            <ul className="mt-[10px] min-lg:px-[50px] max-lg:px-[20px] gap-[10px] max-lg:flex max-lg:flex-col grid grid-cols-2 w-full justify-items-stretch">
                                <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex justify-between items-center p-[20px]">
                                    <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                        Заявка заполнена на:
                                    </span>
                                    <div className="bg-[#116466] max-lg:h-[39px] max-lg:text-[14px] p-[10px] rounded-[6px] font-normal text-[18px] text-[white]">
                                        {getProgressPercentage()}%
                                    </div>
                                </li>
                                <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex justify-between items-center p-[20px]">
                                    <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                        Подходящие специалисты:
                                    </span>
                                    <div className="bg-[#116466] p-[10px] max-lg:h-[39px] max-lg:text-[14px] rounded-[6px] font-normal text-[18px] text-[white]">
                                        {filtered_by_automatch_psy.length}
                                    </div>
                                </li>
                            </ul>
                        </>
                    )}

                    <hr className="w-full border-t-[2px] border-dotted mt-[30px]" />
                </div>
            )}

            {renderStage(currentStage)}
        </div>
    );
}