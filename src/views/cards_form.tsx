'use client'

import { setInitTrackerStatusLaunched } from "@/redux/slices/application_form";
import { Suspense } from "react";
import axios from "axios";

import { generateTicketId } from "@/redux/slices/application_form_data";
import { RootState, store } from "@/redux/store";
import AgeStageApplication from "@/widgets/CardStages/AgeStage";
import ConditionStage from "@/widgets/CardStages/ConditionStage";
import TraumaticStage from "@/widgets/CardStages/TraumaticStage";
import { DiseasesPsychologistStage } from "@/widgets/CardStages/DiseasesPsychologistStage";
import { FinalStage } from "@/widgets/CardStages/FinalStage";
import { GenderStageApplication } from "@/widgets/CardStages/GenderStage";
import { GenderStagePsychologist } from "@/widgets/CardStages/GenderStagePsychologist";
import NameStageApplication from "@/widgets/CardStages/NameStage";
import { PreferencesStage } from "@/widgets/CardStages/PreferencesStage";
import PromocodeStage from "@/widgets/CardStages/PromocodeStage";
import { PsychologistStage } from "@/widgets/CardStages/PsychologistStage";
import RequestStage from "@/widgets/CardStages/RequestStage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ApplicationStage } from '@/redux/slices/application_form';
import { PhoneStage } from "@/widgets/CardStages/PhoneStage";
import { getPsychologistAll } from "@/features/actions/getPsychologistAll";
import { fill_filtered_by_automatch_psy } from "@/redux/slices/filter";
import { submitQuestionnaire, getFilteredPsychologists } from "@/features/actions/getPsychologistSchedule";
import { setHasMatchingError } from "@/redux/slices/application_form_data";
import { setApplicationStage } from "@/redux/slices/application_form";
import { NoMatchError } from "@/widgets/CardStages/NoMatchError";


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

interface FormProps {
    psychologistId?: string;
}

