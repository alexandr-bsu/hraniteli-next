import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useState } from 'react';
import { ModalType } from '@/redux/slices/modal';

interface FilterTimeProps {
  open?: boolean;
  type: ModalType;
  onBack: () => void;
  onSubmit: (times: string[]) => void;
  selectedDate: string;
  availableSlots?: { [key: string]: string[] };
  onClose: () => void;
}

export const FilterTime: React.FC<FilterTimeProps> = ({ 
  open, 
  type, 
  onBack, 
  onSubmit, 
  selectedDate,
  availableSlots = {},
  onClose
}) => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const availableTimes = Object.keys(availableSlots || {}).filter(time => 
    availableSlots?.[time] && availableSlots[time].length > 0
  );

  const handleTimeClick = (time: string) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        return prev.filter(t => t !== time);
      }
      return [...prev, time];
    });
  };

  const handleSubmit = () => {
    onSubmit(selectedTimes);
  };

  return (
    <ModalWindow 
      className='max-[425px]:h-[400px]' 
      open={open} 
      closeButton={false} 
      type={type}
      onOpenChange={onClose}
    >
      <DialogHeader className="flex flex-row items-center">
        <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">
          Выберите время сессии на {selectedDate}:
        </DialogTitle>
        <button onClick={onClose} className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
          <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
        </button>
      </DialogHeader>

      <div className="grid grid-cols-5 gap-4 mt-6 max-lg:grid-cols-3">
        {availableTimes.length > 0 ? (
          availableTimes.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              className={`
                px-4 py-2 rounded-full text-center transition-colors
                ${selectedTimes.includes(time)
                  ? 'bg-[#116466] text-white'
                  : 'border border-[#116466] text-[#116466] hover:bg-[#116466] hover:text-white'
                }
              `}
            >
              {time}
            </button>
          ))
        ) : (
          <div className="col-span-5 text-center p-8 text-gray-500">
            Нет доступных слотов на выбранную дату
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-[#116466] text-[#116466] rounded-full hover:bg-[#116466] hover:text-white transition-colors"
        >
          Назад
        </button>
        <button
          onClick={handleSubmit}
          disabled={selectedTimes.length === 0}
          className={`px-6 py-2 rounded-full transition-colors ${
            selectedTimes.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#116466] text-white hover:opacity-90'
          }`}
        >
          Выбрать
        </button>
      </div>
    </ModalWindow>
  );
};