'use client'
import { RootState } from "@/redux/store";
import { Card, Filter } from "@/widgets";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Error from "next/error";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { setDataNamePsychologist } from "@/redux/slices/filter";
import Image from "next/image";
import { fill_filtered_by_automatch_psy } from "@/redux/slices/filter";

type Props = {
    data: IPsychologist[];
}

export const Psychologist_cards = ({data} : Props) => { 
    const filter = useSelector<RootState>(state => state.filter) as any;
    const [dataCard, setDataCard] = useState<IPsychologist[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    // Инициализация данных
    useEffect(() => {
        setLoading(true);
        setError(null);
        if (!data) {
            setError('Не удалось загрузить данные');
            setLoading(false);
            return;
        }

        if (!Array.isArray(data)) {
            setError('Неверный формат данных');
            setLoading(false);
            return;
        }
        
        dispatch(setDataNamePsychologist(data.map(item => item.name)));
        dispatch(fill_filtered_by_automatch_psy(data));
        setDataCard(data);
        setLoading(false);
    }, [data, dispatch]);

    // Фильтрация при изменении фильтров
    useEffect(() => {
        if (!data?.length) return;
        
        setLoading(true);
        try {            
            // Начинаем с исходных данных
            let filteredData = [...data];

            // Фильтрация по полу
            if (filter.gender !== 'other' && filter.gender !== 'none') {
                filteredData = filteredData.filter(item => {
                    const matches = item.sex === (filter.gender === 'male' ? 'Мужчина' : 'Женщина');
                    return matches;
                });
            }

            // Фильтрация по цене
            if (filter.price > 0 && filter.price !== 1500) {
                filteredData = filteredData.filter(item => {
                    const matches = Number(item.min_session_price) <= filter.price;
                    return matches;
                });
            }

            // Фильтрация по видео
            if (filter.isVideo) {
                filteredData = filteredData.filter(item => item.is_video || item.video);
            }

            // Фильтрация по заболеваниям
            if (filter.IsMental_Illness === true || filter.IsMental_Illness2 === true) {
                filteredData = filteredData.filter(psychologist => {
                    if (!psychologist.works_with) return false;
                    
                    const conditions = psychologist.works_with.split(';').map((item: string) => item.trim());
                    
                    const hasMental = conditions.some((condition: string) => 
                        condition.includes('психическое заболевание') || 
                        condition.includes('РПП') ||
                        condition.includes('СДВГ')
                    );
                    
                    const hasPsychiatric = conditions.some((condition: string) =>
                        condition.includes('психиатрическое заболевание') ||
                        condition.includes('ПРЛ') ||
                        condition.includes('БАР') ||
                        condition.includes('ПТСР')
                    );

                    if (filter.IsMental_Illness === true && filter.IsMental_Illness2 === true) {
                        return filter.IsMental_Illness === hasMental && filter.IsMental_Illness2 === hasPsychiatric;
                    }
                    
                    if (filter.IsMental_Illness === true) {
                        return filter.IsMental_Illness === hasMental;
                    }
                    
                    if (filter.IsMental_Illness2 === true) {
                        return filter.IsMental_Illness2 === hasPsychiatric;
                    }

                    return true;
                });
            }

            // Фильтрация по запросам
            if (filter.requests?.length) {
                const requestLabels = filter.requests.map((item: string) => item?.toLowerCase().trim());
                
                filteredData = filteredData.filter(item => {
                    if (!item.queries) return false;
                    const queries = item.queries.split(';').map((q: string) => q.toLowerCase().trim());
                    
                    return requestLabels.every((label: string) => {
                        const normalizedLabel = label.replace(/[.,;]/g, '').trim();
                        return queries.some((query: string) => {
                            const normalizedQuery = query.replace(/[.,;]/g, '').trim();
                            return normalizedQuery === normalizedLabel;
                        });
                    });
                });
            }

            // Фильтрация по датам и времени
            if (filter.dates?.length || filter.times?.length) {
                const availableNames = new Set<string>();

                // Обработка дат
                if (filter.dates?.length) {
                    filter.dates.forEach((date: any) => {
                        const persons = filter.hour_dates
                            .filter((item: any) => item.pretty_date === date.text)
                            .map((item: any) => item.element1);
                        persons.forEach((name: string) => availableNames.add(name));
                    });
                }

                // Обработка времени
                if (filter.times?.length) {
                    filter.times.forEach((time: any) => {
                        const persons = filter.hour_dates
                            .filter((item: any) => item.hour === time.text)
                            .map((item: any) => item.element1);
                        persons.forEach((name: string) => availableNames.add(name));
                    });
                }

                filteredData = filteredData.filter(item => availableNames.has(item.name));
            }

            setDataCard(filteredData);
            setError(null);
        } catch (error) {
            console.error('Filtering error:', error);
            setError('Ошибка при фильтрации данных');
            setDataCard([]);
        } finally {
            setLoading(false);
        }
    }, [filter, data]);

    const EmptyState = () => {
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

        const hasActiveFilters = Boolean(
            filter.requests?.length || 
            filter.gender || 
            filter.price || 
            filter.dates?.length || 
            filter.times?.length || 
            filter.isVideo || 
            filter.IsMental_Illness || 
            filter.IsMental_Illness2
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

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border-4 border-[#116466] border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="mt-[50px] max-lg:mt-[20px] mb-[50px] max-lg:w-[100%] max-lg:px-[20px] w-full flex max-w-[1204px] max-lg:flex-col justify-center max-lg:gap-[20px] gap-[31px]">
            <aside className="w-full min-lg:max-w-[383px]">
                <Filter />
            </aside>
            <main className="min-lg:max-w-[790px] w-full">
                <div className="flex flex-col gap-[20px]">
                    {dataCard?.length > 0 ? (
                        dataCard.map((item: IPsychologist) => (
                            <Card key={item.id} psychologist={item} />
                        ))
                    ) : (
                        <EmptyState />
                    )}
                </div>
            </main>
        </div>
    );
};