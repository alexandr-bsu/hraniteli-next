'use client'

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTimeDifference } from '@/features/utils';
import { closeModal, openNext } from '@/redux/slices/modal';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';
import { redirect } from 'next/navigation';
import PhoneInput from '@/components/phoneimput';

interface ContactStageProps {
    callback: () => void;
}

interface FormData {
    anxieties: string[];
    questions: string[];
    customQuestion: string[];
    diagnoses: string[];
    diagnoseMedicaments: string;
    diagnoseInfo: string;
    traumaticEvents: string[];
    clientStates: string[];
    selectedPsychologistsNames: string[];
    shownPsychologists: string;
    lastExperience: string;
    amountExpectations: string;
    age: number;
    slots: string[];
    slots_objects: any[];
    contactType: string;
    contact: string;
    name: string;
    promocode: string;
    ticket_id: string;
    emptySlots: boolean;
    userTimeZone: string;
    userTimeOffsetMsk: string;
    bid: string;
    rid: string;
    categoryType: string;
    customCategory: string;
    question_to_psychologist: string[];
    filtered_by_automatch_psy_names: string[];
    _queries: string[] | string;
    customTraumaticEvent: string;
    customState: string;
    formPsyClientInfo: {
        age: number;
        city: string;
        sex: string;
        psychoEducated: string;
        anxieties: string[];
        customAnexiety: string;
        hasPsychoExperience: string;
        meetType: string;
        selectionСriteria: string;
        custmCreteria: string;
        importancePsycho: string;
        customImportance: string;
        agePsycho: string;
        sexPsycho: string;
        priceLastSession: string;
        durationSession: string;
        reasonCancel: string;
        pricePsycho: string;
        reasonNonApplication: string;
        contactType: string;
        contact: string;
        name: string;
        is_adult: boolean;
        is_last_page: boolean;
        occupation: string;
    };
    utm_client: string | null;
    utm_tarif: string | undefined;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_medium: string | null;
    utm_source: string | null;
    utm_term: string | null;
    utm_psy: string | undefined;
}

interface IPsychologist {
    name: string;
}

const TRAUMATIC_EVENTS: string[] = [
    "Утрата близкого",
    "Болезни близкого",
    "Диагностированное смертельное заболевание",
    "Сексуальное насилие во взрослом возрасте",
    "Сексуальное насилие в детстве"
];

const CLIENT_STATES: string[] = [
    "Физические недомогания: постоянная усталость, бессонница, проблемы с питанием, проблемы с памятью, психосоматические реакции",
    "Подавленное настроение, прокрастинация, ощущение бессмысленности существования, опустошенность, отверженность",
    "Беременность, родительство, послеродовая депрессия, проблемы в отношениях с детьми до 18 лет",
    "Абьюзивные отношения, домашнее насилие",
    "Алкогольные и химические зависимости",
    "Психологические зависимости: игровые, любовные, виртуальные и прочие",
    "Состояние ужаса, панические атаки",
    "Намерения или попытки суицида",
    "Повышенная эмоциональность, эмоциональные всплески, приступы агрессии, поступки под действием эмоций, частые смены настроения",
    "Сложности в сексуальной сфере",
    "Проблемы с раскрытием женственности и сексуальности"
];

