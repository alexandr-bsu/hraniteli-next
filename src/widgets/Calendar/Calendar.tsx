import React, { useState } from 'react';
import CardItem from './CalendarItem';

export const Calendar: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>


            {/* <div data-name="data-groups" className="slot-grid-container px-5 pt-5 pb-10 min-h-screen gap-10 absolute top-0 left-0 z-1000">
                <div style={{ position: 'fixed', zIndex: 9999, inset: '16px', pointerEvents: 'none' }}></div>
                <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
                    <div className="bg-white rounded-[30px] w-full max-w-[660px] mx-5 max-h-[650px] overflow-y-auto">
                        <div className="bg-white sticky top-0 p-5 border-b border-b-dark-green w-full flex justify-between items-center">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h2 className="text-[#155d5e] font-bold text-2xl">Супервизия КПТ</h2>
                                <span className="px-3 py-1 rounded-full text-white font-medium text-sm" style={{ backgroundColor: 'rgb(252, 211, 77)' }}>кпт</span>
                            </div>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer w-5 h-5">
                                <path d="m18 6-12 12"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </div>
                        <div data-name="event-data" className="p-5 flex flex-col gap-4">
                            <div data-group="section">
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-[#155d5e] font-bold text-[21px]">3 декабря 2025 в 18:00</h3>
                                </div>
                            </div>
                            <div data-group="section">
                                <div className="flex flex-col gap-1">
                                    <p className="text-[#155d5e] text-base font-normal">На супервизии можно выносить:
                                        1) кейсы по клиентам, в том числе по 1 сессии
                                        2) список вопросов по практике, который волнует сейчас
                                        3) любой другой материал и вопросы супервизору
                                    </p>
                                </div>
                            </div>
                            <div data-group="section">
                                <div className="flex flex-wrap">
                                    <p className="text-[#155d5e] text-base flex items-center flex-wrap">
                                        <span className="font-normal mr-1">Супервизор: </span>
                                        <a href="https://https://t.me/c/2404791398/937/965" target="_blank" rel="noopener noreferrer" className="text-[#155d5e] hover:text-[#155d5e] transition-colors inline-flex items-center" title="Перейти на страницу психолога">
                                            <span className="font-bold">Елена Греченко</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-send-icon lucide-send">
                                                <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path>
                                                <path d="m21.854 2.147-10.94 10.939"></path>
                                            </svg>
                                        </a>
                                    </p>
                                </div>
                                <div className="flex flex-col flex-wrap">
                                    <p className="text-[#155d5e] text-base"><span className="font-normal">Участников: </span> <span className="font-bold">1/10</span></p>
                                </div>
                                <div className="flex flex-col flex-wrap">
                                    <p className="text-[#155d5e] text-base"><span className="font-normal">Ссылка на мероприятие: </span> <a href="https://telemost.360.yandex.ru/j/9882565885" target="_blank" rel="noopener noreferrer" className="text-[#155d5e] font-bold">ссылка</a></p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="p-3 rounded-[30px] border border-2 border-green text-[#155d5e]">
                                    <div className="space-y-2">
                                        <p className="font-semibold">Вы успешно записались на супервизию.</p>
                                        <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                                        <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной супервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества Хранители</a>.</p>
                                    </div>
                                </div>
                                <button className="font-normal transition-colors bg-[#155d5e] text-white hover:bg-dark-green px-[20px] py-[12px] text-[16px] rounded-full">Отменить запись</button><button className="font-normal transition-colors border border-gray text-[#155d5e] hover:bg-gray px-[20px] py-[12px] text-[16px] rounded-full">Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
             */}
            <div data-name="container">
                <div className='sticky top-0 z-20'>
                    <div data-name="header" className='w-full h-6 bg-[#fbfbfb] flex items-center border-b border-[#333] ' >
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

                <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd] border-dashed  border-b'>
                    {/* Строка с датами */}
                    <div className='w-full flex sticky top-6 z-10'>
                        <div className='min-w-[150px] border-r border-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] flex items-center justify-center p-2'>
                            <div className='text-xs font-bold py-2 bg-[#4a9b8e] text-white flex w-full justify-center items-center rounded-full'>1 декабря</div>
                        </div>
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
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]' >13:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'"Кто я?" - теплица проф.идентичности'} counter={'Участников: 0/10'} author={'Алёна Перова'} modality='Общие' />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                    </div>

                    {/* Вторая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >14:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>

                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Супервизия Юнг.'} counter={'Участников: 2/10'} author={'Анна Бородкина'} modality='Юнгианство' is_registered />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Третья строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >18:00</div>
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
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >20:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Исследование личного мифа'} counter={'Участников: 0/10'} author={'Валентина Ким, Нина Дятловская'} modality='Юнгианство' />
                        </div>
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
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]' >09:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Киноклуб'} counter={'Участников: 1/10'} author={'Майя Филиппова'} modality='Общие' />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Вторая строка времени */}
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4  font-bold text-[#155d5e] text-[21px]' >14:00</div></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>
                            <CardItem title={'Рефлексивная группа КПТ'} counter={'Участников: 1/10'} author={'Юлия Ким'} modality='КПТ' is_registered />
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                        <div className='flex-1 min-w-[300px] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'></div>
                    </div>

                    {/* Третья строка времени */}
                    <div className='w-full flex'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >19:00</div></div>
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
                </div>

                <div data-name="week" className='w-full bg-[#fbfbfb] flex flex-col border-[#ddd]  border-dashed border-b'>
                    {/* Строка с датами */}
                    <div className='w-full flex sticky top-6 z-10'>
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
                    <div className='w-full flex border-b border-dashed border-[#ddd]'>
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'>
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]' >13:00</div>
                        </div>
                        <div className='flex-1 min-w-[300px] border-r border-[#333] p-4 flex flex-col gap-2 text-xs font-medium text-[#333]'>

                        </div>
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
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >12:00</div>
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
                            <div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >13:00</div>
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
                            <div className='rounded-full px-8 py-4 font-bold -mt-6 text-[#155d5e] text-[21px]' >10:00</div>
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
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4  font-bold text-[#155d5e] text-[21px]' >12:00</div></div>
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
                        <div data-name='slot-time' className='min-w-[150px] border-r border-[#333] flex items-center justify-center text-xs font-medium text-[#333] py-4'><div className='rounded-full px-8 py-4 font-bold text-[#155d5e] text-[21px]' >13:00</div></div>
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
                <div className="fixed top-16 right-4 bg-[#fbfbfb] rounded-[30px] p-6 flex flex-col gap-4 shadow-lg z-50 border border-[#333333]">
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




        </>

    );
};