import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApplicationFormData, Gender } from '@/shared/types/application.types';

const initialState: IApplicationFormData = {
  ticketID: '',
  username: '',
  age: '',
  gender_user: 'male' as Gender,
  gender_psychologist: 'male' as Gender,
  preferences: [],
  custom_preferences: '',
  actions: [],
  diseases: [],
  requests: [],
  promocode: '',
  selected_slots: [],
  selected_slots_objects: [],
  index_phyc: 0,
  has_matching_error: false
};

export const applicationFormDataSlice = createSlice({
  name: 'applicationFormData',
  initialState,
  reducers: {
    generateTicketId: (state) => {
      state.ticketID = Math.random().toString(36).substring(7);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setGenderUser: (state, action: PayloadAction<Gender>) => {
      state.gender_user = action.payload;
    },
    setGenderPsychologist: (state, action: PayloadAction<Gender>) => {
      state.gender_psychologist = action.payload;
    },
    setPreferences: (state, action: PayloadAction<string[]>) => {
      state.preferences = action.payload;
    },
    setCustomPreferences: (state, action: PayloadAction<string>) => {
      state.custom_preferences = action.payload;
    },
    setActions: (state, action: PayloadAction<string[]>) => {
      state.actions = action.payload;
    },
    setDiseases: (state, action: PayloadAction<string[]>) => {
      state.diseases = action.payload;
    },
    setRequests: (state, action: PayloadAction<string[]>) => {
      state.requests = action.payload;
    },
    setPromocode: (state, action: PayloadAction<string>) => {
      state.promocode = action.payload;
    },
    setSelectedSlots: (state, action: PayloadAction<string[]>) => {
      state.selected_slots = action.payload;
    },
    setSelectedSlotsObjects: (state, action: PayloadAction<string[]>) => {
      state.selected_slots_objects = action.payload;
    },
    setHasMatchingError: (state, action: PayloadAction<boolean>) => {
      state.has_matching_error = action.payload;
    },
    setIndexPhyc: (state, action: PayloadAction<number>) => {
      state.index_phyc = action.payload;
    }
  },
});

export const {
  generateTicketId,
  setUsername,
  setAge,
  setGenderUser,
  setGenderPsychologist,
  setPreferences,
  setCustomPreferences,
  setActions,
  setDiseases,
  setRequests,
  setPromocode,
  setSelectedSlots,
  setSelectedSlotsObjects,
  setHasMatchingError,
  setIndexPhyc
} = applicationFormDataSlice.actions;

export const applicationFormDataReducer = applicationFormDataSlice.reducer;