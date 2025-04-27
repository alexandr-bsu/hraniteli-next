'use client'

import { Button } from '@/components/ui/button';
import { DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getTimeDifference } from '@/features/utils';
import { closeModal, openModal } from '@/redux/slices/modal';
import { ModalWindow } from '@/widgets/ModalWindow/ModalWindow';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { RootState } from '@/redux/store';
import { redirect } from 'next/navigation';
import PhoneInput from '@/components/phoneimput';
import { getPsychologistAll } from '@/features/actions/getPsychologistAll';

interface ContactStageProps {
    callback: () => void;
}

interface FormPsyClientInfo {
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
    formPsyClientInfo: FormPsyClientInfo;
    utm_client: string | null;
    utm_tarif: string | undefined;
    utm_campaign: string | null;
    utm_content: string | null;
    utm_medium: string | null;
    utm_source: string | null;
    utm_term: null;
    utm_psy: string | undefined;
}

interface IPsychologist {
    id?: string;
    name: string;
    experience?: string;
    in_community?: string;
    link_photo?: string;
    verified?: boolean;
    main_modal?: string;
    min_session_price?: number;
    additional_modals?: string[] | string;
    works_with?: string;
    queries?: string;
    short_description?: string;
    personal_therapy_duration?: string;
    supervision?: boolean;
    is_married?: boolean;
    has_children?: boolean;
    vk?: string;
    site?: string;
    telegram?: string;
    is_video?: boolean;
    video?: boolean;
    link_video?: string | null;
    sex?: string;
    age?: number;
    requests?: string[];
    available_times?: string[];
    available_dates?: string[];
    mental_illness?: string[];
    mental_illness2?: string[];
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

const makeTicketId = (length: number): string => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length }, () => 
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
};

const filterClientQueries = (list: any[], mode: 'traumatic' | 'states'): string[] => {
    const targetList = mode === 'traumatic' ? TRAUMATIC_EVENTS : CLIENT_STATES;
    return list.map(item => item.name).filter(item => targetList.includes(item));
};

const getGoogleDriveImageUrl = (url: string | undefined) => {
    if (!url) return '/card/214х351.jpg';
    
    // Убираем @ в начале ссылки если есть
    const cleanUrl = url.startsWith('@') ? url.slice(1) : url;
    
    // Если это не гугл драйв ссылка - возвращаем как есть
    if (!cleanUrl.includes('drive.google.com')) return cleanUrl;
    
    // Если ссылка уже в нужном формате - возвращаем как есть
    if (cleanUrl.includes('/uc?')) return cleanUrl;
    
    // Извлекаем ID файла из разных форматов ссылок
    let fileId = '';
    if (cleanUrl.includes('/d/')) {
        fileId = cleanUrl.match(/\/d\/(.+?)(?:\/|$)/)?.[1] || '';
    } else if (cleanUrl.includes('id=')) {
        fileId = cleanUrl.match(/id=(.+?)(?:&|$)/)?.[1] || '';
    }
    
    if (!fileId) return '/images/default-avatar.png';
    
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

const getAgeWord = (age: number): string => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
};

