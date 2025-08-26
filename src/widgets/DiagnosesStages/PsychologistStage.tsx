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
import { NoMatchError } from './NoMatchError';
import { EmergencyContacts } from './EmergencyContacts';
import axios from 'axios';

import styles from './PsychologistStage.module.scss';
import styles_cards from '../Card/Card.module.scss';
import { format } from 'date-fns';
import { getAgeWord } from '@/features/utils';
import { useSearchParams } from 'next/navigation';

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

interface ScheduleDay {
  date: string;
  slots: {
    [key: string]: Slot[];
  };
  day_name: string;
  pretty_date: string;
}

interface SimpleSlot {
  date: string;
  time: string;
  moscow_datetime_formatted: string;
}

const getGoogleDriveImageUrl = (url: string | undefined) => {
  if (!url) return '/images/default.jpg';

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

  if (!fileId) return '/images/default.jpg';

  return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

const getPsychologistDeclension = (count: number): string => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'психологов';
  }

  if (lastDigit === 1) {
    return 'психолога';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'психолога';
  }

  return 'психологов';
};

export const PsychologistStage = () => {
  const dispatch = useDispatch();

  const ticketID = useSelector<RootState, string>(
    state => state.applicationFormData.ticketID
  );




  const searchParams = useSearchParams()
  const isResearchRedirect = searchParams.get('research') == 'true'
  
  useEffect(() => {

    // Отправляем данные в трекер до выбора слотов
    // Получаем запросы из localStorage
    const storedRequests = localStorage.getItem('app_request') ?
      [JSON.parse(localStorage.getItem('app_request') || '[]')?.request] : [];

    const getNames = (users: IPsychologist[]): string[] => {
      return users.map(user => user.name);
    };

    const psy_names: string[] = getNames(filtered_by_automatch_psy)

    const requestData = {
      form: {
        anxieties: [],
        questions: storedRequests,
        customQuestion: [],
        diagnoses: localStorage.getItem('app_diseases') ?
          JSON.parse(localStorage.getItem('app_diseases') || '[]') : [],
        diagnoseInfo: "",
        diagnoseMedicaments: localStorage.getItem('app_diseases_psychologist') ?
          JSON.parse(localStorage.getItem('app_diseases_psychologist') || '{}').medications : '',
        traumaticEvents: localStorage.getItem('app_traumatic') ?
          JSON.parse(localStorage.getItem('app_traumatic') || '[]') : [],
        clientStates: localStorage.getItem('app_conditions') ?
          JSON.parse(localStorage.getItem('app_conditions') || '[]') : [],
        selectedPsychologistsNames: psy_names,
        shownPsychologists: "",
        lastExperience: "",
        amountExpectations: "",
        age: localStorage.getItem('app_age') || '',
        slots: [],
        slots_objects: [],
        contactType: "Telegram",
        contact: localStorage.getItem('app_phone') || '',
        name: localStorage.getItem('app_username') || '',
        promocode: localStorage.getItem('app_promocode') || '',
        // UPDATE: устанавливаем ticket_id из redux 
        ticket_id: ticketID || '',

        // ticket_id: localStorage.getItem('app_ticket_id') || '',
        emptySlots: false,
        userTimeZone: "МСК" + (+timeDifference > 0 ? '+' + timeDifference : timeDifference == 0 ? '' : timeDifference),
        userTimeOffsetMsk: timeDifference.toString(),
        bid: 0,
        rid: 0,
        categoryType: "",
        customCategory: "",
        question_to_psychologist: storedRequests.join('; '),
        filtered_by_automatch_psy_names: [currentPsychologist?.name],
        _queries: "",
        customTraumaticEvent: "",
        customState: ""
      },
      formPsyClientInfo: {
        age: localStorage.getItem('app_age') || '',
        city: "",
        sex: localStorage.getItem('app_gender') === 'male' ? 'Мужской' :
          localStorage.getItem('app_gender') === 'female' ? 'Женский' : '',
        psychoEducated: "",
        anxieties: [],
        customAnexiety: "",
        hasPsychoExperience: "",
        meetType: "",
        selectionСriteria: "",
        custmCreteria: "",
        importancePsycho: localStorage.getItem('app_preferences') ?
          JSON.parse(localStorage.getItem('app_preferences') || '[]') : [],
        customImportance: localStorage.getItem('app_custom_preferences') || '',
        agePsycho: "",
        sexPsycho: localStorage.getItem('app_gender_psychologist') === 'male' ? 'Мужчина' :
          localStorage.getItem('app_gender_psychologist') === 'female' ? 'Женщина' : 'Не имеет значения',
        priceLastSession: "",
        durationSession: "",
        reasonCancel: "",
        pricePsycho: "",
        reasonNonApplication: "",
        contactType: "Telegram",
        contact: localStorage.getItem('app_phone') || '',
        name: localStorage.getItem('app_username') || '',
        is_adult: parseInt(localStorage.getItem('app_age') || '0') >= 18,
        is_last_page: true,
        occupation: ""
      }
    };

    // axios({
    //   method: "put",
    //   data: { ...requestData, ticket_id: ticketID },
    //   url: "https://n8n-v2.hrani.live/webhook/update-tracker",
    // });

    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Слоты", ticket_id: ticketID },
    });
  }, [])

  const [selectedSlot, setSelectedSlot] = useState<SimpleSlot | null>(null);
  const [showNoMatch, setShowNoMatch] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [availableSlots, setAvailableSlots] = useState<SimpleSlot[]>([]);



  const filtered_by_automatch_psy = useSelector<RootState, any[]>(
    state => state.filter.filtered_by_automatch_psy
  );
  const currentIndex = useSelector((state: RootState) => state.applicationFormData.index_phyc);

  useEffect(() => {
    const fetchPsychologists = async () => {
      if (filtered_by_automatch_psy.length > 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Получаем полные данные психологов
        const { items: fullPsychologists } = await getFilteredPsychologists();
        // console.log('fullPsychologists', fullPsychologists)
        // Мерджим с текущими психологами из стора, приоритет отдаем слотам из стора
        const mergedPsychologists = fullPsychologists.map((fullPsy: IPsychologist) => {
          const existingPsy = filtered_by_automatch_psy.find(p => p.name === fullPsy.name);
          if (existingPsy) {
            return {
              ...fullPsy,
              schedule: existingPsy.schedule || fullPsy.schedule,
              slots: existingPsy.slots || fullPsy.slots
            };
          }
          return fullPsy;
        });

        if (mergedPsychologists?.length) {
          dispatch(fill_filtered_by_automatch_psy(mergedPsychologists));
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
    const loadSlots = async () => {
      try {
        const currentPsychologist = filtered_by_automatch_psy[currentIndex];
        if (!currentPsychologist?.schedule) {
          setAvailableSlots([]);
          return;
        }

        const slots: SimpleSlot[] = [];
        const schedule = currentPsychologist.schedule as Schedule;

        // Обрабатываем расписание как объект с датами
        Object.entries(schedule).forEach(([date, timeSlots]) => {

          // Проверяем что есть слоты на эту дату
          if (Object.keys(timeSlots).length > 0) {
            Object.entries(timeSlots).forEach(([time, slot]) => {
              if (slot.state === 'Свободен') {

                const moscow_datetime = new Date(`${slot.date}T${slot.time}`)
                // Время уже в нужном часовом поясе, не конвертируем
                slots.push({
                  date: date,
                  time: time,
                  moscow_datetime_formatted: format(moscow_datetime, 'dd.M HH:00'),
                });

              }
            });
          }
        });

        // Сортируем слоты по дате и времени
        const sortedSlots = slots.sort((a, b) => {
          const dateA = new Date(a.date.split('.').reverse().join('-') + ' ' + a.time);
          const dateB = new Date(b.date.split('.').reverse().join('-') + ' ' + b.time);
          return dateA.getTime() - dateB.getTime();
        });

        setAvailableSlots(sortedSlots);

      } catch (error) {
        console.error('Error loading slots:', error);
        setAvailableSlots([]);
      }
    };

    loadSlots();
  }, [currentIndex, filtered_by_automatch_psy]);

  const currentPsychologist = filtered_by_automatch_psy[currentIndex];

  const getFilterQueryParams = () => {
    const params = new URLSearchParams();

    if (currentPsychologist?.id) {
      // Убедимся, что используем ID, а не имя
      params.append('selected_psychologist', currentPsychologist.id);
    } else if (currentPsychologist?.name) {
      // Если ID отсутствует, используем name (но это временное решение)
      console.warn('ID психолога отсутствует, используем name:', currentPsychologist.name);
      // Генерируем id из имени, если его нет
      const generatedId = `id_${currentPsychologist.name.replace(/\s+/g, '_')}`;
      params.append('selected_psychologist', generatedId);
    }

    return `/?${params.toString()}`;
  };

  const handleOpenPsychologistCard = () => {
    const url = getFilterQueryParams();
    if (currentPsychologist) {

      // Проверяем наличие ID и при необходимости добавляем его
      if (!currentPsychologist.id && currentPsychologist.name) {
        const generatedId = `id_${currentPsychologist.name.replace(/\s+/g, '_')}`;
        currentPsychologist.id = generatedId;
      }

      // Устанавливаем выбранного психолога для скролла на главной странице
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
      // Время уже в нужном формате, не конвертируем
      const formattedSlot = `${selectedSlot.moscow_datetime_formatted}`;

      dispatch(setSelectedSlots([formattedSlot]));
      dispatch(setSelectedSlotsObjects([]));

      dispatch(setSelectedPsychologist(currentPsychologist))

      if (isResearchRedirect) {
        dispatch(setApplicationStage('phone'))
      } else {
        dispatch(setApplicationStage('promocode'))
      }
    }

  }


  const handleSlotSelect = (slot: SimpleSlot) => {
    // Время уже в нужном формате, не нужно комментировать
    setSelectedSlot(slot);
  };
  
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
                  src={(currentPsychologist?.avatar || currentPsychologist?.link_photo) ?
                    getGoogleDriveImageUrl(currentPsychologist?.avatar || currentPsychologist?.link_photo) :
                    '/images/default.jpg'
                  }
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


                {/* </Tooltip> */}
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
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-[30px] lg:mb-[30px]">
            <div>
              <span className="text-[#9A9A9A] text-[16px]">Основной подход:</span>
              <div className="flex items-center gap-[10px] mt-[5px]">
                {/* UPDATE: по-умолчанию значение - Аналитическая психология */}
                <p className="font-semibold text-[18px] leading-[25px]">{currentPsychologist.main_modal ? currentPsychologist.main_modal : ''}</p>
                <Tooltip text={getMethodDescription(currentPsychologist.main_modal) != '' ? getMethodDescription(currentPsychologist.main_modal) : "Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов."} />
              </div>
            </div>
            <div>
              <span className="text-[#9A9A9A] text-[16px]">Формат встречи:</span>
              <p className="font-semibold text-[18px] leading-[25px] mt-[5px]">Онлайн</p>
            </div>
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
          </div>

          {/* Tablet and Mobile */}
          <div className="lg:hidden block mb-[20px]">

            <div className="flex flex-wrap gap-[10px] justify-between items-center max-w-[700px]">
              <div className="flex flex-col w-fit">
                <span className="text-[#9A9A9A] text-[14px]">Основной подход:</span>
                <div className="flex items-center gap-[10px]">
                  {/* UPDATE: по-умолчанию значение - Аналитическая психология */}
                  <p className="font-semibold text-[14px] leading-[20px]">{currentPsychologist.main_modal ? currentPsychologist.main_modal : ''}</p>
                  <Tooltip text={getMethodDescription(currentPsychologist.main_modal) != '' ? getMethodDescription(currentPsychologist.main_modal) : "Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов."} />
                </div>
              </div>

              <div className="flex flex-col w-fit">
                <span className="text-[#9A9A9A] text-[14px]">Формат встречи:</span>
                <p className="font-semibold text-[14px] leading-[20px]">Онлайн</p>
              </div>
              <div className="flex flex-col w-fit">
                <span className="text-[#9A9A9A] text-[14px]">Стоимость:</span>
                <div className="flex items-center gap-[10px]">
                  <p className="font-semibold text-[14px]">От {currentPsychologist.min_session_price || 0} ₽</p>
                  <Tooltip text="Стоимость сессии длительностью 50-60 минут. Может меняться в зависимости от формата работы и длительности." />
                </div>
              </div>
            </div>
          </div>

          {/* <div className="max-[600px]:block hidden lg:hidden mb-[20px]">
            <div className="mb-[20px]">
              <span className="text-[#9A9A9A] text-[14px]">Основной подход:</span>
              <div className="flex items-center gap-[10px]">
                <p className="font-semibold text-[14px] leading-[20px] whitespace-nowrap">{currentPsychologist.main_modal ? currentPsychologist.main_modal : ''}</p>
                <Tooltip text={getMethodDescription(currentPsychologist.main_modal) != '' ? getMethodDescription(currentPsychologist.main_modal)  : "Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов."} />
              </div>
            </div>
            
            <div className="flex gap-[10px]">
              <div className="flex-1">
                <span className="text-[#9A9A9A] text-[14px]">Формат встречи:</span>
                <p className="font-semibold text-[14px] leading-[20px]">Онлайн</p>
              </div>
              <div className="flex-1">
                <span className="text-[#9A9A9A] text-[14px]">Стоимость:</span>
                <div className="flex items-center gap-[10px]">
                  <p className="font-semibold text-[14px]">От {currentPsychologist.min_session_price || 0} ₽</p>
                  <Tooltip text="Стоимость сессии длительностью 50-60 минут. Может меняться в зависимости от формата работы и длительности." />
                </div>
              </div>
            </div>
          </div> */}

          <div className={styles.nextSession}>
            <h4 className="text-[18px] font-semibold mb-[15px] max-lg:text-[14px]">Ближайшая запись:</h4>
            {availableSlots && availableSlots.length > 0 ? (
              <div className="flex gap-[10px] flex-wrap overflow-y-auto">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => handleSlotSelect(slot)}
                    // flex grow items-center justify-center
                    className={`px-[15px] py-[8px] rounded-[50px] border whitespace-nowrap text-[16px] lg:text-[16px] md:text-[14px] max-lg:text-[14px] cursor-pointer max-lg:shrink-0  ${selectedSlot?.date === slot.date && selectedSlot?.time === slot.time
                      ? 'bg-[#116466] text-white border-[#116466]'
                      : 'border-[#D4D4D4] text-[#116466] hover:bg-[#116466] hover:text-white hover:border-[#116466]'
                      }`}
                  >
                    {`${slot.date.split('.').slice(0, 2).join('.')} / ${slot.time}`}
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
          <button
            type='button'
            onClick={() => dispatch(setApplicationStage('diseases_psychologist'))}
            disabled={isSubmitting}
            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Назад
          </button>

          <button
            type='submit'
            disabled={!selectedSlot || isSubmitting}
            className={`cursor-pointer flex-1 border-[1px] bg-[${COLORS.primary}] p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] flex justify-center items-center gap-[10px] ${!selectedSlot || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleSubmit}
          >
            Продолжить
          </button>
        </div>
      </div>
    </div>
  );
};