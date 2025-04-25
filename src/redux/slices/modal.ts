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
}

const initialState: ModalState = {
  isOpen: false,
  type: null,
  selectedSlots: [],
};

export const modalSlice = createSlice({
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
    selectSlots: (state, action: PayloadAction<string[]>) => {
      state.selectedSlots = action.payload;
    },
  },
});

export const { openModal, closeModal, selectSlots } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;