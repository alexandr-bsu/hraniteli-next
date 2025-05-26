import { ApplicationStage } from '@/redux/slices/application_form';

export type Gender = 'male' | 'female' | 'other' | 'none';
export type ClientExperience = 'earlier' | 'in_therapy' | 'supposed' | 'no' | 'none';
export type Price = 'free' | '300' | '500' | '1000' | '1500' | '2000' | '3000';
export type ContactType = 'Telegram' | 'WhatsApp' | 'Phone';

export interface IApplicationFormData {
  ticketID: string;
  username: string;
  age: string;
  price_session: Price;
  gender_user: Gender;
  gender_psychologist: Gender;
  experience: ClientExperience;
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
  traumatic?: string[];
  conditions?: string[];
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