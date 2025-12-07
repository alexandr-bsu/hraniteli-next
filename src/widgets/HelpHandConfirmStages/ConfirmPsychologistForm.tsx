'use client'

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setIndexPhyc, setHasMatchingError, setSelectedSlots, setSelectedSlotsObjects } from '@/redux/slices/application_form_data';
import { getTimeDifference } from '@/features/utils';
import { getFilteredPsychologists } from '@/features/actions/getPsychologistSchedule';
import { IPsychologist } from '@/shared/types/psychologist.types';
import Image from 'next/image';
import { COLORS } from '@/shared/constants/colors';
import Link from 'next/link';
import { RootState } from '@/redux/store';
import { fill_filtered_by_automatch_psy, setSelectedPsychologist } from '@/redux/slices/filter';
import { Tooltip } from '@/shared/ui/Tooltip';
import { NoMatchError } from '../HelpHandStages/NoMatchError';
import { EmergencyContactsClone } from '../HelpHandStages/EmergencyContactsClone';
import axios from 'axios';
import styles from '@/shared/styles/PsychologistStage.module.css';
import styles_cards from '../Card/Card.module.scss';
import { format, startOfWeek, addMonths } from 'date-fns';
import { getAgeWord } from '@/features/utils';
import { useSearchParams } from 'next/navigation';
import { FinalStage } from './FinalStage';

// --- Типы и утилиты ---
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

interface TimeSlot {
  state: string;
  [key: string]: any;
}

interface DaySchedule {
  [time: string]: TimeSlot;
}

interface Schedule {
  [date: string]: DaySchedule;
}

interface SimpleSlot {
  id: string;
  date: string;
  time: string;
  moscow_datetime_formatted: string;
}

const getGoogleDriveImageUrl = (url: string | undefined) => {
  if (!url) return '/images/default.jpg';
  if (url.includes('cdnvideo.ru')) return url;
  const cleanUrl = url.startsWith('@') ? url.slice(1) : url;
  if (!cleanUrl.includes('drive.google.com')) return cleanUrl;
  if (cleanUrl.includes('/uc?')) return cleanUrl;
  let fileId = '';
  if (cleanUrl.includes('/d/')) {
    fileId = cleanUrl.match(/\/d\/(.+?)(?:\/|$)/)?.[1] || '';
  } else if (cleanUrl.includes('id=')) {
    fileId = cleanUrl.match(/id=(.+?)(?:&|$)/)?.[1] || '';
  } else if (cleanUrl.includes('/file/d/')) {
    fileId = cleanUrl.match(/\/file\/d\/([^/]+)/)?.[1] || '';
  }
  if (!fileId) return '/images/default.jpg';
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

const getPsychologistDeclension = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;
  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'психологов';
  if (lastDigit === 1) return 'психолога';
  if (lastDigit >= 2 && lastDigit <= 4) return 'психолога';
  return 'психологов';
};

