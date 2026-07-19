'use client'

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { COLORS } from '@/shared/constants/colors';
import styles from '@/styles/input.module.scss';

// --- Опции для чекбоксов и радио (копии из HelpHandStages) ---

const PREFERENCES_OPTIONS = [
    { id: "Чуткость, мягкость, умение выслушивать", label: "Чуткость, мягкость, умение выслушивать" },
    { id: "Прямолинейность, строгость, серьезность", label: "Прямолинейность, строгость, серьезность" },
    { id: "Опыт работы в эзотерике", label: "Опыт работы в эзотерике" },
    { id: "Научность, доказательная база подхода, без эзотерики", label: "Научность, доказательная база подхода, без эзотерики" },
    { id: "Опыт семейной жизни, собственные дети", label: "Опыт семейной жизни, собственные дети" },
    { id: "Знание более 1 метода терапии (модальности)", label: "Знание более 1 метода терапии (модальности)" },
] as const;

const CONDITIONS_OPTIONS = [
    { id: "condition", label: "Физические недомогания: постоянная усталость, бессонница, проблемы с питанием, проблемы с памятью, психосоматические реакции" },
    { id: "condition1", label: "Подавленное настроение, прокрастинация, ощущение бессмысленности существования, опустошенность, отверженность" },
    { id: "condition2", label: "Беременность, родительство, послеродовая депрессия, проблемы в отношениях с детьми до 18 лет" },
    { id: "condition3", label: "Абьюзивные отношения, домашнее насилие" },
    { id: "condition4", label: "Психологические зависимости: игровые, любовные, виртуальные и прочие" },
    { id: "condition5", label: "Состояние ужаса, панические атаки" },
    { id: "condition6", label: "Намерения или попытки суицида" },
    { id: "condition7", label: "Повышенная эмоциональность, эмоциональные всплески, приступы агрессии, поступки под действием эмоций, частые смены настроения" },
    { id: "condition8", label: "Сложности в сексуальной сфере" },
    { id: "condition9", label: "Проблемы с раскрытием женственности и сексуальности" },
    { id: "condition10", label: "Ничего из вышеперечисленного" },
] as const;

const TRAUMATIC_OPTIONS = [
    { id: "traumatic1", label: "Утрата близкого" },
    { id: "traumatic2", label: "Болезни близкого" },
    { id: "traumatic3", label: "Диагностированное смертельное заболевание" },
    { id: "traumatic4", label: "Сексуальное насилие во взрослом возрасте" },
    { id: "traumatic5", label: "Сексуальное насилие в детстве" },
    { id: "traumatic6", label: "Ничего из вышеперечисленного" },
] as const;

// --- Zod схема ---

const FormSchema = z.object({
    username: z.string().optional(),
    age: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    experience: z.enum(['earlier', 'in_therapy', 'supposed', 'no']).optional(),
    preferences: z.array(z.string()),
    customPreferences: z.string().optional(),
    diseases: z.enum(['diseases1', 'diseases2', 'nothing']).optional(),
    conditions: z.array(z.string()),
    traumatic: z.array(z.string()),
    request: z.string().optional(),
    price_session: z.enum(['free', '300', '500', '1000', '1500', '2000', '3000']).optional(),
    contact: z.string().optional(),
    contactType: z.enum(['Telegram', 'VK', 'Max']).optional(),
    promocode: z.string().optional(),
});

type FormData = z.infer<typeof FormSchema>;

// --- Маппинг данных API → форма ---

const mapGenderFromApi = (sex: string | undefined): 'male' | 'female' | undefined => {
    if (!sex) return undefined;
    const s = sex.normalize('NFC').toLowerCase().trim();
    if (s === 'мужской' || s === 'male') return 'male';
    if (s === 'женский' || s === 'female') return 'female';
    return undefined;
};

