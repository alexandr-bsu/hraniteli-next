import { IApplicationFormData } from '@/shared/types/application.types';
import { IPsychologist } from '@/shared/types/psychologist.types';
import { getTimeDifference } from '../utils';

interface PsychologistScheduleRequest {
    startDate: string;
    endDate: string;
    ageFilter: string;
    show_only_psy?: string;
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

// Отправка анкеты
export const submitQuestionnaire = async (formData: IApplicationFormData, from_cards: boolean = false, from_diagnostic_form: boolean = false, psychologist_name?: string) => {
    try {
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);

        const request: PsychologistScheduleRequest = {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            ageFilter: formData.age,
            ...(psychologist_name ? { show_only_psy: psychologist_name } : {}),
            formPsyClientInfo: {
                age: formData.age,
                city: '',
                sex: formData.gender_user === 'male' ? 'Мужской' :
                    formData.gender_user === 'female' ? 'Женский' : '',
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
                occupation: localStorage.getItem('app_occupation') === 'fulltime' ? 'Постоянная работа в найме' :
                    localStorage.getItem('app_occupation') === 'freelance' ? 'Фрилансер/самозанятый/работаю на себя' :
                        localStorage.getItem('app_occupation') === 'business' ? 'Предприниматель' :
                            localStorage.getItem('app_occupation') === 'additional income' ? 'Не работаю, есть доп. источник дохода' :
                                localStorage.getItem('app_occupation') === 'no income' ? 'Не работаю, нет доп. источников доходов' : ''
            },
            form: {
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
                categoryType: '',
                customCategory: '',
                question_to_psychologist: formData.requests?.join('; ') || '',
                filtered_by_automatch_psy_names: [],
                _queries: '',
                customTraumaticEvent: '',
                customState: ''
            },
            ticket_id: formData.ticketID,
            userTimeOffsetMsk: getTimeDifference()
        };

        const offset = getTimeDifference();
        const response = await fetch(
            from_cards ? `https://cache-api.hrani.live/convert-schedule-timezone/${offset}`
                : from_diagnostic_form ? 'https://n8n-v2.hrani.live/webhook/schedule-diagnosis-v2'
                    : 'https://n8n-v2.hrani.live/webhook/get-agregated-schedule-v2', {

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

        // Проверяем наличие слотов
        let hasSlots = false;
        if (data[0]?.items) {
            hasSlots = data[0].items.some((day: any) => {
                if (!day.slots) return false;
                return Object.values(day.slots).some((timeSlots: any) => {
                    return Array.isArray(timeSlots) && timeSlots.length > 0;
                });
            });
        }

        // Сортируем психологов по name_order если он есть в ответе
        if (data[0]?.name_order && Array.isArray(data[0].name_order)) {
            const nameOrder = data[0].name_order;

            // Сортируем слоты по порядку психологов в name_order
            data[0].items.forEach((day: any) => {
                if (day.slots) {
                    Object.keys(day.slots).forEach((time) => {
                        if (Array.isArray(day.slots[time])) {
                            day.slots[time].sort((a: any, b: any) => {
                                const aIndex = nameOrder.indexOf(a.psychologist);
                                const bIndex = nameOrder.indexOf(b.psychologist);

                                // Если психолог не найден в name_order, помещаем его в конец
                                if (aIndex === -1 && bIndex === -1) return 0;
                                if (aIndex === -1) return 1;
                                if (bIndex === -1) return -1;

                                return aIndex - bIndex;
                            });
                        }
                    });
                }
            });
        }

        return data;

    } catch (error) {
        console.error('Error submitting questionnaire:', error);
        throw error;
    }
};

// Получение отфильтрованных психологов
export const getFilteredPsychologists = async () => {
    try {
        const response = await fetch('https://cache-api.hrani.live/cards', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch filtered psychologists');
        }

        const data = await response.json();

        // Парсим и форматируем данные
        const formatPsychologist = (psy: Partial<IPsychologist>): IPsychologist => {
            return {
                id: psy.id || undefined,
                name: psy.name || '',
                age: psy.age || undefined,
                sex: psy.sex || psy.gender || undefined,
                experience: psy.experience || undefined,
                max_session_price: psy.max_session_price || psy.price || undefined,
                min_session_price: psy.min_session_price || undefined,
                avatar: psy.avatar || psy.link_photo || undefined,
                specialization: psy.specialization || [],
                rating: psy.rating || undefined,
                reviews_count: psy.reviews_count || undefined,
                works_with: psy.works_with || undefined,
                mental_illness: Array.isArray(psy.mental_illness) ? psy.mental_illness : [],
                mental_illness2: Array.isArray(psy.mental_illness2) ? psy.mental_illness2 : [],
                video: psy.video || psy.is_video || false,
                requests: Array.isArray(psy.requests) ? psy.requests : [],
                queries: psy.queries || '',
                short_description: psy.short_description || '',
                link_video: psy.link_video || null,
                verified: psy.verified || psy.is_verified || false,
                schedule: psy.schedule || undefined,
                main_modal: psy.main_modal || undefined,
                in_community: psy.in_community || undefined
            };
        };

        let psychologists: IPsychologist[] = [];

        if (Array.isArray(data)) {
            psychologists = data.map((psy: any) => formatPsychologist(psy));
        } else if (data?.items && Array.isArray(data.items)) {
            psychologists = data.items.map((psy: any) => formatPsychologist(psy));
        }

        if (psychologists.length === 0) {
            return { items: [], hasMatches: false };
        }

        return { items: psychologists, hasMatches: true };

    } catch (error) {
        console.error('Error fetching filtered psychologists:', error);
        throw error;
    }
}; 