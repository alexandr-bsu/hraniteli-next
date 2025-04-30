import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setIndexPhyc, setHasMatchingError, setSelectedSlots, setSelectedSlotsObjects } from '@/redux/slices/application_form_data';
import { IPsychologist } from '@/shared/types/psychologist.types';
import { Button } from '@/shared/ui/Button';
import { getPsychologistAll } from '@/features/actions/getPsychologistAll';
import Image from 'next/image';
import { COLORS } from '@/shared/constants/colors';
import Link from 'next/link';
import { RootState } from '@/redux/store';
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter';
import { Tooltip } from '@/shared/ui/Tooltip';
import { NoMatchError } from './NoMatchError';
import { EmergencyContacts } from './EmergencyContacts';
import { getTimeDifference } from '@/features/utils';
import axios from 'axios';
import { toast } from 'sonner';
import styles from './PsychologistStage.module.scss';

interface Slot {
  id: string;
  psychologist: string;
  date: string;
  time: string;
  state: string;
  ticket: string | null;
  client_id: string | null;
  meeting_link: string | null;
  meeting_id: string | null;
  calendar_meeting_id: string | null;
  confirmed: boolean;
  auto_assigned: boolean;
  auto_canceled: boolean;
  is_helpful_hand: boolean | null;
  "Дата Локальная": string;
  "Время Локальное": string;
}

interface DaySlots {
  [time: string]: Slot;
}

interface Schedule {
  [date: string]: DaySlots;
}

interface ScheduleDay {
  date: string;
  slots: {
    [key: string]: Slot[];
  };
  day_name: string;
  pretty_date: string;
}