const mapExperienceFromApi = (exp: string | undefined): 'earlier' | 'in_therapy' | 'supposed' | 'no' | undefined => {
    if (!exp) return undefined;
    const s = exp.normalize('NFC').toLowerCase().trim();
    if (s.includes('обращался') || s.includes('ранее')) return 'earlier';
    if (s.includes('нахожусь в терапии') || s.includes('сейчас')) return 'in_therapy';
    if (s.includes('рассматривал')) return 'supposed';
    if (s === 'нет') return 'no';
    return undefined;
};

const mapPriceFromApi = (price: string | undefined): 'free' | '300' | '500' | '1000' | '1500' | '2000' | '3000' | undefined => {
    if (!price) return undefined;
    const s = price.toLowerCase().trim().replace(/\s+/g, '');
    if (s === 'бесплатно' || s === 'free') return 'free';
    const numeric = s.replace(/[^\d]/g, '');
    if (['300', '500', '1000', '1500', '2000', '3000'].includes(numeric)) {
        return numeric as '300' | '500' | '1000' | '1500' | '2000' | '3000';
    }
    return undefined;
};

const mapDiseasesFromApi = (diagnoses: string[] | undefined): 'diseases1' | 'diseases2' | 'nothing' | undefined => {
    if (!diagnoses || diagnoses.length === 0) return 'nothing';
    const joined = diagnoses.join(' ').toLowerCase();
    if (joined.includes('нет') || joined.includes('nothing')) return 'nothing';
    if (joined.includes('психиатрическ')) return 'diseases2';
    if (joined.includes('психическ')) return 'diseases1';
    return 'nothing';
};

const mapContactTypeFromApi = (ct: string | undefined): 'Telegram' | 'VK' | 'Max' | undefined => {
    if (!ct) return 'Telegram';
    const s = ct.trim();
    if (s === 'VK' || s === 'vk') return 'VK';
    if (s === 'Max' || s === 'max') return 'Max';
    return 'Telegram';
};

const extractTicketData = (data: any): any => {
    if (!data) return {};
    // API может возвращать данные в разных обёртках
    if (Array.isArray(data)) return data[0] || {};
    if (data.ticket && typeof data.ticket === 'object') return data.ticket;
    return data;
};

const safeParseArray = (val: any): string[] => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                console.error('Failed to parse JSON string array:', val, e);
            }
        }
        return [trimmed];
    }
    return [];
};

const mapPreferencesToIds = (labels: string[]): string[] => {
    return labels.map(lbl => {
        const normLbl = lbl.normalize('NFC').trim().toLowerCase();
        const found = PREFERENCES_OPTIONS.find(
            opt => opt.id.normalize('NFC').trim().toLowerCase() === normLbl
        );
        return found ? found.id : '';
    }).filter(id => id !== '');
};

const mapConditionsToIds = (labels: string[]): string[] => {
    return labels.map(lbl => {
        const normLbl = lbl.normalize('NFC').trim().toLowerCase();
        const found = CONDITIONS_OPTIONS.find(
            opt => opt.label.normalize('NFC').trim().toLowerCase() === normLbl
        );
        return found ? found.id : '';
    }).filter(id => id !== '');
};

const mapTraumaticToIds = (labels: string[]): string[] => {
    return labels.map(lbl => {
        const normLbl = lbl.normalize('NFC').trim().toLowerCase();
        const found = TRAUMATIC_OPTIONS.find(
            opt => opt.label.normalize('NFC').trim().toLowerCase() === normLbl
        );
        return found ? found.id : '';
    }).filter(id => id !== '');
};

// --- Компонент ---

interface RegistrationFormProps {
    linkId: string;
}

