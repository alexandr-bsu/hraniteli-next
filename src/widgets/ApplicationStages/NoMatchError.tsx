import { useDispatch } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { COLORS } from '@/shared/constants/colors';

interface NoMatchErrorProps {
    onClose: () => void;
}

export const NoMatchError = ({ onClose }: NoMatchErrorProps) => {
    const dispatch = useDispatch();

    const handleChangeGender = () => {
        dispatch(setApplicationStage('gender_psychologist'));
        onClose();
    };

    const handleChangeConditions = () => {
        dispatch(setApplicationStage('condition'));
        onClose();
    };

    const handleChangeTraumatic = () => {
        dispatch(setApplicationStage('traumatic'));
        onClose();
    };

    return (
        <div className="flex flex-col w-full h-full px-[50px] py-[30px] max-lg:px-[20px]">
            <h2 className="text-[20px] font-semibold mb-[20px]">
                К сожалению, мы не смогли подобрать психолога по вашим критериям
            </h2>
            
            <p className="text-[18px] mb-[30px]">
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

            <div className="mt-auto pt-[30px]">
                <button
                    onClick={onClose}
                    className={`w-full border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] rounded-[50px]`}
                >
                    Закрыть
                </button>
            </div>
        </div>
    );
}; 