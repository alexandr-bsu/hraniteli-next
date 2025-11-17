'use client'
import { RootState } from "@/redux/store";
import { Card, Filter } from "@/widgets";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import Error from "next/error";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { setDataNamePsychologist, fill_card_stages_psychologists, setAvailableRequests } from "@/redux/slices/filter";
import Image from "next/image";
import { getPsychologistAll } from '@/features/actions/getPsychologistAll';
import { getAvailableRequests } from '@/shared/api/requests';
import { submitQuestionnaire } from '@/features/actions/getPsychologistSchedule';
import { clearStorage } from "@/features/utils";
import { useSearchParams } from "next/navigation";
import { useWindowVirtualizer, elementScroll, Virtualizer } from '@tanstack/react-virtual';
import React from "react";
import { FullWidthPopup } from "@/shared/ui/FullWidthPopup";

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

function easeInOutQuint(t: number) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
}

const scrollingRef = typeof window !== 'undefined' ? { current: 0 } : { current: 0 };

export const Psychologist_cards = ({ data, isLoaded }: Props) => {
    const filter = useSelector<RootState, any>(state => state.filter);
    const formData = useSelector((state: RootState) => state.applicationFormData);
    const [isLoading, setLoading] = useState(!isLoaded);
    const [isScheduleLoaded, setScheduleLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();
    const [educationMap, setEducationMap] = useState<{ [key: string]: any[] }>({});

    // Проверка активности фильтров по цене или запросам
    const hasActiveFilters = filter.price > 0 || (filter.requests?.length > 0);

    // Определяем отображаемый список карточек с учётом всех фильтров
    const filtered_persons = useMemo(() => {
        let result = [...filter.card_stages_psychologists];

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
        filter.card_stages_psychologists,
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

    // Полная сортировка: сначала по цене, потом по слотам
    const fullySortedPersons = useMemo(() => {
        let arr = [...filtered_persons];
        if (filter.price > 0) {
            arr = arr.sort((a, b) => (a.min_session_price || 0) - (b.min_session_price || 0));
        }
        arr = sort_persons_by_slot_having(arr);
        return arr;
    }, [filtered_persons, filter.price]);

    const scrollToFn = React.useCallback(
        (offset: number, options: { behavior?: 'auto' | 'smooth'; adjustments?: number }, instance: any) => {
            // Принудительно отключаем smooth scroll для стабильности
            const opts = { ...options, behavior: 'auto' as const };
            elementScroll(offset, opts, instance);
        },
        []
    );

    // Виртуализатор для window
    const virtualizer = useWindowVirtualizer({
        count: fullySortedPersons.length,
        estimateSize: () => 350, // средняя высота карточки
        overscan: 5,
        getItemKey: (index) => fullySortedPersons[index]?.id || index,
        gap: 20, // гарантированный отступ между карточками
        scrollToFn, // добавляем кастомный scrollToFn
    });

    const searchParams = useSearchParams()
    // Очищаем предзаполненные блокирующие показ слотов поля из localstorage 
    useEffect(() => {


        if (!searchParams.get('selected_psychologist')) {
            clearStorage(false)
        }


    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const url = new URL(window.location.href);
        const param = url.searchParams.get('selected_psychologist');
        if (param && (param.includes('%2520') || param.includes('%20') || param.includes('_'))) {
            let decoded = decodeURIComponent(decodeURIComponent(param));
            decoded = decoded.replace(/(%2520|%20|_)+/g, ' ');
            url.searchParams.set('selected_psychologist', decoded);
            window.history.replaceState({}, '', url.toString());
        }
    }, []);

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
                    getPsychologistAll(false), // false означает что это НЕ группа "Супервизии"
                    getAvailableRequests()
                ]);

                if (!psychologists?.length) {
                    setError('Не удалось загрузить данные психологов');
                    return;
                }

                dispatch(fill_card_stages_psychologists(psychologists));
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

    // Загрузка образования для всех психологов
    useEffect(() => {
        const loadEducation = async () => {
            try {
                const { data } = await axios.get('https://cache-api.hrani.live/edu-keys-pipeline-batch?batch_size=1000&use_cache=true');
                const map: { [key: string]: any[] } = {};
                data.forEach((item: any) => {
                    const key = item.psychologist;
                    if (!map[key]) map[key] = [];
                    map[key].push({
                        educationItemProgramTitle: item.program_title,
                        educationItemYear: item.year,
                        educationItemTitle: item.title,
                        educationItemType: item.doc_type,
                    });
                });
                setEducationMap(map);
            } catch (e) {
                setEducationMap({});
            }
        };
        loadEducation();
    }, []);

    // Загрузка расписания
    useEffect(() => {
        const loadSchedules = async () => {
            if (!filter.card_stages_psychologists.length) return;

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

                    // Обновляем психологов с их расписаниями и образованием
                    const updatedPsychologists = filter.card_stages_psychologists.map((psy: any) => {
                        const educationKey = psy.name?.replace(/\s+/g, '_');
                        return {
                            ...psy,
                            schedule: psychologistSchedules.get(psy.name) || { days: [] },
                            education: educationMap[educationKey] || [],
                        };
                    });

                    setScheduleLoaded(true)
                    dispatch(fill_card_stages_psychologists(updatedPsychologists));
                }
            } catch (error) {
                console.error('Error loading schedules:', error);
            }
        };

        loadSchedules();
    }, [filter.card_stages_psychologists.length, dispatch, formData, educationMap]);

    // Вычисляем id и индекс выбранного психолога
    const selectedId = filter.selected_psychologist?.id || (filter.selected_psychologist?.name ? `id_${filter.selected_psychologist.name.replace(/\s+/g, '_')}` : undefined);
    const selectedIndex = fullySortedPersons.findIndex(
        p => String(p.id) === String(selectedId) || p.name === selectedId
    );

    // Эффект для скролла к выбранному психологу
    useEffect(() => {
        if (selectedIndex >= 0 && selectedIndex < fullySortedPersons.length) {
            virtualizer.measure();
            virtualizer.scrollToIndex(selectedIndex, { align: 'start', behavior: 'auto' });
        }
    }, [selectedIndex, fullySortedPersons.length, JSON.stringify(fullySortedPersons.map(p => p.id)), virtualizer]);


    // --- Новый код для Popup подробной карточки психолога ---
    // Получаем параметр selected_psychologist из поисковой строки
    const selectedPsychologistId = searchParams.get('selected_psychologist');
    // Находим психолога по id или имени (универсально)
    const popupPsychologist = React.useMemo(() => {
        if (!selectedPsychologistId) return null;
        // Сначала ищем по id
        let found = filter.card_stages_psychologists.find((p: IPsychologist) => String(p.id) === String(selectedPsychologistId));
        // Если не нашли — ищем по имени
        if (!found) {
            found = filter.card_stages_psychologists.find((p: IPsychologist) => p.name === selectedPsychologistId);
        }
        return found || null;
    }, [selectedPsychologistId, filter.card_stages_psychologists]);
    // --- Конец нового кода ---


    // --- Новый код для подробной карточки психолога ---
    // Получаем параметр psychologist из поисковой строки
    const cardPsychologistName = searchParams.get('psychologist');
    // Находим психолога по id или имени (универсально)
    const singleCardPsychologist = React.useMemo(() => {
        if (!cardPsychologistName) return null;
        // Сначала ищем по id
        let found = filter.card_stages_psychologists.find((p: IPsychologist) => String(p.id) === String(cardPsychologistName));
        // Если не нашли — ищем по имени
        if (!found) {
            found = filter.card_stages_psychologists.find((p: IPsychologist) => p.name === cardPsychologistName);
        }
        return found || null;
    }, [cardPsychologistName, filter.card_stages_psychologists]);
    // --- Конец нового кода ---


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
        <>
            {/* Popup для подробной карточки психолога */}
            {selectedPsychologistId && popupPsychologist && !cardPsychologistName && (
                <FullWidthPopup
                    open={true}
                    hideClose={true}
                    onClose={() => {
                        // Remove selected_psychologist from URL
                        const url = new URL(window.location.href);
                        url.searchParams.delete('selected_psychologist');
                        window.history.replaceState({}, '', url.toString());
                    }}

                    padding="32px"
                    maxWidth="900px"
                    className="flex flex-col h-full p-0"
                >
                    <div className="flex-1 overflow-y-auto h-full p-0">
                        <Card psychologist={popupPsychologist} isSelected={true} hideClose={true} inPopup={true} onClose={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.delete('selected_psychologist');
                            window.history.replaceState({}, '', url.toString());
                        }} />
                    </div>
                </FullWidthPopup>
            )}

            {/* Основной контент */}
            {!cardPsychologistName &&
                <div className="mt-[50px] max-lg:mt-[20px] mb-[50px] max-lg:w-[100%] max-lg:px-[20px] w-full flex max-w-[1204px] max-lg:flex-col justify-center max-lg:gap-[20px] gap-[31px]">
                    <aside className="w-full min-lg:max-w-[383px]">
                        <Filter />
                    </aside>
                    <main className="min-lg:max-w-[790px] w-full">
                        <h1 className="text-2xl font-bold text-white pb-[20px] hidden">Подбор психолога и запись на консультацию онлайн</h1>
                        <div style={{ width: '100%' }}>
                            {fullySortedPersons && fullySortedPersons.length > 0 ? (
                                <div
                                    style={{
                                        height: virtualizer.getTotalSize(),
                                        position: 'relative',
                                        width: '100%',
                                    }}
                                >
                                    {virtualizer.getVirtualItems().map((virtualRow) => {
                                        const index = virtualRow.index;
                                        const item = fullySortedPersons[index];
                                        if (!item) return null;
                                        if (!item.id && item.name) {
                                            item.id = `id_${item.name.replace(/\s+/g, '_')}`;
                                        }
                                        // создаём ref для каждой карточки
                                        const cardRef = (el: HTMLDivElement | null) => {
                                            virtualizer.measureElement(el);
                                        };
                                        // функция для обновления высоты карточки
                                        const handleCardExpand = () => {
                                            const el = document.querySelector(`[data-index='${index}']`);
                                            if (el) virtualizer.measureElement(el as HTMLElement);
                                        };
                                        return (
                                            <div
                                                key={virtualRow.key}
                                                data-index={index}
                                                ref={cardRef}
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    transform: `translateY(${virtualRow.start}px)`
                                                }}
                                                id={`psychologist-card-${item.id}`}
                                            >
                                                <Card
                                                    psychologist={item}
                                                    isSelected={filter.selected_psychologist?.id === item.id}
                                                    showBestMatch={hasActiveFilters && index < 3}
                                                    onExpand={handleCardExpand}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <EmptyState />
                            )}
                        </div>
                    </main>
                </div>
            }

            {cardPsychologistName &&
                <div className="min-h-screen w-full flex items-center justify-center p-4">
                    <div className="w-full h-full">
                        <Card psychologist={singleCardPsychologist} isSelected={true} hideClose={true} onClose={() => {
                            const url = new URL(window.location.href);
                            url.searchParams.delete('psychologist');
                            window.history.replaceState({}, '', url.toString());
                        }} />
                    </div>
                </div>
            }
        </>
    );
};