import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPsychologist } from '@/shared/types/psychologist.types';
import { Gender } from '@/shared/types/application.types';

interface FilterState {
  filtered_by_automatch_psy: IPsychologist[];
  filtered_by_slots_psy: IPsychologist[];
  filtered_by_gender: IPsychologist[];
  filtered_by_requests: IPsychologist[];
  filtered_by_basic_approach: IPsychologist[];
  filtered_by_dates: IPsychologist[];
  filtered_by_times: IPsychologist[];
  gender: string;
  requests: string[];
  basic_approach: string;
  dates: string[];
  times: string[];
  available_requests: string[];
  filtered_by_price: IPsychologist[];
  filtered_by_time: IPsychologist[];
  filtered_by_date: IPsychologist[];
  filtered_by_video: IPsychologist[];
  filtered_by_mental_illness: IPsychologist[];
  filtered_by_favorites: IPsychologist[];
  dates_psychologists: IPsychologist[];
  hour_dates: string[];
  price: number;
  video: boolean;
  mental_illness: boolean;
  favorites: boolean;
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
  filtered_by_slots_psy: [],
  filtered_by_gender: [],
  filtered_by_requests: [],
  filtered_by_basic_approach: [],
  filtered_by_dates: [],
  filtered_by_times: [],
  gender: '',
  requests: [],
  basic_approach: '',
  dates: [],
  times: [],
  available_requests: [],
  filtered_by_price: [],
  filtered_by_time: [],
  filtered_by_date: [],
  filtered_by_video: [],
  filtered_by_mental_illness: [],
  filtered_by_favorites: [],
  dates_psychologists: [],
  hour_dates: [],
  price: 0,
  video: false,
  mental_illness: false,
  favorites: false,
  data_name_psychologist: [],
  selected_psychologist: null,
  blocking_questions_changed: {
    gender: false,
    conditions: false,
    traumatic: false
  },
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    fill_filtered_by_automatch_psy: (state, action: PayloadAction<IPsychologist[]>) => {
      state.filtered_by_automatch_psy = action.payload;
      state.filtered_by_gender = action.payload;
    },
    fill_filtered_by_slots_psy: (state, action: PayloadAction<IPsychologist[]>) => {
      state.filtered_by_slots_psy = action.payload;
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
      if (action.payload > 0) {
        state.filtered_by_price = state.filtered_by_automatch_psy.filter(psy => 
          (psy.min_session_price || 0) >= action.payload
        );
      } else {
        state.filtered_by_price = [...state.filtered_by_automatch_psy];
      }
    },
    findByTime: (state, action: PayloadAction<string[]>) => {
      state.times = action.payload;
    },
    findByDate: (state, action: PayloadAction<string[]>) => {
      state.dates = action.payload;
    },
    findByVideo: (state, action: PayloadAction<boolean>) => {
      state.video = action.payload;
    },
    findByMental_Illness: (state, action: PayloadAction<boolean>) => {
      state.mental_illness = action.payload;
      if (action.payload) {
        state.filtered_by_mental_illness = state.filtered_by_automatch_psy.filter(psy => 
          psy.works_with?.includes('Есть диагностированное психиатрическое заболевание (ПРЛ, БАР, ПТСР и др)')
        );
      } else {
        state.filtered_by_mental_illness = [...state.filtered_by_automatch_psy];
      }
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
    },
  },
});

export const {
  fill_filtered_by_automatch_psy,
  fill_filtered_by_slots_psy,
  findByGender,
  findByRequests,
  findByPrice,
  findByTime,
  findByDate,
  findByVideo,
  findByMental_Illness,
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