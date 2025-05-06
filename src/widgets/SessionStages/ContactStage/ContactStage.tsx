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
import Link from 'next/link';

interface ContactStageProps {
    callback: () => void;
}

interface FormPsyClientInfo {
    age: string;
    city: string;
    sex: string;
    psychoEducated: string;
    anxieties: string[];
    customAnexiety: string;
    hasPsychoExperience: string;
    meetType: string;
    selectionСriteria: string;
    custmCreteria: string;
    importancePsycho: string[];
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
    age: string;
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
    bid: number;
    rid: number;
    categoryType: string;
    customCategory: string;
    question_to_psychologist: string;
    filtered_by_automatch_psy_names: string[];
    _queries: string;
    customTraumaticEvent: string;
    customState: string;
    formPsyClientInfo: FormPsyClientInfo;
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
    
    if (!fileId) return '/images/default.jpg';
    
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
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const dispatch = useDispatch();
    
    const slots = useSelector((state: RootState) => state.modal.selectedSlots) || [];
    const slots_objects = useSelector((state: RootState) => state.modal.slots_objects) || [];
    const requests = useSelector((state: RootState) => state.filter.requests) as IPsychologist[];
    const hasMentalIllness = useSelector((state: RootState) => state.filter.mental_illness);
    const selectedPsychologist = useSelector((state: RootState) => state.modal.selectedPsychologist) as string;
    const applicationFormData = useSelector((state: RootState) => state.applicationFormData);
    const selectedSlots = useSelector((state: RootState) => state.modal.selectedSlots);
    const filters = useSelector((state: RootState) => state.filter);

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
        diagnoseMedicaments: localStorage.getItem('app_diseases_psychologist') ? 
            JSON.parse(localStorage.getItem('app_diseases_psychologist') || '{}').medications : 'Нет',
        diagnoseInfo: '',
        traumaticEvents: filterClientQueries(requests, 'traumatic'),
        clientStates: filterClientQueries(requests, 'states'),
        selectedPsychologistsNames: [],
        shownPsychologists: '',
        lastExperience: '',
        amountExpectations: '',
        age: localStorage.getItem('app_age') || '',
        slots: slots,
        slots_objects: slots_objects,
        contactType: 'Telegram',
        contact: telephone,
        name: login,
        promocode: '',
        ticket_id: ticketId,
        emptySlots: false,
        userTimeZone: 'МСК',
        userTimeOffsetMsk: timeDifference.toString(),
        bid: 0,
        rid: 0,
        categoryType: '',
        customCategory: '',
        question_to_psychologist: requests.map(item => item.name).join('; '),
        filtered_by_automatch_psy_names: [selectedPsychologist],
        _queries: '',
        customTraumaticEvent: '',
        customState: '',
        formPsyClientInfo: {
            age: localStorage.getItem('app_age') || '',
            city: '',
            sex: applicationFormData.gender_user === 'male' ? 'Мужской' : 
                 applicationFormData.gender_user === 'female' ? 'Женский' : '',
            psychoEducated: '',
            anxieties: [],
            customAnexiety: '',
            hasPsychoExperience: '',
            meetType: '',
            selectionСriteria: '',
            custmCreteria: '',
            importancePsycho: [],
            customImportance: '',
            agePsycho: '',
            sexPsycho: applicationFormData.gender_psychologist === 'male' ? 'Мужчина' :
                       applicationFormData.gender_psychologist === 'female' ? 'Женщина' : 'Не имеет значения',
            priceLastSession: '',
            durationSession: '',
            reasonCancel: '',
            pricePsycho: '',
            reasonNonApplication: '',
            contactType: 'Telegram',
            contact: telephone,
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

    const separateRequests = (requests: string[]) => {
        const traumatic: string[] = [];
        const states: string[] = [];

        requests.forEach(request => {
            if (TRAUMATIC_EVENTS.includes(request)) {
                traumatic.push(request);
            } else {
                states.push(request);
            }
        });

        return { traumatic, states };
    };

    const onSubmit = async () => {
        if (!isPhoneValid) return;

        setIsSubmitting(true);
        try {
            const { traumatic, states } = separateRequests(filters.requests?.map(r => r.toString()) || []);
            const timeDifference = getTimeDifference();

            const requestData = {
                ...getInitialFormData('', timeDifference),
                traumaticEvents: [...(applicationFormData.actions || []), ...traumatic],
                clientStates: [...(applicationFormData.actions || []), ...states],
            };

            const ticketId = makeTicketId(7);
            const initialFormData = getInitialFormData(ticketId, timeDifference);

            await axios.post('https://n8n-v2.hrani.live/webhook/tilda-zayavka-test-contur', requestData);
            window.location.href = `https://t.me/hraniteli_client_test_bot?start=${ticketId}`;
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handlePhoneChange = (value: string) => {
        setTelephone(value);
        // Проверяем что телефон содержит минимум 11 цифр (для России)
        setIsPhoneValid(value.replace(/\D/g, '').length >= 11);
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

            <DialogTitle className="grow font-semibold text-[20px] leading-[27px] max-lg:text-[14px] max-lg:leading-[22px]">
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
                        target.src = '/images/default.jpg';
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
                    <PhoneInput onChange={handlePhoneChange} />
                </div>
                {!isPhoneValid && telephone && (
                    <span className="text-red-500 text-sm mt-1">
                        Введите корректный номер телефона
                    </span>
                )}
            </form>

            <DialogFooter className='flex flex-col sm:flex-col'>
                <Button 
                    onClick={onSubmit} 
                    disabled={!isPhoneValid}
                    className={`cursor-pointer max-md:text-[14px] w-full rounded-[50px] py-[25px] font-normal text-[18px] leading-[25px] ${
                        isPhoneValid 
                            ? 'hover:bg-[#116466] bg-[#116466] text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    type="button"
                >
                    Перейти в телеграм бот
                </Button>

                <span className='font-normal text-[14px] text-[#151515] max-md:text-[10px]'>
                    Нажимая на «Перейти в телеграм бот», я соглашаюсь с условиями{' '}
                    <span className='text-[#116466]'>
                        <Link href="https://hrani.live/agreement" target="_blank" className="hover:underline">обработки персональных данных</Link>, пользовательского соглашения и Оферты
                    </span>
                </span>
            </DialogFooter>
        </ModalWindow>
    );
};