
'use client'
import { Form } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setPhone, setHasMatchingError, setContactType } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '@/shared/constants/colors';
import { RootState } from '@/redux/store';
import { NoMatchError } from './NoMatchError';
import { useSearchParams } from 'next/navigation'
import axios from 'axios';
import { toast } from 'sonner';
import { getTimeDifference } from '@/features/utils';
import useYandexMetrika from '@/components/yandex/useYandexMetrika'
import { setIsRequestSend } from '@/redux/slices/application_form';
import { ContactMethodFormFields } from '@/widgets/shared/ContactMethodFormFields';
import { contactMethodFormSchema, type ContactMethodFormValues } from '@/widgets/shared/contactMethodFormSchema';
import { getAppContactFromStorage, persistAppContact } from '@/features/appContactStorage';

export const PhoneStage = () => {
    const isRequestSend = useSelector<RootState, boolean>(state => state.applicationForm.is_request_send);
    const dispatch = useDispatch();

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    const selected_slots = useSelector<RootState, string[]>(
        state => state.applicationFormData.selected_slots
    );

    const currentPsychologist = useSelector<RootState, any>(
        state => state.filter
    ).selected_psychologist;

    const filtered_by_automatch_psy = useSelector<RootState, any[]>(
        state => state.filter.filtered_by_automatch_psy
    );

    const timeDifference = getTimeDifference();

    const ridId = useSelector((state: RootState) => state.applicationForm.rid)
    const bidId = useSelector((state: RootState) => state.applicationForm.bid)
    const { reachGoal } = useYandexMetrika(102105189)

    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Контакты клиента", ticket_id: ticketID },
        });

        reachGoal('svyaz')

    }, [])

    const searchParams = useSearchParams()
    const isResearchRedirect = searchParams.get('research') == 'true'

    const utm_client = searchParams.get('utm_client')
    const utm_campaign = searchParams.get('utm_campaign')
    const utm_content = searchParams.get('utm_content')
    const utm_medium = searchParams.get('utm_medium')
    const utm_source = searchParams.get('utm_source')
    const utm_term = searchParams.get('utm_term')

    const [showNoMatch, setShowNoMatch] = React.useState(false);

    const saved = typeof window !== 'undefined' ? getAppContactFromStorage() : { contact: '', contactType: 'Telegram' as const }

    const form = useForm<ContactMethodFormValues>({
        resolver: zodResolver(contactMethodFormSchema),
        defaultValues: {
            contact: saved.contact,
            contactType: saved.contactType === 'WhatsApp' || saved.contactType === 'Phone' ? 'Telegram' : saved.contactType,
        }
    })

    const [isSubmitting, setIsSubmitting] = React.useState(false);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (value.contact !== undefined && value.contactType !== undefined) {
                persistAppContact(value.contact ?? '', value.contactType ?? 'Telegram');
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch]);

    const handleCloseNoMatch = () => {
        setShowNoMatch(false);
        dispatch(setHasMatchingError(false));
    };

    const handleSubmit = async (data: ContactMethodFormValues) => {
        if (isRequestSend) return;
        dispatch(setIsRequestSend(true));
        persistAppContact(data.contact, data.contactType);
        dispatch(setPhone(data.contact));
        dispatch(setContactType(data.contactType));

        const contactStr = data.contact;
        const contactTypeStr = data.contactType;

        try {
            setIsSubmitting(true)
            const storedRequests = localStorage.getItem('app_request') ?
                [JSON.parse(localStorage.getItem('app_request') || '[]')?.request] : [];

            const requestData = {
                "utm_client": utm_client || 'null',
                "utm_campaign": utm_campaign || 'null',
                "utm_content": utm_content || 'null',
                "utm_medium": utm_medium || 'null',
                "utm_source": utm_source || 'null',
                "utm_term": utm_term || 'null',
                anxieties: [],
                questions: storedRequests,
                customQuestion: [],
                diagnoses: localStorage.getItem('app_diseases') ?
                    JSON.parse(localStorage.getItem('app_diseases') || '[]') : [],
                diagnoseInfo: "",
                diagnoseMedicaments: localStorage.getItem('app_diseases_psychologist') ?
                    JSON.parse(localStorage.getItem('app_diseases_psychologist') || '{}').medications : '',
                traumaticEvents: localStorage.getItem('app_traumatic') ?
                    JSON.parse(localStorage.getItem('app_traumatic') || '[]') : [],
                clientStates: localStorage.getItem('app_conditions') ?
                    JSON.parse(localStorage.getItem('app_conditions') || '[]') : [],
                selectedPsychologistsNames: [currentPsychologist?.name],
                shownPsychologists: currentPsychologist?.name || "",
                top_3_psychologists: Array.from(new Set((filtered_by_automatch_psy || []).map((psy: any) => psy.name).filter(Boolean))),
                lastExperience: localStorage.getItem('app_experience') === 'earlier' ? 'Да, я работал(а) с психологом/психотерапевтом.' + (localStorage.getItem('app_experience') == 'earlier' ?
                    localStorage.getItem('app_session_duration') === '<1 month' ? 'До месяца' :
                        localStorage.getItem('app_session_duration') === '2-3 months' ? '2-3 месяца' :
                            localStorage.getItem('app_session_duration') === '<1 year' ? 'До года' :
                                localStorage.getItem('app_session_duration') === '>1 year' ? 'Более года' : ''
                    : '') :
                    localStorage.getItem('app_experience') === 'supposed' ? 'Нет, я не работал(а) с психологом/психотерапевтом' : '',
                amountExpectations: "",
                age: localStorage.getItem('app_age') || '',
                slots: Array.isArray(selected_slots) ? selected_slots : [selected_slots],
                slots_objects: [],
                contactType: contactTypeStr,
                contact: contactStr,
                name: localStorage.getItem('app_username') || '',
                promocode: isResearchRedirect ? 'Клиент перешёл из исследовательской анкеты' : localStorage.getItem('app_promocode') || '',
                ticket_id: ticketID || '',
                emptySlots: false,
                userTimeZone: "МСК" + (+timeDifference > 0 ? '+' + timeDifference : timeDifference == 0 ? '' : timeDifference),
                userTimeOffsetMsk: timeDifference.toString(),
                bid: bidId,
                rid: ridId,
                categoryType: "",
                customCategory: "",
                question_to_psychologist: storedRequests.join('; '),
                filtered_by_automatch_psy_names: [currentPsychologist?.name],
                _queries: "",
                customTraumaticEvent: "",
                customState: "",
                formPsyClientInfo: {
                    age: localStorage.getItem('app_age') || '',
                    city: "",
                    sex: localStorage.getItem('app_gender') === 'male' ? 'Мужской' :
                        localStorage.getItem('app_gender') === 'female' ? 'Женский' : '',

                    psychoEducated: localStorage.getItem('app_psychologist_education') === 'practic' ? 'Да, я практикующий специалист' :
                        localStorage.getItem('app_psychologist_education') === 'other_speciality' ? 'Да, но работаю в другой сфере' :
                            localStorage.getItem('app_psychologist_education') === 'student' ? 'В процессе получения' :
                                localStorage.getItem('app_psychologist_education') === 'no' ? 'Нет' : '',

                    anxieties: [],
                    customAnexiety: "",
                    hasPsychoExperience: localStorage.getItem('app_experience') === 'earlier' ? 'Да, я работал(а) с психологом/психотерапевтом' :
                        localStorage.getItem('app_experience') === 'supposed' ? 'Нет, но рассматривал(а) такую возможность' : '',

                    meetType: localStorage.getItem('app_meeting_type') === 'online' ? 'Онлайн' :
                        localStorage.getItem('app_meeting_type') === 'offline' ? 'Оффлайн' :
                            localStorage.getItem('app_meeting_type') === 'both' ? 'И так и так' : '',

                    selectionСriteria: localStorage.getItem('app_choose_preferences') === 'friends' ? 'По рекомендациям знакомых' :
                        localStorage.getItem('app_choose_preferences') === 'self' ? 'Самостоятельно просматривал(а) анкеты в интернете или читал(а) отзывы' :
                            localStorage.getItem('app_choose_preferences') === 'service' ? 'Через сервис, который сам подбирает подходящего специалиста' : '',

                    custmCreteria: "",
                    importancePsycho: localStorage.getItem('app_preferences') ?
                        JSON.parse(localStorage.getItem('app_preferences') || '[]') : [],

                    customImportance: localStorage.getItem('app_custom_preferences') || '',
                    agePsycho: "",
                    sexPsycho: localStorage.getItem('app_gender_psychologist') === 'male' ? 'Мужчина' :
                        localStorage.getItem('app_gender_psychologist') === 'female' ? 'Женщина' : 'Не имеет значения',

                    priceLastSession: localStorage.getItem('app_experience') == 'earlier' ?
                        localStorage.getItem('app_last_session_price') === 'free' ? 'Бесплатно' :
                            localStorage.getItem('app_last_session_price') === '<1000' ? 'Меньше 1000 руб.' :
                                localStorage.getItem('app_last_session_price') === '<3000' ? 'Меньше 3000 руб.' :
                                    localStorage.getItem('app_last_session_price') === '<5000' ? 'Меньше 5000 руб.' :
                                        localStorage.getItem('app_last_session_price') === '5000+' ? '5000 руб. и более' : ''
                        : '',

                    durationSession: localStorage.getItem('app_experience') == 'earlier' ?
                        localStorage.getItem('app_session_duration') === '<1 month' ? 'До месяца' :
                            localStorage.getItem('app_session_duration') === '2-3 months' ? '2-3 месяца' :
                                localStorage.getItem('app_session_duration') === '<1 year' ? 'До года' :
                                    localStorage.getItem('app_session_duration') === '>1 year' ? 'Более года' : ''
                        : '',

                    reasonCancel: localStorage.getItem('app_experience') == 'earlier' ?
                        localStorage.getItem('app_cancel_reason') === 'solved' ? 'Помогло, проблема была решена' :
                            localStorage.getItem('app_cancel_reason') === 'new_psychologist' ? 'Не помогло, выбрал(а) нового' :
                                localStorage.getItem('app_cancel_reason') === 'full_cancel' ? 'Не помогло, вообще прекратил(а)' :
                                    localStorage.getItem('app_cancel_reason') === 'expensive' ? 'Дорого' :
                                        localStorage.getItem('app_cancel_reason') === 'uncomfortable' ? 'Неудобно по времени/формату/месту' :
                                            localStorage.getItem('app_cancel_reason') === 'in_therapy' ? 'Я всё еще в терапии' : ''
                        : '',

                    pricePsycho: localStorage.getItem('app_experience') == 'supposed' ?
                        localStorage.getItem('app_last_session_price') === 'free' ? 'Бесплатно' :
                            localStorage.getItem('app_last_session_price') === '<1000' ? 'Меньше 1000 руб.' :
                                localStorage.getItem('app_last_session_price') === '<3000' ? 'Меньше 3000 руб.' :
                                    localStorage.getItem('app_last_session_price') === '<5000' ? 'Меньше 5000 руб.' :
                                        localStorage.getItem('app_last_session_price') === '5000+' ? '5000 руб. и более' : ''
                        : '',

                    reasonNonApplication: localStorage.getItem('app_experience') == 'supposed' ?
                        localStorage.getItem('app_cancel_reason') === 'solved' ? 'Проблемы сами разрешились' :
                            localStorage.getItem('app_cancel_reason') === 'no trust' ? 'Не было доверия' :
                                localStorage.getItem('app_cancel_reason') === 'expensive' ? 'Дорого' :
                                    localStorage.getItem('app_cancel_reason') === 'other' ? 'Другая причина' : ''
                        : '',

                    contactType: contactTypeStr,
                    contact: contactStr,
                    name: localStorage.getItem('app_username') || '',
                    is_adult: parseInt(localStorage.getItem('app_age') || '0') >= 18,
                    is_last_page: true,
                    occupation: localStorage.getItem('app_occupation') === 'fulltime' ? 'Постоянная работа в найме' :
                        localStorage.getItem('app_occupation') === 'freelance' ? 'Фрилансер/самозанятый/работаю на себя' :
                            localStorage.getItem('app_occupation') === 'business' ? 'Предприниматель' :
                                localStorage.getItem('app_occupation') === 'additional income' ? 'Не работаю, есть доп. источник дохода' :
                                    localStorage.getItem('app_occupation') === 'no income' ? 'Не работаю, нет доп. источников доходов' : ''
                }
            };

            const response = await axios.post('https://n8n-v2.hrani.live/webhook/tilda-zayavka-diagnostic-v2', requestData);

            if (ridId && bidId) {
                await axios.put('https://n8n-v2.hrani.live/webhook/update-contacts-stb',
                    {
                        rid: ridId,
                        bid: bidId,
                        contact: contactStr,
                        contactType: contactTypeStr,
                        name: localStorage.getItem('app_username') || '',
                        age: localStorage.getItem('app_age') || '',
                        formPsyClientInfo: {
                            age: localStorage.getItem('app_age') || '',
                            city: "",
                            sex: localStorage.getItem('app_gender') === 'male' ? 'Мужской' :
                                localStorage.getItem('app_gender') === 'female' ? 'Женский' : '',

                            psychoEducated: localStorage.getItem('app_psychologist_education') === 'practic' ? 'Да, я практикующий специалист' :
                                localStorage.getItem('app_psychologist_education') === 'other_speciality' ? 'Да, но работаю в другой сфере' :
                                    localStorage.getItem('app_psychologist_education') === 'student' ? 'В процессе получения' :
                                        localStorage.getItem('app_psychologist_education') === 'no' ? 'Нет' : '',

                            anxieties: [],
                            customAnexiety: "",
                            hasPsychoExperience: localStorage.getItem('app_experience') === 'earlier' ? 'Да, я работал(а) с психологом/психотерапевтом' :
                                localStorage.getItem('app_experience') === 'supposed' ? 'Нет, но рассматривал(а) такую возможность' : '',

                            meetType: localStorage.getItem('app_meeting_type') === 'online' ? 'Онлайн' :
                                localStorage.getItem('app_meeting_type') === 'offline' ? 'Оффлайн' :
                                    localStorage.getItem('app_meeting_type') === 'both' ? 'И так и так' : '',

                            selectionСriteria: localStorage.getItem('app_choose_preferences') === 'friends' ? 'По рекомендациям знакомых' :
                                localStorage.getItem('app_choose_preferences') === 'self' ? 'Самостоятельно просматривал(а) анкеты в интернете или читал(а) отзывы' :
                                    localStorage.getItem('app_choose_preferences') === 'service' ? 'Через сервис, который сам подбирает подходящего специалиста' : '',

                            custmCreteria: "",
                            importancePsycho: localStorage.getItem('app_preferences') ?
                                JSON.parse(localStorage.getItem('app_preferences') || '[]') : [],

                            customImportance: localStorage.getItem('app_custom_preferences') || '',
                            agePsycho: "",
                            sexPsycho: localStorage.getItem('app_gender_psychologist') === 'male' ? 'Мужчина' :
                                localStorage.getItem('app_gender_psychologist') === 'female' ? 'Женщина' : 'Не имеет значения',

                            priceLastSession: localStorage.getItem('app_experience') == 'earlier' ?
                                localStorage.getItem('app_last_session_price') === 'free' ? 'Бесплатно' :
                                    localStorage.getItem('app_last_session_price') === '<1000' ? 'Меньше 1000 руб.' :
                                        localStorage.getItem('app_last_session_price') === '<3000' ? 'Меньше 3000 руб.' :
                                            localStorage.getItem('app_last_session_price') === '<5000' ? 'Меньше 5000 руб.' :
                                                localStorage.getItem('app_last_session_price') === '5000+' ? '5000 руб. и более' : ''
                                : '',

                            durationSession: localStorage.getItem('app_experience') == 'earlier' ?
                                localStorage.getItem('app_session_duration') === '<1 month' ? 'До месяца' :
                                    localStorage.getItem('app_session_duration') === '2-3 months' ? '2-3 месяца' :
                                        localStorage.getItem('app_session_duration') === '<1 year' ? 'До года' :
                                            localStorage.getItem('app_session_duration') === '>1 year' ? 'Более года' : ''
                                : '',

                            reasonCancel: localStorage.getItem('app_experience') == 'earlier' ?
                                localStorage.getItem('app_cancel_reason') === 'solved' ? 'Помогло, проблема была решена' :
                                    localStorage.getItem('app_cancel_reason') === 'new_psychologist' ? 'Не помогло, выбрал(а) нового' :
                                        localStorage.getItem('app_cancel_reason') === 'full_cancel' ? 'Не помогло, вообще прекратил(а)' :
                                            localStorage.getItem('app_cancel_reason') === 'expensive' ? 'Дорого' :
                                                localStorage.getItem('app_cancel_reason') === 'uncomfortable' ? 'Неудобно по времени/формату/месту' :
                                                    localStorage.getItem('app_cancel_reason') === 'in_therapy' ? 'Я всё еще в терапии' : ''
                                : '',

                            pricePsycho: localStorage.getItem('app_experience') == 'supposed' ?
                                localStorage.getItem('app_last_session_price') === 'free' ? 'Бесплатно' :
                                    localStorage.getItem('app_last_session_price') === '<1000' ? 'Меньше 1000 руб.' :
                                        localStorage.getItem('app_last_session_price') === '<3000' ? 'Меньше 3000 руб.' :
                                            localStorage.getItem('app_last_session_price') === '<5000' ? 'Меньше 5000 руб.' :
                                                localStorage.getItem('app_last_session_price') === '5000+' ? '5000 руб. и более' : ''
                                : '',

                            reasonNonApplication: localStorage.getItem('app_experience') == 'supposed' ?
                                localStorage.getItem('app_cancel_reason') === 'solved' ? 'Проблемы сами разрешились' :
                                    localStorage.getItem('app_cancel_reason') === 'no trust' ? 'Не было доверия' :
                                        localStorage.getItem('app_cancel_reason') === 'expensive' ? 'Дорого' :
                                            localStorage.getItem('app_cancel_reason') === 'other' ? 'Другая причина' : ''
                                : '',

                            contactType: contactTypeStr,
                            contact: contactStr,
                            name: localStorage.getItem('app_username') || '',
                            is_adult: parseInt(localStorage.getItem('app_age') || '0') >= 18,
                            is_last_page: true,
                            occupation: localStorage.getItem('app_occupation') === 'fulltime' ? 'Постоянная работа в найме' :
                                localStorage.getItem('app_occupation') === 'freelance' ? 'Фрилансер/самозанятый/работаю на себя' :
                                    localStorage.getItem('app_occupation') === 'business' ? 'Предприниматель' :
                                        localStorage.getItem('app_occupation') === 'additional income' ? 'Не работаю, есть доп. источник дохода' :
                                            localStorage.getItem('app_occupation') === 'no income' ? 'Не работаю, нет доп. источников доходов' : ''
                        }
                    }
                )
            }


            if (response.status === 200) {
                setIsSubmitting(false)
                if (!isResearchRedirect) {
                    reachGoal('submit_form_podbor_bes_issledovanie')
                }
                else {
                    reachGoal('submit_form_podbor_issledovanie')
                }
                dispatch(setApplicationStage('gratitude'));

            } else {
                setIsSubmitting(false)
                throw new Error('Ошибка при отправке заявки');
            }
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
            toast.error('Произошла ошибка при отправке заявки. Пожалуйста, попробуйте еще раз.');
        } finally {
            dispatch(setIsRequestSend(false));
        }

    };



    if (showNoMatch) {
        return <NoMatchError onClose={handleCloseNoMatch} />;
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[15px] w-full flex flex-col relative">
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
                            <div className="flex flex-col items-center gap-[10px]">
                                <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[18px] text-[#116466]">Отправка заявки...</span>
                            </div>
                        </div>
                    )}

                    <ContactMethodFormFields
                        control={form.control}
                        contactName="contact"
                        contactTypeName="contactType"
                    />

                    <div className="shrink-0 mt-[30px] pb-[50px] max-lg:pb-[20px] flex gap-[10px]">
                        <button
                            type='button'
                            onClick={() => isResearchRedirect ? dispatch(setApplicationStage('psychologist')) : dispatch(setApplicationStage('promocode'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Практически конец
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
