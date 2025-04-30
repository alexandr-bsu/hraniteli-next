import { ApplicationStage } from '@/redux/slices/application_form';

export type Gender = 'male' | 'female' | 'other' | 'none';
export type ContactType = 'Telegram' | 'WhatsApp' | 'Phone';

export interface IApplicationFormData {
  ticketID: string;
  username: string;
  age: string;
  gender_user: Gender;
  gender_psychologist: Gender;
  preferences: string[];
  custom_preferences: string;
  actions: string[];
  diseases: string[];
  requests: string[];
  promocode: string;
  phone: string;
  selected_slots: string[];
  selected_slots_objects: string[];
  index_phyc: number;
  has_matching_error: boolean;
  matching_attempts: number;
}

// Состояние формы заявки в Redux
export interface IApplicationFormState {
  application_stage: ApplicationStage;
  applicationFormData: IApplicationFormData;
  maxIndex: number;
}

// Данные для отправки на сервер
export interface IApplicationSubmitData {
  anxieties: string[];
  questions: string[];
  customQuestion: string[];
  diagnoses: string[];
  diagnoseMedicaments: string;
  diagnoseInfo: boolean;
  traumaticEvents: string[];
  clientStates: string[];
  selectedPsychologistsNames: string[];
  age: number;
  slots: string[];
  slots_objects: string[];
  contactType: ContactType;
  contact: string;
  name: string;
  promocode: string;
  ticket_id: string;
  userTimeZone: number;
  userTimeOffsetMsk: number;
} 