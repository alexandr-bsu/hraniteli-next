import { createSlice } from "@reduxjs/toolkit";
import { ModalState } from "../store";

const clickSlice = createSlice({
    name: 'modal',
    

    initialState:{
        isOpenType: '',
        isOpen: false,
        selectedPsychologist: '',

        telephone: '',
        slotsSelect: [],
        slots_objects: []
    },
    
    reducers: {
        open(state) {
            state.isOpen = true;
        },
        close(state) {
            state.isOpen = false;
        },
        openNext(state, action) {
            state.isOpenType = action.payload;
        },
        selectPsychologist(state,action) {
            state.selectedPsychologist = action.payload
        },
        selectSlots(state,action) {
            state.slotsSelect = action.payload
        },
        selectSlotsObjects(state,action) {
            state.slots_objects = action.payload
        }
    },
});

export const  { open, close, openNext,selectPsychologist,selectSlotsObjects, selectSlots } = clickSlice.actions;

export const isOpenType = ( state: ModalState ) => state.modal.isOpenType;
export const isOpen = ( state:ModalState ) => state.modal.isOpen;

export default clickSlice.reducer;