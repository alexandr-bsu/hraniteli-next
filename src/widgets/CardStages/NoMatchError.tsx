import { useDispatch, useSelector } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setHasMatchingError } from '@/redux/slices/application_form_data';
import { COLORS } from '@/shared/constants/colors';
import { useEffect, useState } from 'react';

import { RootState } from '@/redux/store';
import axios from 'axios';

interface NoMatchErrorProps {
    onClose?: () => void;
    onRetryWithoutSpecificPsychologist?: () => void;
    onContinueAnyway?: () => void;
    onEmergencyHelp?: () => void;
}

export const NoMatchError = ({ onClose, onRetryWithoutSpecificPsychologist, onContinueAnyway, onEmergencyHelp }: NoMatchErrorProps) => {
    const dispatch = useDispatch();


    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Изменение критериев подбора", ticket_id: ticketID },
        });
    }, [])



    const handleChangeGender = () => {
        dispatch(setHasMatchingError(false));
        dispatch(setApplicationStage('gender_psychologist'));
    };

    const handleChangeConditions = () => {
        dispatch(setHasMatchingError(false));
        dispatch(setApplicationStage('condition'));
    };

    const handleChangeTraumatic = () => {
        dispatch(setHasMatchingError(false));
        dispatch(setApplicationStage('traumatic'));
    };



    return (
        <div className="flex flex-col w-full h-full px-[50px] py-[30px] max-lg:px-[20px]">
            <h2 className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold mb-[20px]">
                К сожалению выбранный психолог не работает с выбранными критериями.
            </h2>

            <p className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] text-[#737373] mb-[30px]">
                Вы можете продолжить с текущими критериями но психолог может отказать либо изменить критерии, либо выбрать другого из нашего сообщества
            </p>

            <div className="flex flex-col gap-[15px]">
                {/* <button
                    onClick={handleChangeGender}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить предпочтения по полу психолога
                </button> */}

                <button
                    onClick={handleChangeConditions}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить описание состояний
                </button>

                <button
                    onClick={handleChangeTraumatic}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить описание травмирующих событий
                </button>

                {onRetryWithoutSpecificPsychologist && (
                    <div className='flex-wrap flex gap-2'>
                        {onContinueAnyway && (
                            <button
                                onClick={onContinueAnyway}
                                className="text-center px-[24px] py-[12px] border grow border-[#116466] bg-white text-[#116466] rounded-[30px] text-[16px] font-medium hover:bg-[#F5F5F5] transition-all md:text-[16px] md:py-[13px] md:px-[20px]"
                            >
                                Всё равно продолжить
                            </button>
                        )}
                        <button
                            onClick={onRetryWithoutSpecificPsychologist}
                            className="text-center px-[24px] py-[12px] bg-[#116466] grow text-white rounded-[30px] text-[16px] font-medium hover:brightness-90 transition-all md:text-[16px] md:py-[13px] md:px-[20px]"
                        >
                            Подобрать других психологов
                        </button>


                        {/*                         
                        {onEmergencyHelp && (
                            <button
                                onClick={onEmergencyHelp}
                                className={`w-full text-center p-[20px] bg-red-600 text-white rounded-[15px] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] hover:bg-red-700 transition-colors mt-[10px]`}
                            >
                                Экстренная помощь
                            </button>
                        )} */}
                    </div>
                )}
            </div>
        </div>
    );
}; 