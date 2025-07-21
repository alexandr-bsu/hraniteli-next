import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// UPDATE 20.05: Добавил experience и psychologist_price
export type ApplicationStage =
    | 'city'
    | 'psychologist_education'
    | 'meet_type'
    | 'choose_preferences'
    | 'last_session_price'
    | 'session_duration'
    | 'cancelation'
    | 'occupation'
    | 'name'
    | 'age'
    | 'gender'
    | 'experience'
    | 'preferences'
    | 'gender_psychologist'
    | 'request'
    | 'condition'
    | 'traumatic'
    | 'diseases_psychologist'
    | 'promocode'
    | 'psychologist_price'
    | 'phone'
    | 'gratitude'
    | 'error'
    | 'emergency'
    | 'psychologist';

interface ApplicationFormState {
    application_stage: ApplicationStage;
    rid: number;
    bid: number;
    is_tracker_launched: boolean;
    is_request_send: boolean; // Новый флаг
}

const initialState: ApplicationFormState = {
    application_stage: 'name',
    rid: 0,
    bid: 0,
    is_tracker_launched: false,
    is_request_send: false // Значение по умолчанию
};

export const applicationFormSlice = createSlice({
    name: 'applicationForm',
    initialState,
    reducers: {
        setApplicationStage: (state, action: PayloadAction<ApplicationStage>) => {
            state.application_stage = action.payload;
        },

        setRid: (state, action: PayloadAction<number>) => {
            state.rid = action.payload;
        },

        setBid: (state, action: PayloadAction<number>) => {
            state.bid = action.payload;
        },

        setInitTrackerStatusLaunched(state){
            state.is_tracker_launched = true
        },
        setIsRequestSend: (state, action: PayloadAction<boolean>) => {
            state.is_request_send = action.payload;
        }
    }
});

export const { setApplicationStage, setRid, setBid, setInitTrackerStatusLaunched, setIsRequestSend } = applicationFormSlice.actions;
export const applicationFormReducer = applicationFormSlice.reducer;

// Селектор для получения текущего этапа
export const selectCurrentStage = (state: RootState) => state.applicationForm.application_stage;
