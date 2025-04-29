import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ModalType } from '@/redux/slices/modal';
import { getSchedule, ScheduleItem } from '@/features/actions/getSchedule';
import { FilterTime } from './FilterTime';

interface FilterDateProps {
  open?: boolean;
  type: ModalType;
  callback: () => void;
  onSubmit: (dates: { date: string; slots?: string[] }[]) => void;
  selectedDateInfo?: { date: string; slots?: string[] };
}

export const FilterDate: React.FC<FilterDateProps> = ({ 
  open, 
  type, 
  callback, 
  onSubmit,
  selectedDateInfo 
}) => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTimeSelect, setShowTimeSelect] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateItem, setSelectedDateItem] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    if (open) {
      loadSchedule();
      setShowTimeSelect(false);
      setSelectedDate('');
      setSelectedDateItem(null);
    }
  }, [open]);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await getSchedule();
      if (data && data[0]?.items) {
        setSchedule(data[0].items);
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasAvailableSlots = (slots: { [key: string]: string[] }) => {
    return Object.values(slots).some(slotArray => slotArray && slotArray.length > 0);
  };

  const getAvailableTimes = (slots: { [key: string]: string[] }) => {
    return Object.entries(slots)
      .filter(([_, slotArray]) => slotArray && slotArray.length > 0)
      .map(([time]) => time);
  };

  const handleDateClick = (date: string, item: ScheduleItem) => {
    setSelectedDate(date);
    setSelectedDateItem(item);
    setShowTimeSelect(true);
  };

  const handleTimeSubmit = (times: string[]) => {
    if (selectedDate) {
      const dateItem = {
        date: selectedDate,
        slots: times
      };
      onSubmit([dateItem]);
      setShowTimeSelect(false);
      callback();
    }
  };

  const handleBackFromTime = () => {
    setShowTimeSelect(false);
    setSelectedDate('');
    setSelectedDateItem(null);
  };

  if (showTimeSelect && selectedDateItem) {
    return (
      <FilterTime
        type={type}
        open={true}
        onBack={handleBackFromTime}
        onSubmit={handleTimeSubmit}
        selectedDate={selectedDate}
        availableSlots={selectedDateItem.slots}
      />
    );
  }

  return (
    <ModalWindow className='max-[425px]:h-[240px] max-lg:p-[16px]' closeButton={false} type={type}>
      <DialogHeader className="flex flex-row items-center max-lg:mb-[16px]">
        <DialogTitle className="grow font-semibold text-[20px] leading-[27px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] max-lg:leading-[22px]">
          Выберите дату сессии
        </DialogTitle>
        <DialogClose onClick={callback} className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
          <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
        </DialogClose>
      </DialogHeader>

      <div className="grid grid-cols-2 gap-4 mt-4 max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="col-span-2 flex justify-center items-center p-8">
            <div className="w-8 h-8 border-4 border-[#116466] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : schedule.length > 0 ? (
          schedule.map((item, index) => {
            if (!hasAvailableSlots(item.slots)) return null;

            const isSelected = selectedDateInfo?.date === item.pretty_date;
            const availableTimes = getAvailableTimes(item.slots);
            
            return (
              <button
                key={index}
                onClick={() => handleDateClick(item.pretty_date, item)}
                className={`p-4 rounded-lg text-left ${
                  isSelected 
                    ? 'bg-[#116466] text-white' 
                    : 'bg-[#FAFAFA] hover:bg-[#E5E5E5]'
                }`}
              >
                <div className="font-medium">{item.pretty_date} ({item.day_name})</div>
                <div className="text-sm mt-1">
                  {availableTimes.slice(0, 3).join(', ')}
                  {availableTimes.length > 3 && '...'}
                </div>
              </button>
            );
          })
        ) : (
          <div className="col-span-2 text-center p-8 text-gray-500">
            Нет доступных дат для записи
          </div>
        )}
      </div>
    </ModalWindow>
  );
};