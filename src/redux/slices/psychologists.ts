import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPsychologist } from '@/shared/types/psychologist.types';

const initialState: IPsychologist[] = [];

export const psychologistsSlice = createSlice({
  name: 'psychologists',
  initialState,
  reducers: {
    setPsychologists: (state, action: PayloadAction<IPsychologist[]>) => {
      return action.payload;
    }
  }
});

export const { setPsychologists } = psychologistsSlice.actions;
export const psychologistsReducer = psychologistsSlice.reducer;