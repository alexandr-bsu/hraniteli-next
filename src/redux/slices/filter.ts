import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPsychologist } from '@/shared/types/psychologist.types';
import { Gender } from '@/shared/types/application.types';

interface FilterState {
  filtered_by_automatch_psy: IPsychologist[];
  filtered_by_gender: IPsychologist[];
  filtered_by_requests: IPsychologist[];
  filtered_by_price: IPsychologist[];
  filtered_by_time: IPsychologist[];
  filtered_by_date: IPsychologist[];
  filtered_by_video: IPsychologist[];
  filtered_by_mental_illness: IPsychologist[];
  filtered_by_mental_illness2: IPsychologist[];
  filtered_by_favorites: IPsychologist[];
  dates_psychologists: IPsychologist[];
  hour_dates: string[];
  gender: Gender;
  price: number;
  time: string[];
  date: string[];
  video: boolean;
  mental_illness: boolean;
  mental_illness2: boolean;
  favorites: boolean;
  requests: string[];
  available_requests: string[];
  data_name_psychologist: string[];
  selected_psychologist: IPsychologist | null;
  blocking_questions_changed: {
    gender: boolean;
    conditions: boolean;
    traumatic: boolean;
  };
}

const initialState: FilterState = {
  filtered_by_automatch_psy: [],
  filtered_by_gender: [],
  filtered_by_requests: [],
  filtered_by_price: [],
  filtered_by_time: [],
  filtered_by_date: [],
  filtered_by_video: [],
  filtered_by_mental_illness: [],
  filtered_by_mental_illness2: [],
  filtered_by_favorites: [],
  dates_psychologists: [],
  hour_dates: [],
  gender: 'other',
  price: 0,
  time: [],
  date: [],
  video: false,
  mental_illness: false,
  mental_illness2: false,
  favorites: false,
  requests: [],
  available_requests: [],
  data_name_psychologist: [],
  selected_psychologist: null,
  blocking_questions_changed: {
    gender: false,
    conditions: false,
    traumatic: false
  }
};

export const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    fill_filtered_by_automatch_psy: (state, action: PayloadAction<IPsychologist[]>) => {
      state.filtered_by_automatch_psy = action.payload;
      state.filtered_by_gender = action.payload;
    },
    findByGender: (state, action: PayloadAction<Gender>) => {
      state.gender = action.payload;
      state.blocking_questions_changed.gender = true;
    },
    findByRequests: (state, action: PayloadAction<string[]>) => {
      state.requests = action.payload;
    },
    findByConditions: (state, action: PayloadAction<string[]>) => {
      state.blocking_questions_changed.conditions = true;
    },
    findByTraumatic: (state, action: PayloadAction<string[]>) => {
      state.blocking_questions_changed.traumatic = true;
    },
    findByPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
    },
    findByTime: (state, action: PayloadAction<string[]>) => {
      state.time = action.payload;
    },
    findByDate: (state, action: PayloadAction<string[]>) => {
      state.date = action.payload;
    },
    findByVideo: (state, action: PayloadAction<boolean>) => {
      state.video = action.payload;
    },
    findByMental_Illness: (state, action: PayloadAction<boolean>) => {
      state.mental_illness = action.payload;
    },
    findByMental_Illness2: (state, action: PayloadAction<boolean>) => {
      state.mental_illness2 = action.payload;
    },
    findByFavorites: (state, action: PayloadAction<{ favoriteIds: string[], enabled: boolean }>) => {
      state.favorites = action.payload.enabled;
      if (action.payload.enabled) {
        state.filtered_by_favorites = state.filtered_by_automatch_psy.filter(psy => 
          psy.id && action.payload.favoriteIds.includes(psy.id)
        );
      } else {
        state.filtered_by_favorites = [...state.filtered_by_automatch_psy];
      }
    },
    setDatesPsychologists: (state, action: PayloadAction<IPsychologist[]>) => {
      state.dates_psychologists = action.payload;
    },
    setHourDates: (state, action: PayloadAction<string[]>) => {
      state.hour_dates = action.payload;
    },
    setDataNamePsychologist: (state, action: PayloadAction<string[]>) => {
      state.data_name_psychologist = action.payload;
    },
    setSelectedPsychologist: (state, action: PayloadAction<IPsychologist>) => {
      state.selected_psychologist = action.payload;
    },
    setAvailableRequests: (state, action: PayloadAction<string[]>) => {
      state.available_requests = action.payload;
    },
    resetBlockingQuestions: (state) => {
      state.blocking_questions_changed = {
        gender: false,
        conditions: false,
        traumatic: false
      };
    }
  },
});

export const {
  fill_filtered_by_automatch_psy,
  findByGender,
  findByRequests,
  findByPrice,
  findByTime,
  findByDate,
  findByVideo,
  findByMental_Illness,
  findByMental_Illness2,
  findByFavorites,
  setDatesPsychologists,
  setHourDates,
  setDataNamePsychologist,
  setSelectedPsychologist,
  setAvailableRequests,
  findByConditions,
  findByTraumatic,
  resetBlockingQuestions
} = filterSlice.actions;

export default filterSlice.reducer;