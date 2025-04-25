import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApplicationStage } from '@/shared/types/application.types';
import { RootState } from '../store';

interface ApplicationFormState {
    application_stage: ApplicationStage;
}

const initialState: ApplicationFormState = {
    application_stage: 'name',
};

export const applicationFormSlice = createSlice({
    name: 'applicationForm',
    initialState,
    reducers: {
        toNextStage: (state, action: PayloadAction<ApplicationStage>) => {
            state.application_stage = action.payload;
        },
    },
});

export const { toNextStage } = applicationFormSlice.actions;
export const applicationFormReducer = applicationFormSlice.reducer;

// Селектор для получения текущего этапа
export const selectCurrentStage = (state: RootState) => state.applicationForm.application_stage;