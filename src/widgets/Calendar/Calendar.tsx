import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CardItem from './CalendarItem';
import { CalendarModal } from './CalendarModal';
import { Check } from 'lucide-react';
import { useDragToScroll } from '../../hooks/useDragToScroll';
import styles from './Calendar.module.css';

// Типы для API данных
interface Event {
    id: string;
    title: string;
    event_modal_type: string;
    event_type: string;
    description: string;
    organizator_type: string;
    organizator_name: string;
    organizator_link: string;
    max_participants: number;
    date: string;
    next_event: string | null;
    is_canceled: boolean;
    event_link: string;
    is_published: boolean;
    time: string;
    repeat_period: string | null;
    last_planed_date: string | null;
    event_folder: string | null;
    root_event: string | null;
    current_participants: number;
    allow_connect: boolean;
    is_registered?: boolean;
    slot_id?: string;
}

interface Slot {
    id: string;
    status: string;
    event: string | null;
    event_modal_type: string | null;
    slot_over_event: boolean;
}

interface DaySlots {
    date: string;
    slots: { [time: string]: Slot[] };
    day_name: string;
    pretty_date: string;
}

interface SlotsResponse {
    items: DaySlots[];
    date: string;
}

// Функция для получения понедельника текущей недели
const getMonday = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

// Функция для получения дат недели начиная с понедельника
const getWeekDates = (startDate: Date): Date[] => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dates.push(date);
    }
    return dates;
};

// Функция для форматирования даты
const formatDate = (date: Date): string => {
    const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
};



