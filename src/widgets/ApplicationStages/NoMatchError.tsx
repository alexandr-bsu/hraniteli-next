import { useDispatch, useSelector } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { resetMatchingAttempts } from '@/redux/slices/application_form_data';
import { COLORS } from '@/shared/constants/colors';
import { useEffect, useState } from 'react';
import { EmergencyContacts } from './EmergencyContacts';
import { RootState } from '@/redux/store';

interface NoMatchErrorProps {
    onClose: () => void;
}

export const NoMatchError = ({ onClose }: NoMatchErrorProps) => {
    const dispatch = useDispatch();
    const [showEmergency, setShowEmergency] = useState(false);
    const matchingAttempts = useSelector((state: RootState) => state.applicationFormData.matching_attempts);

    useEffect(() => {
        // Если 3 попытки - показываем экстренные контакты
        if (matchingAttempts >= 3) {
            setShowEmergency(true);
        }
    }, [matchingAttempts]);

    const handleChangeGender = () => {
        dispatch(resetMatchingAttempts());
        dispatch(setApplicationStage('gender_psychologist'));
        onClose();
    };

    const handleChangeConditions = () => {
        dispatch(resetMatchingAttempts());
        dispatch(setApplicationStage('condition'));
        onClose();
    };

    const handleChangeTraumatic = () => {
        dispatch(resetMatchingAttempts());
        dispatch(setApplicationStage('traumatic'));
        onClose();
    };

    const handleEmergencyClose = () => {
        dispatch(resetMatchingAttempts());
        onClose();
    };

    if (showEmergency) {
        return <EmergencyContacts onClose={handleEmergencyClose} />;
    }

    return (
        <div className="flex flex-col w-full h-full px-[50px] py-[30px] max-lg:px-[20px]">
            <h2 className="text-[20px] font-semibold mb-[20px]">
                К сожалению, мы не смогли подобрать психолога по вашим критериям
            </h2>
            
            <p className="text-[18px] mb-[30px] text-[#737373]">
                Рекомендуем изменить ответы в следующих разделах:
            </p>

            <div className="flex flex-col gap-[15px]">
                <button
                    onClick={handleChangeGender}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить предпочтения по полу психолога
                </button>
                
                <button
                    onClick={handleChangeConditions}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить описание состояний
                </button>
                
                <button
                    onClick={handleChangeTraumatic}
                    className={`w-full text-left p-[20px] border rounded-[15px] text-[18px] hover:border-[${COLORS.primary}] transition-colors`}
                >
                    Изменить описание травмирующих событий
                </button>
            </div>

            <div className="shrink-0 max-lg:pb-[30px] flex gap-[10px] mt-auto mb-[20px]">
                <button
                    onClick={onClose}
                    className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px] rounded-[50px]"
                >
                    Продолжить
                </button>
            </div>
        </div>
    );
}; 