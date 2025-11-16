'use client'

import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import CardsForm from '@/views/cards_form';

export const CardsFormStage = () => {
    return (
        <ModalWindow type="CardsForm" maxWidth="960px" className="max-w-[960px] max-h-[650px] p-0 overflow-hidden">
            <div className="w-full h-[650px] overflow-hidden">
                <CardsForm />
            </div>
        </ModalWindow>
    );
};