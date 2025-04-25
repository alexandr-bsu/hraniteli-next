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
    data: any;
}

export const Psychologist_cards = ({data} : Props) => { 
    const filter = useSelector<RootState>(state => state.filter) as any;
    
    const [ dataCard, setDataCard] = useState<IPsychologist[]>([]);

    const [isLoading, setLoading] = useState(true);

    const dispatch = useDispatch();

    // useEffect(() => {
    //     try
    //     {
    //         setLoading(true);
    //         const apiUrl = 'https://n8n-v2.hrani.live/webhook/get-filtered-psychologists-test-contur';

    //         axios.get(apiUrl).then((resp) => {
    //             const allPsychologist = resp.data;

    //         });
    //     }
    //     catch {
    //         setLoading(false)
    //         throw new Error('Something went wrong.' as any)
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // },[]);

    useEffect(() => {
        console.log('data',data)

        dispatch(setDataNamePsychologist(data.map((item: IPsychologist) => {
            return item.name
        })))
        setDataCard(data);
    },[data])

    useEffect(() => {
        try
        {
            setLoading(true);
            FilterData(data)
        }
        catch {
            setLoading(false)
            throw new Error('Something went wrong.' as any)
        }
        finally {
            setLoading(false)
        }
    },[filter]);


    // useEffect(() => {
    //     try
    //     {
    //         setLoading(true);
    //         const apiUrl = 'https://n8n-v2.hrani.live/webhook/get-filtered-psychologists-test-contur';

    //         console.log(filter)
    //         axios.get(apiUrl).then((resp) => {
    //             const allPsychologist = resp.data;
    //             FilterData(allPsychologist)
    //         });
    //     }
    //     catch {
    //         setLoading(false)
    //         throw new Error('Something went wrong.' as any)
    //     }
    //     finally {
    //         setLoading(false)
    //     }
    // },[filter]);
    

    //Метод фильтрации данных 
    const FilterData = async(data: any) => {
        if (!data) return;
        
        const gender = filter.gender;
        const price = filter.price;
        let requests = filter.requests;
        const dates = filter.dates || [];
        const times = filter.times || [];
        const hour_dates = filter.hour_dates || [];
        const isVideo = filter.isVideo;
        const mental_Illness = filter.IsMental_Illness;
        const mental_Illness2 = filter.IsMental_Illness2;

        let filterData = [...data];

        // Фильтрация по стоимости
        if(filterData !== null && filterData !== undefined && price !== 1500) {  
            if (filterData.length > 1) {
                filterData = filterData.filter((item : any) => Number(item.min_session_price) <= price);
            }
        }

        // Фильтрация по видео визитки 
        if(filterData !== null && filterData !== undefined && isVideo) {  
            const result = filterData.filter((item: any) => item.link_video !== null);
            filterData = result;
        }

// Фильтрация по психическим заболеваниям
if (filterData) {
    filterData = filterData.filter((psychologist: IPsychologist) => {
        if (!psychologist.works_with) return false;
        
        const conditions = psychologist.works_with
            .split(';')
            .map(item => item.trim());
        
        // Проверяем "содержит" вместо точного соответствия
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
        
        // Определяем, нужно ли применять каждый фильтр
        const applyMentalFilter = mental_Illness !== false;
        const applyPsychiatricFilter = mental_Illness2 !== false;
        
        // Если ни один фильтр не применяется - показываем всех
        if (!applyMentalFilter && !applyPsychiatricFilter) {
            return true;
        }
        
        // Проверяем соответствие включенным фильтрам
        let matchesMental = true;
        let matchesPsychiatric = true;
        
        if (applyMentalFilter) {
            matchesMental = (mental_Illness === hasMental);
        }
        
        if (applyPsychiatricFilter) {
            matchesPsychiatric = (mental_Illness2 === hasPsychiatric);
        }
        
        return matchesMental && matchesPsychiatric;
    });
}
        

        // Фильтрация по запросу
        if(filterData !== null && filterData !== undefined && requests.length > 0) {
            const result = []
            requests = requests.map(function(item: any){
                return item?.label;
            })
            for (let index = 0; index <= filterData.length - 1; index++) {
                const queries = filterData[index].queries.split(';').map(function(item: any){
                    return item.trimStart();
                });

                let isInclude = true;
                for (let index = 0; index < requests.length; index++) {
                    if(!queries.includes(requests[index])) {
                        isInclude = false;
                        break;
                    }
                }

                if(isInclude) {
                    result.push(filterData[index]);
                }              
            }
            if (result.length === 0) {
                setDataCard([])
                return;
            }
            filterData = result;  
        }


        // Фильтрация по полу
        if(gender !== 'none' && gender !== 'Не имеет значения'  && gender !== '' && gender !== null && gender !== undefined) {
            filterData = filterData.filter((item: any) => item.sex === gender);       
        }

        // Фильтрация по дате и  часам 
        if(filterData !== null && filterData !== undefined && dates.length > 0) {
            const result = []  as any
            if (filterData != null && filterData != undefined) {
                dates.forEach((element: any )=> {
                    const persons = hour_dates.filter((item: any) => item.pretty_date === element.text)
                    result.push(persons);
                }); 
            }
    
            const names = new Set();
    
            result.forEach((item: any) => {
                item.forEach((element: any ) => {
                    names.add(element.element1)
                });
            })

            const newData = [] as any

            names.forEach((res) => {
                let findItem = data;
                console.log(res)
                findItem = data.find((item : any) => item.name === res);
                if (findItem != undefined && findItem != null) {
                    newData.push(findItem);
                }
            })

            filterData = newData;
        }

        // Фильтрация по дате и  часам 
        if(filterData !== null && filterData !== undefined && times.length > 0) {
            const result = [] as any
            if (filterData != null && filterData != undefined) {
                times.forEach((element : any ) => {
                    console.log(hour_dates)
                    const persons = hour_dates.filter((item: any) => item.hour === element.text)
                    result.push(persons);
                }); 
            }
    
            const names = new Set();
    
            result.forEach((item: any ) => {
                item.forEach((element : any) => {
                    names.add(element.element1)
                });
            })

            const newData = [] as any

            names.forEach((res) => {
                let findItem = data;
                findItem = data.find((item : any ) => item.name === res);
                if (findItem != undefined && findItem != null) {
                    newData.push(findItem);
                }
            })

            filterData = newData;
        }

        if (filterData !== null && filterData !== undefined) {
            if(filterData.length === 0) {
                setDataCard([])
                return;
            }
            if (Object.keys(dataCard)?.length === 1) {{
                setDataCard(filterData)
                return;
            }}
            setDataCard(filterData)
        }
    }

    if (isLoading) {
        return (
            <div className="mt-[50px] max-lg:mt-[20px] mb-[50px] max-lg:w-[100%] max-lg:px-[20px] w-full flex max-w-[1204px] max-lg:flex-col justify-center max-lg:gap-[20px] gap-[31px]  ">
            <aside className="w-full min-lg:max-w-[383px]">
                <Filter />
            </aside>

                <main className="min-lg:max-w-[790px] w-full">
                    <h1>Загрузка...</h1> 
                </main>
            </div>
        )
    }
    
    return (
        <div className="mt-[50px] max-lg:mt-[20px] mb-[50px] max-lg:w-[100%] max-lg:px-[20px] w-full flex max-w-[1204px] max-lg:flex-col justify-center max-lg:gap-[20px] gap-[31px]  ">
            <aside className="w-full min-lg:max-w-[383px]">
                <Filter />
            </aside>

            <main className="min-lg:max-w-[790px] w-full">
                <div className="flex flex-col gap-[20px]">
                    {dataCard?.length > 0 ? (
                        dataCard.map((item: IPsychologist, i) => (
                            <Card key={i} psychologist={item} />
                        ))
                    ) : (
                        <h1>Ничего не найдено</h1>
                    )}
                </div>
            </main>
        </div>
    );
};