export const ContactStage: React.FC<ContactStageProps> = ({ callback }) => {
    const [login, setLogin] = useState('');
    const [telephone, setTelephone] = useState('');
    const [psychologistData, setPsychologistData] = useState<IPsychologist | null>(null);
    
    const dispatch = useDispatch();
    
    const slots = useSelector((state: RootState) => state.modal.selectedSlots) || [];
    const slots_objects = useSelector((state: RootState) => state.modal.slots_objects) || [];
    const requests = useSelector((state: RootState) => state.filter.requests) as IPsychologist[];
    const hasMentalIllness = useSelector((state: RootState) => state.filter.mental_illness);
    const selectedPsychologist = useSelector((state: RootState) => state.modal.selectedPsychologist) as string;

    useEffect(() => {
        const loadPsychologistData = async () => {
            if (!selectedPsychologist) return;
            
            try {
                const psychologists = await getPsychologistAll();
                const psychologist = psychologists.find(p => p.name === selectedPsychologist);
                
                if (psychologist) {
                    // Преобразуем данные в формат IPsychologist
                    if (psychologist.additional_modals && typeof psychologist.additional_modals === 'string') {
                        psychologist.additional_modals = psychologist.additional_modals.split(';').map((item: string) => item.trim());
                    }
                    
                    setPsychologistData(psychologist);
                }
            } catch (error) {
                console.error('Error loading psychologist data:', error);
            }
        };

        loadPsychologistData();
    }, [selectedPsychologist]);

    const handleBack = () => {
        dispatch(closeModal());
        dispatch(openModal('Time'));
    };

    const getInitialFormData = (ticketId: string, timeDifference: number): FormData => ({
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
        userTimeZone: timeDifference.toString(),
        userTimeOffsetMsk: timeDifference.toString(),
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
    });

    const onSubmit = async () => {
        const timeDifference = getTimeDifference();
        const ticketId = makeTicketId(7);
        const formData = getInitialFormData(ticketId, timeDifference);

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
        <ModalWindow type="ContactForm">
            <DialogHeader className="flex flex-row">
                <Button 
                    className='m-0 p-0 cursor-pointer bg-transparent text-[#151515] shadow-none hover:bg-transparent'
                    onClick={handleBack}
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
                    className='rounded-full object-cover max-md:h-[52px] max-md:w-[52px] max-h-[80px] w-[80px]' 
                    src={getGoogleDriveImageUrl(psychologistData?.link_photo)} 
                    alt={psychologistData?.name || 'психолог'} 
                    height={80} 
                    width={80} 
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/default-avatar.png';
                    }}
                />

                <div className='flex flex-col gap-[5px]'>
                    <div className='flex items-center gap-[5px]'>
                        <h2 className='font-semibold text-[18px] leading-[25px] max-md:text-[14px]'>
                            {psychologistData?.name || selectedPsychologist}
                            {psychologistData?.age && `, ${psychologistData.age} ${getAgeWord(psychologistData.age)}`}
                        </h2>
                        {psychologistData?.verified && (
                            <Image 
                                src="/card/verified.svg" 
                                alt="Verified" 
                                width={16} 
                                height={16}
                                unoptimized
                            />
                        )}
                    </div>
                    <span className='font-normal text-[16px] leading-[22px] max-md:text-[14px]'>
                        {psychologistData?.experience && (
                            <span className=''>
                                {psychologistData.experience}{' '}
                            </span>
                        )}
                        {psychologistData?.in_community && (
                            <span className=''>
                                в сообществе
                            </span>
                        )}
                    </span>
                </div>
            </div>

            <form>
                <input 
                    value={login} 
                    onChange={e => setLogin(e.target.value)}
                    maxLength={35}
                    type="text" 
                    className='max-md:placeholder:text-[14px] max-md:h-[47px] w-full h-[65px] bg-[#FAFAFA] px-[20px] rounded-[10px] font-normal text-[18px] leading-[25px]' 
                    placeholder='Введите ваше имя или псевдоним' 
                />
                
                <div className='mt-[25px] focus-within:outline-2 focus-within:outline-[#D4D4D4] px-[20px] max-md:placeholder:text-[14px] flex max-md:h-[47px] w-full h-[65px] bg-[#FAFAFA] rounded-[10px] font-normal text-[18px] leading-[25px]'>
                    <Image src='/flag.svg' alt='flag' height={23} width={23} />
                    <PhoneInput onChange={value => setTelephone(value)} />
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
                    Нажимая на «Забронировать», я соглашаюсь с условиями{' '}
                    <span className='text-[#116466]'>
                        обработки персональных данных, пользовательского соглашения и Оферты
                    </span>
                </span>
            </DialogFooter>
        </ModalWindow>
    );
};