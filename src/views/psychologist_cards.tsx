'use client'
import { RootState } from "@/redux/store";
import { Card, Filter } from "@/widgets";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Error from "next/error";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { setDataNamePsychologist, fill_filtered_by_automatch_psy, setAvailableRequests } from "@/redux/slices/filter";
import Image from "next/image";
import { getPsychologistAll } from '@/features/actions/getPsychologistAll';
import { getAvailableRequests } from '@/shared/api/requests';
import { submitQuestionnaire } from '@/features/actions/getPsychologistSchedule';
import { clearStorage } from "@/features/utils";
import { useSearchParams } from "next/navigation";

type Props = {
    data?: IPsychologist[];
    isLoaded?: boolean;
}

//Сортируем психологов по наличию слотов (сначала показываем психологов со слотами потом без)
const sort_persons_by_slot_having = (persons: Array<IPsychologist>): Array<IPsychologist> => {
    const result: Array<IPsychologist> = [...persons].sort((a, b) => {
        const aSlots = a.schedule?.days?.length || 0;
        const bSlots = b.schedule?.days?.length || 0;
        return bSlots - aSlots;
    });

    return result
}

export const Psychologist_cards = ({ data, isLoaded }: Props) => {
    const filter = useSelector<RootState, any>(state => state.filter);
    const formData = useSelector((state: RootState) => state.applicationFormData);
    const [isLoading, setLoading] = useState(!isLoaded);
    const [isScheduleLoaded, setScheduleLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    // Проверка активности фильтров по цене или запросам
    const hasActiveFilters = filter.price > 0 || (filter.requests?.length > 0);

    // Определяем отображаемый список карточек с учётом всех фильтров
    const filtered_persons = useMemo(() => {
        let result = [...filter.filtered_by_automatch_psy];

        // Применяем фильтр по полу
        if (filter.gender !== 'other' && filter.filtered_by_gender?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_gender.some((f: IPsychologist) => f.id === item.id)
            );
        }

        // Применяем фильтр по избранным
        if (filter.favorites) {
            // Если фильтр включен, но нет избранных, всё равно применяем пустой фильтр
            const favoriteIds = filter.filtered_by_favorites?.map((f: IPsychologist) => f.id) || [];
            result = result.filter(item => favoriteIds.includes(item.id));
        }

        // Применяем фильтр по запросам
        if (filter.requests?.length > 0 && filter.filtered_by_requests?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_requests.some((f: IPsychologist) => f.id === item.id)
            );
        }

        // Применяем фильтр по цене
        if (filter.price > 0 && filter.filtered_by_price?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_price.some((f: IPsychologist) => f.id === item.id)
            );
        }

        // Применяем фильтр по времени
        if (filter.times?.length > 0 && filter.filtered_by_time?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_time.some((f: IPsychologist) => f.id === item.id)
            );
        }

        // Применяем фильтр по дате
        if (filter.dates?.length > 0 && filter.filtered_by_date?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_date.some((f: IPsychologist) => f.id === item.id)
            );
        }

        // Применяем фильтр по видео
        if (filter.video && filter.filtered_by_video?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_video.some((f: IPsychologist) => f.id === item.id)
            );
        }

        // Применяем фильтр по психиатрическим заболеваниям
        if (filter.mental_illness && filter.filtered_by_mental_illness?.length > 0) {
            result = result.filter(item =>
                filter.filtered_by_mental_illness.some((f: IPsychologist) => f.id === item.id)
            );
        }



        return result;
    }, [
        filter.filtered_by_automatch_psy,
        filter.filtered_by_favorites,
        filter.filtered_by_gender,
        filter.filtered_by_requests,
        filter.filtered_by_price,
        filter.filtered_by_time,
        filter.filtered_by_date,
        filter.filtered_by_video,
        filter.filtered_by_mental_illness,
        filter.gender,
        filter.requests,
        filter.price,
        filter.times,
        filter.dates,
        filter.video,
        filter.mental_illness,
        filter.favorites
    ]);

    // Сортировка психологов по цене
    const sortedPersons = useMemo(() => {
        if (filter.price > 0) {
            return [...filtered_persons].sort((a, b) => (a.min_session_price || 0) - (b.min_session_price || 0));
        }
        return filtered_persons;
    }, [filtered_persons, filter.price]);

    const searchParams = useSearchParams()
    // Очищаем предзаполненные блокирующие показ слотов поля из localstorage 
    useEffect(() => {
        
      
        if (!searchParams.get('selected_psychologist')) {
            clearStorage(false)
        }

        
    }, [])

    // Инициализация данных
    useEffect(() => {
        // Если данные уже загружены из родительского компонента, пропускаем загрузку
        if (isLoaded) {
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                const [psychologists, availableRequests] = await Promise.all([
                    getPsychologistAll(),
                    getAvailableRequests()
                ]);

                if (!psychologists?.length) {
                    setError('Не удалось загрузить данные психологов');
                    return;
                }

                dispatch(fill_filtered_by_automatch_psy(psychologists));
                dispatch(setAvailableRequests(availableRequests));
            } catch (err) {
                setError('Произошла ошибка при загрузке данных');
                console.error('Error loading data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [dispatch, isLoaded]);

    // Загрузка расписания
    useEffect(() => {
        const loadSchedules = async () => {
            if (!filter.filtered_by_automatch_psy.length) return;

            try {
                const schedule = await submitQuestionnaire(formData, true);

                if (schedule && schedule[0]?.items) {
                    // Собираем расписание для каждого психолога
                    const psychologistSchedules = new Map<string, any>();
                    schedule[0].items.forEach((day: any) => {
                        if (!day.slots) return;
                        Object.entries(day.slots).forEach(([time, slots]) => {
                            if (!Array.isArray(slots)) return;
                            slots.forEach((slot: any) => {
                                if (slot.psychologist) {
                                    if (!psychologistSchedules.has(slot.psychologist)) {
                                        const psychologistSchedule: { days: any[] } = { days: [] };
                                        schedule[0].items.forEach((d: any) => {
                                            const daySchedule = {
                                                ...d,
                                                slots: {}
                                            };
                                            if (d.slots) {
                                                Object.entries(d.slots).forEach(([t, s]) => {
                                                    if (Array.isArray(s)) {
                                                        const psychologistSlots = s.filter(sl => sl.psychologist === slot.psychologist);
                                                        if (psychologistSlots.length > 0) {
                                                            daySchedule.slots[t] = psychologistSlots;
                                                        }
                                                    }
                                                });
                                            }
                                            if (Object.keys(daySchedule.slots).length > 0) {
                                                psychologistSchedule.days.push(daySchedule);
                                            }
                                        });
                                        psychologistSchedules.set(slot.psychologist, psychologistSchedule);
                                    }
                                }
                            });
                        });
                    });

                    // Обновляем психологов с их расписаниями
                    const updatedPsychologists = filter.filtered_by_automatch_psy.map((psy: any) => ({
                        ...psy,
                        schedule: psychologistSchedules.get(psy.name) || { days: [] }
                    }));

                    setScheduleLoaded(true)
                    dispatch(fill_filtered_by_automatch_psy(updatedPsychologists));
                }
            } catch (error) {
                console.error('Error loading schedules:', error);
            }
        };

        loadSchedules();
    }, [filter.filtered_by_automatch_psy.length, dispatch, formData]);

    // Эффект для скролла к выбранному психологу
    useEffect(() => {
        const selectedPsychologist = filter.selected_psychologist;
        if (selectedPsychologist && !isLoading) {
            setTimeout(() => {
                const selectedCardId = `psychologist-card-${selectedPsychologist.id}`;

                const selectedCard = document.getElementById(selectedCardId);
                if (selectedCard) {
                    selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    console.error('Элемент не найден:', selectedCardId);

                    // Если карточка не найдена по ID, пробуем найти по имени
                    if (selectedPsychologist.name) {
                        const nameBasedId = `psychologist-card-${selectedPsychologist.name.replace(/\s+/g, '_')}`;
                        const cardByName = document.getElementById(nameBasedId);

                        if (cardByName) {
                            cardByName.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    }
                }
            }, 1000); // Увеличиваем время ожидания до 1 секунды
        }
    }, [filter.selected_psychologist, isScheduleLoaded]);



    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#116466] border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[20px] min-h-[400px]">
                <Image
                    src="/error.svg"
                    alt="Ошибка"
                    width={200}
                    height={200}
                    className="mb-6 opacity-80"
                />
                <h2 className="text-[24px] font-semibold text-[#116466] mb-2">
                    Что-то пошло не так
                </h2>
                <p className="text-[16px] text-gray-500 text-center max-w-[400px]">
                    {error}. Пожалуйста, попробуйте обновить страницу
                </p>
            </div>
        );
    }

    const EmptyState = () => {
        const hasActiveFilters = Boolean(
            filter.requests?.length ||
            filter.gender !== 'other' ||
            filter.price > 0 ||
            filter.dates?.length ||
            filter.times?.length ||
            filter.video ||
            filter.mental_illness ||
            filter.favorites
        );

        // Проверяем, выбран ли фильтр "Только избранные" и пуст ли список избранных
        const isEmptyFavorites = filter.favorites &&
            (!filter.filtered_by_favorites || filter.filtered_by_favorites.length === 0);

        return (
            <>
                <h1 className="text-2xl font-bold text-white pb-[20px] hidden">Подбор психолога и запись на консультацию онлайн</h1>
                <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[20px] min-h-[400px]">
                    <Image
                        src={hasActiveFilters ? "/not-found.svg" : "/empty.svg"}
                        alt="Ничего не найдено"
                        width={200}
                        height={200}
                        className="mb-6 opacity-80"
                    />
                    <h2 className="text-[24px] font-semibold text-[#116466] mb-2">
                        {isEmptyFavorites
                            ? "Нет избранных Хранителей"
                            : hasActiveFilters
                                ? "Упс! Ничего не найдено"
                                : "Нет доступных специалистов"}
                    </h2>
                    <p className="text-[16px] text-gray-500 text-center max-w-[400px]">
                        {isEmptyFavorites
                            ? "Добавьте Хранителей в избранное, чтобы они отображались здесь"
                            : hasActiveFilters
                                ? "Попробуйте изменить параметры фильтрации или сбросить фильтры"
                                : "В данный момент нет доступных специалистов. Пожалуйста, попробуйте позже"
                        }
                    </p>
                </div>
            </>
        );
    };

    return (
        <div className="mt-[50px] max-lg:mt-[20px] mb-[50px] max-lg:w-[100%] max-lg:px-[20px] w-full flex max-w-[1204px] max-lg:flex-col justify-center max-lg:gap-[20px] gap-[31px]">
            <aside className="w-full min-lg:max-w-[383px]">
                <Filter />
            </aside>
            <main className="min-lg:max-w-[790px] w-full">
                <h1 className="text-2xl font-bold text-white pb-[20px] hidden">Подбор психолога и запись на консультацию онлайн</h1>
                <div className="flex flex-col gap-[20px] pb-[50px]">
                    {sortedPersons && sortedPersons.length > 0 ? (
                        sort_persons_by_slot_having(sortedPersons).map((item: IPsychologist, index: number) => {
                            // Убедимся, что у каждого психолога есть ID
                            if (!item.id && item.name) {
                                item.id = `id_${item.name.replace(/\s+/g, '_')}`;
                            }

                            return (
                                <Card
                                    key={item.id}
                                    psychologist={item}
                                    id={`psychologist-card-${item.id}`}
                                    isSelected={filter.selected_psychologist?.id === item.id}
                                    showBestMatch={hasActiveFilters && index < 3}
                                />
                            );
                        })
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </main>
        </div>
    );
};