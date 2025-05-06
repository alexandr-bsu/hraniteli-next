import axios from 'axios';

export interface ScheduleItem {
  date: string;
  slots: {
    [key: string]: string[];
  };
  day_name: string;
  pretty_date: string;
}

export interface ScheduleResponse {
  date: string;
  items: ScheduleItem[];
}

export const getStartAndEndDates = () => {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - today.getDay() + 1); // Получаем понедельник текущей недели
  
  const endDate = new Date(monday);
  endDate.setDate(monday.getDate() + 28); // +4 недели
  
  return {
    startDate: monday.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0]
  };
};

export const getSchedule = async () => {
  try {
    const { startDate, endDate } = getStartAndEndDates();
    
    const response = await axios.post('https://n8n-v2.hrani.live/webhook/get-aggregated-psychologist-schedule', {
      startDate,
      endDate,
      userTimeOffsetMsk: 0,
      ageFilter: "",
      formPsyClientInfo: {
        age: "",
        sex: "",
        sexPsycho: "Не имеет значения",
        is_adult: true,
        is_last_page: false
      },
      form: {
        emptySlots: false,
        userTimeZone: "МСК"
      }
    });

    return response.data as ScheduleResponse[];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return null;
  }
}; 