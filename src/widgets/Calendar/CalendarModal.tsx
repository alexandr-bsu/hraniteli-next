import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/shared/ui/Button';
import { toast } from 'sonner';
import Image from 'next/image';

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

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    event?: Event | null;
    onEventUpdate?: (updatedEvent: Event) => void;
    allEvents?: Event[];
    onEventSwitch?: (event: Event) => void;
    psychologistName?: string | null; // Опциональное имя психолога, которое может быть передано из родительского компонента
}

// Функция для нормализации имени (приведение к нижнему регистру и удаление лишних пробелов)
const normalizeName = (name: string): string => {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
};

// Функция для сравнения имен с учетом перестановки имени и фамилии
const compareNames = (name1: string, name2: string): boolean => {
    const normalized1 = normalizeName(name1);
    const normalized2 = normalizeName(name2);
    
    // Прямое сравнение
    if (normalized1 === normalized2) {
        return true;
    }
    
    // Разбиваем имена на части
    const parts1 = normalized1.split(' ').filter(p => p.length > 0);
    const parts2 = normalized2.split(' ').filter(p => p.length > 0);
    
    // Если количество частей не совпадает, это разные люди
    if (parts1.length !== parts2.length) {
        return false;
    }
    
    // Проверяем, являются ли части одинаковыми (с учетом перестановки)
    const sorted1 = [...parts1].sort().join(' ');
    const sorted2 = [...parts2].sort().join(' ');
    
    return sorted1 === sorted2;
};

