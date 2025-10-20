"use client"

import ApplicationForm from "@/views/application_form";
import { generateTicketId } from "@/redux/slices/application_form_data";
import { setInitTrackerStatusLaunched } from "@/redux/slices/application_form";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";



export default function ApplicationFormLayout() {
    const dispatch = useDispatch()

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    const is_tracker_launched = useSelector((state: RootState) => state.applicationForm.is_tracker_launched)

    useEffect(() => {
        if (!ticketID) {
            dispatch(generateTicketId(''));
        }
    }, [ticketID, dispatch]);

    // Инициализируем трекер формы
    useEffect(() => {
        if (ticketID != "" && !is_tracker_launched) {           
            axios({
                method: "POST",
                url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
                data: { ticket_id: ticketID, form_type: 'Заявка на подбор психолога', step: "Начало" },
            }).then(r => {
                dispatch(setInitTrackerStatusLaunched())
            });
        }
    }, [ticketID])

    return (
        // <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
            <Suspense>
                <ApplicationForm />
            </Suspense>
        </div>
    )
}