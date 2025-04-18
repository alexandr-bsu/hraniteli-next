'use client'
import React from 'react';

const InfoStage = () => {
    return (
        <div className='font-normal h-full w-full p-[30px] flex flex-col gap-[30px]'>
            <div className=''>
                <h2 className='font-semibold text-[20px] leading-[27px]'>Универсальные службы:</h2>
                <div className='flex flex-col gap-[10px] mt-[20px]'>
                    <p className='text-[18px] leading-[25px]'>Горячая линия Центра экстренной психологической <br />помощи МЧС России +7 495 989-50-50</p>
                    <p className='text-[18px] leading-[25px]'>Телефон экстренной психологической помощи для детей<br /> и взрослых Института «Гармония» +7 800 500-22-87</p>
                    <p className='text-[18px] leading-[25px]'>Горячая линия психологической помощи <br /> Московского института психоанализа +7 800 500-22-87</p>
                </div>
            </div>

            <div className=''>
                <h2 className='font-semibold text-[20px] leading-[27px]'>Помощь людям с тяжёлыми заболеваниями:</h2>
                <div className='flex flex-col gap-[10px] mt-[20px]'>
                    <p className='text-[18px] leading-[25px]'>Горячая линия Центра экстренной психологической помощи МЧС России +7 495 989-50-50</p>
                    <p className='text-[18px] leading-[25px]'>Горячая линия службы «Ясное утро» +7 800 100-01-91</p>
                    <p className='text-[18px] leading-[25px]'>Горячая линия помощи неизлечимо больным людям +7 800 700-84-36</p>
                </div>
            </div>

            <div className=''>
                <h2 className='font-semibold text-[20px] leading-[27px]'>Помощь женщинам в кризисе:</h2>
                <div className='flex flex-col gap-[10px] mt-[20px]'>
                    <p className='text-[18px] leading-[25px]'>Центр «Насилию.нет» +7 495 916-30-00</p>
                    <p className='text-[18px] leading-[25px]'>Телефон доверия для женщин, пострадавших от домашнего насилия <br /> кризисного Центра «АННА»: 8 800 7000 600</p>
                </div>
            </div>

            <div className=''>
                <h2 className='font-semibold text-[20px] leading-[27px]'>Помощь детям и подросткам:</h2>
                <div className='flex flex-col gap-[10px] mt-[20px]'>
                    <p className='text-[18px] leading-[25px]'>Телефон доверия для детей, подростков и их родителей 8 800 2000 122</p>
                    <p className='text-[18px] leading-[25px]'>Проект группы кризисных психологов из Петербурга «Твоя <br /> территория.онлайн» +7 800 200-01-22</p>
                </div>
            </div>
        </div>
    );
};

export default InfoStage;