// Компонент для отображения одной недели
const WeekComponent: React.FC<{
    weekDates: Date[];
    weekNumber: number;
    events: Event[];
    onEventClick: (event: Event) => void;
}> = ({ weekDates, weekNumber, events, onEventClick }) => {

    // Фильтруем события для текущей недели
    const weekEvents = useMemo(() => {
        const weekStart = weekDates[0];
        const weekEnd = weekDates[6];

        const filtered = events.filter(event => {
            const eventDate = new Date(event.date);
            const weekStartDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
            const weekEndDate = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

            return eventDateOnly >= weekStartDate && eventDateOnly <= weekEndDate;
        });

        console.log(`Неделя ${weekNumber}: ${weekStart.toDateString()} - ${weekEnd.toDateString()}`);
        console.log(`Найдено событий для недели ${weekNumber}:`, filtered.length);

        // Логируем все события для отладки
        if (weekNumber === 1) {
            console.log('Всего событий для проверки:', events.length);
            events.forEach(event => {
                const eventDate = new Date(event.date);
                const weekStartDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
                const weekEndDate = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());
                const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

                const isInWeek = eventDateOnly >= weekStartDate && eventDateOnly <= weekEndDate;
                console.log(`Событие "${event.title}" на ${event.date}`);
                console.log(`  Дата события: ${eventDateOnly.toDateString()}`);
                console.log(`  Начало недели: ${weekStartDate.toDateString()}`);
                console.log(`  Конец недели: ${weekEndDate.toDateString()}`);
                console.log(`  В неделе: ${isInWeek}`);
                console.log('---');
            });
        }

        return filtered;
    }, [weekDates, events, weekNumber]);

    // Получаем уникальные времена для этой недели и сортируем их
    const weekTimes = useMemo(() => {
        const times = Array.from(new Set(weekEvents.map(event => event.time)));
        return times.sort((a, b) => {
            const timeA = parseInt(a.split(':')[0]) * 60 + parseInt(a.split(':')[1]);
            const timeB = parseInt(b.split(':')[0]) * 60 + parseInt(b.split(':')[1]);
            return timeA - timeB;
        });
    }, [weekEvents]);

    // Группируем события по дате и времени
    const eventsByDateTime = useMemo(() => {
        const grouped: { [key: string]: Event[] } = {};
        weekEvents.forEach(event => {
            const key = `${event.date}-${event.time}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(event);
        });

        console.log(`Неделя ${weekNumber} - сгруппированные события:`, grouped);
        return grouped;
    }, [weekEvents, weekNumber]);

    // Функция для получения событий для конкретной даты и времени
    const getEventsForDateTime = (date: Date, time: string): Event[] => {
        const dateStr = date.toISOString().split('T')[0];
        const key = `${dateStr}-${time}`;
        const events = eventsByDateTime[key] || [];

        if (events.length > 0) {
            console.log(`Найдены события для ${dateStr} в ${time}:`, events.length);
        }

        return events;
    };

    return (
        <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-dashed border-b'>
            {/* Строка с датами */}
            <div className='w-full flex sticky top-6 z-10'>
                <div className='min-w-[150px] border-r border-[#333] flex items-center justify-center'>
                    {/* <span className='text-xs font-bold text-[#155d5e]'>Неделя {weekNumber}</span> */}
                </div>
                {weekDates.map((date, index) => (
                    <div key={index} className={`flex-1 min-w-[300px] ${index < 6 ? 'border-r border-[#333]' : ''} flex items-center justify-center p-2`}>
                        <div className='text-xs font-bold py-2 bg-[#155d5e] text-white flex w-full justify-center items-center rounded-full'>
                            {formatDate(date)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Динамические временные слоты */}
            {weekTimes.length === 0 ? (
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-8'>
                        <div className='text-gray-400'>Нет событий</div>
                    </div>
                    {weekDates.map((_, dayIndex) => (
                        <div key={dayIndex} className={`flex-1 min-w-[300px] ${dayIndex < 6 ? 'border-r border-[#333]' : ''} p-4 flex flex-col gap-2 text-xs font-medium text-[#333]`}>
                        </div>
                    ))}
                </div>
            ) : (
                weekTimes.map((time, timeIndex) => (
                    <div key={time} className={`w-full flex ${timeIndex < weekTimes.length - 1 ? 'border-b border-dashed border-[#ddd]' : ''}`}>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className={`rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px] ${timeIndex === 0 ? '-mt-6' : ''}`}>
                                {time}
                            </div>
                        </div>
                        {weekDates.map((date, dayIndex) => {
                            const dayEvents = getEventsForDateTime(date, time);
                            return (
                                <div key={dayIndex} className={`flex-1 min-w-[300px] ${dayIndex < 6 ? 'border-r border-[#333]' : ''} p-4 flex flex-col gap-2 text-xs font-medium text-[#333]`}>
                                    {dayEvents.map((event) => {
                                        console.log('Рендерим событие:', event.title, 'в ячейке');
                                        return (
                                            <div key={event.id} onClick={() => onEventClick(event)}>
                                                <CardItem
                                                    title={event.title}
                                                    counter={`Участников: ${event.current_participants}/${event.max_participants}`}
                                                    author={event.organizator_name}
                                                    modality={
                                                        event.event_modal_type === 'кпт' ? 'КПТ' :
                                                            event.event_modal_type === 'юнгианство' ? 'Юнгианство' :
                                                                event.event_modal_type === 'общие' ? 'Общие' :
                                                                    event.event_modal_type === 'гештальт' ? 'Гештальт' :
                                                                        event.event_modal_type === 'психоанализ' ? 'Психоанализ' :
                                                                            'Общие'
                                                    }
                                                    is_registered={event.is_registered || false}
                                                />
                                            </div>
                                        );
                                    })}

                                </div>
                            );
                        })}
                    </div>
                ))
            )}
        </div>
    );
};

