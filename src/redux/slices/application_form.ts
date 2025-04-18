import { createSlice } from "@reduxjs/toolkit";
import { ModalState } from "../store";

const applicationFormSlice = createSlice({
    name: 'applicationForm',

    initialState:{
        application_stage: 'name',
    },
    
    reducers: {
        toNextStage(state, action) {
            state.application_stage = action.payload;
        },
    },
});


export const  { toNextStage } = applicationFormSlice.actions;

export const application_stage = ( state: ModalState ) => state.applicationForm.application_stage;

export default applicationFormSlice.reducer;