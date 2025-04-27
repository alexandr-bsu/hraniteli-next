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
  dates_psychologists: IPsychologist[];
  hour_dates: string[];
  gender: Gender;
  price: number;
  time: string[];
  date: string[];
  video: boolean;
  mental_illness: boolean;
  mental_illness2: boolean;
  requests: string[];
  data_name_psychologist: string[];
  selected_psychologist: IPsychologist | null;
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
  dates_psychologists: [],
  hour_dates: [],
  gender: 'other',
  price: 0,
  time: [],
  date: [],
  video: false,
  mental_illness: false,
  mental_illness2: false,
  requests: [],
  data_name_psychologist: [],
  selected_psychologist: null,
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
      if (action.payload === 'other' || action.payload === 'none') {
        state.filtered_by_gender = [...state.filtered_by_automatch_psy];
      } else {
        state.filtered_by_gender = state.filtered_by_automatch_psy.filter(psy => {
          const matches = psy.sex === (action.payload === 'male' ? 'Мужчина' : 'Женщина');
          return matches;
        });
      }
    },
    findByRequests: (state, action: PayloadAction<string[]>) => {
      state.requests = action.payload;
      state.filtered_by_requests = state.filtered_by_automatch_psy.filter(psy => 
        action.payload.every(request => psy.requests?.includes(request))
      );
    },
    findByPrice: (state, action: PayloadAction<number>) => {
      state.price = action.payload;
      state.filtered_by_price = state.filtered_by_automatch_psy.filter(psy => 
        (psy.price ?? 0) <= action.payload
      );
    },
    findByTime: (state, action: PayloadAction<string[]>) => {
      state.time = action.payload;
      state.filtered_by_time = state.filtered_by_automatch_psy.filter(psy => 
        action.payload.every(time => psy.available_times?.includes(time))
      );
    },
    findByDate: (state, action: PayloadAction<string[]>) => {
      state.date = action.payload;
      state.filtered_by_date = state.filtered_by_automatch_psy.filter(psy => 
        action.payload.every(date => psy.available_dates?.includes(date))
      );
    },
    findByVideo: (state, action: PayloadAction<boolean>) => {
      state.video = action.payload;
      state.filtered_by_video = state.filtered_by_automatch_psy.filter(psy => 
        action.payload ? Boolean(psy.is_video || psy.video || psy.link_video) : true
      );
    },
    findByMental_Illness: (state, action: PayloadAction<boolean>) => {
      state.mental_illness = action.payload;
      state.filtered_by_mental_illness = state.filtered_by_automatch_psy.filter(psy => 
        (psy.mental_illness?.length ?? 0) > 0
      );
    },
    findByMental_Illness2: (state, action: PayloadAction<boolean>) => {
      state.mental_illness2 = action.payload;
      state.filtered_by_mental_illness2 = state.filtered_by_automatch_psy.filter(psy => 
        (psy.mental_illness2?.length ?? 0) > 0
      );
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
  setDatesPsychologists,
  setHourDates,
  setDataNamePsychologist,
  setSelectedPsychologist,
} = filterSlice.actions;

export default filterSlice.reducer;