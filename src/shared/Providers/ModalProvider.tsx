'use client'

import { useDispatch } from "react-redux";
import { closeModal } from "@/redux/slices/modal";
import { TimeStage } from "@/widgets/SessionStages/TimeStage/TimeStage";
import { ContactStage } from "@/widgets/SessionStages/ContactStage/ContactStage";

export function ModalProvider() {
    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(closeModal());
    };

    return (
        <>
            <TimeStage />
            <ContactStage callback={handleClose} />
        </>
    );
} 