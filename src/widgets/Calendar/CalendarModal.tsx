import React from 'react';

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
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, event }) => {
    if (!isOpen || !event) return null;

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

    return (
        <div className="slot-grid-container px-5 pt-5 pb-10 min-h-screen gap-10 absolute top-0 left-0 z-1000">
            <div style={{ position: 'fixed', zIndex: 9999, inset: '16px', pointerEvents: 'none' }}></div>
            <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="bg-white rounded-[30px] w-full max-w-[660px] mx-5 max-h-[650px] overflow-y-auto">
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
                                <p className="text-[#155d5e] text-base font-normal">
                                    {event.description}
                                </p>
                            </div>
                        </div>
                        <div data-group="section">
                            <div className="flex flex-wrap">
                                <p className="text-[#155d5e] text-base flex items-center flex-wrap">
                                    <span className="font-normal mr-1">Супервизор: </span>
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
                                </p>
                            </div>
                            <div className="flex flex-col flex-wrap">
                                <p className="text-[#155d5e] text-base">
                                    <span className="font-normal">Участников: </span> 
                                    <span className="font-bold">{event.current_participants}/{event.max_participants}</span>
                                </p>
                            </div>
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
                        </div>
                        <div className="flex flex-col gap-2">
                            {event.is_registered ? (
                                <div className="p-3 rounded-[30px] border border-2 border-green text-[#155d5e]">
                                    <div className="space-y-2">
                                        <p className="font-semibold">Вы успешно записались на супервизию.</p>
                                        <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                        <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной супервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества Хранители</a>.</p>
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex gap-2">
                                {event.is_registered ? (
                                    <button className="font-normal transition-colors bg-[#155d5e] text-white hover:bg-dark-green px-[20px] py-[12px] text-[16px] rounded-full">
                                        Отменить запись
                                    </button>
                                ) : (
                                    <button className="font-normal transition-colors bg-[#155d5e] text-white hover:bg-dark-green px-[20px] py-[12px] text-[16px] rounded-full">
                                        Записаться
                                    </button>
                                )}
                                <button 
                                    onClick={onClose}
                                    className="font-normal transition-colors border border-gray text-[#155d5e] hover:bg-gray px-[20px] py-[12px] text-[16px] rounded-full"
                                >
                                    Закрыть
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};