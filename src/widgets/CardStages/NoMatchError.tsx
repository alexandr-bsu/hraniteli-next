import { useDispatch, useSelector } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setHasMatchingError } from '@/redux/slices/application_form_data';
import { COLORS } from '@/shared/constants/colors';
import { useEffect, useState } from 'react';
import { EmergencyContacts } from './EmergencyContacts';
import { RootState } from '@/redux/store';
import axios from 'axios';

interface NoMatchErrorProps {
    onClose?: () => void;
    onRetryWithoutSpecificPsychologist?: () => void;
}

export const NoMatchError = ({ onClose, onRetryWithoutSpecificPsychologist }: NoMatchErrorProps) => {
    const dispatch = useDispatch();
    const [showEmergency, setShowEmergency] = useState(false);
    const [matchingAttempts, setMatchingAttempts] = useState(0);
    
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

    useEffect(() => {
        const attempts = Number(localStorage.getItem('matching_attempts') || '0');
        setMatchingAttempts(attempts);
    }, []);

    useEffect(() => {
        // Если 3 попытки - показываем экстренные контакты
        if (matchingAttempts >= 5) {
            setShowEmergency(true);
        }
    }, [matchingAttempts]);

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

    const handleEmergencyClose = () => {
        localStorage.setItem('matching_attempts', '0');
        dispatch(setHasMatchingError(false));
        if (onClose) onClose();
    };

    if (showEmergency) {
        return <EmergencyContacts onClose={handleEmergencyClose} />;
    }

    return (
        <div className="flex flex-col w-full h-full px-[50px] py-[30px] max-lg:px-[20px]">
            <h2 className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold mb-[20px]">
                К сожалению, мы не смогли подобрать психолога по вашим критериям
            </h2>
            
            <p className="text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] text-[#737373] mb-[30px]">
                Рекомендуем изменить ответы в следующих разделах:
            </p>

            <div className="flex flex-col gap-[15px]">
                <button
                    onClick={handleChangeGender}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить предпочтения по полу психолога
                </button>
                
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
                    <button
                        onClick={onRetryWithoutSpecificPsychologist}
                        className={`w-full text-center p-[20px] bg-[${COLORS.primary}] text-white rounded-[15px] text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] hover:opacity-90 transition-opacity mt-[10px]`}
                    >
                        Подобрать других психологов
                    </button>
                )}
            </div>
        </div>
    );
}; 