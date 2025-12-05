import React, { useState, useMemo } from 'react';
import CardItem from './CalendarItem';
import { Check } from 'lucide-react';

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
const WeekComponent: React.FC<{ weekDates: Date[]; weekNumber: number }> = ({ weekDates, weekNumber }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => setIsModalOpen(true);

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

            {/* Временные слоты */}
            {weekNumber === 1 && (
                <>
                    {/* Первая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]'>13:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'"Кто я?" - теплица проф.идентичности'} counter={'Участников: 0/10'} author={'Алёна Перова'} modality='Общие' />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Вторая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>14:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Супервизия Юнг.'} counter={'Участников: 2/10'} author={'Анна Бородкина'} modality='Юнгианство' is_registered />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Третья строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>18:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <div onClick={openModal}>
                                <CardItem title={'Супервизия КПТ'} counter={'Участников: 1/10'} author={'Елена Греченко'} modality='КПТ' />
                            </div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Четвёртая строка времени */}
                    <div className='w-full flex'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>20:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Исследование личного мифа'} counter={'Участников: 0/10'} author={'Валентина Ким, Нина Дятловская'} modality='Юнгианство' />
                        </div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>
                </>
            )}

            {weekNumber === 2 && (
                <>
                    {/* Первая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]'>09:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Киноклуб'} counter={'Участников: 1/10'} author={'Майя Филиппова'} modality='Общие' />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Вторая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>14:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Рефлексивная группа КПТ'} counter={'Участников: 1/10'} author={'Юлия Ким'} modality='КПТ' is_registered />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Третья строка времени */}
                    <div className='w-full flex'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>19:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Книжный Клуб'} counter={'Участников: 1/10'} author={'Юлия Ким'} modality='КПТ' />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>
                </>
            )}

            {weekNumber === 3 && (
                <>
                    {/* Первая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]'>13:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'"Кто я?" - теплица проф.идентичности'} counter={'Участников: 3/10'} author={'Алёна Перова'} modality='Общие' is_registered={true} />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Вторая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>12:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <div className='h-[100px] bg-[#FCD34D] rounded-md p-3 flex flex-col justify-between text-gray-800'>
                                <div>
                                    <div className='font-bold text-sm mb-1'>Супервизия КПТ</div>
                                    <div className='text-xs opacity-90'>Разбор 2-х случаев</div>
                                </div>
                                <div className='text-xs opacity-80'>Елена Гриценко</div>
                            </div>
                            <div className='h-[100px] bg-[#FCD34D] rounded-md p-3 flex flex-col justify-between text-gray-800'>
                                <div>
                                    <div className='font-bold text-sm mb-1'>Интервизия КПТ</div>
                                    <div className='text-xs opacity-90'>Разбор 2-х случаев</div>
                                </div>
                                <div className='text-xs opacity-80'>Юлия Ким</div>
                            </div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <div className='h-[100px] bg-[#FCD34D] rounded-md p-3 flex flex-col justify-between text-gray-800'>
                                <div>
                                    <div className='font-bold text-sm mb-1'>Рефлексивная группа КПТ</div>
                                    <div className='text-xs opacity-90'>Родители-психологи с коллегами</div>
                                </div>
                                <div className='text-xs opacity-80'>Юлия Ким</div>
                            </div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Третья строка времени */}
                    <div className='w-full flex'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>13:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <div className='h-[100px] bg-[#3B82F6] rounded-md p-3 flex flex-col justify-between text-white'>
                                <div>
                                    <div className='font-bold text-sm mb-1'>Группа самоуправления</div>
                                    <div className='text-xs opacity-90'>Лидия Казанцева</div>
                                </div>
                            </div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>
                </>
            )}

            {weekNumber === 4 && (
                <>
                    {/* Первая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]'>10:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Вторая строка времени */}
                    <div className='w-full flex'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]'>15:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>
                </>
            )}
        </div>
    );
};

export const Calendar: React.FC = () => {
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
                    <WeekComponent key={index} weekDates={weekDates} weekNumber={index + 1} />
                ))}

                {/* Плавающий элемент в правом верхнем углу */}
                <div className="fixed top-20 right-4 bg-[#fbfbfb] rounded-[30px] p-6 flex flex-col gap-4 shadow-lg z-50 border border-[#333333]">
                    <ul className='flex flex-col gap-2'>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#8B5CF6] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff'/>
                            </span>
                            Юнгианство
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#FCD34D] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff'/>
                            </span>
                            КПТ
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#1c9140] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff'/>
                            </span>
                            Гештальт
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#3B82F6] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff'/>
                            </span>
                            Психоанализ
                        </li>
                        <li className="flex gap-4 items-center">
                            <span className='rounded-md bg-[#10B981] h-6 w-6 flex items-center justify-center'>
                                <Check width={16} height={16} color='#fff'/>
                            </span>
                            Общие
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};