function Form({ psychologistId }: FormProps) {
    const router = useRouter();
    const dispatch = useDispatch();

    const searchParams = useSearchParams()
    // Проверяем, перешли ли мы из иммледовательской формы
    const isResearchRedirect = searchParams.get('research') == 'true'

    // Создаем уникальный ключ для localStorage для каждого психолога
    const storageKey = psychologistId ? `matching_attempts_${psychologistId}` : 'matching_attempts';

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

    const currentPsychologist = useSelector<RootState, any>(
        state => state.filter
    ).selected_psychologist;

    useEffect(() => {
        clearStorage(isResearchRedirect)
    }, [])

    // Функция для повторного подбора без конкретного психолога
    const handleRetryWithoutSpecificPsychologist = async () => {
        setIsLoading(true);
        try {
            // Отправляем анкету без указания конкретного психолога
            const schedule = await submitQuestionnaire(formData, false, false); // Не передаем имя психолога

            // Проверяем наличие слотов
            let hasSlots = false;
            if (schedule[0]?.items) {
                hasSlots = schedule[0].items.some((day: any) => {
                    if (!day.slots) return false;
                    return Object.entries(day.slots).some(([time, slots]) => {
                        if (!Array.isArray(slots)) return false;
                        return slots.some(slot => slot.state === 'Свободен');
                    });
                });
            }

            // Получаем список психологов
            const result = await getFilteredPsychologists();

            // Если нет слотов вообще - показываем ошибку
            if (!hasSlots || result.items.length === 0) {
                return; // Остаемся на экране ошибки
            }

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

            // Фильтруем психологов у которых есть слоты
            const psychologistsWithSlots = result.items.map((psy: any) => {
                const schedule = psychologistSchedules.get(psy.name);
                return {
                    ...psy,
                    schedule: schedule
                };
            }).filter((psy: any) => {
                const schedule = psychologistSchedules.get(psy.name);
                if (!schedule) return false;
                return Object.values(schedule).some((daySlots: any) =>
                    // @ts-expect-error: We expecting error because of error type
                    Object.values(daySlots).some(slot => slot && slot.state === 'Свободен')
                );
            });

            // Сортируем психологов по name_order если он есть в ответе
            if (schedule[0]?.name_order && Array.isArray(schedule[0].name_order)) {
                const nameOrder = schedule[0].name_order;
                psychologistsWithSlots.sort((a: any, b: any) => {
                    const aIndex = nameOrder.indexOf(a.name);
                    const bIndex = nameOrder.indexOf(b.name);

                    // Если психолог не найден в name_order, помещаем его в конец
                    if (aIndex === -1 && bIndex === -1) return 0;
                    if (aIndex === -1) return 1;
                    if (bIndex === -1) return -1;

                    return aIndex - bIndex;
                });
            }

            if (psychologistsWithSlots.length > 0) {
                dispatch(fill_filtered_by_automatch_psy(psychologistsWithSlots));
                dispatch(setHasMatchingError(false));
                dispatch(setApplicationStage('psychologist'));
            }
        } catch (error) {
            console.error('Ошибка при подборе других психологов:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Функция для продолжения с выбранным психологом через get-aggregated-all API
    const handleContinueAnyway = async () => {
        console.log('=== НАЧАЛО handleContinueAnyway ===');
        console.log('Текущий психолог:', currentPsychologist);
        console.log('Имя психолога:', currentPsychologist?.name);

        if (!currentPsychologist?.name) {
            console.error('Нет выбранного психолога');
            return;
        }

        console.log('Устанавливаем isLoading = true');
        setIsLoading(true);
        try {
            const requestBody = {
                startDate: "2025-11-17",
                endDate: "2025-12-18",
                ageFilter: "",
                formPsyClientInfo: {
                    age: "",
                    city: "",
                    sex: "Мужской",
                    psychoEducated: "",
                    anxieties: [],
                    customAnexiety: "",
                    hasPsychoExperience: "",
                    meetType: "",
                    selectionСriteria: "",
                    custmCreteria: "",
                    importancePsycho: [],
                    customImportance: "",
                    agePsycho: "",
                    sexPsycho: "Не имеет значения",
                    priceLastSession: "",
                    durationSession: "",
                    reasonCancel: "",
                    pricePsycho: "",
                    reasonNonApplication: "",
                    contactType: "",
                    contact: "",
                    name: "",
                    is_adult: false,
                    is_last_page: false,
                    occupation: ""
                },
                form: {
                    anxieties: [],
                    questions: [],
                    customQuestion: [],
                    diagnoses: [],
                    diagnoseInfo: "",
                    diagnoseMedicaments: "",
                    traumaticEvents: [],
                    clientStates: [],
                    selectedPsychologistsNames: [],
                    shownPsychologists: "",
                    psychos: [],
                    lastExperience: "",
                    amountExpectations: "",
                    age: "",
                    slots: [],
                    contactType: "",
                    contact: "",
                    name: "",
                    promocode: "",
                    ticket_id: "",
                    emptySlots: false,
                    userTimeZone: "МСК",
                    bid: 0,
                    rid: 0,
                    categoryType: "",
                    customCategory: "",
                    question_to_psychologist: "",
                    filtered_by_automatch_psy_names: [],
                    _queries: "",
                    customTraumaticEvent: "",
                    customState: ""
                },
                ticket_id: "",
                userTimeOffsetMsk: 0,
                show_only_psy: currentPsychologist.name
            };

            // Вызываем API get-aggregated-all с полной структурой запроса
            const response = await fetch('https://n8n-v2.hrani.live/webhook/get-aggregated-all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error('Ошибка при получении данных психолога');
            }

            const data = await response.json();

            console.log('=== ОТЛАДКА КНОПКИ "ВСЁРАВНО ПРОДОЛЖИТЬ" ===');
            console.log('1. Ответ от API get-aggregated-all:', data);
            console.log('2. Имя текущего психолога:', currentPsychologist?.name);
            console.log('3. Есть ли data?', !!data);
            console.log('4. Является ли data массивом?', Array.isArray(data));
            console.log('5. Есть ли data[0]?', !!data?.[0]);
            console.log('6. Есть ли data[0].items?', !!data?.[0]?.items);
            console.log('7. Является ли data[0].items массивом?', Array.isArray(data?.[0]?.items));

            const scheduleData = Array.isArray(data) && data.length > 0 ? data[0] : null;

            if (scheduleData?.items) {
                console.log('8. Количество дней в расписании:', scheduleData.items.length);

                // Подробно анализируем каждый день
                scheduleData.items.forEach((day: any, dayIndex: number) => {
                    console.log(`День ${dayIndex + 1} (${day.pretty_date}):`);
                    console.log('  - Есть ли slots?', !!day.slots);

                    if (day.slots) {
                        const slotsCount = Object.keys(day.slots).length;
                        console.log(`  - Количество временных слотов: ${slotsCount}`);

                        let dayFreeSlots = 0;
                        Object.entries(day.slots).forEach(([time, slots]) => {
                            if (Array.isArray(slots) && slots.length > 0) {
                                const freeSlots = slots.filter(slot => slot.state === 'Свободен');
                                if (freeSlots.length > 0) {
                                    dayFreeSlots += freeSlots.length;
                                    console.log(`    ${time}: ${freeSlots.length} свободных слотов`);
                                    freeSlots.forEach(slot => {
                                        console.log(`      - Психолог: ${slot.psychologist}, Статус: ${slot.state}`);
                                    });
                                }
                            }
                        });
                        console.log(`  - Всего свободных слотов в этот день: ${dayFreeSlots}`);
                    }
                });
            }

            // Проверяем наличие свободных слотов
            let hasAvailableSlots = false;
            if (scheduleData && scheduleData.items && Array.isArray(scheduleData.items)) {
                // Проверяем есть ли вообще слоты со статусом "Свободен"
                hasAvailableSlots = scheduleData.items.some((day: any) => {
                    if (!day.slots) return false;

                    return Object.entries(day.slots).some(([time, slots]) => {
                        if (!Array.isArray(slots)) return false;

                        return slots.some(slot => slot.state === 'Свободен');
                    });
                });
            }

            console.log('9. Найдены ли свободные слоты?', hasAvailableSlots);
            console.log('10. Текущий этап приложения:', currentStage);
            console.log('11. Есть ли ошибка подбора?', hasError);

            // Всегда переходим к выбору времени, если получили данные
            if (scheduleData && scheduleData.items) {
                console.log('12. ПЕРЕХОДИМ К ВЫБОРУ ВРЕМЕНИ');
                console.log('13. Данные для сохранения в Redux:', {
                    psychologist: currentPsychologist,
                    schedule: scheduleData
                });

                dispatch(fill_filtered_by_automatch_psy([{
                    ...currentPsychologist,
                    schedule: scheduleData
                }]));
                dispatch(setHasMatchingError(false));
                dispatch(setApplicationStage('psychologist'));

                console.log('14. Redux actions выполнены');
            } else {
                console.log('12. НЕ ПЕРЕХОДИМ К ВЫБОРУ ВРЕМЕНИ - нет данных');
            }

            console.log('=== КОНЕЦ ОТЛАДКИ ===');
        } catch (error) {
            console.error('=== ОШИБКА В handleContinueAnyway ===');
            console.error('Ошибка при вызове get-aggregated-all:', error);
            console.error('Имя психолога:', currentPsychologist?.name);
            console.error('=== КОНЕЦ ОШИБКИ ===');
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        const formKey = psychologistId ? `cd_` : 'cd_';
        if (!ticketID || !ticketID.includes(formKey)) {
            dispatch(generateTicketId(formKey));
            localStorage.setItem(storageKey, '0');
        }
    }, [dispatch, ticketID, psychologistId, storageKey]);


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
                return <NoMatchError onClose={handleClose} onRetryWithoutSpecificPsychologist={handleRetryWithoutSpecificPsychologist} onContinueAnyway={handleContinueAnyway} />;
            case 'emergency':
                return <NoMatchError onClose={handleClose} onRetryWithoutSpecificPsychologist={handleRetryWithoutSpecificPsychologist} onContinueAnyway={handleContinueAnyway} />;
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

            {currentStage !== 'gratitude' && currentStage !== 'error' && currentStage !== 'emergency' && (
                <div className="w-full min-lg:rounded-[30px] pt-[30px] shrink-0">
                    <div className="w-full flex justify-between min-lg:px-[50px] max-lg:px-[20px]">
                        <div className="flex flex-col md:gap-[10px] justify-center">
                            <h2 className="font-semibold text-[20px] max-lg:text-[14px] max-lg:leading-[22px] leading-[27px]">
                                Запись на сессию {currentPsychologist?.name ? ` - ${currentPsychologist.name}` : ''}
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

interface CardsFormProps {
    psychologistId?: string;
}

export default function CardsForm({ psychologistId }: CardsFormProps) {
    const dispatch = useDispatch()

    // Создаем уникальный ключ для каждого психолога
    const formKey = psychologistId ? `cd_` : 'cd_';

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    const is_tracker_launched = useSelector((state: RootState) => state.applicationForm.is_tracker_launched)

    useEffect(() => {
        if (!ticketID || !ticketID.includes(formKey)) {
            dispatch(generateTicketId(formKey));
        }
    }, [ticketID, dispatch, formKey]);

    // Инициализируем трекер формы
    useEffect(() => {
        if (ticketID != "" && !is_tracker_launched && ticketID.includes(formKey)) {
            axios({
                method: "POST",
                url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
                data: { ticket_id: ticketID, form_type: 'Заявка из карточки психолога', step: "Начало" },
            }).then(r => {
                dispatch(setInitTrackerStatusLaunched())
            });
        }
    }, [ticketID, formKey])

    return (
        // <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
            {/* <div className="flex justify-center items-center max-w-[960px] max-h-[650px]"> */}
            <Suspense>
                <Form psychologistId={psychologistId} />
            </Suspense>
            {/* </div> */}
        </div>
    )
}