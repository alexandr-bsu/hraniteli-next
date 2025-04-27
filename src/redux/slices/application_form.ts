import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export type ApplicationStage = 
    | 'name'
    | 'age'
    | 'gender'
    | 'preferences'
    | 'gender_psychologist'
    | 'request'
    | 'condition'
    | 'traumatic'
    | 'psycho'
    | 'action'
    | 'diseases'
    | 'diseases_psychologist'
    | 'psychologist'
    | 'promocode'
    | 'gratitude'
    | 'error';

interface ApplicationFormState {
    application_stage: ApplicationStage;
}

const initialState: ApplicationFormState = {
    application_stage: 'name'
};

export const applicationFormSlice = createSlice({
    name: 'applicationForm',
    initialState,
    reducers: {
        setApplicationStage: (state, action: PayloadAction<ApplicationStage>) => {
            state.application_stage = action.payload;
        }
    }
});

export const { setApplicationStage } = applicationFormSlice.actions;
export const applicationFormReducer = applicationFormSlice.reducer;

// Селектор для получения текущего этапа
export const selectCurrentStage = (state: RootState) => state.applicationForm.application_stage;