export const ContactStage: React.FC<ContactStageProps> = ({ callback }) => {
    const [login, setLogin] = useState('');
    const [telephone, setTelephone] = useState('');
    
    const dispatch = useDispatch();
    
    const slots = useSelector((state: RootState) => state.modal.selectedSlots) || [];
    const slots_objects = useSelector((state: RootState) => state.modal.slots_objects) || [];
    const requests = useSelector((state: RootState) => state.filter.requests) as IPsychologist[];
    const hasMentalIllness = useSelector((state: RootState) => state.filter.IsMental_Illness);
    const selectedPsychologist = useSelector((state: RootState) => state.modal.selectedPsychologist) as string;

    const filterClientQueries = (list: IPsychologist[], mode: 'traumatic' | 'states'): string[] => {
        const targetList = mode === 'traumatic' ? TRAUMATIC_EVENTS : CLIENT_STATES;
        return list.map(item => item.name).filter(item => targetList.includes(item));
    };

    const makeTicketId = (length: number): string => {
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return Array.from({ length }, () => 
            characters.charAt(Math.floor(Math.random() * characters.length))
        ).join('');
    };

    const onSubmit = async () => {
        const time_difference = getTimeDifference();
        const ticketId = makeTicketId(7);

        const formData: FormData = {
            anxieties: [],
            questions: [],
            customQuestion: [],
            diagnoses: [hasMentalIllness ? 'Есть диагностированное психиатрическое заболевание' : 'Нет'],
            diagnoseMedicaments: '',
            diagnoseInfo: '',
            traumaticEvents: filterClientQueries(requests, 'traumatic'),
            clientStates: filterClientQueries(requests, 'states'),
            selectedPsychologistsNames: [],
            shownPsychologists: '',
            lastExperience: '',
            amountExpectations: '',
            age: -1,
            slots,
            slots_objects,
            contactType: 'Telegram',
            contact: telephone,
            name: login,
            promocode: '',
            ticket_id: ticketId,
            emptySlots: false,
            userTimeZone: time_difference.toString(),
            userTimeOffsetMsk: time_difference.toString(),
            bid: '',
            rid: '',
            categoryType: '',
            customCategory: '',
            question_to_psychologist: [],
            filtered_by_automatch_psy_names: [],
            _queries: requests.map(item => item.name) || '',
            customTraumaticEvent: '',
            customState: '',
            formPsyClientInfo: {
                age: -1,
                city: '',
                sex: '',
                psychoEducated: '',
                anxieties: [],
                customAnexiety: '',
                hasPsychoExperience: '',
                meetType: '',
                selectionСriteria: '',
                custmCreteria: '',
                importancePsycho: '',
                customImportance: '',
                agePsycho: '',
                sexPsycho: '',
                priceLastSession: '',
                durationSession: '',
                reasonCancel: '',
                pricePsycho: '',
                reasonNonApplication: '',
                contactType: '',
                contact: '',
                name: login,
                is_adult: true,
                is_last_page: false,
                occupation: ''
            },
            utm_client: null,
            utm_tarif: undefined,
            utm_campaign: null,
            utm_content: null,
            utm_medium: null,
            utm_source: null,
            utm_term: null,
            utm_psy: undefined
        };

        try {
            await axios.post('https://n8n-v2.hrani.live/webhook/tilda-zayavka-test-contur', formData);
            setTimeout(() => {
                redirect(`https://t.me/hraniteli_client_test_bot?start=${ticketId}`);
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <ModalWindow type="FilterRequest">
            <DialogHeader className="flex flex-row">
                <Button 
                    className='m-0 p-0 cursor-pointer bg-transparent text-[#151515] shadow-none hover:bg-transparent'
                    onClick={() => {
                        dispatch(closeModal());
                        dispatch(openNext('FilterTime'));
                    }}
                >
                    <Image src='/modal/back_arrow.svg' alt='back_arrow' height={10} width={30} />
                    Назад
                </Button>
            </DialogHeader>

            <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[16px] max-lg:leading-[22px]">
                Оставить заявку
            </DialogTitle>

            <div className='h-[80px] flex items-center gap-[25px]'>
                <Image 
                    className='rounded-full object-cover max-md:h-[52px] max-md:w-[52px]' 
                    src='/images/person.png' 
                    alt='person' 
                    height={80} 
                    width={80} 
                />

                <div className='flex flex-col gap-[5px]'>
                    <h2 className='font-semibold text-[18px] leading-[25px] max-md:text-[14px]'>
                        {selectedPsychologist}
                    </h2>
                    <span className='font-normal text-[16px] leading-[22px] max-md:text-[14px]'>
                        6 месяцев в хранителях
                    </span>
                </div>
            </div>

            <form>
                <input 
                    value={login} 
                    onChange={e => setLogin(e.target.value)} 
                    type="text" 
                    className='max-md:placeholder:text-[14px] max-md:h-[47px] w-full h-[65px] bg-[#FAFAFA] px-[20px] rounded-[10px] font-normal text-[18px] leading-[25px]' 
                    placeholder='Введите ваше имя или псевдоним' 
                />
                
                <div className='mt-[25px] focus-within:outline-2 focus-within:outline-[#D4D4D4] px-[20px] max-md:placeholder:text-[14px] flex max-md:h-[47px] w-full h-[65px] bg-[#FAFAFA] rounded-[10px] font-normal text-[18px] leading-[25px]'>
                    <Image src='/flag.svg' alt='flag' height={23} width={23} />
                    <PhoneInput />
                </div>
            </form>

            <DialogFooter className='flex flex-col sm:flex-col'>
                <Button 
                    onClick={onSubmit} 
                    className="cursor-pointer max-md:text-[14px] w-full hover:bg-[#116466] bg-[#116466] rounded-[50px] text-[white] py-[25px] font-normal text-[18px] leading-[25px]" 
                    type="button"
                >
                    Перейти в телеграм бот
                </Button>

                <span className='font-normal text-[14px] text-[#151515] max-md:text-[10px]'>
                    Нажимая на «Забронировать», я соглашаюсь с условиями 
                    <span className='text-[#116466]'>
                        обработки персональных данных, пользовательского соглашения и Оферты
                    </span>
                </span>
            </DialogFooter>
        </ModalWindow>
    );
};