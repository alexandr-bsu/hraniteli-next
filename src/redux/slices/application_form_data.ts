import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IApplicationFormData, Gender, ClientExperience, Price, PsychologistEducation, MeetingType, ChoosePreferences, LastSessionPriceResearch, SessionDuration, CancelReason } from '@/shared/types/application.types';
import { setPsychologists } from './psychologists';

const initialState: IApplicationFormData = {
  ticketID: '',
  username: '',
  age: '',
  city:'',
  cancel_reason: 'solved' as CancelReason,
  session_duration: '<1 month' as SessionDuration,
  choose_preferences: 'friends' as ChoosePreferences,
  meeting_type:'online' as MeetingType,
  psychologist_education: 'no' as PsychologistEducation,
  price_session: 'free' as Price,
  last_session_price: 'free' as LastSessionPriceResearch,
  gender_user: 'male' as Gender,
  gender_psychologist: 'other' as Gender,
  preferences: [],
  custom_preferences: '',
  experience: 'no' as ClientExperience,
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
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
    },
    setGenderUser: (state, action: PayloadAction<Gender>) => {
      state.gender_user = action.payload;
    },
    setExperienceUser: (state, action: PayloadAction<ClientExperience>) => {
      state.experience = action.payload;
    },
    setPriceSession: (state, action: PayloadAction<Price>) => {
      state.price_session = action.payload;
    },

    setLastSessionPrice: (state, action: PayloadAction<LastSessionPriceResearch>) =>{
      state.last_session_price = action.payload
    },

    setPsychologistsEducation: (state, action: PayloadAction<PsychologistEducation>) => {
      state.psychologist_education = action.payload;
    },
    setMeetingType: (state, action: PayloadAction<MeetingType>) => {
      state.meeting_type = action.payload;
    },
    setCancelReason: (state, action: PayloadAction<CancelReason>) => {
      state.cancel_reason = action.payload;
    },
    setSessionDuration: (state, action: PayloadAction<SessionDuration>) => {
      state.session_duration = action.payload;
    },
    setChoosePreferences: (state, action: PayloadAction<ChoosePreferences>) => {
      state.choose_preferences = action.payload;
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
  setPriceSession,
  setLastSessionPrice,
  setCancelReason,
  setPsychologistsEducation,
  setAge,
  setChoosePreferences,
  setGenderUser,
  setGenderPsychologist,
  setPreferences,
  setCustomPreferences,
  setActions,
  setDiseases,
  setRequests,
  setTraumatic,
  setConditions,
  setMeetingType,
  setExperienceUser,
  setPromocode,
  setPhone,
  setSelectedSlots,
  setSelectedSlotsObjects,
  setHasMatchingError,
  setSessionDuration,
  setCity,
  setIndexPhyc
} = applicationFormDataSlice.actions;

export const applicationFormDataReducer = applicationFormDataSlice.reducer;