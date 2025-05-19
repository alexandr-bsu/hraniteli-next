import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApplicationFormData, Gender } from '@/shared/types/application.types';

const initialState: IApplicationFormData = {
  ticketID: '',
  username: '',
  age: '',
  gender_user: 'male' as Gender,
  gender_psychologist: 'other' as Gender,
  preferences: [],
  custom_preferences: '',
  actions: [],
  diseases: [],
  requests: [],
  traumatic: [],
  conditions: [],
  promocode: '',
  phone: '',
  selected_slots: [],
  selected_slots_objects: [],
  index_phyc: 0,
  has_matching_error: false,
  matching_attempts: 0
};

export const applicationFormDataSlice = createSlice({
  name: 'applicationFormData',
  initialState,
  reducers: {
    generateTicketId: (state, prefix) => {
      state.ticketID = (prefix.payload ? prefix.payload : '')+Math.random().toString(36).substring(7);
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
    setTraumatic: (state, action: PayloadAction<string[]>) => {
      state.traumatic = action.payload;
    },
    setConditions: (state, action: PayloadAction<string[]>) => {
      state.conditions = action.payload;
    },
    setPromocode: (state, action: PayloadAction<string>) => {
      state.promocode = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
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
  setTraumatic,
  setConditions,
  setPromocode,
  setPhone,
  setSelectedSlots,
  setSelectedSlotsObjects,
  setHasMatchingError,
  setIndexPhyc
} = applicationFormDataSlice.actions;

export const applicationFormDataReducer = applicationFormDataSlice.reducer;