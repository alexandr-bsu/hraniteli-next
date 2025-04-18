import { configureStore } from "@reduxjs/toolkit";
import modal from './slices/modal'
import filter from "./slices/filter";
import applicationForm from './slices/application_form'
import applicationFormData from './slices/application_form_data'

const store = configureStore({
    reducer: {
        modal: modal,
        filter: filter,
        applicationForm: applicationForm,
        applicationFormData: applicationFormData,
    }
})

export default store;

export type ModalState = ReturnType<typeof store.getState>