export const RegistrationForm = ({ linkId }: RegistrationFormProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSubmittingRef = useRef(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: '',
            age: '',
            gender: undefined,
            experience: undefined,
            preferences: [],
            customPreferences: '',
            diseases: 'nothing',
            conditions: [],
            traumatic: [],
            request: '',
            price_session: undefined,
            contact: '',
            contactType: 'Telegram',
            promocode: '',
        },
    });

    // Загрузка данных анкеты
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const response = await fetch(
                    `https://n8n-v2.hrani.live/webhook/get-ticket-info?ticket_id=${encodeURIComponent(linkId)}`
                );
                if (!response.ok) throw new Error(`Ошибка загрузки: ${response.status}`);
                const rawData = await response.json();
                const data = extractTicketData(rawData);

                // Маппим API данные в формат формы
                const rawPreferences = safeParseArray(
                    data.important_in_psychologist || data.importancePsycho || data.preferences
                );
                const rawConditions = safeParseArray(
                    data.client_state || data.clientStates || data.conditions
                );
                const rawTraumatic = safeParseArray(
                    data.traumatic_events || data.traumaticEvents || data.traumatic
                );

                form.reset({
                    username: data.name || data.username || data.client_name || '',
                    age: String(data.age || data.client_age || ''),
                    gender: mapGenderFromApi(data.sex || data.gender_user || data.client_sex),
                    experience: mapExperienceFromApi(
                        data.hasPsychoExperience || data.experience || data.client_experience || data.past_session_experience
                    ),
                    preferences: mapPreferencesToIds(rawPreferences),
                    customPreferences: data.customImportance || data.custom_preferences || '',
                    diseases: mapDiseasesFromApi(
                        Array.isArray(data.diagnoses) ? data.diagnoses :
                            Array.isArray(data.diseases) ? data.diseases :
                                data.has_mental_illness ? [data.has_mental_illness] : undefined
                    ),
                    conditions: mapConditionsToIds(rawConditions),
                    traumatic: mapTraumaticToIds(rawTraumatic),
                    request: Array.isArray(data.questions)
                        ? data.questions.join('\n')
                        : data.questions_to_psychologist || data.question_to_psychologist || data.request || '',
                    price_session: mapPriceFromApi(
                        data.categoryType || data.price_session || data.psychologist_price
                    ),
                    contact: data.contact || data.phone || '',
                    contactType: mapContactTypeFromApi(data.contactType || data.contact_type),
                    promocode: data.promocode || '',
                });
            } catch (error) {
                console.error('Ошибка загрузки данных анкеты:', error);
                setLoadError('Не удалось загрузить данные анкеты. Проверьте link_id и попробуйте снова.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [linkId]);

    // При изменении полей формы сбрасываем статус успешного сохранения/ошибки
    useEffect(() => {
        const subscription = form.watch(() => {
            if (submitSuccess) setSubmitSuccess(false);
            if (submitError) setSubmitError(null);
        });
        return () => subscription.unsubscribe();
    }, [form, submitSuccess, submitError]);

    const handleSubmit = async (data: FormData) => {
        if (isSubmittingRef.current || isSubmitting || submitSuccess) return;
        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitError(null);
        try {
            // Маппим обратно в формат API
            const payload = {
                ticket_id: linkId,
                name: data.username || '',
                age: data.age || '',
                sex: data.gender === 'male' ? 'Мужской' : data.gender === 'female' ? 'Женский' : '',
                hasPsychoExperience:
                    data.experience === 'earlier' ? 'Да, обращался(ась) ранее' :
                        data.experience === 'in_therapy' ? 'Да, сейчас нахожусь в терапии' :
                            data.experience === 'supposed' ? 'Нет, но рассматривал(а) такую возможность' :
                                data.experience === 'no' ? 'Нет' : '',
                importancePsycho: data.preferences,
                customImportance: data.customPreferences || '',
                diagnoses: data.diseases === 'diseases1'
                    ? ['Есть диагностированное психическое заболевание']
                    : data.diseases === 'diseases2'
                        ? ['Есть диагностированное психиатрическое заболевание']
                        : ['Нет'],
                clientStates: data.conditions.map(id => {
                    const option = CONDITIONS_OPTIONS.find(o => o.id === id);
                    return option ? option.label : id;
                }),
                traumaticEvents: data.traumatic.map(id => {
                    const option = TRAUMATIC_OPTIONS.find(o => o.id === id);
                    return option ? option.label : id;
                }),
                questions: data.request ? [data.request] : [],
                question_to_psychologist: data.request || '',
                categoryType: data.price_session === 'free' ? 'Бесплатно' :
                    data.price_session ? `${data.price_session} руб` : '',
                contact: data.contact || '',
                contactType: data.contactType || 'Telegram',
                promocode: data.promocode || '',
            };

            const response = await fetch(
                `https://n8n-v2.hrani.live/webhook/republish-rp?link_id=${encodeURIComponent(linkId)}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) throw new Error(`Ошибка сохранения: ${response.status}`);

            setSubmitSuccess(true);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
            setSubmitError('Не удалось сохранить изменения. Попробуйте позже.');
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                <span className="mt-4 text-[18px] max-lg:text-[14px] text-[#116466]">Загрузка анкеты...</span>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-[30px]">
                <span className="text-[18px] max-lg:text-[14px] text-[#FF4D4F] text-center">{loadError}</span>
            </div>
        );
    }

    return (
        <div className="px-[50px] max-lg:px-[20px] flex w-full grow">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full flex flex-col mt-[15px] gap-[20px] max-lg:gap-[15px]">

                    {isSubmitting && (
                        <div className="fixed inset-0 bg-white/80 flex items-center justify-center z-50">
                            <div className="flex flex-col items-center gap-[10px]">
                                <div className="w-12 h-12 border-4 border-[#116466] border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-[18px] text-[#116466]">Сохранение...</span>
                            </div>
                        </div>
                    )}



                    {/* === Имя === */}
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Как вас зовут?
                                </FormLabel>
                                <div className={styles.input__text_container}>
                                    <Input
                                        {...field}
                                        placeholder=" "
                                        className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                    />
                                    <label className={`${styles.input__text_label} text-[14px]`}>
                                        Введите ваше имя или псевдоним
                                    </label>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* === Возраст === */}
                    <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[16px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Сколько вам лет?
                                </FormLabel>
                                <div className={styles.input__text_container}>
                                    <Input
                                        {...field}
                                        placeholder=" "
                                        className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                    />
                                    <label className={`${styles.input__text_label} text-[14px]`}>
                                        Введите ваш возраст
                                    </label>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* === Пол === */}
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Какой у вас пол?
                                </FormLabel>
                                <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                    >
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="male" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Мужской
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="female" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Женский
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* === Опыт === */}
                    <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Обращались ли вы к психологу или к психотерапевту ранее?
                                </FormLabel>
                                <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                    >
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="earlier" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Да, обращался(ась) ранее
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="in_therapy" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Да, сейчас нахожусь в терапии
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="supposed" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Нет, но рассматривал(а) такую возможность
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="no" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Нет
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* === Что важно в психологе === */}
                    <FormField
                        control={form.control}
                        name="preferences"
                        render={() => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Что для вас важно в психологе?
                                </FormLabel>
                                <FormDescription className="text-neutral-500 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                    Выберите один или несколько вариантов
                                </FormDescription>
                                <div className="flex flex-col gap-[15px] max-lg:gap-[12px] mt-[20px] max-lg:mt-[16px]">
                                    {PREFERENCES_OPTIONS.map((option) => (
                                        <FormField
                                            key={option.id}
                                            control={form.control}
                                            name="preferences"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <Checkbox
                                                            className="h-[24px] w-[24px] max-lg:h-[20px] max-lg:w-[20px] mt-[2px]"
                                                            checked={field.value?.includes(option.id)}
                                                            onCheckedChange={(checked) => {
                                                                const current = field.value || [];
                                                                field.onChange(
                                                                    checked
                                                                        ? [...current, option.id]
                                                                        : current.filter((v: string) => v !== option.id)
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        {option.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                                {/* Свой вариант */}
                                <FormField
                                    control={form.control}
                                    name="customPreferences"
                                    render={({ field }) => (
                                        <div className={`${styles.input__text_container} mt-[15px]`}>
                                            <Input
                                                {...field}
                                                placeholder=" "
                                                className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                            />
                                            <label className={`${styles.input__text_label} text-[14px]`}>
                                                Свой вариант (необязательно)
                                            </label>
                                        </div>
                                    )}
                                />
                            </FormItem>
                        )}
                    />

                    {/* === Заболевания === */}
                    <FormField
                        control={form.control}
                        name="diseases"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Есть ли у вас диагностированное заболевание?
                                </FormLabel>
                                <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                    >
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="diseases1" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Есть диагностированное психическое заболевание
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="diseases2" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Есть диагностированное психиатрическое заболевание
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                            <FormControl>
                                                <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value="nothing" />
                                            </FormControl>
                                            <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                Нет
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* === Состояния === */}
                    <FormField
                        control={form.control}
                        name="conditions"
                        render={() => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Отметьте состояния, в которых вы сейчас находитесь
                                </FormLabel>
                                <FormDescription className="text-neutral-500 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                    Можно выбрать несколько
                                </FormDescription>
                                <div className="flex flex-col gap-[15px] max-lg:gap-[12px] mt-[20px] max-lg:mt-[16px]">
                                    {CONDITIONS_OPTIONS.map((option) => (
                                        <FormField
                                            key={option.id}
                                            control={form.control}
                                            name="conditions"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <Checkbox
                                                            className="h-[24px] w-[24px] max-lg:h-[20px] max-lg:w-[20px] mt-[2px]"
                                                            checked={field.value?.includes(option.id)}
                                                            onCheckedChange={(checked) => {
                                                                const current = field.value || [];
                                                                field.onChange(
                                                                    checked
                                                                        ? [...current, option.id]
                                                                        : current.filter((v: string) => v !== option.id)
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        {option.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* === Травматический опыт === */}
                    <FormField
                        control={form.control}
                        name="traumatic"
                        render={() => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Есть ли у вас травматический опыт?
                                </FormLabel>
                                <FormDescription className="text-neutral-500 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                    Можно выбрать несколько
                                </FormDescription>
                                <div className="flex flex-col gap-[15px] max-lg:gap-[12px] mt-[20px] max-lg:mt-[16px]">
                                    {TRAUMATIC_OPTIONS.map((option) => (
                                        <FormField
                                            key={option.id}
                                            control={form.control}
                                            name="traumatic"
                                            render={({ field }) => (
                                                <FormItem className="flex items-start gap-[15px] max-lg:gap-[12px]">
                                                    <FormControl>
                                                        <Checkbox
                                                            className="h-[24px] w-[24px] max-lg:h-[20px] max-lg:w-[20px] mt-[2px]"
                                                            checked={field.value?.includes(option.id)}
                                                            onCheckedChange={(checked) => {
                                                                const current = field.value || [];
                                                                field.onChange(
                                                                    checked
                                                                        ? [...current, option.id]
                                                                        : current.filter((v: string) => v !== option.id)
                                                                );
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                        {option.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* === Запрос === */}
                    <FormField
                        control={form.control}
                        name="request"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Опишите свой запрос к психологу
                                </FormLabel>
                                <FormDescription className="text-neutral-500 text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal">
                                    Что беспокоит, чего ожидаете, к чему хотите прийти?
                                </FormDescription>
                                <div className={styles.input__text_container}>
                                    <Textarea
                                        {...field}
                                        placeholder=" "
                                        className={`${styles.input__text} text-[18px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                        style={{
                                            resize: 'none',
                                            lineHeight: '1.5',
                                            wordBreak: 'break-word',
                                            whiteSpace: 'pre-wrap',
                                            overflowWrap: 'break-word',
                                            maxHeight: '180px',
                                            overflowY: 'auto',
                                        }}
                                    />
                                    <label className={styles.input__text_label}>
                                        Опишите ваш запрос
                                    </label>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* === Стоимость === */}
                    <FormField
                        control={form.control}
                        name="price_session"
                        render={({ field }) => (
                            <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                                <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                                    Какую сумму за сессию вы готовы платить?
                                </FormLabel>
                                <FormControl className="mt-[20px] max-lg:mt-[16px]">
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="flex flex-col gap-[20px] max-lg:gap-[16px]"
                                    >
                                        {[
                                            { value: '2000', label: '2 000 ₽' },
                                            { value: '1500', label: '1 500 ₽' },
                                            { value: '1000', label: '1 000 ₽' },
                                            { value: '500', label: '500 ₽' },
                                            { value: 'free', label: 'Бесплатно' },
                                        ].map((opt) => (
                                            <FormItem key={opt.value} className="flex items-center gap-[15px] max-lg:gap-[12px]">
                                                <FormControl>
                                                    <RadioGroupItem className="h-[30px] w-[30px] max-lg:h-[24px] max-lg:w-[24px]" value={opt.value} />
                                                </FormControl>
                                                <FormLabel className={`text-[18px] lg:text-[18px] md:text-[14px] max-lg:text-[14px] leading-[25px] max-lg:leading-[20px] font-normal text-[${COLORS.text.primary}]`}>
                                                    {opt.label}
                                                </FormLabel>
                                            </FormItem>
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    {/* === Контакт === */}
                    <FormItem className="p-[30px] max-lg:p-[15px] border-[1px] rounded-[25px]">
                        <FormLabel className="text-[20px] lg:text-[20px] md:text-[14px] max-lg:text-[14px] leading-[27px] max-lg:leading-[22px] font-semibold">
                            Контакт для связи
                        </FormLabel>
                        <FormField
                            control={form.control}
                            name="contactType"
                            render={({ field }) => (
                                <div className="flex flex-wrap gap-[10px] max-lg:gap-[8px] mt-[15px]">
                                    {(['Telegram', 'VK', 'Max'] as const).map((opt) => {
                                        const isActive = field.value === opt;
                                        return (
                                            <button
                                                key={opt}
                                                type="button"
                                                onClick={() => field.onChange(opt)}
                                                className={`flex items-center gap-[8px] px-[16px] py-3 max-lg:px-[12px] max-lg:py-[8px] rounded-[50px] border text-[16px] leading-none max-lg:text-[12px] transition-colors ${isActive
                                                    ? `border-[${COLORS.primary}] bg-[#F0FAFA] text-[${COLORS.primary}]`
                                                    : 'border-[#D4D4D4] text-[#333] hover:border-[#999]'
                                                    }`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact"
                            render={({ field }) => (
                                <div className={`${styles.input__text_container} mt-[15px]`}>
                                    <Input
                                        {...field}
                                        placeholder=" "
                                        className={`${styles.input__text} text-[14px] w-full h-full px-[20px] bg-[#FAFAFA] rounded-[10px] border-none`}
                                    />
                                    <label className={`${styles.input__text_label} text-[14px]`}>
                                        Введите контакт
                                    </label>
                                </div>
                            )}
                        />
                    </FormItem>

                    {/* === Кнопка === */}
                    <div className="shrink-0 pb-[50px] max-lg:pb-[20px] flex flex-col gap-[15px] mt-[10px]">
                        <button
                            type="submit"
                            disabled={isSubmitting || submitSuccess}
                            className={`grow border-[1px] bg-[${COLORS.primary}] min-lg:p-[12px] text-[${COLORS.white}] font-normal text-[18px] max-lg:text-[14px] rounded-[50px] max-lg:h-[47px] ${isSubmitting || submitSuccess ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isSubmitting ? 'Сохранение...' : submitSuccess ? 'Сохранено' : 'Сохранить изменения'}
                        </button>

                        {submitSuccess && (
                            <div className="bg-[#E8F5E9] border border-[#4CAF50] p-[15px] rounded-[15px] text-[16px] max-lg:text-[14px] text-[#2E7D32] text-center font-medium">
                                Изменения успешно сохранены. Пожалуйста подтвердите заявку в боте
                            </div>
                        )}

                        {submitError && (
                            <div className="bg-[#FFEBEE] border border-[#FF8A80] p-[15px] rounded-[15px] text-[16px] max-lg:text-[14px] text-[#C62828] text-center font-medium">
                                {submitError}
                            </div>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default RegistrationForm;