import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PsychologistService } from '@/shared/api/api.service';
import { fill_filtered_by_automatch_psy } from '@/redux/slices/filter';
import { RootState } from '@/redux/store';
import { IApplicationSubmitData } from '@/shared/types/application.types';
import { IPsychologist, ISlot } from '@/shared/types/psychologist.types';

interface ScheduleItem {
  slots: Record<string, ISlot[]>;
}

interface ScheduleResponse {
  items: ScheduleItem[];
}

interface UsePsychologistScheduleReturn {
  loading: boolean;
  error: string | null;
  fetchSchedule: () => Promise<void>;
}

export const usePsychologistSchedule = (): UsePsychologistScheduleReturn => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applicationFormData = useSelector((state: RootState) => state.applicationFormData);

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const submitData: IApplicationSubmitData = {
        anxieties: [],
        questions: [],
        customQuestion: [],
        diagnoses: [applicationFormData.diseases[0]],
        diagnoseMedicaments: 'Нет',
        diagnoseInfo: false,
        traumaticEvents: [...applicationFormData.actions, applicationFormData.custom_preferences],
        clientStates: applicationFormData.preferences,
        selectedPsychologistsNames: [],
        age: Number(applicationFormData.age),
        slots: [],
        slots_objects: [],
        contactType: 'Telegram',
        contact: '+71234567890',
        name: applicationFormData.username,
        promocode: applicationFormData.promocode,
        ticket_id: applicationFormData.ticketID,
        userTimeZone: new Date().getTimezoneOffset() / -60,
        userTimeOffsetMsk: new Date().getTimezoneOffset() / -60,
      };

      const [scheduleData, psychologists] = await Promise.all([
        PsychologistService.getSchedule(submitData) as Promise<ScheduleResponse>,
        PsychologistService.getAll()
      ]);

      // Обработка слотов
      const allSlots = scheduleData.items.flatMap(item => 
        Object.values(item.slots).flat()
      ).filter(Boolean);

      // Группировка по психологам
      const psychologistNames = new Set(allSlots.map(slot => slot.psychologist));
      const persons = Array.from(psychologistNames).map(name => {
        const slots = allSlots.filter(slot => slot.psychologist === name);
        const psychologist = psychologists.find(p => p.name === name);
        
        return {
          name,
          slots,
          experience: psychologist?.experience,
          age: psychologist?.age,
          max_session_price: psychologist?.max_session_price,
          main_modal: psychologist?.main_modal,
        } as IPsychologist;
      });

      dispatch(fill_filtered_by_automatch_psy(persons));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при загрузке расписания';
      setError(errorMessage);
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  }, [applicationFormData, dispatch]);

  return {
    loading,
    error,
    fetchSchedule,
  };
}; 