// Функция для проверки, является ли психолог организатором мероприятия
const isOrganizer = (psychologistName: string, organizatorNames: string): boolean => {
    if (!psychologistName || !organizatorNames) {
        return false;
    }
    
    // Разбиваем список организаторов по запятой
    const organizers = organizatorNames.split(',').map(name => name.trim()).filter(name => name.length > 0);
    
    // Проверяем каждое имя организатора
    return organizers.some(organizerName => compareNames(psychologistName, organizerName));
};

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, event, onEventUpdate, allEvents = [], onEventSwitch, psychologistName }) => {
    const searchParams = useSearchParams();
    const secret = searchParams.get('secret') || ''; // fallback к дефолтному значению

    const [isLoading, setIsLoading] = useState(false);
    const [currentPsychologistName, setCurrentPsychologistName] = useState<string | null>(psychologistName || null);

    // Получаем имя текущего психолога по secret
    useEffect(() => {
        const fetchPsychologistName = async () => {
            if (!secret) {
                return;
            }
            
            try {
                // Используем эндпоинт /get-psycho для получения имени психолога
                const response = await fetch(`https://n8n-v2.hrani.live/webhook/get-psycho?secret=${secret}`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    if (Array.isArray(data) && data.length > 0 && data[0].psychologist) {
                        setCurrentPsychologistName(data[0].psychologist);
                        return;
                    } else if (data.psychologist) {
                        setCurrentPsychologistName(data.psychologist);
                        return;
                    }
                }
            } catch (error) {
                console.error('Ошибка при получении имени психолога:', error);
            }
        };

        if (isOpen && secret && !psychologistName) {
            fetchPsychologistName();
        } else if (psychologistName) {
            setCurrentPsychologistName(psychologistName);
        }
    }, [secret, isOpen, psychologistName]);

    if (!isOpen || !event) return null;

    const showToast = (message: string, type: 'success' | 'error') => {
        if (type === 'success') {
            toast.success(message, {
                position: 'top-left',
                duration: 3000,
            });
        } else {
            toast.error(message, {
                position: 'top-left',
                duration: 3000,
            });
        }
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('https://n8n-v2.hrani.live/webhook/join-to-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    secret: secret,
                    date: event.date,
                    time: event.time,
                    event: event.title
                })
            });

            if (!response.ok) {
                throw new Error('Ошибка при записи на мероприятие');
            }

            const data = await response.json();

            // Проверяем на ограничение доступа
            if (data.error === "access_denied") {
                showToast(data.message || 'Запись на мероприятия сообщества недоступна для вашего профиля 🙏', 'error');
                return;
            }

            // Проверяем на ошибку тарифа супервизий
            if (data.error === "max_supervision_tarif_reached") {
                showToast('К сожалению ваш тариф не включает в себя посещение супервизий', 'error');
                return;
            }

            // Показываем уведомление об успешной записи
            showToast('Вы записались на мероприятие', 'success');

            // Обновляем событие
            const updatedEvent = {
                ...event,
                is_registered: true,
                slot_id: data.id,
                current_participants: event.current_participants + 1
            };

            if (onEventUpdate) {
                onEventUpdate(updatedEvent);
            }

        } catch (error) {
            console.error('Ошибка при записи на мероприятие:', error);
            showToast('Ошибка при записи на мероприятие', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRegistration = async () => {
        if (!event.slot_id) {
            showToast('Ошибка: ID слота не найден', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`https://n8n-v2.hrani.live/webhook/cancel-slot?slot=${event.slot_id}&secret=${secret}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Ошибка при отмене записи');
            }

            // Показываем уведомление об успешной отмене
            showToast('Запись отменена', 'success');

            // Обновляем событие
            const updatedEvent = {
                ...event,
                is_registered: false,
                slot_id: undefined,
                current_participants: Math.max(0, event.current_participants - 1)
            };

            if (onEventUpdate) {
                onEventUpdate(updatedEvent);
            }

        } catch (error) {
            console.error('Ошибка при отмене записи:', error);
            showToast('Ошибка при отмене записи', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateStr: string, timeStr: string) => {
        const date = new Date(dateStr);
        const months = [
            'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
            'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
        ];
        return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} в ${timeStr}`;
    };

    const getModalityColor = (modality: string): string => {
        switch (modality.toLowerCase()) {
            case 'кпт': return 'rgb(252, 211, 77)';
            case 'юнгианство': return 'rgb(139, 92, 246)';
            case 'общие': return 'rgb(16, 185, 129)';
            case 'гештальт': return 'rgb(28, 145, 64)';
            case 'психоанализ': return 'rgb(59, 130, 246)';
            default: return 'rgb(74, 155, 142)';
        }
    };

    const handleNextEventClick = () => {
        if (!event?.next_event || !allEvents.length) return;

        // Ищем событие с названием, соответствующим next_event
        const nextEvent: Event | undefined = allEvents.find((e: Event) => e.title === event.next_event);

        if (nextEvent && onEventSwitch) {
            onEventSwitch(nextEvent);
        }
    };

    // Проверяем, существует ли следующее событие в allEvents
    const hasNextEvent = event?.next_event && allEvents.some((e: Event) => e.title === event.next_event);

    return (
        <div className="slot-grid-container px-5 pt-5 pb-10 min-h-screen gap-10 absolute top-0 left-0 z-1000">
            {/* <Toaster
                position="top-center"
                duration={3000}
                richColors
                closeButton
                toastOptions={{
                    style: {
                        background: '#FFFFFF',
                        color: '#333333',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        minWidth: '300px',
                    },
                }}
            /> */}
            <div style={{ position: 'fixed', zIndex: 9999, inset: '16px', pointerEvents: 'none' }}></div>
            <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="bg-white rounded-[30px] w-full max-w-[660px] mx-5 max-h-[650px] overflow-hidden flex flex-col">
                    <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#D4D4D4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#9A9A9A] [scrollbar-width:thin] [scrollbar-color:#D4D4D4_transparent] pr-2">
                    <div className="bg-white sticky top-0 p-5 border-b border-b-dark-green w-full flex justify-between items-center">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-[#155d5e] font-bold text-2xl">{event.title}</h2>
                            <span
                                className="px-3 py-1 rounded-full text-white font-medium text-sm"
                                style={{ backgroundColor: getModalityColor(event.event_modal_type) }}
                            >
                                {event.event_modal_type}
                            </span>
                        </div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="cursor-pointer w-5 h-5"
                            onClick={onClose}
                        >
                            <path d="m18 6-12 12"></path>
                            <path d="m6 6 12 12"></path>
                        </svg>
                    </div>
                    <div data-name="event-data" className="p-5 flex flex-col gap-4">
                        <div data-group="section">
                            <div className="flex flex-col gap-1">
                                <h3 className="text-[#155d5e] font-bold text-[21px]">
                                    {formatDate(event.date, event.time)}
                                </h3>
                            </div>
                        </div>
                        <div data-group="section">
                            <div className="flex flex-col gap-1">
                                <div 
                                    className="text-[#155d5e] text-base font-normal whitespace-pre-wrap [&_a]:text-[#155d5e] [&_a]:underline [&_a]:hover:text-[#0f4a4b] [&_a]:cursor-pointer"
                                    dangerouslySetInnerHTML={{ __html: event.description }}
                                />
                            </div>
                        </div>
                        <div data-group="section">
                            <div className="flex flex-wrap">
                                <p className="text-[#155d5e] text-base flex items-center flex-wrap">
                                    <span className="font-normal mr-1">
                                        {(() => {
                                            const eventType = (event.event_type || "").toLowerCase();
                                            // Определяем название роли согласно типу мероприятия
                                            if (eventType.includes("супервизи")) {
                                                return "Супервизор: ";
                                            } else if (eventType.includes("интервизи")) {
                                                return "Модератор: ";
                                            } else {
                                                return "Ведущий: ";
                                            }
                                        })()}
                                    </span>
                                    {event.organizator_link ? (
                                        <a
                                            href={event.organizator_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#155d5e] hover:text-[#155d5e] transition-colors inline-flex items-center"
                                            title="Перейти на страницу психолога"
                                        >
                                            <span className="font-bold">{event.organizator_name}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send">
                                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                                <path d="m21.854 2.147-10.94 10.939"></path>
                                            </svg>
                                        </a>
                                    ) : (
                                        <span className="font-bold">{event.organizator_name}</span>
                                    )}
                                </p>
                            </div>
                            <div className="flex flex-col flex-wrap">
                                <p className="text-[#155d5e] text-base">
                                    <span className="font-normal">Участников: </span>
                                    <span className="font-bold">{event.current_participants}/{event.max_participants}</span>
                                </p>
                            </div>
                            {/* Ссылка на встречу - только для зарегистрированных */}
                            {event.event_link && event.is_registered && (
                                <div className="flex flex-col flex-wrap">
                                    <p className="text-[#155d5e] text-base">
                                        <span className="font-normal">Ссылка на мероприятие: </span>
                                        <a
                                            href={event.event_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#155d5e] font-bold"
                                        >
                                            ссылка
                                        </a>
                                    </p>
                                </div>
                            )}

                            {/* Папка с кейсами (только для supervision и intervision и только для зарегистрированных) */}
                            {event.event_folder &&
                                event.is_registered &&
                                (event.event_type === "supervision" ||
                                    event.event_type === "интервизия" ||
                                    event.event_type === "супервизия" ||
                                    event.event_type === "intervision") && (
                                    <div className="flex flex-wrap">
                                        <p className="text-[#155d5e] text-base">
                                            <span className="font-normal">Папка с кейсами: </span>
                                            <a
                                                href={event.event_folder}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#155d5e] font-bold"
                                            >
                                                ссылка
                                            </a>
                                        </p>
                                    </div>
                                )}
                        </div>

                        {/* Следующее мероприятие - показываем только если событие существует в allEvents */}
                        {hasNextEvent && (
                            <div data-group="section">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[#155d5e] text-base">
                                        <span className="font-normal">Следующее мероприятие:</span>{' '}
                                        <span
                                            className="font-bold text-[#155d5e] cursor-pointer hover:underline transition-colors"
                                            onClick={handleNextEventClick}
                                            title="Перейти к следующему мероприятию"
                                        >
                                            {event.next_event}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {!event.is_registered && !event.is_canceled && !(event.current_participants >= event.max_participants) ? (
                                <Button
                                    variant={'primary'}
                                    className="rounded-full"
                                    onClick={handleRegister}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Записываемся...' : 'Записаться'}
                                </Button>
                            ) : event.is_canceled ? (
                                <div className="p-3 rounded-lg bg-red text-white">
                                    Мероприятие отменено
                                </div>
                            ) : event.current_participants >= event.max_participants && !event.is_registered ? (
                                <div className="p-3 rounded-[30px] border-2 border-[#155d5e] text-[#155d5e]">
                                    <div className="space-y-2">
                                        <p>К сожалению вы не можете записаться на это мероприятие, поскольку число желающих его посетить уже достигло максимального количества.</p>
                                        {hasNextEvent && (
                                            <p>Вы можете записаться на аналогичное мероприятие &quot;{event.next_event}&quot; по ссылке выше 🙏</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-[30px] border border-2 border-[#155d5e] text-[#155d5e]">
                                    {(() => {
                                        const eventType = (event.event_type || "").toLowerCase();
                                        const eventName = event.title;
                                        const eventFolder = event.event_folder;

                                        if (eventType.includes("супервизи")) {
                                            return (
                                                <div className="space-y-2">
                                                    <p className="font-semibold">Вы успешно записались на супервизию.</p>
                                                    <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                                    <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной супервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества &quot;Хранители&quot;</a>.</p>
                                                    {eventFolder && (
                                                        <p>Кейсы можете загрузить в папку <a href={event.event_folder || ''} target="_blank" rel="noopener noreferrer" className="underline">по ссылке</a></p>
                                                    )}
                                                </div>
                                            );
                                        } else if (eventType.includes("интервизи")) {
                                            return (
                                                <div className="space-y-2">
                                                    <p className="font-semibold">Вы успешно записались на интервизию.</p>
                                                    <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                                    <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной интервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества &quot;Хранители&quot;</a>.</p>
                                                    {eventFolder && (
                                                        <p>Кейсы можете загрузить в папку <a href={event.event_folder || ''} target="_blank" rel="noopener noreferrer" className="underline">по ссылке</a></p>
                                                    )}
                                                </div>
                                            );
                                        } else if (eventType.includes("лекци") || eventType.includes("семинар") || eventType.includes("вебинар")) {
                                            return (
                                                <div className="space-y-2">
                                                    <p className="font-semibold">Вы успешно записались на {eventType.includes("лекци") ? "лекцию" : eventType.includes("семинар") ? "семинар" : "вебинар"}: {eventName}.</p>
                                                    <p>Ссылка на мероприятие доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                                    <p>Подготовьте вопросы заранее, чтобы максимально эффективно использовать время мероприятия.</p>
                                                </div>
                                            );
                                        } else if (eventType.includes("группов") || eventType.includes("терапи")) {
                                            return (
                                                <div className="space-y-2">
                                                    <p className="font-semibold">Вы успешно записались на групповую терапию: {eventName}.</p>
                                                    <p>Ссылка на мероприятие доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                                    <p>Пожалуйста, подготовьтесь к работе в группе и соблюдайте конфиденциальность участников.</p>
                                                </div>
                                            );
                                        } else if (eventType.includes("мастер-класс") || eventType.includes("воркшоп")) {
                                            return (
                                                <div className="space-y-2">
                                                    <p className="font-semibold">Вы успешно записались на {eventType.includes("мастер-класс") ? "мастер-класс" : "воркшоп"}: {eventName}.</p>
                                                    <p>Ссылка на мероприятие доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                                    <p>Подготовьте материалы для практической работы, если они указаны в описании мероприятия.</p>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div className="space-y-2">
                                                    <p className="font-semibold">Вы успешно записались на мероприятие: {eventName}, которое состоится {formatDate(event.date, event.time)}.</p>
                                                    <p>Ссылка на мероприятие доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            )}

                            {/* Кнопка-ссылка для организатора - показывается только если текущий психолог является организатором */}
                            {event.is_registered && 
                             currentPsychologistName && 
                             isOrganizer(currentPsychologistName, event.organizator_name) &&
                             event.event_link ? (
                                <Button
                                    variant={'outline'}
                                    className="rounded-full"
                                    onClick={() => window.open(event.event_link || '', '_blank')}
                                >
                                    Ссылка для организатора
                                </Button>
                            ) : null}

                            {/* Кнопка отмены записи - показывается только если пользователь записан */}
                            {event.is_registered && !event.is_canceled && (
                                <Button
                                    variant={'primary'}
                                    className="rounded-full"
                                    onClick={handleCancelRegistration}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Отменяем...' : 'Отменить запись'}
                                </Button>
                            )}

                            <Button variant="outline" className="rounded-full" onClick={onClose}>
                                Закрыть
                            </Button>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};