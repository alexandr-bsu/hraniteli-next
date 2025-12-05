import React, { useState, useMemo, useEffect } from 'react';
import CardItem from './CalendarItem';
import { Check } from 'lucide-react';

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

// Функция для получения цвета модальности
const getModalityColor = (modality: string): string => {
    switch (modality.toLowerCase()) {
        case 'кпт': return '#FCD34D';
        case 'юнгианство': return '#8B5CF6';
        case 'общие': return '#10B981';
        case 'гештальт': return '#1c9140';
        case 'психоанализ': return '#3B82F6';
        default: return '#4a9b8e';
    }
};

// Компонент для отображения одной недели
const WeekComponent: React.FC<{ weekDates: Date[]; weekNumber: number; events: Event[] }> = ({ weekDates, weekNumber, events }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

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
        events.forEach(event => {
            const eventDate = new Date(event.date);
            const weekStartDate = new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate());
            const weekEndDate = new Date(weekEnd.getFullYear(), weekEnd.getMonth(), weekEnd.getDate());
            const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

            const isInWeek = eventDateOnly >= weekStartDate && eventDateOnly <= weekEndDate;
            if (weekNumber === 1) { // Логируем только для первой недели
                console.log(`Событие "${event.title}" на ${event.date} (${eventDateOnly.toDateString()}) - в неделе: ${isInWeek}`);
            }
        });

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
                    <span className='text-xs font-bold text-[#155d5e]'>Неделя {weekNumber}</span>
                </div>
                {weekDates.map((date, index) => (
                    <div key={index} className={`flex-1 min-w-[300px] ${index < 6 ? 'border-r border-[#333]' : ''} flex items-center justify-center p-2`}>
                        <div className='text-xs font-bold py-2 bg-[#4a9b8e] text-white flex w-full justify-center items-center rounded-full'>
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
                                            <div key={event.id} onClick={openModal}>
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
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Загружаем события из API
    useEffect(() => {
        const fetchEvents = async () => {
            console.log('Начинаем загрузку событий...');
            try {
                const response = await fetch('https://n8n-v2.hrani.live/webhook/get-all-events?secret=6a656816-9ac1-4d98-8613-ca2edb067ca4');
                console.log('Ответ получен:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Данные получены:', data.length, 'событий');
                setEvents(data);
            } catch (error) {
                console.error('Ошибка загрузки событий:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

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
            <div data-name="container">
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
                    <WeekComponent key={index} weekDates={weekDates} weekNumber={index + 1} events={events} />
                ))}

                {/* Плавающий элемент в правом верхнем углу */}
                <div className="fixed top-20 right-4 bg-[#fbfbfb] rounded-[30px] p-6 flex flex-col gap-4 shadow-lg z-50 border border-[#333333]">
                    <ul className='flex flex-col gap-2'>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#8B5CF6] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff' />
                            </span>
                            Юнгианство
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#FCD34D] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff' />
                            </span>
                            КПТ
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#1c9140] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff' />
                            </span>
                            Гештальт
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#3B82F6] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff' />
                            </span>
                            Психоанализ
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#10B981] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff' />
                            </span>
                            Общие
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};