import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setIndexPhyc } from '@/redux/slices/application_form_data';
import { IPsychologist } from '@/shared/types/psychologist.types';
import { Button } from '@/shared/ui/Button';
import { getPsychologistAll } from '@/features/actions/getPsychologistAll';
import Image from 'next/image';
import { COLORS } from '@/shared/constants/colors';
import Link from 'next/link';
import { RootState } from '@/redux/store';
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter';

const getGoogleDriveImageUrl = (url: string | undefined) => {
  if (!url) return '/card/214х351.jpg';
  if (url.includes('drive.google.com')) {
    const id = url.match(/[-\w]{25,}/);
    return id ? `https://drive.google.com/uc?export=view&id=${id[0]}` : '/card/214х351.jpg';
  }
  return url;
};

export const PsychologistStage = () => {
  const dispatch = useDispatch();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  
  const filtered_by_automatch_psy = useSelector((state: RootState) => state.filter.filtered_by_automatch_psy);
  const currentIndex = useSelector((state: RootState) => state.applicationFormData.index_phyc);
  const filters = useSelector((state: RootState) => state.filter);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        const data = await getPsychologistAll();
        if (data?.length) {
          dispatch(fill_filtered_by_automatch_psy(data));
        }
      } catch (error) {
        console.error('Failed to fetch psychologists:', error);
      }
    };

    fetchPsychologists();
  }, [dispatch]);

  const currentPsychologist = filtered_by_automatch_psy[currentIndex];

  const getFilterQueryParams = () => {
    const params = new URLSearchParams();
    
    // Добавляем ID текущего психолога
    if (currentPsychologist?.id) {
      params.append('selected_psychologist', currentPsychologist.id);
    }

    return `/?${params.toString()}`;
  };

  const handleOpenPsychologistCard = () => {
    const url = getFilterQueryParams();

    window.open(url, '_blank');
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      dispatch(setIndexPhyc(currentIndex - 1));
      setSelectedSlot(null);
    }
  };

  const handleNext = () => {
    if (currentIndex < filtered_by_automatch_psy.length - 1) {
      dispatch(setIndexPhyc(currentIndex + 1));
      setSelectedSlot(null);
    }
  };

  const handleSubmit = () => {
    dispatch(setApplicationStage('gratitude'));
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  if (!filtered_by_automatch_psy.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-[18px] text-[#116466]">Загрузка психологов...</span>
      </div>
    );
  }

  const remainingPsychologists = filtered_by_automatch_psy.length - (currentIndex + 1);
  const availableSlots = ['28.01/ 13:00'];

  return (
    <div className="flex flex-col w-full pr-[50px] pl-[50px] pb-[50px] pt-[30px] max-lg:p-[20px] h-full">
      <div className="flex justify-between items-center mb-[20px]">
        <button 
          onClick={handlePrevious} 
          disabled={currentIndex === 0}
          className={`flex items-center gap-[10px] cursor-pointer text-[#116466] ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Image src="/card/arrow_left.svg" alt="Previous" width={50} height={50} />
          <span>Предыдущий психолог</span>
        </button>
        <button 
          onClick={handleNext}
          disabled={currentIndex >= filtered_by_automatch_psy.length - 1}
          className={`flex items-center gap-[10px] cursor-pointer text-[#116466] ${currentIndex >= filtered_by_automatch_psy.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>Показать еще {remainingPsychologists} психологов</span>
          <Image src="/card/arrow_right.svg" alt="Next" width={50} height={50} />
        </button>
      </div>

      <div className="flex flex-col grow p-[25px] max-lg:p-[15px] mb-[57px] border-[1px] rounded-[25px]">
        <div className="flex justify-between items-start mb-[30px]">
          <div className="flex gap-[20px] items-center">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden">
              <Image 
                src={getGoogleDriveImageUrl(currentPsychologist.link_photo)}
                alt={currentPsychologist.name}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold">{currentPsychologist.name}, {currentPsychologist.age} лет</h3>
              <span className="text-[16px] text-[#9A9A9A]">
                {currentPsychologist.experience && (
                  <span>{currentPsychologist.experience}{' '}</span>
                )}
                {currentPsychologist.in_community && (
                  <span>в сообществе</span>
                )}
              </span>
            </div>
          </div>
          <button 
            onClick={handleOpenPsychologistCard}
            className="hover:opacity-80 transition-opacity cursor-pointer"
          >
            Перейти на карточку психолога
          </button>
        </div>

        <div className="grid grid-cols-3 gap-[30px] mb-[30px]">
          <div>
            <span className="text-[#9A9A9A] text-[16px]">Основной подход:</span>
            <div className="flex items-center gap-[10px] mt-[5px]">
              <p className="font-semibold text-[18px]">{currentPsychologist.main_modal}</p>
              <Image src="/card/hint.svg" alt="hint" width={24} height={24} />
            </div>
          </div>
          <div>
            <span className="text-[#9A9A9A] text-[16px]">Формат встречи:</span>
            <p className="font-semibold text-[18px] mt-[5px]">Онлайн</p>
          </div>
          <div>
            <span className="text-[#9A9A9A] text-[16px]">Стоимость:</span>
            <div className="flex items-center gap-[10px] mt-[5px]">
              <p className="font-semibold text-[18px]">От {currentPsychologist.min_session_price || 0} ₽</p>
              <Image src="/card/hint.svg" alt="hint" width={24} height={24} />
            </div>
          </div>
        </div>

        <div className="mb-[30px]">
          <h4 className="font-semibold text-[18px] mb-[10px]">Ближайшая запись:</h4>
          <div className="flex gap-[10px] overflow-x-auto pb-[10px]">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                onClick={() => handleSlotSelect(slot)}
                className={`px-[15px] py-[8px] rounded-[50px] border whitespace-nowrap min-w-[132px] ${
                  selectedSlot === slot 
                    ? 'bg-[#116466] text-white border-[#116466]' 
                    : 'border-[#D4D4D4] text-[#116466]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 pb-[50px] flex gap-[10px]">
          <button
              type='button'
              onClick={() => dispatch(setApplicationStage('promocode'))}
              className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}
          >
              Назад
          </button>

          <button
              type='submit'
              className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]`}
              onClick={handleSubmit}
          >
              Продолжить
          </button>
      </div>
    </div>
  );
};