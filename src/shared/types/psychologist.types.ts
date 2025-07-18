export interface ISlot {
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

export interface IScheduleDay {
  date: string;
  slots: ISlot[];
}

export interface ISchedule {
  days: IScheduleDay[];
}

export type Experience = '1-3' | '3-5' | '5-10' | '10+';
export type Specialization = 'CBT' | 'Psychoanalysis' | 'Gestalt' | 'SystemicTherapy' | string;
export type Gender = 'male' | 'female' | 'other';

export interface IPsychologist {
  id?: string;
  name: string;
  age?: number;
  sex?: string;
  experience?: Experience;
  max_session_price?: number;
  min_session_price?: number;
  main_modal?: string;
  slots?: ISlot[];
  avatar?: string;
  specialization?: Specialization[];
  rating?: number;
  reviews_count?: number;
  pretty_date?: string;
  works_with?: string;
  gender?: string;
  mental_illness?: string[];
  mental_illness2?: string[];
  video?: boolean;
  requests?: string[];
  hour?: string[];
  dates?: string[];
  available_dates?: string[];
  available_times?: string[];
  price?: number;
  is_video?: boolean;
  telegram_id?: string | null;
  link_photo?: string;
  queries?: string;
  short_description?: string;
  additional_modals?: string | string[];
  vk?: string;
  site?: string;
  telegram?: string;
  is_married?: boolean;
  has_children?: boolean;
  link_video: string | null;
  personal_therapy?: boolean;
  personal_therapy_duration?: string;
  supervision?: boolean;
  marital_status?: string;
  verified?: boolean;
  is_verified?: boolean;
  in_community?: boolean;
  internal_number?: string;
  allow_assignment?: boolean;
  min_client_age?: number;
  max_client_age?: number;
  anketa_name?: string;
  client_sex?: string;
  number_of_clients_provided?: number;
  debt?: number;
  send_feedback?: boolean;
  send_payment_link?: boolean;
  subscription_payment_month?: string | null;
  psychologist_contact?: string | null;
  all_with_price?: boolean;
  first_free?: boolean;
  help_hand?: boolean;
  personal_therapy_type?: string | null;
  is_onboarding_finished?: boolean;
  schedule?: {
    days: {
      date: string;
      slots: {
        [key: string]: {
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
        }[];
      };
      day_name: string;
      pretty_date: string;
    }[];
  };
  education?: import("@/entities/IEducation").IEducation[];
}

// Типы для фильтрации психологов
export interface IPsychologistFilters {
  specialization?: Specialization[];
  priceRange?: {
    min: number;
    max: number;
  };
  experience?: Experience[];
  rating?: number;
}

// Типы для результатов поиска
export interface IPsychologistSearchResult {
  items: IPsychologist[];
  total: number;
  page: number;
  limit: number;
} 