export const Calendar: React.FC = () => {
    const searchParams = useSearchParams();
    const secret = searchParams.get('secret') || ''; // fallback к дефолтному значению

    const [events, setEvents] = useState<Event[]>([]);
    const [slots, setSlots] = useState<SlotsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['юнгианство', 'кпт', 'гештальт', 'психоанализ', 'общие']);

    // Хук для drag-to-scroll функциональности
    const scrollRef = useDragToScroll({
        direction: 'horizontal',
        sensitivity: 1,
        disabled: loading // Отключаем хук пока идет загрузка
    });

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
    };

    const handleEventUpdate = (updatedEvent: Event) => {
        setEvents(prevEvents =>
            prevEvents.map(event =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        );
        setSelectedEvent(updatedEvent);
    };

    const handleEventSwitch = (newEvent: Event) => {
        setSelectedEvent(newEvent);
    };

    const handleFilterToggle = (filterType: string) => {
        setSelectedFilters(prev =>
            prev.includes(filterType)
                ? prev.filter(f => f !== filterType)
                : [...prev, filterType]
        );
    };

    // Функция для сопоставления событий со слотами
    const matchEventsWithSlots = (events: Event[], slotsData: SlotsResponse): Event[] => {
        return events.map(event => {
            // Ищем слот для этого события
            const daySlots = slotsData.items.find(day => day.date === event.date);
            if (!daySlots) {
                return { ...event, is_registered: false };
            }

            const timeSlots = daySlots.slots[event.time];
            if (!timeSlots || timeSlots.length === 0) {
                return { ...event, is_registered: false };
            }

            // Ищем слот с таким же названием события
            const matchingSlot = timeSlots.find(slot =>
                slot.event === event.title &&
                slot.status === 'Забронирован'
            );

            if (matchingSlot) {
                console.log(`Найдено соответствие: событие "${event.title}" забронировано в слоте ${matchingSlot.id}`);
                return {
                    ...event,
                    is_registered: true,
                    slot_id: matchingSlot.id
                };
            }

            return { ...event, is_registered: false };
        });
    };

    // Загружаем события и слоты из API
    useEffect(() => {
        const fetchData = async () => {
            console.log('Начинаем загрузку данных...');
            try {
                // Вычисляем диапазон дат для 4 недель
                const today = new Date();
                const monday = getMonday(today);
                const endDate = new Date(monday);
                endDate.setDate(monday.getDate() + 27); // 4 недели = 28 дней

                const startDateStr = monday.toISOString().split('T')[0];
                const endDateStr = endDate.toISOString().split('T')[0];

                // Загружаем события и слоты параллельно
                const [eventsResponse, slotsResponse] = await Promise.all([
                    fetch(`https://n8n-v2.hrani.live/webhook/get-all-events?secret=${secret}`),
                    fetch(`https://n8n-v2.hrani.live/webhook/get-slot?startDate=${startDateStr}&endDate=${endDateStr}&secret=${secret}`)
                ]);

                console.log('Ответы получены:', eventsResponse.status, slotsResponse.status);

                if (!eventsResponse.ok || !slotsResponse.ok) {
                    throw new Error(`HTTP error! events: ${eventsResponse.status}, slots: ${slotsResponse.status}`);
                }

                const eventsData = await eventsResponse.json();
                const slotsData = await slotsResponse.json();

                console.log('Сырые данные событий:', eventsData);
                console.log('Сырые данные слотов:', slotsData);

                // Проверяем структуру данных
                if (!Array.isArray(eventsData)) {
                    console.error('eventsData не является массивом:', eventsData);
                    throw new Error('Неверный формат данных событий');
                }

                if (!Array.isArray(slotsData) || !slotsData[0] || !slotsData[0].items || !Array.isArray(slotsData[0].items)) {
                    console.error('slotsData имеет неверную структуру:', slotsData);
                    throw new Error('Неверный формат данных слотов');
                }

                const slotsItems = slotsData[0];
                console.log('Данные получены:', eventsData.length, 'событий,', slotsItems.items.length, 'дней со слотами');
                console.log('Все события:', eventsData.map(e => ({ title: e.title, date: e.date, time: e.time })));

                // Сопоставляем события со слотами
                const eventsWithSlots = matchEventsWithSlots(eventsData, slotsItems);

                setEvents(eventsWithSlots);
                setSlots(slotsItems);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [secret]);

    // Фильтруем события по выбранным модальностям
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const modalType = event.event_modal_type.toLowerCase();
            return selectedFilters.includes(modalType);
        });
    }, [events, selectedFilters]);

    // Вычисляем даты для всех четырех недель
    const allWeeks = useMemo(() => {
        const today = new Date();
        const monday = getMonday(today);
        const weeks = [];

        for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
            const weekStart = new Date(monday);
            weekStart.setDate(monday.getDate() + (weekOffset * 7));
            weeks.push(getWeekDates(weekStart));
        }

        return weeks;
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Загрузка событий...</div>;
    }

    return (
        <>
            <CalendarModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                event={selectedEvent}
                onEventUpdate={handleEventUpdate}
                allEvents={filteredEvents}
                onEventSwitch={handleEventSwitch}
            />

            <div data-name="container">
                {/* Контейнер с горизонтальным скроллом */}
                <div
                    ref={scrollRef}
                    className={`overflow-x-auto overflow-y-visible ${styles.scrollContainer}`}
                >
                    <div className="min-w-[2250px]"> {/* Минимальная ширина для 7 колонок по 300px + 150px для времени */}
                        <div className='sticky top-0 z-20'>
                            <div data-name="header" className='w-full h-6 bg-[#fbfbfb] flex items-center border-b border-[#333]'>
                                <span className='h-full min-w-[150px] flex items-center justify-center text-xs font-bold border-r border-[#333]'></span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[21px]'>ПН</span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[21px]'>ВТ</span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[21px]'>СР</span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[21px]'>ЧТ</span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[21px]'>ПТ</span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[21px]'>СБ</span>
                                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#155d5e] text-[21px]'>ВС</span>
                            </div>
                        </div>

                        {/* Отображаем все четыре недели */}
                        {allWeeks.map((weekDates, index) => (
                            <WeekComponent
                                key={index}
                                weekDates={weekDates}
                                weekNumber={index + 1}
                                events={filteredEvents}
                                onEventClick={handleEventClick}
                            />
                        ))}
                    </div>
                </div>

                {/* Плавающий элемент в правом верхнем углу */}
                <div className="fixed top-20 right-4 bg-[#fbfbfb] rounded-[30px] p-6 flex flex-col gap-4 shadow-lg z-50 border border-[#333333]">
                    <ul className='flex flex-col gap-2'>
                        <li className="flex gap-4 items-center cursor-pointer" onClick={() => handleFilterToggle('юнгианство')}>
                            <span className={`rounded-md h-6 w-6 flex items-center justify-center transition-all duration-200 ${selectedFilters.includes('юнгианство')
                                ? 'bg-[#8B5CF6]'
                                : 'bg-gray-300'
                                }`}>
                                {selectedFilters.includes('юнгианство') && (
                                    <Check width={16} height={16} color='#fff' />
                                )}
                            </span>
                            Юнгианство
                        </li>
                        <li className="flex gap-4 items-center cursor-pointer" onClick={() => handleFilterToggle('кпт')}>
                            <span className={`rounded-md h-6 w-6 flex items-center justify-center transition-all duration-200 ${selectedFilters.includes('кпт')
                                ? 'bg-[#FCD34D]'
                                : 'bg-gray-300'
                                }`}>
                                {selectedFilters.includes('кпт') && (
                                    <Check width={16} height={16} color='#fff' />
                                )}
                            </span>
                            КПТ
                        </li>
                        <li className="flex gap-4 items-center cursor-pointer" onClick={() => handleFilterToggle('гештальт')}>
                            <span className={`rounded-md h-6 w-6 flex items-center justify-center transition-all duration-200 ${selectedFilters.includes('гештальт')
                                ? 'bg-[#1c9140]'
                                : 'bg-gray-300'
                                }`}>
                                {selectedFilters.includes('гештальт') && (
                                    <Check width={16} height={16} color='#fff' />
                                )}
                            </span>
                            Гештальт
                        </li>
                        <li className="flex gap-4 items-center cursor-pointer" onClick={() => handleFilterToggle('психоанализ')}>
                            <span className={`rounded-md h-6 w-6 flex items-center justify-center transition-all duration-200 ${selectedFilters.includes('психоанализ')
                                ? 'bg-[#3B82F6]'
                                : 'bg-gray-300'
                                }`}>
                                {selectedFilters.includes('психоанализ') && (
                                    <Check width={16} height={16} color='#fff' />
                                )}
                            </span>
                            Психоанализ
                        </li>
                        <li className="flex gap-4 items-center cursor-pointer" onClick={() => handleFilterToggle('общие')}>
                            <span className={`rounded-md h-6 w-6 flex items-center justify-center transition-all duration-200 ${selectedFilters.includes('общие')
                                ? 'bg-[#10B981]'
                                : 'bg-gray-300'
                                }`}>
                                {selectedFilters.includes('общие') && (
                                    <Check width={16} height={16} color='#fff' />
                                )}
                            </span>
                            Общие
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};