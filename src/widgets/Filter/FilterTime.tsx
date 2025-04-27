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
}

export const FilterTime: React.FC<FilterTimeProps> = ({ open, type, onBack, onSubmit, selectedDate }) => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

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
    <ModalWindow className='max-[425px]:h-[400px]' open={open} closeButton={false} type={type}>
      <DialogHeader className="flex flex-row items-center">
        <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">
          Выберите подходящие для Вас время:
        </DialogTitle>
        <DialogClose className="w-[40px] h-[40px] shrink-0 flex justify-center items-center border-2 border-[#D4D4D4] rounded-full">
          <Image src={'/modal/cross.svg'} alt="cross" height={15} width={15} />
        </DialogClose>
      </DialogHeader>

      <div className="grid grid-cols-5 gap-4 mt-6 max-lg:grid-cols-3">
        {times.map((time) => (
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
        ))}
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
          className="px-6 py-2 bg-[#116466] text-white rounded-full hover:opacity-90 transition-opacity"
        >
          Далее
        </button>
      </div>
    </ModalWindow>
  );
};