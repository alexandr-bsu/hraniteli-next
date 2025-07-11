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
    
    const getMoscowTime = (): Date => {
      const now = new Date();
      // Московское время — это текущее UTC время +3 часа
      return new Date(now.getTime() + 3 * 60 * 60 * 1000);
    };
    
    const getTimeDifference = (): number => {
      // Смещение пользователя в часах (например, для UTC+3 вернет 3)
      const userOffset = -(new Date().getTimezoneOffset() / 60);
      const moscowOffset = 3; // Москва UTC+3
      // Разница = Московское смещение - пользовательское смещение
      return userOffset-moscowOffset;
    };  

    const offset = getTimeDifference();
    const response = await axios.post(`http://127.0.0.1:8001/schedule/${offset}`, {
      startDate,
      endDate,
      userTimeOffsetMsk: offset,
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
        userTimeZone: "МСК" + (offset > 0 ? '+'+offset : offset < 0 ? offset : '')
      }
    });

    return response.data as ScheduleResponse[];
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return null;
  }
}; 