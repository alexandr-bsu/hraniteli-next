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

type Props = {
    data?: IPsychologist[];
    isLoaded?: boolean;
}

export const Psychologist_cards = ({data, isLoaded} : Props) => { 
    const filter = useSelector<RootState, any>(state => state.filter);
    const formData = useSelector((state: RootState) => state.applicationFormData);
    const [isLoading, setLoading] = useState(!isLoaded);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    
    // Проверка активности фильтров по цене или запросам
    const hasActiveFilters = filter.price > 0 || (filter.requests?.length > 0);
    
    // Определяем отображаемый список карточек с учётом всех фильтров
    const filtered_persons = useMemo(() => {
        let result = filter.filtered_by_automatch_psy as IPsychologist[];
        
        // Применяем фильтр по избранным, если он активен
        if (filter.favorites && filter.filtered_by_favorites?.length > 0) {
            result = filter.filtered_by_favorites as IPsychologist[];
        }
        
        // Применяем другие активные фильтры
        if (filter.gender !== 'other' && filter.filtered_by_gender?.length > 0) {
            result = result.filter((item: IPsychologist) => 
                filter.filtered_by_gender.some((f: IPsychologist) => f.id === item.id)
            );
        }
        
        if (filter.requests?.length > 0 && filter.filtered_by_requests?.length > 0) {
            result = filter.filtered_by_requests;
        }
        
        if (filter.price > 0 && filter.filtered_by_price?.length > 0) {
            result = result.filter((item: IPsychologist) => 
                filter.filtered_by_price.some((f: IPsychologist) => f.id === item.id)
            );
        }
        
        if (filter.time?.length > 0 && filter.filtered_by_time?.length > 0) {
            result = result.filter((item: IPsychologist) => 
                filter.filtered_by_time.some((f: IPsychologist) => f.id === item.id)
            );
        }
        
        if (filter.date?.length > 0 && filter.filtered_by_date?.length > 0) {
            result = result.filter((item: IPsychologist) => 
                filter.filtered_by_date.some((f: IPsychologist) => f.id === item.id)
            );
        }
        
        if (filter.video && filter.filtered_by_video?.length > 0) {
            result = result.filter((item: IPsychologist) => 
                filter.filtered_by_video.some((f: IPsychologist) => f.id === item.id)
            );
        }
        
        if (filter.mental_illness && filter.filtered_by_mental_illness?.length > 0) {
            result = result.filter((item: IPsychologist) => 
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
        filter.time,
        filter.date,
        filter.video,
        filter.mental_illness,
        filter.favorites
    ]);
    
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
                const schedule = await submitQuestionnaire(formData);

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
            // Даем время для отрисовки карточек
            setTimeout(() => {
                const selectedCard = document.getElementById(`psychologist-card-${selectedPsychologist.id}`);
                if (selectedCard) {
                    selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 500);
        }
    }, [filter.selected_psychologist, isLoading]);

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

        return (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-[20px] min-h-[400px]">
                <Image 
                    src={hasActiveFilters ? "/not-found.svg" : "/empty.svg"} 
                    alt="Ничего не найдено" 
                    width={200} 
                    height={200}
                    className="mb-6 opacity-80"
                />
                <h2 className="text-[24px] font-semibold text-[#116466] mb-2">
                    {hasActiveFilters ? "Упс! Ничего не найдено" : "Нет доступных специалистов"}
                </h2>
                <p className="text-[16px] text-gray-500 text-center max-w-[400px]">
                    {hasActiveFilters 
                        ? "Попробуйте изменить параметры фильтрации или сбросить фильтры" 
                        : "В данный момент нет доступных специалистов. Пожалуйста, попробуйте позже"
                    }
                </p>
            </div>
        );
    };

    return (
        <div className="mt-[50px] max-lg:mt-[20px] mb-[50px] max-lg:w-[100%] max-lg:px-[20px] w-full flex max-w-[1204px] max-lg:flex-col justify-center max-lg:gap-[20px] gap-[31px]">
            <aside className="w-full min-lg:max-w-[383px]">
                <Filter />
            </aside>
            <main className="min-lg:max-w-[790px] w-full">
                <div className="flex flex-col gap-[20px] pb-[50px]">
                    {filtered_persons && filtered_persons.length > 0 ? (
                        filtered_persons.map((item: IPsychologist, index: number) => (
                            <Card 
                                key={item.id} 
                                psychologist={item} 
                                id={`psychologist-card-${item.id}`} 
                                isSelected={filter.selected_psychologist?.id === item.id} 
                                showBestMatch={hasActiveFilters && index < 3}
                            />
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </main>
        </div>
    );
};