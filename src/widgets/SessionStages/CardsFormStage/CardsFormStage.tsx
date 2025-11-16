'use client'

import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import CardsForm from '@/views/cards_form';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { resetApplicationForm } from '@/redux/slices/application_form';
import { resetApplicationFormData } from '@/redux/slices/application_form_data';

export const CardsFormStage = () => {
    const dispatch = useDispatch();
    const selectedPsychologist = useSelector((state: RootState) => state.modal.selectedPsychologist);
    
    // Сбрасываем состояние формы при смене психолога
    useEffect(() => {
        if (selectedPsychologist) {
            const newTicketId = `cd_${Math.random().toString(36).substring(7)}`;
            dispatch(resetApplicationForm());
            dispatch(resetApplicationFormData(newTicketId));
        }
    }, [selectedPsychologist, dispatch]);
    
    if (!selectedPsychologist) {
        return null;
    }
    
    return (
        <ModalWindow type="CardsForm" maxWidth="960px" className="max-w-[960px] max-h-[650px] !p-0 overflow-hidden">
            <div className="w-full h-[650px] overflow-hidden">
                <CardsForm key={selectedPsychologist} psychologistId={selectedPsychologist} />
            </div>
        </ModalWindow>
    );
};