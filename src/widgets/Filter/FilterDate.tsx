import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '@/redux/slices/modal';
import axios from 'axios'
import { RootState } from '@/redux/store';
import { setDatesPsychologists, setHourDates } from '@/redux/slices/filter';
import { getTimeDifference } from '@/features/utils';
import { ModalType } from '@/redux/slices/modal';
import { FilterTime } from './FilterTime';

interface DateSlot {
  psychologist: string;
  time: string;
  date: string;
}

interface DateItem {
  pretty_date: string;
  slots: {
    [hour: string]: DateSlot[];
  };
}

interface ScheduleResponse {
  items: DateItem[];
}

interface FilterDateProps {
  open?: boolean;
  type: ModalType;
  callback: () => void;
  onSubmit: (dates: { date: string; slots?: string[] }[]) => void;
  selectedDates?: string[];
}

export const FilterDate: React.FC<FilterDateProps> = ({ open, type, callback, onSubmit }) => {
  const dispatch = useDispatch();

  const [availableDates, setAvailableDates] = useState<DateItem[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [currentDate, setCurrentDate] = useState<string>('');

  const psychologists = useSelector<RootState>(state => state.filter.data_name_psychologist) as string[];

  const [datePsychologists, setDatePsychologists] = useState<DateItem[]>();

  const hours = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00',
  ]

  useEffect(() => {
    const fetchDates = async () => {
      try {
        setLoading(true);
        const timeDifference = getTimeDifference();

        if (!psychologists?.length) {
          return;
        }

        const allDates: DateItem[] = [];
        
        for (const psychologist of psychologists) {
          const encodedName = encodeURIComponent(psychologist.trim());
          
          try {
            const requestUrl = `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur`;
            const requestParams = {
              psychologist: encodedName,
              userTimeOffsetMsk: timeDifference || 0,
              utm_psy: encodedName
            };
            
            const response = await axios.get(requestUrl, { params: requestParams });
            
            if (response.data?.[0]?.items?.length > 0) {
              allDates.push(...response.data[0].items.filter((item: any) => 
                // Проверяем, что в слотах есть хотя бы один час с данными
                Object.values(item.slots || {}).some((slot: any) => slot && slot.length > 0)
              ));
            }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error('Ошибка при запросе дат для психолога', psychologist, ':', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: {
                  url: error.config?.url,
                  params: error.config?.params
                }
              });
            } else {
              console.error('Неизвестная ошибка при запросе дат для психолога', psychologist, ':', error);
            }
          }
        }

        // Убираем дубликаты дат
        const uniqueDates = allDates.filter((item, index, self) =>
          index === self.findIndex((t) => t.pretty_date === item.pretty_date)
        );

        setAvailableDates(uniqueDates);
        setDatePsychologists(uniqueDates);

      } catch (error) {
        console.error('Общая ошибка при загрузке дат:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchDates();
    }
  }, [open, psychologists]);

  useEffect(() => {
    if (!datePsychologists?.length) return;

    const notDublicate = [] as string[];
    datePsychologists.forEach(element => {
      if (!notDublicate.includes(element.pretty_date)) {
        notDublicate.push(element.pretty_date);         
      }
    }); 

    setSelectedDates(notDublicate);

    const result = [] as any[];
    
    psychologists.forEach((psychologist: string) => {
      datePsychologists.forEach((item) => {
        Object.entries(item.slots || {}).forEach(([hour, slots]: [string, any]) => {
          if (Array.isArray(slots) && slots.some(slot => slot.psychologist === psychologist)) {
            result.push({
              element1: psychologist,
              hour,
              pretty_date: item.pretty_date
            });
          }
        });
      });
    });

    if (result.length > 0) {
      dispatch(setHourDates(result));
      // Преобразуем DateItem[] в IPsychologist[] для Redux
      const psychologistsData = psychologists.map(name => ({
        name,
        link_video: null,
        available_dates: datePsychologists
          .filter(item => 
            Object.values(item.slots || {})
              .flat()
              .some(slot => slot.psychologist === name)
          )
          .map(item => item.pretty_date)
      }));
      dispatch(setDatesPsychologists(psychologistsData));
    }

  }, [datePsychologists, psychologists, dispatch]);

  const handleDateClick = (date: string) => {
    setCurrentDate(date);
    const newSelectedDates = selectedDates.includes(date)
      ? selectedDates.filter(d => d !== date)
      : [...selectedDates, date];
    
    setSelectedDates(newSelectedDates);
  };

  const handleTimeSubmit = (times: string[]) => {
    const selectedDateItems = availableDates
      .filter(item => item.pretty_date === currentDate)
      .map(item => ({
        date: item.pretty_date,
        slots: times
      }));

    onSubmit(selectedDateItems);
    setShowTimeModal(false);
    callback();
  };

  return (
    <>
      <ModalWindow className='max-[425px]:h-[400px]' open={open && !showTimeModal} closeButton={false} type={type}>
        <DialogHeader className="flex flex-row items-center">
          <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">
            Выберите подходящую для Вас дату:
          </DialogTitle>
          <DialogClose 
            onClick={callback}
            className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full"
          >
            <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
          </DialogClose>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="w-8 h-8 border-4 border-[#116466] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 mt-6 max-lg:grid-cols-3">
            {availableDates.map((item, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(item.pretty_date)}
                className={`
                  px-4 py-2 rounded-full text-center transition-colors
                  ${selectedDates.includes(item.pretty_date)
                    ? 'bg-[#116466] text-white'
                    : 'border border-[#116466] text-[#116466] hover:bg-[#116466] hover:text-white'
                  }
                `}
              >
                {item.pretty_date}
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={() => {
              if (selectedDates.length > 0) {
                setShowTimeModal(true);
              }
            }}
            className="px-6 py-2 bg-[#116466] text-white rounded-full hover:opacity-90 transition-opacity"
          >
            Далее
          </button>
        </div>
      </ModalWindow>

      <FilterTime
        open={showTimeModal}
        type="FilterTime"
        onBack={() => setShowTimeModal(false)}
        onSubmit={handleTimeSubmit}
        selectedDate={currentDate}
      />
    </>
  );
};