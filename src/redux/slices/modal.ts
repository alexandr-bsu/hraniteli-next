import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 
  | 'FilterRequest'
  | 'FilterGender'
  | 'FilterPrice'
  | 'FilterDate'
  | 'FilterTime'
  | 'Time'
  | 'Contact'
  | 'ContactForm'
  | null;

interface Slot {
  date: string;
  time: string;
}

export interface ModalState {
  isOpen: boolean;
  type: string | null;
  selectedSlots: string[];
  slots_objects: any[];
  selectedPsychologist: string;
  selectedDate: string | null;
  selectedSlot: Slot | null;
  content: React.ReactNode;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  content: null,
  selectedSlots: [],
  slots_objects: [],
  selectedPsychologist: '',
  selectedDate: '',
  selectedSlot: null
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<ModalType>) => {
      state.isOpen = true;
      state.type = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.type = null;
    },
    setSelectedSlots: (state, action: PayloadAction<string[]>) => {
      state.selectedSlots = action.payload;
    },
    setSlotsObjects: (state, action: PayloadAction<any[]>) => {
      state.slots_objects = action.payload;
    },
    setSelectedPsychologist: (state, action: PayloadAction<string>) => {
      state.selectedPsychologist = action.payload;
    },
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },
    setSelectedSlot: (state, action: PayloadAction<Slot | null>) => {
      state.selectedSlot = action.payload;
    }
  },
});

export const { 
  openModal, 
  closeModal, 
  setSelectedSlots, 
  setSlotsObjects, 
  setSelectedPsychologist,
  setSelectedDate,
  setSelectedSlot
} = modalSlice.actions;
export const modalReducer = modalSlice.reducer;