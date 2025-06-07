"use client"

import HelpHandForm from "@/views/help_hand_form";

import { generateTicketId } from "@/redux/slices/application_form_data";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";

export default function ApplicationFormLayout() {

    const dispatch = useDispatch()

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

     if (!ticketID) {
        dispatch(generateTicketId(''));
    }

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId(''));
        }
    }, []);

    // Инициализируем трекер формы
    useEffect(() => {
        if (ticketID != "") {
            axios({
                method: "POST",
                url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
                data: { ticket_id: ticketID, form_type: 'Заявка на руку помощи', step: "Начало" },
            });
        }
    }, [ticketID])

    return (
        // <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
            <Suspense>
                <HelpHandForm />
            </Suspense>
        </div>
    )
}