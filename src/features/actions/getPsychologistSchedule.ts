import { IApplicationFormData } from '@/shared/types/application.types';

interface PsychologistScheduleRequest {
    startDate: string;
    endDate: string;
    ageFilter: string;
    formPsyClientInfo: {
        age: string;
        city: string;
        sex: string;
        psychoEducated: string;
        anxieties: string[];
        customAnexiety: string;
        hasPsychoExperience: string;
        meetType: string;
        selectionСriteria: string;
        custmCreteria: string;
        importancePsycho: string[];
        customImportance: string;
        agePsycho: string;
        sexPsycho: string;
        priceLastSession: string;
        durationSession: string;
        reasonCancel: string;
        pricePsycho: string;
        reasonNonApplication: string;
        contactType: string;
        contact: string;
        name: string;
        is_adult: boolean;
        is_last_page: boolean;
        occupation: string;
    };
    form: {
        anxieties: string[];
        questions: string[];
        customQuestion: string[];
        diagnoses: string[];
        diagnoseInfo: string;
        diagnoseMedicaments: string;
        traumaticEvents: string[];
        clientStates: string[];
        selectedPsychologistsNames: string[];
        shownPsychologists: string;
        psychos: any[];
        lastExperience: string;
        amountExpectations: string;
        age: string;
        slots: string[];
        contactType: string;
        contact: string;
        name: string;
        promocode: string;
        ticket_id: string;
        emptySlots: boolean;
        userTimeZone: string;
        bid: number;
        rid: number;
        categoryType: string;
        customCategory: string;
        question_to_psychologist: string;
        filtered_by_automatch_psy_names: string[];
        _queries: string;
        customTraumaticEvent: string;
        customState: string;
    };
    ticket_id: string;
    userTimeOffsetMsk: number;
}

export const getPsychologistSchedule = async (formData: IApplicationFormData) => {
    try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const request: PsychologistScheduleRequest = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            ageFilter: formData.age,
            formPsyClientInfo: {
                age: formData.age,
                city: '',
                sex: formData.gender_user === 'male' ? 'Мужской' : 'Женский',
                psychoEducated: '',
                anxieties: [],
                customAnexiety: '',
                hasPsychoExperience: '',
                meetType: '',
                selectionСriteria: '',
                custmCreteria: '',
                importancePsycho: formData.preferences,
                customImportance: formData.custom_preferences,
                agePsycho: '',
                sexPsycho: formData.gender_psychologist === 'male' ? 'Мужчина' : 
                          formData.gender_psychologist === 'female' ? 'Женщина' : 'Не имеет значения',
                priceLastSession: '',
                durationSession: '',
                reasonCancel: '',
                pricePsycho: '',
                reasonNonApplication: '',
                contactType: '',
                contact: formData.phone,
                name: formData.username,
                is_adult: parseInt(formData.age) >= 18,
                is_last_page: false,
                occupation: ''
            },
            form: {
                anxieties: [],
                questions: formData.requests,
                customQuestion: [],
                diagnoses: formData.diseases,
                diagnoseInfo: '',
                diagnoseMedicaments: localStorage.getItem('app_diseases_psychologist') ? 
                    JSON.parse(localStorage.getItem('app_diseases_psychologist') || '{}').medications : 'no',
                traumaticEvents: formData.actions,
                clientStates: formData.actions,
                selectedPsychologistsNames: [],
                shownPsychologists: '',
                psychos: [],
                lastExperience: '',
                amountExpectations: '',
                age: formData.age,
                slots: [],
                contactType: '',
                contact: formData.phone,
                name: formData.username,
                promocode: formData.promocode,
                ticket_id: formData.ticketID,
                emptySlots: false,
                userTimeZone: 'МСК',
                bid: 0,
                rid: 0,
                categoryType: '',
                customCategory: '',
                question_to_psychologist: formData.requests.join('; '),
                filtered_by_automatch_psy_names: [],
                _queries: '',
                customTraumaticEvent: '',
                customState: ''
            },
            ticket_id: formData.ticketID,
            userTimeOffsetMsk: 0
        };

        const response = await fetch('https://n8n-v2.hrani.live/webhook/get-aggregated-psychologist-schedule-test-contur', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error('Failed to fetch psychologist schedule');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching psychologist schedule:', error);
        throw error;
    }
} 