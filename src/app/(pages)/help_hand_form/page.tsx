"use client"

import HelpHandForm from "@/views/help_hand_form";

import { generateTicketId } from "@/redux/slices/application_form_data";
import { setInitTrackerStatusLaunched } from "@/redux/slices/application_form";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";

export default function ApplicationFormLayout() {

    const dispatch = useDispatch()

    const is_tracker_launched = useSelector((state: RootState) => state.applicationForm.is_tracker_launched)

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

     if (!ticketID) {
        dispatch(generateTicketId('hh_'));
    }

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId('hh_'));
        }
    }, []);

    // Инициализируем трекер формы
    useEffect(() => {
        if (ticketID != "" && !is_tracker_launched) {
            axios({
                method: "POST",
                url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
                data: { ticket_id: ticketID, form_type: 'Заявка на руку помощи', step: "Начало" },
            }).then(r => {
                dispatch(setInitTrackerStatusLaunched())
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