const getGoogleDriveImageUrl = (url: string | undefined) => {
    if (!url) return '/images/default-avatar.png';
    
    // Если это cdnvideo.ru, возвращаем как есть
    if (url.includes('cdnvideo.ru')) return url;
    
    // Убираем @ в начале ссылки если есть
    const cleanUrl = url.startsWith('@') ? url.slice(1) : url;
    
    // Если это не гугл драйв ссылка - возвращаем как есть
    if (!cleanUrl.includes('drive.google.com')) return cleanUrl;
    
    // Если ссылка уже в нужном формате - возвращаем как есть
    if (cleanUrl.includes('/uc?')) return cleanUrl;
    
    // Извлекаем ID файла из разных форматов ссылок
    let fileId = '';
    if (cleanUrl.includes('/d/')) {
        fileId = cleanUrl.match(/\/d\/(.+?)(?:\/|$)/)?.[1] || '';
    } else if (cleanUrl.includes('id=')) {
        fileId = cleanUrl.match(/id=(.+?)(?:&|$)/)?.[1] || '';
    } else if (cleanUrl.includes('/file/d/')) {
        fileId = cleanUrl.match(/\/file\/d\/([^/]+)/)?.[1] || '';
    }
    
    if (!fileId) return '/images/default-avatar.png';
    
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

export const PsychologistStage = () => {
  const dispatch = useDispatch();
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [showNoMatch, setShowNoMatch] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [availableDays, setAvailableDays] = useState<ScheduleDay[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);

  const filtered_by_automatch_psy = useSelector<RootState, any[]>(
    state => state.filter.filtered_by_automatch_psy
  );
  const currentIndex = useSelector((state: RootState) => state.applicationFormData.index_phyc);
  const filters = useSelector((state: RootState) => state.filter);
  const hasError = useSelector((state: RootState) => state.applicationFormData.has_matching_error);
  const formData = useSelector((state: RootState) => state.applicationFormData);

  useEffect(() => {
    const fetchPsychologists = async () => {
      if (filtered_by_automatch_psy.length > 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getPsychologistAll();
        if (data?.length) {
          dispatch(fill_filtered_by_automatch_psy(data));
          dispatch(setHasMatchingError(false));
        } else {
          dispatch(setHasMatchingError(true));
          setShowNoMatch(true);
        }
      } catch (error) {
        console.error('Failed to fetch psychologists:', error);
        dispatch(setHasMatchingError(true));
        setShowNoMatch(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPsychologists();
  }, []);

  useEffect(() => {
    if (!isLoading && filtered_by_automatch_psy.length === 0) {
      setShowNoMatch(true);
    }
  }, [filtered_by_automatch_psy.length, isLoading]);

  useEffect(() => {
    if (!isLoading && filtered_by_automatch_psy.length === 0 && retryCount > 0) {
      setShowEmergency(true);
    }
  }, [filtered_by_automatch_psy.length, retryCount, isLoading]);

  useEffect(() => {
    const loadSlots = (schedule: { [date: string]: { [time: string]: Slot } } | null) => {
      if (!schedule) {
        setAvailableSlots([]);
        return;
      }

      const slots: Slot[] = [];
      
      Object.entries(schedule).forEach(([date, daySlots]) => {
        Object.entries(daySlots).forEach(([time, slot]) => {
          if (slot && slot.state === 'Свободен') {
            slots.push(slot);
          }
        });
      });

      setAvailableSlots(slots);
    };

    if (filtered_by_automatch_psy[currentIndex]?.schedule) {
      loadSlots(filtered_by_automatch_psy[currentIndex].schedule);
    }
  }, [currentIndex, filtered_by_automatch_psy]);

  const currentPsychologist = filtered_by_automatch_psy[currentIndex];
  console.log('Current psychologist data:', currentPsychologist);

  const getFilterQueryParams = () => {
    const params = new URLSearchParams();

    if (currentPsychologist?.id) {
      params.append('selected_psychologist', currentPsychologist.id);
    }

    return `/?${params.toString()}`;
  };

  const handleOpenPsychologistCard = () => {
    const url = getFilterQueryParams();
    window.open(url, '_blank');
  };

  const handleCloseNoMatch = () => {
    setShowNoMatch(false);
    setRetryCount(prev => prev + 1);
  };

  const handleCloseEmergency = () => {
    setShowEmergency(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedSlot(null);
      setAvailableSlots([]);
      dispatch(setIndexPhyc(currentIndex - 1));
    }
  };

  const handleNext = () => {
    if (currentIndex < filtered_by_automatch_psy.length - 1) {
      setSelectedSlot(null);
      setAvailableSlots([]);
      dispatch(setIndexPhyc(currentIndex + 1));
    }
  };

  const handleSubmit = async () => {
    if (selectedSlot) {
      setIsSubmitting(true);
      try {
        const requestData = {
          anxieties: [],
          questions: formData.requests,
          customQuestion: [],
          diagnoses: formData.diseases,
          diagnoseInfo: "",
          diagnoseMedicaments: localStorage.getItem('app_diseases_psychologist') ? 
            JSON.parse(localStorage.getItem('app_diseases_psychologist') || '{}').medications : 'no',
          traumaticEvents: formData.actions,
          clientStates: formData.actions,
          selectedPsychologistsNames: [currentPsychologist?.name],
          shownPsychologists: currentPsychologist?.name || "",
          lastExperience: "",
          amountExpectations: "",
          age: formData.age,
          slots: [`${selectedSlot["Дата Локальная"]} ${selectedSlot["Время Локальное"]}`],
          slots_objects: [selectedSlot.id],
          contactType: "Phone",
          contact: formData.phone,
          name: formData.username,
          promocode: formData.promocode,
          ticket_id: formData.ticketID,
          emptySlots: false,
          userTimeZone: "МСК",
          bid: 0,
          rid: 0,
          categoryType: "",
          customCategory: "",
          question_to_psychologist: formData.requests.join('; '),
          filtered_by_automatch_psy_names: [currentPsychologist?.name],
          _queries: "",
          customTraumaticEvent: "",
          customState: "",
          formPsyClientInfo: {
            age: formData.age,
            city: "",
            sex: formData.gender_user === 'male' ? 'Мужской' : 'Женский',
            psychoEducated: "",
            anxieties: [],
            customAnexiety: "",
            hasPsychoExperience: "",
            meetType: "",
            selectionСriteria: "",
            custmCreteria: "",
            importancePsycho: formData.preferences,
            customImportance: formData.custom_preferences,
            agePsycho: "",
            sexPsycho: formData.gender_psychologist === 'male' ? 'Мужчина' : 
                      formData.gender_psychologist === 'female' ? 'Женщина' : 'Не имеет значения',
            priceLastSession: "",
            durationSession: "",
            reasonCancel: "",
            pricePsycho: "",
            reasonNonApplication: "",
            contactType: "Phone",
            contact: formData.phone,
            name: formData.username,
            is_adult: parseInt(formData.age) >= 18,
            is_last_page: true,
            occupation: ""
          }
        };

        console.log('Отправляем запрос на запись:', requestData);

        const response = await axios.post('https://n8n-v2.hrani.live/webhook/tilda-zayavka-test-contur', requestData);
        console.log('Ответ сервера:', response.data);

        if (response.status === 200) {
          dispatch(setSelectedSlots([`${selectedSlot["Дата Локальная"]} ${selectedSlot["Время Локальное"]}`]));
          dispatch(setSelectedSlotsObjects([selectedSlot.id]));
          dispatch(setApplicationStage('gratitude'));
        } else {
          throw new Error('Ошибка при отправке заявки');
        }
      } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        toast.error('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[14px] text-[#116466]">Загрузка психологов...</span>
      </div>
    );
  }

  if (showEmergency) {
    return <EmergencyContacts onClose={handleCloseEmergency} />;
  }

  if (showNoMatch) {
    return <NoMatchError onClose={handleCloseNoMatch} />;
  }

  if (!filtered_by_automatch_psy.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[14px] text-[#116466]">Загрузка психологов...</span>
      </div>
    );
  }

  const remainingPsychologists = filtered_by_automatch_psy.length - (currentIndex + 1);

  return (
    <div className="flex flex-col w-full pr-[50px] pl-[50px] pb-[50px] pt-[30px] max-lg:p-[20px] h-full relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-[10px]">
            <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[18px] text-[#116466]">Отправка заявки...</span>
          </div>
        </div>
      )}

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-[20px] max-lg:flex-col max-lg:gap-[15px] min-h-[50px] max-lg:min-h-[80px]">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-[10px] cursor-pointer text-[#116466] text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px]"
            >
              <Image src="/card/arrow_left.svg" alt="Previous" width={50} height={50} className="max-lg:w-[30px] max-lg:h-[30px]" />
              <span>Предыдущий психолог</span>
            </button>
          )}
          {currentIndex < filtered_by_automatch_psy.length - 1 && remainingPsychologists > 0 && (
            <button
              onClick={handleNext}
              className="flex items-center gap-[10px] cursor-pointer text-[#116466] text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px] ml-auto"
            >
              <span>Показать еще {remainingPsychologists} психологов</span>
              <Image src="/card/arrow_right.svg" alt="Next" width={50} height={50} className="max-lg:w-[30px] max-lg:h-[30px]" />
            </button>
          )}
        </div>

        <div className="flex flex-col grow p-[25px] max-lg:p-[15px] mb-[30px] max-lg:mb-[20px] border-[1px] rounded-[25px] overflow-y-auto max-h-[calc(100vh-400px)] min-lg:max-h-[400px] scrollContainer">
          <div className="flex justify-between items-start mb-[30px] max-lg:mb-[20px] max-lg:flex-col max-lg:gap-[15px]">
            <div className="flex gap-[20px] items-center max-lg:gap-[15px]">
              <div className="w-[80px] h-[80px] max-lg:w-[60px] max-lg:h-[60px] rounded-full overflow-hidden">
                <Image
                  src={getGoogleDriveImageUrl(currentPsychologist?.avatar || currentPsychologist?.link_photo)}
                  alt={currentPsychologist?.name || 'Фото психолога'}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src !== '/images/default-avatar.png') {
                      target.src = '/images/default-avatar.png';
                    }
                  }}
                  priority
                />
              </div>
              <div>
                <h3 className="text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px] font-semibold">
                  {currentPsychologist?.name}
                  {currentPsychologist?.age && `, ${currentPsychologist.age} лет`}
                </h3>
                <span className="text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px] text-[#9A9A9A]">
                  {currentPsychologist?.experience && (
                    <span>{currentPsychologist.experience}{' '}</span>
                  )}
                  {currentPsychologist?.in_community && (
                    <span>в сообществе</span>
                  )}
                </span>
              </div>
            </div>
            <button
              onClick={handleOpenPsychologistCard}
              className="hover:opacity-80 transition-opacity cursor-pointer text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px] text-[#116466] max-lg:w-full max-lg:text-center max-lg:py-[8px] max-lg:border max-lg:border-[#116466] max-lg:rounded-[50px]"
            >
              Перейти на карточку психолога
            </button>
          </div>

          <div className="grid grid-cols-3 gap-[30px] mb-[30px] max-lg:grid-cols-1 max-lg:gap-[20px] max-lg:mb-[20px]">
            <div>
              <span className="text-[#9A9A9A] text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px]">Основной подход:</span>
              <div className="flex items-center gap-[10px] mt-[5px]">
                <p className="font-semibold text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px]">{currentPsychologist.main_modal}</p>
                <Tooltip text="Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов." />
              </div>
            </div>
            <div>
              <span className="text-[#9A9A9A] text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px]">Формат встречи:</span>
              <p className="font-semibold text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px] mt-[5px]">Онлайн</p>
            </div>
            <div>
              <span className="text-[#9A9A9A] text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px]">Стоимость:</span>
              <div className="flex items-center gap-[10px] mt-[5px]">
                <p className="font-semibold text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px]">От {currentPsychologist.min_session_price || 0} ₽</p>
                <Tooltip text="Стоимость сессии длительностью 50-60 минут. Может меняться в зависимости от формата работы и длительности." />
              </div>
            </div>
          </div>

          <div className={styles.nextSession}>
            <div className="mt-[30px]">
              <h4 className="text-[18px] font-semibold mb-[15px]">Ближайшая запись:</h4>
              {availableSlots.length > 0 ? (
                <div className="flex gap-[10px] flex-wrap">
                  {availableSlots.map((slot, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleSlotSelect(slot)}
                      className={`px-[15px] py-[8px] rounded-[50px] border whitespace-nowrap text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px] cursor-pointer ${
                        selectedSlot?.id === slot.id
                          ? 'bg-[#116466] text-white border-[#116466]'
                          : 'border-[#D4D4D4] text-[#116466] hover:bg-[#116466] hover:text-white hover:border-[#116466]'
                      }`}
                    >
                      {`${slot.date.split('-').reverse().slice(0, 2).join('.')} / ${slot.time}`}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-[20px] p-[15px] bg-[#F5F5F5] rounded-[10px] text-[16px] text-center">
                  У психолога пока нет свободного времени для записи
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shrink-0 mt-auto pb-[10px] flex gap-[10px]">
          <button
            type='button'
            onClick={() => dispatch(setApplicationStage('phone'))}
            disabled={isSubmitting}
            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px] rounded-[50px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Назад
          </button>

          <button
            type='submit'
            disabled={!selectedSlot || isSubmitting}
            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[16px] rounded-[50px] flex justify-center items-center gap-[10px] ${!selectedSlot || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Отправка...</span>
              </>
            ) : (
              'Продолжить'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};