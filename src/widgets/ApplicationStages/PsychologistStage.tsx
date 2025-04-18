import { getTimeDifference } from "@/features/utils";
import { toNextStage } from "@/redux/slices/application_form";
import { fill_maxIndex, fill_slots } from "@/redux/slices/application_form_data";
import { fill_filtered_by_automatch_psy } from "@/redux/slices/filter";
import { ModalState } from "@/redux/store";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PsychologistStageItem from "./PsychologistStageItem";

export const PsychologistStage = () => {
    const dispatch = useDispatch();

    const filtered_persons = useSelector<ModalState>(state => state.filter.filtered_by_automatch_psy) as any;

    const application_form_data = useSelector<ModalState>(state => state) as ModalState;

    const [resultData, setResultData] = useState() as any [];
    
    const hours = [
        '00:00',
        '01:00',
        '02:00',
        '03:00',
        '04:00',
        '05:00',
        '06:00',
        '07:00',
        '08:00',
        '09:00',
        '10:00',
        '11:00',
        '12:00',
        '13:00',
        '14:00',
        '15:00',
        '16:00',
        '17:00',
        '18:00',
        '19:00',
        '20:00',
        '21:00',
        '22:00',
        '23:00',
    ]


    useEffect(() => {
        const time_difference = getTimeDifference();

        const data = {
            anxieties: [],
            questions: [],
            customQuestion: [],

            diagnoses:  [application_form_data.applicationFormData.diseases[0]],

            diagnoseMedicaments: 'Нет',

            diagnoseInfo:false,

            traumaticEvents: [...application_form_data.applicationFormData.actions, application_form_data.applicationFormData.custom_preferences],

            clientStates: application_form_data.applicationFormData.preferences,

            selectedPsychologistsNames: [],

            shownPsychologists: '',
            lastExperience: 'Да, было.  До года',
            amountExpectations: '',
            age: Number(application_form_data.applicationFormData.age),

            slots: [],
            slots_objects: [],

            contactType: 'Telegram',
            contact: '+71234567890',

            name: application_form_data.applicationFormData.username,

            promocode: application_form_data.applicationFormData.promocode,

            ticket_id: application_form_data.applicationFormData.ticketID,

            emptySlots: false,

            userTimeZone: time_difference,
            userTimeOffsetMsk: time_difference,
            bid: 3764,

            rid: 4091,

            categoryType: '',

            customCategory: '',

            question_to_psychologist: application_form_data.applicationFormData.requests,

            filtered_by_automatch_psy_names: [],

            _queries: '',

            customTraumaticEvent: 'Ещё одно состояние',

            customState: '',

            formPsyClientInfo: {
                age: 18,
                city: '',
                sex: application_form_data.applicationFormData.gender_user,
                psychoEducated: 'Да, я практикующий специалист',
                anxieties: [],
                customAnexiety: '',
                hasPsychoExperience: 'Да, я работал(а) с психологом/психотерапевтом',
                meetType: 'Оффлайн',
                selectionСriteria: '',
                custmCreteria: '',
                importancePsycho: application_form_data.applicationFormData.preferences,

                customImportance: application_form_data.applicationFormData.custom_preferences,

                agePsycho: '',
                sexPsycho: 'Не имеет значения',
                priceLastSession: '',
                durationSession: 'До года',
                reasonCancel: 'Не помогло, вообще прекратил(а)',
                pricePsycho: '',
                reasonNonApplication: '',
                contactType: '',
                contact: '+71234567890',
                name: application_form_data.applicationFormData.username,
                is_adult: true,
                is_last_page: false,
                occupation: 'Предприниматель'     
            },
            utm_client: null,
            utm_tarif: undefined,
            utm_campaign: null,
            utm_content: null,
            utm_medium: null,
            utm_source: null,
            utm_term: null,
            utm_psy: undefined
        }

        const apiUrl = 'https://n8n-v2.hrani.live/webhook/get-aggregated-psychologist-schedule-test-contur';

        axios.post(apiUrl, data).then((resp) => {
            const data = resp.data;
            const result = [] as any

            data[0].items.map((item:any) => {
                // Массив [ Person ]
                [item.slots].forEach((element: any) => {                  
                    for (let index = 0; index < Object.keys(element).length; index++) {
                        const slot = element[hours[index]]
                        if (slot !== undefined && slot !== null && slot.length > 0)
                        {
                            slot.forEach((elementSlot:any) => {
                                result.push(elementSlot)
                            });
                        }
                    }
                })
            })

            const names = new Set();

            result.forEach((element: any) => {
                names.add(element.psychologist);
            });
            
            const apiUrl = 'https://n8n-v2.hrani.live/webhook/get-filtered-psychologists-test-contur';
            axios.get(apiUrl).then((resp: any) => {
                const persons = [] as any;
                const newData = resp.data;
                console.log(newData)

                names.forEach((e) => {
                    const data = result.filter((item:any) => item.psychologist === e)
                    const dataPerson = newData.find((item:any) => item.name === e)
                    console.log(dataPerson)
                    console.log(newData[0].name)
                    persons.push({
                        name: e,
                        slots: [
                            ...data,
                        ],
                        experience: dataPerson?.experience,
                        age: dataPerson?.age,
                        max_session_price: dataPerson?.max_session_price,
                        main_modal: dataPerson?.main_modal,
                    })
                })
                dispatch(fill_maxIndex(persons.length))
    
                dispatch(fill_filtered_by_automatch_psy(persons))
            });
        });
    },[])

    const handleSubmit = useCallback(() => {
        const time_difference = getTimeDifference();

        const data = {
            anxieties: [],
            questions: [],
            customQuestion: [],

            diagnoses:  [application_form_data.applicationFormData.diseases[0]],

            diagnoseMedicaments: 'Нет',

            diagnoseInfo:false,

            traumaticEvents: [...application_form_data.applicationFormData.actions, application_form_data.applicationFormData.custom_preferences],

            clientStates: application_form_data.applicationFormData.preferences,

            selectedPsychologistsNames: [],

            shownPsychologists: '',
            lastExperience: 'Да, было.  До года',
            amountExpectations: '',
            age: Number(application_form_data.applicationFormData.age),

            slots: [
                resultData.map((item: any) => {
                    return item.text;
                })
            ],
            slots_objects: [
                resultData.map((item: any) => {
                    return item.id;
                })
            ],

            contactType: 'Telegram',
            contact: '+71234567890',

            name: application_form_data.applicationFormData.username,

            promocode: application_form_data.applicationFormData.promocode,

            ticket_id: application_form_data.applicationFormData.ticketID,

            emptySlots: false,

            userTimeZone: time_difference,
            userTimeOffsetMsk: time_difference,
            bid: 3764,

            rid: 4091,

            categoryType: '',

            customCategory: '',

            question_to_psychologist: application_form_data.applicationFormData.requests,

            filtered_by_automatch_psy_names: filtered_persons?.map((item:any) => {
                return item.name
            }),

            _queries: '',

            customTraumaticEvent: 'Ещё одно состояние',

            customState: '',

            formPsyClientInfo: {
                age: 18,
                city: '',
                sex: application_form_data.applicationFormData.gender_user,
                psychoEducated: 'Да, я практикующий специалист',
                anxieties: [],
                customAnexiety: '',
                hasPsychoExperience: 'Да, я работал(а) с психологом/психотерапевтом',
                meetType: 'Оффлайн',
                selectionСriteria: '',
                custmCreteria: '',
                importancePsycho: application_form_data.applicationFormData.preferences,

                customImportance: application_form_data.applicationFormData.custom_preferences,

                agePsycho: '',
                sexPsycho: 'Не имеет значения',
                priceLastSession: '',
                durationSession: 'До года',
                reasonCancel: 'Не помогло, вообще прекратил(а)',
                pricePsycho: '',
                reasonNonApplication: '',
                contactType: '',
                contact: '+71234567890',
                name: application_form_data.applicationFormData.username,
                is_adult: true,
                is_last_page: false,
                occupation: 'Предприниматель'     
            },
            utm_client: null,
            utm_tarif: undefined,
            utm_campaign: null,
            utm_content: null,
            utm_medium: null,
            utm_source: null,
            utm_term: null,
            utm_psy: undefined
        }

        const apiUrl = 'https://n8n-v2.hrani.live/webhook/get-aggregated-psychologist-schedule-test-contur';

        const delayBeforeSuccess = setTimeout(() => {
            dispatch(toNextStage('gratitude'))
        },1000)

        console.log(data)

        axios.post(apiUrl, data).then(() => {
            console.log('success');

            return () => delayBeforeSuccess;
        }).catch(() => {

        });

        dispatch(fill_slots(resultData));

        return () => delayBeforeSuccess;
    },[resultData])

    return (
        <>
            <div className="flex flex-col min-h-full min-lg:mx-[40px] max-lg:px-[20px] mt-[20px] grow h-[100%]">
                <div className="grow w-full justify-center min-h-full h-[100%]">
                    {
                        filtered_persons?.map((item: any, i: any) => <>
                            <PsychologistStageItem index={i} onSubmit={(d) => {
                                setResultData(d)
                            }} data={item} />
                        </>)
                    }
                </div>


                <div className="shrink-0 mt-[25px]  pb-[50px] flex gap-[10px]">
                    <button onClick={() => dispatch(toNextStage('promocode'))} className="cursor-pointer shrink-0 w-[81px] border-[1px] border-[#116466] p-[12px] text-[#116466] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                        Назад
                    </button>

                    <button type='button'  onClick={() => {
                        handleSubmit();
                        }} className="cursor-pointer grow border-[1px] bg-[#116466] p-[12px] text-[white] font-normal text-[18px] max-lg:text-[14px] rounded-[50px]">
                        Продолжить
                    </button>
                </div>
            </div>
        </>
    );
};