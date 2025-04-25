import { IPsychologist, ISlot } from '@/shared/types/psychologist.types';
import { Button } from '@/shared/ui/Button';
import { COLORS } from '@/shared/constants/colors';
import Image from 'next/image';

interface PsychologistCardProps {
  psychologist: IPsychologist;
  onSlotSelect: (slot: ISlot) => void;
  selectedSlots: ISlot[];
}

export const PsychologistCard = ({ psychologist, onSlotSelect, selectedSlots }: PsychologistCardProps) => {
  return (
    <div className={`w-full border-[1px] border-[${COLORS.border}] rounded-[15px] p-[20px] flex flex-col gap-[20px]`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-[15px]">
          <div className="w-[100px] h-[100px] rounded-full overflow-hidden relative">
            <Image 
              src={psychologist.avatar || '/default-avatar.png'} 
              alt={psychologist.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-[10px]">
            <h3 className={`font-semibold text-[18px] leading-[25px] text-[${COLORS.text.primary}]`}>
              {psychologist.name}
            </h3>
            <div className="flex flex-col gap-[5px]">
              {psychologist.experience && (
                <span className={`text-[14px] leading-[19px] text-[${COLORS.text.secondary}]`}>
                  Опыт работы: {psychologist.experience}
                </span>
              )}
              {psychologist.age && (
                <span className={`text-[14px] leading-[19px] text-[${COLORS.text.secondary}]`}>
                  Возраст: {psychologist.age} лет
                </span>
              )}
              {psychologist.max_session_price && (
                <span className={`text-[14px] leading-[19px] text-[${COLORS.text.secondary}]`}>
                  Стоимость сессии: {psychologist.max_session_price} ₽
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {psychologist.slots && psychologist.slots.length > 0 && (
        <div className="flex flex-col gap-[10px]">
          <h4 className={`font-medium text-[16px] leading-[22px] text-[${COLORS.text.primary}]`}>
            Доступное время:
          </h4>
          <div className="grid grid-cols-3 gap-[10px]">
            {psychologist.slots.map((slot) => {
              const isSelected = selectedSlots.some(s => s.id === slot.id);
              return (
                <Button
                  key={slot.id}
                  onClick={() => onSlotSelect(slot)}
                  variant={isSelected ? 'primary' : 'secondary'}
                  size="sm"
                >
                  {slot.text}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {psychologist.main_modal && (
        <div className={`text-[14px] leading-[19px] text-[${COLORS.text.secondary}]`}>
          {psychologist.main_modal}
        </div>
      )}
    </div>
  );
}; 