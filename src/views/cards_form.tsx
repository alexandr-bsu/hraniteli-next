'use client'

import { setInitTrackerStatusLaunched } from "@/redux/slices/application_form";
import { Suspense } from "react";
import axios from "axios";

import { generateTicketId } from "@/redux/slices/application_form_data";
import { RootState, store } from "@/redux/store";
import AgeStageApplication from "@/widgets/ApplicationStages/AgeStage";
import ConditionStage from "@/widgets/ApplicationStages/ConditionStage";
import TraumaticStage from "@/widgets/ApplicationStages/TraumaticStage";
import { DiseasesPsychologistStage } from "@/widgets/ApplicationStages/DiseasesPsychologistStage";
import { FinalStage } from "@/widgets/ApplicationStages/FinalStage";
import { GenderStageApplication } from "@/widgets/ApplicationStages/GenderStage";
import { GenderStagePsychologist } from "@/widgets/ApplicationStages/GenderStagePsychologist";
import NameStageApplication from "@/widgets/ApplicationStages/NameStage";
import { PreferencesStage } from "@/widgets/ApplicationStages/PreferencesStage";
import PromocodeStage from "@/widgets/ApplicationStages/PromocodeStage";
import { PsychologistStage } from "@/widgets/ApplicationStages/PsychologistStage";
import RequestStage from "@/widgets/ApplicationStages/RequestStage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStage } from '@/redux/slices/application_form';
import { PhoneStage } from "@/widgets/ApplicationStages/PhoneStage";
import { getPsychologistAll } from "@/features/actions/getPsychologistAll";
import { fill_filtered_by_automatch_psy } from "@/redux/slices/filter";
import { submitQuestionnaire, getFilteredPsychologists } from "@/features/actions/getPsychologistSchedule";
import { setHasMatchingError } from "@/redux/slices/application_form_data";
import { setApplicationStage } from "@/redux/slices/application_form";
import { NoMatchError } from "@/widgets/ApplicationStages/NoMatchError";
import { EmergencyContacts } from "@/widgets/ApplicationStages/EmergencyContacts";

import { useSearchParams } from "next/navigation";
import { clearStorage } from "@/features/utils";

// Только три ключевых экрана, которые влияют на подбор психологов
const KEY_STAGES = [
    'gender_psychologist',
    'condition',
    'traumatic',
    'diseases_psychologist'
] as const;

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

function Form() {
    const router = useRouter();
    const dispatch = useDispatch();

    const searchParams = useSearchParams()
    // Проверяем, перешли ли мы из иммледовательской формы
    const isResearchRedirect = searchParams.get('research') == 'true'


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

    useEffect(() => {
        clearStorage(isResearchRedirect)
    }, [])

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId('cd_'));
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
                return <NoMatchError onClose={handleClose} />;
            case 'emergency':
                return <EmergencyContacts onClose={handleClose} />;
            case 'psychologist':
                return <PsychologistStage />;
            case 'diseases_psychologist':
                return <DiseasesPsychologistStage />;
            default:
                return null;
        }
    };

    const showProgress = (STAGES_WITH_PROGRESS as readonly string[]).includes(currentStage) && !hasError;

    return (
        // <div className="w-full overflow-hidden h-full m-[20px] rounded-[30px] bg-[white] flex flex-col relative">
        <div className="w-full overflow-hidden h-full flex flex-col relative">

            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[18px] text-[#116466] max-lg:text-[14px]">Подбираем психологов...</p>
                    </div>
                </div>
            )}

            {currentStage !== 'gratitude' && currentStage !== 'error' && (
                <div className="w-full min-lg:rounded-[30px] pt-[30px] shrink-0">
                    <div className="w-full flex justify-between min-lg:px-[50px] max-lg:px-[20px]">
                        <div className="flex flex-col md:gap-[10px] justify-center">
                            <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                                Подбор психолога
                            </h2>
                            <span className="font-normal text-[18px] hidden md:block max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
                                Среднее время заполнения заявки - 5 минут
                            </span>
                        </div>

                        {/* <button 
                            type="button" 
                            onClick={handleClose}
                            className="cursor-pointer w-[30px] h-[30px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]"
                        >
                            <Image src='/modal/cross.svg' alt="cross" height={15} width={15} />
                        </button> */}
                    </div>

                    {showProgress && (
                        <>
                            <ul className="mt-[10px] min-lg:px-[50px] max-lg:px-[20px] gap-[10px] max-lg:flex max-lg:flex-col flex w-full ">
                                <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex justify-between items-center p-[20px] w-full">
                                    <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                        Заявка заполнена на:
                                    </span>
                                    <div className="bg-[#116466] max-lg:h-[39px] max-lg:text-[14px] p-[10px] rounded-[6px] font-normal text-[18px] text-[white]">
                                        {getProgressPercentage()}%
                                    </div>
                                </li>
                                {/* <li className="w-auto border-[1px] max-lg:h-[59px] border-[#D4D4D4] h-[85px] rounded-[15px] flex justify-between items-center p-[20px]">
                                    <span className="font-normal max-lg:text-[14px] text-[18px] leading-[25px]">
                                        Подходящие специалисты:
                                    </span>
                                    <div className="bg-[#116466] p-[10px] max-lg:h-[39px] max-lg:text-[14px] rounded-[6px] font-normal text-[18px] text-[white]">
                                        {currentStage == 'promocode' || currentStage == 'phone' ? 1 : filtered_by_automatch_psy?.length || 0 }
                                    </div>
                                </li> */}
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

export default function CardsForm() {
    const dispatch = useDispatch()

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    const is_tracker_launched = useSelector((state: RootState) => state.applicationForm.is_tracker_launched)

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId('cd_'));
        }
    }, [ticketID, dispatch]);

    // Инициализируем трекер формы
    useEffect(() => {
        if (ticketID != "" && !is_tracker_launched) {
            axios({
                method: "POST",
                url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
                data: { ticket_id: ticketID, form_type: 'Заявка из карточки психолога', step: "Начало" },
            }).then(r => {
                dispatch(setInitTrackerStatusLaunched())
            });
        }
    }, [ticketID])

    return (
        // <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
            {/* <div className="flex justify-center items-center max-w-[960px] max-h-[650px]"> */}
                <Suspense>
                    <Form />
                </Suspense>
            {/* </div> */}
        </div>
    )
}