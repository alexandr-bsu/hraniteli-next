import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { applicationFormReducer, ApplicationStage } from './slices/application_form';
import { applicationFormDataReducer } from './slices/application_form_data';
import filterReducer from './slices/filter';
import { modalReducer, ModalState } from './slices/modal';
import { psychologistsReducer } from './slices/psychologists';
import favoritesReducer from './slices/favorites';
import { IApplicationFormData } from '@/shared/types/application.types';
import { IPsychologist } from '@/shared/types/psychologist.types';

export interface RootState {
  applicationForm: {
    application_stage: ApplicationStage;
    rid: number;
    bid: number;
    is_tracker_launched: boolean
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
    available_requests: string[];
  };
  modal: ModalState;
  psychologists: IPsychologist[];
  favorites: {
    items: IPsychologist[];
  };
}

export const store = configureStore({
  reducer: {
    applicationForm: applicationFormReducer,
    applicationFormData: applicationFormDataReducer,
    filter: filterReducer,
    modal: modalReducer,
    psychologists: psychologistsReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;