'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const InfoStage = () => {
    const router = useRouter();

    const handleClose = () => {
        router.push('/');
    };

    return (
        <div className='relative min-lg:p-[50px] p-[20px] max-lg:px-[20px] flex-col min-h-full h-[100svh] flex w-full grow'>
            <div className="w-full flex justify-end">
                <button 
                    type="button" 
                    onClick={handleClose}
                    className="cursor-pointer w-[50px] h-[50px] rounded-full flex justify-center items-center border-[1px] border-[#D4D4D4]"
                >
                    <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
                </button>
            </div>

            <div className='font-normal w-full flex flex-col gap-[30px] grow overflow-auto'>
                <div>
                    <h2 className='font-semibold text-[20px] leading-[27px]'>Универсальные службы:</h2>
                    <div className='flex flex-col gap-[10px] mt-[20px]'>
                        <p className='text-[18px] leading-[25px]'>Горячая линия Центра экстренной психологической <br />помощи МЧС России +7 495 989-50-50</p>
                        <p className='text-[18px] leading-[25px]'>Телефон экстренной психологической помощи для детей<br /> и взрослых Института «Гармония» +7 800 500-22-87</p>
                        <p className='text-[18px] leading-[25px]'>Горячая линия психологической помощи <br /> Московского института психоанализа +7 800 500-22-87</p>
                    </div>
                </div>

                <div>
                    <h2 className='font-semibold text-[20px] leading-[27px]'>Помощь людям с тяжёлыми заболеваниями:</h2>
                    <div className='flex flex-col gap-[10px] mt-[20px]'>
                        <p className='text-[18px] leading-[25px]'>Горячая линия Центра экстренной психологической помощи МЧС России +7 495 989-50-50</p>
                        <p className='text-[18px] leading-[25px]'>Горячая линия службы «Ясное утро» +7 800 100-01-91</p>
                        <p className='text-[18px] leading-[25px]'>Горячая линия помощи неизлечимо больным людям +7 800 700-84-36</p>
                    </div>
                </div>

                <div>
                    <h2 className='font-semibold text-[20px] leading-[27px]'>Помощь женщинам в кризисе:</h2>
                    <div className='flex flex-col gap-[10px] mt-[20px]'>
                        <p className='text-[18px] leading-[25px]'>Центр «Насилию.нет» +7 495 916-30-00</p>
                        <p className='text-[18px] leading-[25px]'>Телефон доверия для женщин, пострадавших от домашнего насилия <br /> кризисного Центра «АННА»: 8 800 7000 600</p>
                    </div>
                </div>

                <div>
                    <h2 className='font-semibold text-[20px] leading-[27px]'>Помощь детям и подросткам:</h2>
                    <div className='flex flex-col gap-[10px] mt-[20px]'>
                        <p className='text-[18px] leading-[25px]'>Телефон доверия для детей, подростков и их родителей 8 800 2000 122</p>
                        <p className='text-[18px] leading-[25px]'>Проект группы кризисных психологов из Петербурга «Твоя <br /> территория.онлайн» +7 800 200-01-22</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoStage;