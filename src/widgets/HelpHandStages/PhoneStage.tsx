
'use client'
import { Form } from '@/components/ui/form';
import { setApplicationStage } from '@/redux/slices/application_form';
import { setPhone, setHasMatchingError, setContactType } from '@/redux/slices/application_form_data';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '@/shared/constants/colors';
import { RootState } from '@/redux/store';
import { NoMatchError } from './NoMatchError';
import { submitHelpHandQuestionnaire } from '@/features/actions/HelpHand'
import axios from 'axios';
import useYandexMetrika from '@/components/yandex/useYandexMetrika'

import { setIsRequestSend } from '@/redux/slices/application_form';
import { ContactMethodFormFields } from '@/widgets/shared/ContactMethodFormFields';
import { contactMethodFormSchema, type ContactMethodFormValues } from '@/widgets/shared/contactMethodFormSchema';
import { getAppContactFromStorage, persistAppContact } from '@/features/appContactStorage';
import { onHelpHandQuizCompletedSuccessfully } from '@/shared/utils/topMailHelpHandLeadwide';

export const PhoneStage = () => {
    const isRequestSend = useSelector<RootState, boolean>(state => state.applicationForm.is_request_send);
    const dispatch = useDispatch();
    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    const { reachGoal } = useYandexMetrika(102105189)


    useEffect(() => {
        axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Контакты клиента", ticket_id: ticketID },
        });

        reachGoal('svyaz')
    }, [])

    const formData = useSelector((state: RootState) => state.applicationFormData);
    const [showNoMatch, setShowNoMatch] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const saved = typeof window !== 'undefined' ? getAppContactFromStorage() : { contact: '', contactType: 'Telegram' as const }

    const form = useForm<ContactMethodFormValues>({
        resolver: zodResolver(contactMethodFormSchema),
        defaultValues: {
            contact: saved.contact,
            contactType: saved.contactType === 'WhatsApp' || saved.contactType === 'Phone' ? 'Telegram' : saved.contactType,
        }
    })

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
        setIsLoading(true);
        dispatch(setIsRequestSend(true));
        persistAppContact(data.contact, data.contactType);
        dispatch(setPhone(data.contact));
        dispatch(setContactType(data.contactType));

        try {
            if (typeof window !== 'undefined') {
                (window as any)._tmr?.push?.({ type: 'reachGoal', id: 3503497, goal: 'Lead' });
            }

            await submitHelpHandQuestionnaire({
                ...formData,
                phone: data.contact,
                contact_type: data.contactType,
            });

            dispatch(setHasMatchingError(false));
            reachGoal('submit_help_hand_form')

            onHelpHandQuizCompletedSuccessfully(ticketID);
            dispatch(setApplicationStage('gratitude'));


        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            dispatch(setHasMatchingError(true));
            setShowNoMatch(true);
        } finally {
            setIsLoading(false);
            dispatch(setIsRequestSend(false));
        }
    }

    if (showNoMatch) {
        return <NoMatchError onClose={handleCloseNoMatch} />;
    }

    return (
        <div className='px-[50px] max-lg:px-[20px] flex w-full grow'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[15px] w-full flex flex-col relative">
                    {isLoading && (
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
                            onClick={() => dispatch(setApplicationStage('psychologist_price'))}
                            className={`cursor-pointer shrink-0 w-[81px] border-[1px] border-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.primary}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Назад
                        </button>

                        <button
                            type='submit'
                            className={`cursor-pointer grow border-[1px] bg-[${COLORS.primary}] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px]`}
                        >
                            Подтвердить заявку
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
