"use client"

import ApplicationForm from "@/views/application_form";
import { generateTicketId } from "@/redux/slices/application_form_data";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import axios from "axios";
import { clearStorage } from "@/features/utils";
import { useSearchParams } from "next/navigation";

export default function ApplicationFormLayout() {
    const dispatch = useDispatch()

    const searchParams = useSearchParams()
    // Проверяем, перешли ли мы из иммледовательской формы
    const isResearchRedirect = searchParams.get('research') == 'true'

    const ticketID = useSelector<RootState, string>(
        state => state.applicationFormData.ticketID
    );

    if (!ticketID) {
        dispatch(generateTicketId(''));
    }

    useEffect(() => {
        // Инициализируем трекер формы
        axios({
            method: "POST",
            url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
            data: { ticket_id: ticketID, form_type: 'Заявка на подбор психолога', step: "Начало" },
        });

        clearStorage(isResearchRedirect)
    }, []);
    return (
        // <div className="w-full min-h-[100svh] max-lg:flex-col  max-lg:justify-start  min-lg:flex justify-center items-center">
        <div className="w-full h-full flex justify-center items-center">
            <ApplicationForm />
        </div>
    )
}