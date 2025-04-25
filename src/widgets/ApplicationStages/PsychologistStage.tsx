import { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toNextStage } from '@/redux/slices/application_form';
import { RootState } from '@/redux/store';
import { usePsychologistSchedule } from '@/features/hooks/usePsychologistSchedule';
import { PsychologistCard } from '@/widgets/PsychologistCard/PsychologistCard';
import { ISlot } from '@/shared/types/psychologist.types';
import { setSelectedSlots, setSelectedSlotsObjects } from '@/redux/slices/application_form_data';
import { Button } from '@/shared/ui/Button';
import { COLORS } from '@/shared/constants/colors';

export const PsychologistStage = () => {
  const dispatch = useDispatch();
  const { loading, error, fetchSchedule } = usePsychologistSchedule();
  const [selectedSlots, setLocalSelectedSlots] = useState<ISlot[]>([]);

  const filtered_persons = useSelector((state: RootState) => state.filter.filtered_by_automatch_psy);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const handleSlotSelect = useCallback((slot: ISlot) => {
    setLocalSelectedSlots(prev => {
      const isSelected = prev.some(s => s.id === slot.id);
      if (isSelected) {
        return prev.filter(s => s.id !== slot.id);
      }
      return [...prev, slot];
    });
  }, []);

  const handleSubmit = useCallback(() => {
    if (selectedSlots.length === 0) {
      alert('Пожалуйста, выберите время для сессии');
      return;
    }

    dispatch(setSelectedSlots(selectedSlots.map(slot => slot.text)));
    dispatch(setSelectedSlotsObjects(selectedSlots.map(slot => slot.id)));
    dispatch(toNextStage('gratitude'));
  }, [selectedSlots, dispatch]);

  const loadingContent = useMemo(() => (
    <div className="w-full h-full flex justify-center items-center">
      <span className={`text-[18px] leading-[25px] text-[${COLORS.text.primary}]`}>
        Загрузка психологов...
      </span>
    </div>
  ), []);

  const errorContent = useMemo(() => (
    <div className="w-full h-full flex justify-center items-center">
      <span className={`text-[18px] leading-[25px] text-[${COLORS.error}]`}>{error}</span>
    </div>
  ), [error]);

  if (loading) return loadingContent;
  if (error) return errorContent;

  return (
    <div className="w-full flex flex-col gap-[30px] p-[20px] pb-[100px]">
      <div className="grid grid-cols-1 gap-[20px]">
        {filtered_persons.map((psychologist) => (
          <PsychologistCard
            key={psychologist.name}
            psychologist={psychologist}
            onSlotSelect={handleSlotSelect}
            selectedSlots={selectedSlots}
          />
        ))}
      </div>

      <div className={`fixed bottom-0 left-0 w-full bg-[${COLORS.white}] border-t border-[${COLORS.border}] p-[20px]`}>
        <div className="flex justify-between items-center max-w-[960px] mx-auto">
          <div className="flex flex-col">
            <span className={`text-[16px] leading-[22px] text-[${COLORS.text.primary}]`}>
              Выбрано слотов: {selectedSlots.length}
            </span>
          </div>
          <Button
            onClick={handleSubmit}
            size="lg"
          >
            Продолжить
          </Button>
        </div>
      </div>
    </div>
  );
};