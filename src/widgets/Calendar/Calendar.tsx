import React from 'react';

export const Calendar: React.FC = () => {
    return (
        <div data-name="container">

            <div className='sticky top-0 z-10'>
                <div data-name="header" className='w-full h-6 bg-[#d9d9d9] flex items-center border-b border-[#333]'>
                    <span className='h-full min-w-[150px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>Время</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ПН</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ВТ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>СР</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ЧТ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ПТ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>СБ</span>
                    <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333]'>ВС</span>
                </div>
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6'>
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
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'><span className='h-[100px] bg-[#d9d9d9] rounded-md'></span></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Третья строка времени */}
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6'>
                    <div className='min-w-[150px] border-r border-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>8 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>9 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>10 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>11 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>12 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>13 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>14 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'><span className='h-[100px] bg-[#d9d9d9] rounded-md'></span></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Третья строка времени */}
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6'>
                    <div className='min-w-[150px] border-r border-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>15 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>16 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>17 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>18 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>19 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>20 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>21 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'><span className='h-[100px] bg-[#d9d9d9] rounded-md'></span></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Третья строка времени */}
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-b'>
                {/* Строка с датами */}
                <div className='w-full flex sticky top-6'>
                    <div className='min-w-[150px] border-r border-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>15 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>16 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>17 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>18 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>19 декабря</div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>20 декабря</div>
                    <div className='flex-1 min-w-[300px] flex items-center justify-center text-xs font-bold py-1 bg-[#4a9b8e] text-white'>21 декабря</div>
                </div>

                {/* Первая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Вторая строка времени */}
                <div className='w-full flex border-b border-[#ddd]'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'><span className='h-[100px] bg-[#d9d9d9] rounded-md'></span></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>

                {/* Третья строка времени */}
                <div className='w-full flex'>
                    <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                        <span className='h-[100px] bg-[#d9d9d9] rounded-md'></span>
                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                    </div>
                    <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                </div>
            </div>

            {/* Плавающий элемент в правом нижнем углу */}
            <div className="fixed top-16 right-4 bg-white rounded-md p-6 flex flex-col gap-4 shadow-lg z-50 border border-[#333333]">
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