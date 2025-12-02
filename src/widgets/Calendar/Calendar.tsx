import React from 'react';

export const Calendar: React.FC = () => {
    return (
        <div data-name="container">
            <div data-name="header" className='w-full h-6 bg-[#d9d9d9] flex items-center border-b border-[#333]'>
                <span className='w-[150px] h-full flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>Время</span>
                <span className='flex-1 h-full flex items-center justify-center text-xs font-bold text-[#333old text-[#333] border-r border-[#333]'>ПН</span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ВТ</span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>СР</span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ЧТ</span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>ПТ</span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'>СБ</span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333]'>ВС</span>
            </div>

            <div data-name="days-nav" className='w-full h-6 bg-[#d9d9d9] flex items-center border-b border-[#333]'>
                <span className='w-[150px] h-full flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333] border-r border-[#333]'></span>
                <span className='flex-1 h-full min-w-[300px] flex items-center justify-center text-xs font-bold text-[#333]'></span>
            </div>

            <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-b'>
                {/* Строка с датами */}
                <div className='w-full flex'>
                    <div className='w-[150px] border-r border-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                <div className='w-full flex '>
                    <div className='w-[150px] border-r border-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                <div className='w-full flex'>
                    <div className='w-[150px] border-r border-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
                    <div data-name='slot-time' className='w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333]'></div>
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
        </div>
    );
};