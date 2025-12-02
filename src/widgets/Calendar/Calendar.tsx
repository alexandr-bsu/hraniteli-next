import React from 'react';

export const Calendar: React.FC = () => {
    return (
        <div data-name="container">

            <div className='sticky top-0 z-20'>
                <div data-name="header" className='w-full h-6 bg-[#fbfbfb] flex items-center border-b border-[#333] ' >
                    <span className='h-full min-w-[150px] flex items-center justify-center text-xs font-bold border-r border-[#333]'></span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[19px]'>ПН</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[19px]'>ВТ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[19px]'>СР</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[19px]'>ЧТ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[19px]'>ПТ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold border-r border-[#333] text-[#155d5e] text-[19px]'>СБ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#155d5e] text-[19px]'>ВС</span>
                </div>
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-dashed  border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6 z-10'>
                    <div className='min-w-[150px] border-r border-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>1 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>2 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>3 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>4 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>5 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>6 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>7 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                        <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[19px]' >10:00</div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#8B5CF6] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Юнгианство</div>
                                <div className='text-xs opacity-90'>Знакомство с коллегами, обсуждение планов</div>
                            </div>
                            <div className='text-xs opacity-80'>Алена Петрова</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#FCD34D] rounded-md p-3 flex flex-col justify-between text-gray-800'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Рефлексивная группа</div>
                                <div className='text-xs opacity-90'>Родители-психологи с коллегами</div>
                            </div>
                            <div className='text-xs opacity-80'>Зоя Карелидзе</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                    <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[19px]' >12:00</div>
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
                    <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[19px]' >13:00</div>
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
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd]  border-dashed border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6 z-10'>
                    <div className='min-w-[150px] border-r border-[#333]'>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>8 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>9 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>10 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>11 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>12 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>13 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>14 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                    <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[19px]' >10:00</div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#8B5CF6] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Книжная встреча</div>
                                <div className='text-xs opacity-90'>«П. Экзюпери "Маленький принц"»</div>
                            </div>
                            <div className='text-xs opacity-80'>Татьяна Кудашова</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#1c9140] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Юнгианская встреча</div>
                                <div className='text-xs opacity-90'>«П. Экзюпери "Маленький принц"»</div>
                            </div>
                            <div className='text-xs opacity-80'>Татьяна Кудашова</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4  font-bold text-[#155d5e] text-[19px]' >12:00</div></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#1c9140] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Тренинг первой сессии</div>
                                <div className='text-xs opacity-90'>3 активных участника</div>
                            </div>
                            <div className='text-xs opacity-80'>Юлия Ким</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Третья строка времени */}
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[19px]' >13:00</div></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>
            </div>

             <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd]  border-dashed border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6 z-10'>
                    <div className='min-w-[150px] border-r border-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>1 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>2 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>3 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>4 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>5 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>6 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>7 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                        <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[19px]' >10:00</div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#8B5CF6] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Юнгианство</div>
                                <div className='text-xs opacity-90'>Знакомство с коллегами, обсуждение планов</div>
                            </div>
                            <div className='text-xs opacity-80'>Алена Петрова</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#FCD34D] rounded-md p-3 flex flex-col justify-between text-gray-800'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Рефлексивная группа</div>
                                <div className='text-xs opacity-90'>Родители-психологи с коллегами</div>
                            </div>
                            <div className='text-xs opacity-80'>Зоя Карелидзе</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                    <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[19px]' >12:00</div>
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
                    <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[19px]' >13:00</div>
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
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd]  border-dashed border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6 z-10'>
                    <div className='min-w-[150px] border-r border-[#333]'>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>8 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>9 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>10 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>11 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>12 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>13 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>14 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                    <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[19px]' >10:00</div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#8B5CF6] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Книжная встреча</div>
                                <div className='text-xs opacity-90'>«П. Экзюпери "Маленький принц"»</div>
                            </div>
                            <div className='text-xs opacity-80'>Татьяна Кудашова</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#1c9140] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Юнгианская встреча</div>
                                <div className='text-xs opacity-90'>«П. Экзюпери "Маленький принц"»</div>
                            </div>
                            <div className='text-xs opacity-80'>Татьяна Кудашова</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-dashed border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4  font-bold text-[#155d5e] text-[19px]' >12:00</div></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <div className='h-[100px] bg-[#1c9140] rounded-md p-3 flex flex-col justify-between text-white'>
                            <div>
                                <div className='font-bold text-sm mb-1'>Тренинг первой сессии</div>
                                <div className='text-xs opacity-90'>3 активных участника</div>
                            </div>
                            <div className='text-xs opacity-80'>Юлия Ким</div>
                        </div>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Третья строка времени */}
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[19px]' >13:00</div></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>
            </div>

        

            

            {/* Плавающий элемент в правом нижнем углу */}
            <div className="fixed top-16 right-4 bg-[#fbfbfb] rounded-md p-6 flex flex-col gap-4 shadow-lg z-50 border border-[#333333]">
                {/* Содержимое плавающего элемента */}
                <ul className='flex flex-col gap-2'>
                    <li className="flex gap-4 items-center">
                        <span className='rounded-md p-2 bg-[#8B5CF6] h-6 w-6 flex items-center justify-center'>

                        </span>

                        Юнгианство
                    </li>

                    <li className="flex gap-4 items-center">
                        <span className='rounded-md p-2 bg-[#FCD34D] h-6 w-6'></span>
                        Кпт
                    </li>

                    <li className="flex gap-4 items-center">
                        <span className='rounded-md p-2 bg-[#1c9140] h-6 w-6'></span>
                        Гештальт
                    </li>

                    <li className="flex gap-4 items-center">
                        <span className='rounded-md p-2 bg-[#3B82F6] h-6 w-6'></span>
                        Психоанализ
                    </li>

                    <li className="flex gap-4 items-center">
                        <span className='rounded-md p-2 bg-[#10B981] h-6 w-6'></span>
                        Общие
                    </li>

                </ul>
            </div>
        </div>
    );
};