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

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  selectedSlots: string[];
  slots_objects: any[];
  selectedPsychologist: string;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  selectedSlots: [],
  slots_objects: [],
  selectedPsychologist: ''
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
    }
  },
});

export const { openModal, closeModal, setSelectedSlots, setSlotsObjects, setSelectedPsychologist } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;