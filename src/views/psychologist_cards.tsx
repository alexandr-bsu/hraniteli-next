'use client'
import { RootState } from "@/redux/store";
import { Card, Filter } from "@/widgets";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Error from "next/error";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { setDataNamePsychologist } from "@/redux/slices/filter";

type Props = {
    data: IPsychologist[];
}

export const Psychologist_cards = ({data} : Props) => { 
    const filter = useSelector<RootState>(state => state.filter) as any;
    const [dataCard, setDataCard] = useState<IPsychologist[]>([]);
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();

    // Инициализация данных
    useEffect(() => {
        setLoading(true);
        if (!data) {
            console.error('No data provided to Psychologist_cards');
            setLoading(false);
            return;
        }

        if (!Array.isArray(data)) {
            console.error('Data is not an array:', data);
            setLoading(false);
            return;
        }
        
        dispatch(setDataNamePsychologist(data.map(item => item.name)));
        setDataCard(data);
        setLoading(false);
    }, [data, dispatch]);

    // Фильтрация при изменении фильтров
    useEffect(() => {
        if (!data?.length) return;
        
        setLoading(true);
        try {
            const filteredData = FilterData(data);
            setDataCard(filteredData);
        } catch (error) {
            console.error('Filtering error:', error);
            setDataCard([]);
        } finally {
            setLoading(false);
        }
    }, [filter, data]);

    const FilterData = (inputData: IPsychologist[]) => {
        let filteredData = [...inputData];

        // Фильтрация по цене
        if (filter.price > 0 && filter.price !== 1500) {
            filteredData = filteredData.filter(item => 
                Number(item.min_session_price) <= filter.price
            );
        }

        // Фильтрация по видео
        if (filter.isVideo) {
            filteredData = filteredData.filter(item => item.is_video || item.video);
        }

        // Фильтрация по заболеваниям
        if (filter.IsMental_Illness === true || filter.IsMental_Illness2 === true) {
            filteredData = filteredData.filter(psychologist => {
                if (!psychologist.works_with) return false;
                
                const conditions = psychologist.works_with.split(';').map(item => item.trim());
                
                const hasMental = conditions.some(condition => 
                    condition.includes('психическое заболевание') || 
                    condition.includes('РПП') ||
                    condition.includes('СДВГ')
                );
                
                const hasPsychiatric = conditions.some(condition =>
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
            const requestLabels = filter.requests.map((item: any) => item?.label);
            
            filteredData = filteredData.filter(item => {
                if (!item.queries) return false;
                const queries = item.queries.split(';').map(q => q.trimStart());
                return requestLabels.every((label: string) => queries.includes(label));
            });
        }

        // Фильтрация по полу
        if (filter.gender && filter.gender !== 'none' && filter.gender !== 'Не имеет значения') {   
            const genderMap = {
                'male': 'Мужчина',
                'female': 'Женщина'
            };
            
            filteredData = filteredData.filter(item => item.sex === genderMap[filter.gender as keyof typeof genderMap]);
        
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

        return filteredData;
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
                        <h1>Ничего не найдено</h1>
                    )}
                </div>
            </main>
        </div>
    );
};