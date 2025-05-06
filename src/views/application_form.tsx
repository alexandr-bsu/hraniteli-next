'use client'

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

export default function ApplicationForm() {
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

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId());
            localStorage.setItem('matching_attempts', '0');
        }
    }, [dispatch, ticketID]);

    // Получаем первоначальный список психологов и обновляем при смене ключевых экранов
    useEffect(() => {
        const updatePsychologists = async () => {
            // Если мы переходим на экран редактирования с NoMatchError, не делаем проверку
            if (hasError && (
                currentStage === 'gender_psychologist' ||
                currentStage === 'condition' ||
                currentStage === 'traumatic'
            )) {
                return;
            }

            // Проверяем, уходим ли мы с одного из трех ключевых экранов
            const isKeyStageTransition = prevStage.current && KEY_STAGES.includes(prevStage.current as any);

            if (isKeyStageTransition) {
                setIsLoading(true);
            }

            try {
                // Получаем актуальные данные формы на момент вызова
                const currentFormData = store.getState().applicationFormData;
                
                // Отправляем текущие данные формы и получаем расписание
                const schedule = await submitQuestionnaire(currentFormData);
                
                // Собираем все id психологов из слотов и их расписания
                const psychologistSchedules = new Map<string, any>();
                schedule[0].items.forEach((day: any) => {
                    if (!day.slots) return;
                    Object.entries(day.slots).forEach(([time, slots]) => {
                        if (!Array.isArray(slots)) return;
                        slots.forEach((slot: any) => {
                            if (slot.psychologist) {
                                if (!psychologistSchedules.has(slot.psychologist)) {
                                    const psychologistSchedule: { [date: string]: { [time: string]: any } } = {};
                                    schedule[0].items.forEach((d: any) => {
                                        if (d.slots) {
                                            psychologistSchedule[d.pretty_date] = {};
                                            Object.entries(d.slots).forEach(([t, s]) => {
                                                if (Array.isArray(s)) {
                                                    const psychologistSlots = s.filter(sl => sl.psychologist === slot.psychologist && sl.state === 'Свободен');
                                                    if (psychologistSlots.length > 0) {
                                                        psychologistSchedule[d.pretty_date][t] = psychologistSlots[0];
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    psychologistSchedules.set(slot.psychologist, psychologistSchedule);
                                }
                            }
                        });
                    });
                });

                // Берем текущий список психологов из стора
                const currentPsychologists = store.getState().filter.filtered_by_automatch_psy;

                // Фильтруем психологов у которых есть слоты
                const psychologistsWithSlots = Array.from(psychologistSchedules.entries()).map(([name, schedule]) => ({
                    name,
                    schedule,
                    id: name,
                    link_video: null,
                    age: undefined,
                    sex: undefined,
                    experience: undefined,
                    max_session_price: undefined,
                    min_session_price: undefined,
                    avatar: undefined,
                    specialization: [],
                    rating: undefined,
                    reviews_count: undefined,
                    works_with: undefined,
                    mental_illness: [],
                    mental_illness2: [],
                    video: false,
                    requests: [],
                    queries: '',
                    short_description: '',
                    verified: false
                })).filter((psy: any) => {
                    const schedule = psychologistSchedules.get(psy.name);
                    if (!schedule) return false;
                    return Object.values(schedule).some((daySlots: any) =>
                        // @ts-expect-error Сложная структура данных
                        Object.values(daySlots).some(slot => slot && slot.state === 'Свободен')
                    );
                });

                // Проверяем наличие психологов со слотами только при переходе с ключевого экрана
                if (isKeyStageTransition && psychologistsWithSlots.length === 0) {
                    const currentAttempts = Number(localStorage.getItem('matching_attempts') || '0');
                    console.log('Нет подходящих психологов, попытка:', currentAttempts + 1);
                    
                    localStorage.setItem('matching_attempts', (currentAttempts + 1).toString());
                    
                    if (currentAttempts + 1 >= 5) {
                        dispatch(setHasMatchingError(true));
                        dispatch(setApplicationStage('emergency'));
                        return;
                    }
                    
                    dispatch(setHasMatchingError(true));
                    dispatch(setApplicationStage('error'));
                    return;
                }

                dispatch(fill_filtered_by_automatch_psy(psychologistsWithSlots));
                if (isKeyStageTransition) {
                    dispatch(setHasMatchingError(false));
                }
            } catch (error) {
                console.error('Failed to update filtered psychologists:', error);
            } finally {
                // Минимальное время показа лоадера - 1 секунда
                if (isKeyStageTransition) {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                } else {
                    setIsLoading(false);
                }
            }
        };

        updatePsychologists();
        
        // Сохраняем текущий экран для следующей проверки
        prevStage.current = currentStage;
    }, [currentStage, dispatch]);

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
        <div className="w-full overflow-hidden h-screen min-lg:max-w-[960px] min-lg:max-h-[800px] min-lg:rounded-[30px] bg-[white] flex flex-col relative">
            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[18px] text-[#116466] max-lg:text-[14px]">Подбираем психологов...</p>
                    </div>
                </div>
            )}

            {currentStage !== 'gratitude' && currentStage !== 'error' && (
                <div className="w-full min-lg:rounded-[30px] pt-[50px] shrink-0">
                    <div className="w-full flex justify-between min-lg:px-[50px] pb-[20px] max-lg:px-[20px]">
                        <div className="flex flex-col gap-[10px]">
                            <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                                Подбор психолога
                            </h2>
                            <span className="font-normal text-[18px] max-lg:text-[14px] leading-[25px] max-[360px]:w-[192px]">
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
                                        {filtered_by_automatch_psy?.length || 0}
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