export const ConfirmPsychologistForm = () => {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.applicationFormData);
  const searchParams = useSearchParams();
  const isResearchRedirect = searchParams.get('research') == 'true';
  const utm_psy = searchParams.get('utm_psy');
  const ticketID = searchParams.get('ticket_id');

  // Проверяем наличие обязательных параметров
  const hasRequiredParams = utm_psy || ticketID;

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Слоты", ticket_id: ticketID },
    });
  }, [ticketID]);

  const [selectedSlot, setSelectedSlot] = useState<SimpleSlot | null>(null);
  const [showNoMatch, setShowNoMatch] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<SimpleSlot[]>([]);
  const [showFinalStage, setShowFinalStage] = useState(false);
  const [isAllowedForSlots, setIsAllowedForSlots] = useState<boolean | null>(null); // Новый стейт

  const filtered_by_automatch_psy = useSelector<RootState, any[]>(state => state.filter.filtered_by_automatch_psy);
  const currentIndex = useSelector((state: RootState) => state.applicationFormData.index_phyc);

  // --- ДОБАВЛЯЕМ ПСИХОЛОГА ПО utm_psy ЕСЛИ МАССИВ ПУСТ ---
  useEffect(() => {
    const fetchAndSetPsychologist = async () => {
      if (utm_psy && filtered_by_automatch_psy.length === 0) {
        try {
          const res = await fetch('https://cache-api.hrani.live/cards');
          const allPsychologists = await res.json();
          const found = allPsychologists.find((p: any) => p.name === utm_psy);
          if (found) {
            dispatch(fill_filtered_by_automatch_psy([found]));
          } else {
            dispatch(fill_filtered_by_automatch_psy([{ name: utm_psy, link_video: null }]));
          }
          dispatch(setIndexPhyc(0));
        } catch (e) {
          dispatch(fill_filtered_by_automatch_psy([{ name: utm_psy, link_video: null }]));
          dispatch(setIndexPhyc(0));
        }
      }
    };
    fetchAndSetPsychologist();
  }, [utm_psy, filtered_by_automatch_psy.length, dispatch]);

  const currentPsychologist = filtered_by_automatch_psy[currentIndex];

  // Проверка разрешения на показ слотов
  useEffect(() => {
    if (!ticketID) {
      setIsAllowedForSlots(null);
      return;
    }
    setIsLoading(true);
    fetch(`https://n8n-v2.hrani.live/webhook/check-allotment-for-slot-confirmation?ticket_id=${encodeURIComponent(ticketID)}`)
      .then(res => res.json())
      .then(data => {
        if (data.is_allowed === false || data.is_allowed === 'false') {
          setIsAllowedForSlots(false);
          setIsLoading(false);
        } else {
          setIsAllowedForSlots(true);
        }
      })
      .catch(() => {
        setIsAllowedForSlots(false);
        setIsLoading(false);
      });
  }, [ticketID]);

  // Новый способ загрузки слотов через API
  useEffect(() => {
    // Не загружаем слоты, если не разрешено
    if (isAllowedForSlots === false) {
      setAvailableSlots([]);
      setShowEmergency(true);
      setIsLoading(false);
      return;
    }
    if (isAllowedForSlots !== true) return;
    const fetchHelpfulHandSlots = async () => {
      if (!currentPsychologist?.name) {
        setAvailableSlots([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const now = new Date();
        const startDate = format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        const endDate = format(addMonths(new Date(startDate), 1), 'yyyy-MM-dd');
        const userTimeOffsetMsk = getTimeDifference();
        // --- Формируем объекты ---
        const formPsyClientInfo = {
          age: formData.age,
          city: formData.city,
          sex: formData.gender_user === 'male' ? 'Мужской' :
            formData.gender_user === 'female' ? 'Женский' : '',
          psychoEducated: '',
          anxieties: [],
          customAnexiety: '',
          hasPsychoExperience: formData.experience === 'earlier' ? 'Да, обращался(ась) ранее' :
            formData.experience === 'in_therapy' ? 'Да, сейчас нахожусь в терапии' :
              formData.experience === 'supposed' ? 'Нет, но рассматривал(а) такую возможность' :
                formData.experience === 'no' ? 'Нет' : 'Нет',
          meetType: '',
          selectionСriteria: '',
          custmCreteria: '',
          importancePsycho: formData.preferences,
          customImportance: formData.custom_preferences,
          agePsycho: '',
          sexPsycho: formData.gender_psychologist === 'male' ? 'Мужской' :
            formData.gender_psychologist === 'female' ? 'Женский' : 'Не имеет значения',
          priceLastSession: '',
          durationSession: '',
          reasonCancel: '',
          pricePsycho: '',
          reasonNonApplication: '',
          contactType: '',
          contact: formData.phone,
          name: formData.username,
          is_adult: parseInt(formData.age) >= 18,
          is_last_page: false,
          occupation: '',
        };
        const form = {
          anxieties: [],
          questions: formData.requests,
          customQuestion: [],
          diagnoses: formData.diseases,
          diagnoseInfo: '',
          diagnoseMedicaments: '',
          traumaticEvents: formData.traumatic || [],
          clientStates: formData.conditions || [],
          selectedPsychologistsNames: [],
          shownPsychologists: '',
          psychos: [],
          lastExperience: '',
          amountExpectations: '',
          age: formData.age,
          slots: [],
          contactType: '',
          contact: formData.phone,
          name: formData.username,
          promocode: formData.promocode,
          ticket_id: ticketID,
          emptySlots: false,
          userTimeZone: "МСК" + (userTimeOffsetMsk > 0 ? '+' + userTimeOffsetMsk : userTimeOffsetMsk < 0 ? userTimeOffsetMsk : ''),
          bid: 0,
          rid: 0,
          categoryType: formData.price_session === 'free' ? 'Бесплатно' :
            formData.price_session === '300' ? '300 руб' :
              formData.price_session === '500' ? '500 руб' :
                formData.price_session === '1000' ? '1000 руб' :
                  formData.price_session === '1500' ? '1500 руб' :
                    formData.price_session === '2000' ? '2000 руб' :
                      formData.price_session === '3000' ? '3000 руб' : 'Бесплатно',
          customCategory: '',
          question_to_psychologist: formData.requests?.join('; ') || '',
          filtered_by_automatch_psy_names: [],
          _queries: '',
          customTraumaticEvent: '',
          customState: ''
        };
        const body = {
          startDate,
          endDate,
          formPsyClientInfo,
          form,
          ticket_id: ticketID,
          userTimeOffsetMsk,
          utm_psy: currentPsychologist.name,
        };
        const response = await fetch('https://n8n-v2.hrani.live/webhook/get-agregated-schedule-helpful-hand', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Ошибка загрузки расписания');
        const data = await response.json();
        // Логирование для отладки структуры ответа
        console.log('API schedule response:', data);
        // Парсим ответ: ищем свободные слоты
        const slots: SimpleSlot[] = [];

        if (Array.isArray(data) && data.length > 0 && data[0].items) {
          data[0].items.forEach((day: any) => {
            if (day.slots) {
              Object.entries(day.slots).forEach(([time, slotArr]: [string, any]) => {
                // Если слот - массив с объектами, проверяем каждый объект
                if (Array.isArray(slotArr) && slotArr.length > 0) {
                  slotArr.forEach((slot: any) => {
                    // Логирование каждого слота
                    console.log('slot:', slot);
                    console.log('slot.id:', slot.id);
                    if (slot.state && slot.state.trim().includes('Свободен')) {
                      // Используем локальные дату и время из слота
                      const slotDate = slot['Дата Локальная'] || slot.date;
                      const slotTime = slot['Время Локальное'] || slot.time;
                      const moscow_datetime = new Date(`${slotDate}T${slotTime}`);

                      // Фильтруем устаревшие слоты (старше 24 часов)
                      const timeDifference = moscow_datetime.getTime() - now.getTime();
                      const hoursUntilSlot = timeDifference / (1000 * 60 * 60); // Разница в часах

                      // Показываем только слоты, которые начинаются не раньше чем через 24 часа от текущего времени
                      if (hoursUntilSlot >= 24) {
                        // Проверяем, что у слота есть ID
                        if (slot.id) {
                          slots.push({
                            id: slot.id, // Используем именно ID слота из API (UUID)
                            date: slotDate,
                            time: slotTime,
                            moscow_datetime_formatted: format(moscow_datetime, 'dd.MM / HH:mm'),
                          });
                        } else {
                          console.warn('Слот без ID:', slot);
                        }
                      } else {
                        console.log(`Слот ${slotDate} ${slotTime} отфильтрован как устаревший (${hoursUntilSlot.toFixed(1)} часов до начала)`);
                      }
                    }
                  });
                }
              });
            }
          });
        }
        console.log('Found slots:', slots.length);
        setAvailableSlots(slots);
        if (slots.length === 0) {
          setShowEmergency(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading slots:', error);
        setAvailableSlots([]);
        setIsLoading(false);
      }
    };
    fetchHelpfulHandSlots();
  }, [currentIndex, filtered_by_automatch_psy, ticketID, isAllowedForSlots]);




  // Показываем экстренные контакты если нет обязательных параметров
  useEffect(() => {
    if (!hasRequiredParams) {
      setShowEmergency(true);
    }
  }, [hasRequiredParams]);



  const getFilterQueryParams = () => {
    const params = new URLSearchParams();
    if (currentPsychologist?.id) {
      params.append('selected_psychologist', currentPsychologist.id);
    } else if (currentPsychologist?.name) {
      const generatedId = `id_${currentPsychologist.name.replace(/\s+/g, '_')}`;
      params.append('selected_psychologist', generatedId);
    }

    // Если психолог не из сообщества, направляем на страницу /groups
    const basePath = currentPsychologist?.group !== "Сообщество" ? "/groups" : "/";
    return `${basePath}?${params.toString()}`;
  };

  const handleOpenPsychologistCard = () => {
    const url = getFilterQueryParams();
    if (currentPsychologist) {
      if (!currentPsychologist.id && currentPsychologist.name) {
        const generatedId = `id_${currentPsychologist.name.replace(/\s+/g, '_')}`;
        currentPsychologist.id = generatedId;
      }
      dispatch(setSelectedPsychologist(currentPsychologist));
    }
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

  const timeDifference = getTimeDifference();

  const handleSubmit = async () => {
    if (selectedSlot) {
      setIsSubmitting(true);

      try {
        // Форматируем слот в правильном формате (дата и время по МСК)
        // Используем 'd.M' для формата "23.7" (без ведущего нуля для месяца)
        // Конвертируем в московское время
        // Если timeDifference = +5, то нужно вычесть 5 часов для получения МСК
        const localDateTime = new Date(selectedSlot.date + 'T' + selectedSlot.time);
        const moscowDateTime = new Date(localDateTime.getTime() - (timeDifference * 60 * 60 * 1000));
        const formattedSlot = `${format(moscowDateTime, 'd.M')} ${format(moscowDateTime, 'HH:mm')}`;
        console.log('Форматированный слот (МСК):', formattedSlot);
        console.log('Исходная дата:', selectedSlot.date);
        console.log('Исходное время:', selectedSlot.time);
        console.log('Разница с МСК:', timeDifference);
        console.log('Локальное время:', localDateTime.toISOString());
        console.log('Московское время:', moscowDateTime.toISOString());
        console.log('ID выбранного слота:', selectedSlot.id);

        // Сохраняем в Redux
        dispatch(setSelectedSlots([formattedSlot]));
        dispatch(setSelectedSlotsObjects([selectedSlot.id])); // Сохраняем ID выбранного слота
        dispatch(setSelectedPsychologist(currentPsychologist));

        // Формируем данные для отправки на API
        const requestData = {
          anxieties: [],
          questions: formData.requests || [],
          customQuestion: [],
          diagnoses: formData.diseases || [],
          diagnoseInfo: "",
          diagnoseMedicaments: "",
          traumaticEvents: formData.traumatic || [],
          clientStates: formData.conditions || [],
          selectedPsychologistsNames: [],
          shownPsychologists: "",
          psychos: [],
          lastExperience: "",
          amountExpectations: "",
          age: formData.age || "",
          slots: [formattedSlot], // Формат "23.7 19:00"
          slots_objects: [selectedSlot.id], // ID выбранного слота
          contactType: "Telegram",
          contact: formData.phone || "",
          name: formData.username || "",
          promocode: formData.promocode || "",
          ticket_id: ticketID || "",
          emptySlots: false,
          userTimeZone: "МСК" + (timeDifference > 0 ? '+' + timeDifference : timeDifference < 0 ? timeDifference : ''),
          bid: 0,
          rid: 0,
          categoryType: formData.price_session === 'free' ? 'Бесплатно' :
            formData.price_session === '300' ? '300 руб' :
              formData.price_session === '500' ? '500 руб' :
                formData.price_session === '1000' ? '1000 руб' :
                  formData.price_session === '1500' ? '1500 руб' :
                    formData.price_session === '2000' ? '2000 руб' :
                      formData.price_session === '3000' ? '3000 руб' : 'Бесплатно',
          customCategory: "",
          question_to_psychologist: formData.requests?.join('; ') || "",
          filtered_by_automatch_psy_names: currentPsychologist?.name ? [currentPsychologist.name] : [],
          _queries: "",
          customTraumaticEvent: "",
          customState: "",
          utm_psy: currentPsychologist?.name || ""
        };

        console.log('Отправляем данные на API:', requestData);

        // Отправляем данные на API
        const response = await axios.post(
          'https://n8n-v2.hrani.live/webhook/helpful-hand-zayavka-new',
          requestData
        );

        console.log('Ответ от API:', response.data);

        if (response.status === 200) {
          // Обновляем tracking step
          await axios.put(
            'https://n8n-v2.hrani.live/webhook/update-tracking-step',
            { step: "Заявка отправлена", ticket_id: ticketID }
          );
          setShowFinalStage(true);
          return;
        }
      } catch (error) {
        console.error('Ошибка при отправке заявки:', error);
        // Можно добавить обработку ошибок, например показать toast
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  const handleSlotSelect = (slot: SimpleSlot) => {
    setSelectedSlot(slot);
  };

  if (isAllowedForSlots === false || showEmergency) {
    return <EmergencyContactsClone onClose={handleCloseEmergency} />;
  }
  if (showNoMatch && availableSlots.length === 0) {
    return <EmergencyContactsClone onClose={handleCloseNoMatch} />;
  }
  if (!filtered_by_automatch_psy.length || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
        <span className="mt-4 text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[14px] text-[#116466]">Загрузка психологов...</span>
      </div>
    );
  }
  if (showFinalStage) {
    return <FinalStage ticket_id={ticketID || ''} />;
  }
  const remainingPsychologists = filtered_by_automatch_psy.length - (currentIndex + 1);
  const method_description = {
    "Аналитическая психология": "Подход помогает глубоко исследовать причины вашего текущего состояния — включая травмы, подавленные чувства и сценарии, повторяющиеся в жизни. Работа строится не только через разговор, но и через образы: сны, символы, метафоры, МАК-карты, сказки. Здесь важна не только логика, но и воображение — как инструмент самопонимания. Вместе с психологом вы будете размышлять, исследовать свои чувства и искать смысл в личной истории",
    "Гештальт": "Подход поможет вам соединить «в моменте» мысли, чувства и эмоции - он в целом держит в фокусе ваши эмоции. Ключевая идея - вернуть вас в состояние «здесь и сейчас», дать возможность в настоящем осмыслить и понять себя и свои потребности. Помимо этого, вместе с психологом вы сможете осмыслить отношения с окружающими  - завершить те контакты, которые приносят переживания. Это очень живой и разговорный подход",
    "Психоанализ": "В этом подходе акцент делается на том, чтобы заново переосмыслить (в основном) ваш детский опыт, который влияет на убеждения и предпочтения в настоящем. Вместе с психологом вы будете искать и «выводить в свет» подавленные мысли и желания, которые сдерживают вашу энергию жизни, страсти (или по-другому - «Либидо»). Это творческий, глубинный, психодинамический подход, близкий по техникам к аналитической психологии",
    "КПТ": "Этот подход поможет вам скорректировать свое поведение и реакции, избавиться от симптомов, не затрагивая причин, что важно особенно если вы не готовы «идти туда» сейчас. В подходе огромное количество техник, которые помогают найти нерациональные негативные убеждения, а затем изменить их. Это очень логический и структурный подход, с большим объемом саморефлексии, а иногда и домашними заданиями в виде дневника мыслей и эмоций",
  }
  const getMethodDescription = (method: string | undefined): string => {
    if (method == undefined) return ''
    let description: string = ''
    switch (method) {
      case 'Аналитическая психология':
        description = method_description['Аналитическая психология']
        break
      case 'Гештальт':
        description = method_description['Гештальт']
        break
      case 'Психоанализ':
        description = method_description['Психоанализ']
        break
      case 'КПТ':
        description = method_description['КПТ']
        break
      default:
        description = ''
        break
    }
    return description
  }
  return (
    <div className="px-[50px] max-lg:px-[20px] flex w-full grow relative max-lg:overflow-y-auto">
      {isSubmitting && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-[10px]">
            <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[18px] text-[#116466]">Отправка заявки...</span>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full w-full pb-[120px] max-lg:pb-[0px]">
        {filtered_by_automatch_psy.length > 1 && <div className="flex justify-between items-center mt-[20px] max-lg:gap-[15px] min-h-[50px]">
          <>
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="flex items-center gap-[10px] cursor-pointer text-[#116466] text-[14px] lg:text-[14px] md:text-[12px] max-lg:text-[12px] text-right"
              >
                <Image src="/card/arrow_left.svg" alt="Previous" width={50} height={50} className="max-lg:w-[30px] max-lg:h-[30px]" />
                <span>Предыдущий психолог</span>
              </button>
            )}
            {currentIndex < filtered_by_automatch_psy.length - 1 && remainingPsychologists > 0 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-[10px] cursor-pointer text-left text-[#116466] text-[14px] lg:text-[14px] md:text-[12px] max-lg:text-[12px] ml-auto"
              >
                <span>Показать еще {remainingPsychologists} {getPsychologistDeclension(remainingPsychologists)}</span>
                <Image src="/card/arrow_right.svg" alt="Next" width={50} height={50} className="max-lg:w-[30px] max-lg:h-[30px]" />
              </button>
            )}
          </>
        </div>}
        <div className="flex flex-col p-[25px] max-lg:p-[15px] mb-[43px] max-lg:mb-[20px] border-[1px] rounded-[25px] scrollContainer h-[500px] overflow-y-auto mt-[20px]">
          <div className="flex justify-between items-start mb-[30px] max-lg:mb-[20px] max-[650px]:flex-col max-[650px]:gap-[15px]">
            <div className="flex gap-[20px] max-lg:gap-[15px]">
              <div className="w-[80px] h-[80px] max-lg:w-[60px] max-lg:h-[60px] rounded-full overflow-hidden">
                <Image
                  src={((currentPsychologist?.avatar || currentPsychologist?.link_photo)
                    ? getGoogleDriveImageUrl((currentPsychologist?.avatar || currentPsychologist?.link_photo)?.trim())
                    : '/images/default.jpg')}
                  alt={currentPsychologist?.name || 'Фото психолога'}
                  width={80}
                  height={80}
                  className="object-cover aspect-square rounded-full"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = '/images/default.jpg';
                    img.onerror = null;
                  }}
                  priority
                />
              </div>
              <div>
                <h3 className="text-[18px] lg:text-[18px] md:text-[16px] max-lg:text-[14px] font-semibold mb-1 whitespace-nowrap">
                  {currentPsychologist?.name}
                  {currentPsychologist?.age && currentPsychologist.age !== 0 && `, ${currentPsychologist.age} ${getAgeWord(currentPsychologist.age)}`}
                </h3>
                {currentPsychologist.group !== "Сообщество" ? (
                  <div className={`${styles_cards.experienceWrapper} px-2 py-1 rounded-full w-fit bg-[#f5f5f5]`}>
                    {currentPsychologist.experience && (
                      <span className={`${styles_cards.experience} text-[12px] whitespace-nowrap`}>
                        {
                          (currentPsychologist.group == "Супервизии" ? `Участник супервизионной группы Хранителей ${currentPsychologist.experience}` : `Участник проекта Рука помощи ${currentPsychologist.experience}`)
                        }
                      </span>
                    )}
                    {currentPsychologist.verified && (
                      <Image
                        src="/card/verified.svg"
                        alt="Verified"
                        width={23}
                        height={23}
                        style={{ marginLeft: '6px' }}
                        unoptimized
                      />
                    )}
                  </div>
                ) : (
                  <Tooltip
                    text={`${currentPsychologist.name.split(" ")[1]} как Хранитель придерживается этических правил и принципов сообщества, посещает супервизора, углубляет знания в психологии на наших мероприятиях`}
                    customMargin="35%"
                  >
                    <div className={`${styles_cards.experienceWrapper} px-2 py-1 rounded-full w-fit bg-[#f5f5f5]`}>
                      {currentPsychologist.experience && (
                        <span className={`${styles_cards.experience} text-[12px] whitespace-nowrap`}>
                          {currentPsychologist.experience} в сообществе
                        </span>
                      )}
                      {currentPsychologist.verified && (
                        <Image
                          src="/card/verified.svg"
                          alt="Verified"
                          width={23}
                          height={23}
                          style={{ marginLeft: '6px' }}
                          unoptimized
                        />
                      )}
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
            <button
              onClick={handleOpenPsychologistCard}
              className="hover:opacity-80 transition-opacity text-left cursor-pointer text-[14px] lg:text-[14px] md:text-[12px] max-lg:text-[12px] text-[#116466] flex"
            >
              Перейти на карточку психолога
            </button>
          </div>
          {/* Desktop */}
          <div className={`hidden lg:grid lg:gap-[30px] lg:mb-[30px] ${currentPsychologist.group !== "Сообщество" ? 'lg:grid-cols-2' : 'lg:grid-cols-3'}`}>
            <div>
              <span className="text-[#9A9A9A] text-[16px]">Основной подход:</span>
              <div className="flex items-center gap-[10px] mt-[5px]">
                <p className="font-semibold text-[18px] leading-[25px]">{currentPsychologist.main_modal ? currentPsychologist.main_modal : ''}</p>
                {currentPsychologist.group === "Сообщество" && (
                  <Tooltip text={getMethodDescription(currentPsychologist.main_modal) != '' ? getMethodDescription(currentPsychologist.main_modal) : "Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов."} />
                )}
              </div>
            </div>
            <div>
              <span className="text-[#9A9A9A] text-[16px]">Формат встречи:</span>
              <p className="font-semibold text-[18px] leading-[25px] mt-[5px]">Онлайн</p>
            </div>
            {currentPsychologist.group === "Сообщество" && (
              <div>
                <span className="text-[#9A9A9A] text-[16px]">Стоимость:</span>
                <div className="flex items-center gap-[10px] mt-[5px]">
                  {/* <p className="font-semibold text-[18px]">От {currentPsychologist.min_session_price || 0} ₽</p> */}
                  <p className="font-semibold text-[18px]">От 0 ₽</p>
                  <Tooltip text={`<b>Первая сессия - бесплатно. Последующие сессии по цене психолога - ${currentPsychologist.min_session_price || 0} ₽.</b>

Стоимость сессии длительностью 50-60 минут. Может меняться в зависимости от формата работы и длительности.
`} />
                </div>
              </div>
            )}
          </div>
          {/* Tablet and Mobile */}
          <div className="lg:hidden block mb-[20px]">
            <div className="flex flex-wrap gap-[10px] justify-between items-center max-w-[700px]">
              <div className="flex flex-col w-fit">
                <span className="text-[#9A9A9A] text-[14px]">Основной подход:</span>
                <div className="flex items-center gap-[10px]">
                  <p className="font-semibold text-[14px] leading-[20px]">{currentPsychologist.main_modal ? currentPsychologist.main_modal : ''}</p>
                  {currentPsychologist.group === "Сообщество" && (
                    <Tooltip text={getMethodDescription(currentPsychologist.main_modal) != '' ? getMethodDescription(currentPsychologist.main_modal) : "Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов."} />
                  )}
                </div>
              </div>
              <div className="flex flex-col w-fit">
                <span className="text-[#9A9A9A] text-[14px]">Формат встречи:</span>
                <p className="font-semibold text-[14px] leading-[20px]">Онлайн</p>
              </div>
              {currentPsychologist.group === "Сообщество" && (
                <div className="flex flex-col w-fit">
                  <span className="text-[#9A9A9A] text-[14px]">Стоимость:</span>
                  <div className="flex items-center gap-[10px]">
                    <p className="font-semibold text-[14px]">От {currentPsychologist.min_session_price || 0} ₽</p>
                    <Tooltip text="Стоимость сессии длительностью 50-60 минут. Может меняться в зависимости от формата работы и длительности." />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className={styles.nextSession}>
            <h4 className="text-[18px] font-semibold mb-[15px] max-lg:text-[14px]">Ближайшая запись:</h4>
            {availableSlots && availableSlots.length > 0 ? (
              <div className="flex gap-[10px] flex-wrap overflow-y-auto">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    className={`px-[15px] py-[8px] rounded-[50px] border whitespace-nowrap text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px] cursor-pointer max-lg:shrink-0  ${selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                      ? 'bg-[#116466] text-white border-[#116466]'
                      : 'border-[#D4D4D4] text-[#116466] hover:bg-[#116466] hover:text-white hover:border-[#116466]'
                      }`}
                  >
                    {`${format(new Date(slot.date + 'T' + slot.time), 'dd.MM')} / ${slot.time}`}
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
        <div className="pb-[20px] flex gap-[10px]">
          {/* <button
            type='button'
            onClick={() => dispatch(setApplicationStage('diseases_psychologist'))}
            disabled={isSubmitting}
            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Назад
          </button> */}
          <button
            type='submit'
            disabled={!selectedSlot || isSubmitting}
            className={`cursor-pointer flex-1 border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] flex justify-center items-center gap-[10px] ${!selectedSlot || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
          >
            Забронировать слот
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPsychologistForm; 