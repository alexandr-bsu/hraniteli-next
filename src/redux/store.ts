import { configureStore } from '@reduxjs/toolkit';
import { applicationFormReducer } from './slices/application_form';
import { applicationFormDataReducer } from './slices/application_form_data';
import filterReducer from './slices/filter';
import { modalReducer } from './slices/modal';
import { IApplicationFormData } from '@/shared/types/application.types';
import { IPsychologist } from '@/shared/types/psychologist.types';

export interface RootState {
  applicationForm: {
    application_stage: string;
  };
  applicationFormData: IApplicationFormData;
  filter: {
    filtered_by_automatch_psy: IPsychologist[];
    gender: string;
    requests: IPsychologist[];
    basic_approach: string;
    dates: IPsychologist[];
    times: IPsychologist[];
    price: number;
    video: boolean;
    data_name_psychologist: IPsychologist[];
    dates_psychologists: IPsychologist[];
    hour_dates: IPsychologist[];
    mental_illness: boolean;
    mental_illness2: boolean;
  };
  modal: {
    isOpen: boolean;
    content: React.ReactNode;
    type: string | null;
    selectedSlots: string[];
    slots_objects: any[];
    selectedPsychologist: string;
  };
}

export type ModalType = 'FilterRequest' | 'Contact' | 'Slots' | null;

export interface ModalState {
    isOpen: boolean;
    type: ModalType;
    content: React.ReactNode;
    selectedSlots?: string[];
    slots_objects?: any[];
    selectedPsychologist?: string;
}

export const store = configureStore({
  reducer: {
    applicationForm: applicationFormReducer,
    applicationFormData: applicationFormDataReducer,
    filter: filterReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;