import { createSlice } from "@reduxjs/toolkit";

const makeTicketId = (length: number) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

const applicationFormDataSlice = createSlice({
    name: 'applicationForm',

    initialState:{
        username: '',
        age: 0,
        gender_user: '',
        preferences: [],
        gender_psychologist: '',
        actions: [],
        conditions: [],
        diseasesPsychologist: [],
        diseases:[],
        requests: [],
        promocode:'',
        slots:[],
        custom_preferences: '',

        ticketID: '',

        maxIndex: 0,

        index_phyc: 1,
    },
    
    reducers: {
        generateTicketId(state) {
            const ticketId = makeTicketId(7);
            state.ticketID =  ticketId;
        },
        fill_username(state, action) {
            state.username = action.payload;
        },
        fill_age(state, action) {
            state.age = action.payload;
        },
        fill_gender(state, action) {
            state.gender_user = action.payload;
        },
        fill_preferences(state, action) {
            state.preferences = action.payload;
        },
        fill_actions(state, action) {
            state.actions = action.payload;
        },
        fill_promocode(state, action) {
            state.promocode = action.payload;
        },
        fill_diseases(state, action) {
            state.diseases = action.payload;
        },
        fill_diseasesPsychologist(state, action) {
            state.diseasesPsychologist = action.payload;
        },
        fill_conditions(state, action) {
            state.conditions = action.payload;
        },
        fill_requests(state, action) {
            state.requests = action.payload;
        },
        fill_gender_psychologist(state, action) {
            state.gender_psychologist = action.payload;
        },
        fill_slots(state,action) {
            state.slots = action.payload;
        },
        fill_custom_preferences(state,action) {
            state.custom_preferences = action.payload;
        },
        fill_maxIndex(state,action) {
            state.maxIndex = action.payload;
        },
        increment_index_psyc(state) {
            if (state.index_phyc < state.maxIndex - 1) {
                state.index_phyc += 1;
            }
        },
        decrement_index_psyc(state) {
            if (state.index_phyc > 0) {
                state.index_phyc -= 1;
            }
        }
    },
});


export const  { 
                fill_username, 
                fill_age, 
                fill_gender, 
                fill_preferences, 
                fill_actions,
                fill_gender_psychologist, 
                fill_conditions,fill_diseases,
                fill_diseasesPsychologist,
                fill_promocode,
                fill_requests, 
                fill_slots,  
                fill_custom_preferences,
                generateTicketId,
                increment_index_psyc,
                decrement_index_psyc,
                fill_maxIndex
            } = applicationFormDataSlice.actions;

export default applicationFormDataSlice.reducer;