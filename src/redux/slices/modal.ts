import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ModalType = 
  | 'FilterRequest'
  | 'FilterGender'
  | 'FilterPrice'
  | 'FilterDate'
  | 'FilterTime'
  | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;
  selectedSlots?: string[];
  content: any;
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  selectedSlots: [],
  content: null,
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
      state.content = null;
    },
    selectSlots: (state, action: PayloadAction<string[]>) => {
      state.selectedSlots = action.payload;
    },
    openNext: (state, action) => {
      state.isOpen = true;
      state.type = action.payload;
    }
  },
});

export const { openModal, closeModal, selectSlots, openNext } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;