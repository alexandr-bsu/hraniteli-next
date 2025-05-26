import { IApplicationFormData } from '@/shared/types/application.types';
import { getTimeDifference } from '../utils';

interface HelpHandRequest {

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
}

// Отправка анкеты
export const submitHelpHandQuestionnaire = async (formData: IApplicationFormData) => {
    try {
        const request: HelpHandRequest = {

            formPsyClientInfo: {
                age: formData.age,
                city: '',
                sex: formData.gender_user === 'male' ? 'Мужской' :
                    formData.gender_user === 'female' ? 'Женский' : '',
                psychoEducated: '',

                anxieties: [],
                customAnexiety: '',
                hasPsychoExperience: formData.experience === 'earlier' ? 'Да, обращался(ась) ранее' :
                    formData.experience === 'in_therapy' ? 'Да, сейчас нахожусь в терапии' :
                        formData.experience === 'supposed' ? 'Нет, но рассматривал(а) такую возможность' :
                            formData.experience === 'no' ? 'Нет' : 'Нет',
                meetType: '',
                selectionСriteria: '',
                custmCreteria: '',
                importancePsycho: formData.preferences,
                customImportance: formData.custom_preferences,
                agePsycho: '',
                sexPsycho: formData.gender_psychologist === 'male' ? 'Мужской' :
                    formData.gender_psychologist === 'female' ? 'Женский' :
                        'Не имеет значения',
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

            anxieties: [],
            questions: formData.requests,
            customQuestion: [],
            diagnoses: formData.diseases,
            diagnoseInfo: '',
            diagnoseMedicaments: '',
            traumaticEvents: formData.traumatic || [],
            clientStates: formData.conditions || [],
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
            userTimeZone: "МСК" + (getTimeDifference() > 0 ? '+' + getTimeDifference() : getTimeDifference() < 0 ? getTimeDifference() : ''),
            bid: 0,
            rid: 0,
            // 'free' | '300' | '500' | '1000' | '1500' | '2000' | '3000';
            categoryType: formData.price_session === 'free' ? 'Бесплатно' :
                formData.price_session === '300' ? '300 руб' :
                    formData.price_session === '500' ? '500 руб' :
                        formData.price_session === '1000' ? '1000 руб' :
                            formData.price_session === '1500' ? '1500 руб' :
                                formData.price_session === '2000' ? '2000 руб' :
                                    formData.price_session === '3000' ? '3000 руб' : 'Бесплатно',
            customCategory: '',
            question_to_psychologist: formData.requests?.join('; ') || '',
            filtered_by_automatch_psy_names: [],
            _queries: '',
            customTraumaticEvent: '',
            customState: ''
        };

        const response = await fetch(
            'https://n8n-v2.hrani.live/webhook/register-ticket-for-help-hand', {

            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            console.error('Ошибка при отправке анкеты:', response.status, response.statusText);
            throw new Error('Failed to submit questionnaire');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error submitting questionnaire:', error);
        throw error;
    }
};
