'use client'

import Image from "next/image";
import { FC, useEffect, useState, useRef, forwardRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal, setSelectedPsychologist as setModalSelectedPsychologist, setSelectedDate, setSelectedSlot } from "@/redux/slices/modal";
import { addFavorite, removeFavorite } from "@/redux/slices/favorites";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';
import { RootState } from "@/redux/store";
import styles from './Card.module.scss';
import { toast } from "sonner";
import { Tooltip } from '@/shared/ui/Tooltip/Tooltip';
import { TextTooltip } from '@/shared/ui/Tooltip/TextTooltip';
import { setSelectedPsychologist } from "@/redux/slices/filter";
import { useSearchParams, usePathname } from 'next/navigation'
import React from 'react';

const getAgeWord = (age: number): string => {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
};

const getGoogleDriveImageUrl = (url: string | undefined) => {
    if (!url) return '/card/214х351.jpg';

    // Если это cdnvideo.ru, возвращаем как есть
    if (url.includes('cdnvideo.ru')) return url;

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

const getGoogleDriveVideoUrl = (url: string | null | undefined) => {
    if (!url) return null;

    // Если это cdnvideo.ru, возвращаем как есть
    if (url.includes('cdnvideo.ru')) return url;

    if (!url.includes('drive.google.com')) return url;

    const fileId = url.match(/\/d\/(.+?)\//)?.[1];
    if (!fileId) return null;

    return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

const method_description = {
    "Аналитическая психология": "Подход помогает глубоко исследовать причины вашего текущего состояния — включая травмы, подавленные чувства и сценарии, повторяющиеся в жизни. Работа строится не только через разговор, но и через образы: сны, символы, метафоры, МАК-карты, сказки. Здесь важна не только логика, но и воображение — как инструмент самопонимания. Вместе с психологом вы будете размышлять, исследовать свои чувства и искать смысл в личной истории",
    "Гештальт": "Подход поможет вам соединить «в моменте» мысли, чувства и эмоции - он в целом держит в фокусе ваши эмоции. Ключевая идея - вернуть вас в состояние «здесь и сейчас», дать возможность в настоящем осмыслить и понять себя и свои потребности. Помимо этого, вместе с психологом вы сможете осмыслить отношения с окружающими  - завершить те контакты, которые приносят переживания. Это очень живой и разговорный подход",
    "Психоанализ": "В этом подходе акцент делается на том, чтобы заново переосмыслить (в основном) ваш детский опыт, который влияет на убеждения и предпочтения в настоящем. Вместе с психологом вы будете искать и «выводить в свет» подавленные мысли и желания, которые сдерживают вашу энергию жизни, страсти (или по-другому - «Либидо»). Это творческий, глубинный, психодинамический подход, близкий по техникам к аналитической психологии",
    "КПТ": "Этот подход поможет вам скорректировать свое поведение и реакции, избавиться от симптомов, не затрагивая причин, что важно особенно если вы не готовы «идти туда» сейчас. В подходе огромное количество техник, которые помогают найти нерациональные негативные убеждения, а затем изменить их. Это очень логический и структурный подход, с большим объемом саморефлексии, а иногда и домашними заданиями в виде дневника мыслей и эмоций",
}

const getMethodDescription = (method: string | undefined): string => {
    if (method == undefined) return ''

    let description: string = ''
    switch (method) {
        case 'Аналитическая психология':
            description = method_description['Аналитическая психология']
            break
        case 'Гештальт':
            description = method_description['Гештальт']
            break
        case 'Психоанализ':
            description = method_description['Психоанализ']
            break
        case 'КПТ':
            description = method_description['КПТ']
            break
        default:
            description = ''
            break
    }

    return description
}

interface CardProps {
    psychologist: IPsychologist;
    id?: string;
    isSelected?: boolean;
    showBestMatch?: boolean;
    onExpand?: () => void;
    inPopup?: boolean;
    hideClose?: boolean
    onClose?: () => void;
}

const CardInner = forwardRef<HTMLDivElement, CardProps>(
    ({ psychologist, id, isSelected, showBestMatch = false, onExpand, inPopup = false, hideClose = false, onClose }, ref) => {
        const dispatch = useDispatch();
        const searchParams = useSearchParams()

        const modal = useSelector((state: RootState) => state.modal);
        const favorites = useSelector((state: RootState) => state.favorites.items);
        const videoRef = useRef<HTMLVideoElement>(null);
        const [isPlaying, setIsPlaying] = useState(false);
        const [isExpanded, setIsExpanded] = useState(false);
        const [showVideo, setShowVideo] = useState(false);
        const [availableSlots, setAvailableSlots] = useState<{ date: string, time: string }[]>([]);

        const [showAllEducation, setShowAllEducation] = useState(false);
        const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
        const descriptionRef = useRef<HTMLDivElement>(null);
        const [shouldShowGradient, setShouldShowGradient] = useState(false);



        // Если ID не задан, создаем его из имени
        useEffect(() => {
            if (!psychologist.id && psychologist.name) {
                psychologist.id = `id_${psychologist.name.replace(/\s+/g, '_')}`;
            }
        }, [psychologist]);

        // Проверяем, находится ли психолог в избранном
        const isFavorite = favorites.some(item => item.id === psychologist.id);

        const imageUrl = getGoogleDriveImageUrl(psychologist.link_photo);
        const videoUrl = psychologist.link_video;

        useEffect(() => {
            const loadSlots = async () => {
                try {
                    if (!psychologist.schedule?.days) {
                        setAvailableSlots([]);
                        return;
                    }

                    const slots: { date: string; time: string }[] = [];

                    psychologist.schedule.days.forEach((day) => {
                        if (day.slots) {
                            Object.entries(day.slots).forEach(([time, slotArray]) => {
                                if (Array.isArray(slotArray)) {
                                    slotArray.forEach((slot) => {
                                        if (slot && slot.state === 'Свободен') {
                                            slots.push({
                                                date: day.pretty_date,
                                                time: time
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });

                    const sortedSlots = slots.sort((a, b) => {
                        const dateA = new Date(a.date.split('.').reverse().join('-') + ' ' + a.time);
                        const dateB = new Date(b.date.split('.').reverse().join('-') + ' ' + b.time);
                        return dateA.getTime() - dateB.getTime();
                    });

                    setAvailableSlots(sortedSlots.slice(0, 3));
                } catch (error) {
                    console.error('Error loading slots:', error);
                    setAvailableSlots([]);
                }
            };

            loadSlots();
        }, [psychologist.schedule]);

        useEffect(() => {
            if (descriptionRef.current) {
                const height = descriptionRef.current.scrollHeight;
                setShouldShowGradient(height > 44); // 44px - это высота двух строк
                if (height > 44) {
                    descriptionRef.current.style.height = '44px';
                }
            }
        }, [psychologist.short_description]);

        const handleOpenModal = () => {
            dispatch(setModalSelectedPsychologist(psychologist.name));
            dispatch(setSelectedPsychologist(psychologist));
            dispatch(openModal('CardsForm'));
        };

        const handleTimeStageComplete = () => {
            dispatch(closeModal());
            dispatch(openModal('FilterTime'));
        };

        const handleVideoClick = () => {
            if (!videoUrl) return;

            setShowVideo(true);
            setIsPlaying(true);

            // Даем немного времени для рендера видео
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.play();
                }
            }, 100);
        };

        const handleFavoriteClick = () => {
            if (!psychologist.id) return;

            if (isFavorite) {
                dispatch(removeFavorite(psychologist.id));
                toast.success('Психолог удален из избранного');
            } else {
                dispatch(addFavorite(psychologist));
                toast.success('Психолог добавлен в избранное');
            }
        };

        const handleSlotClick = (slot: { date: string; time: string }) => {
            const localSlot = {
                ...slot,
                time: slot.time
            };

            dispatch(setModalSelectedPsychologist(psychologist.name));
            dispatch(setSelectedPsychologist(psychologist));
            dispatch(setSelectedDate(localSlot.date));
            dispatch(setSelectedSlot(localSlot));
            dispatch(openModal('CardsForm'));
        };

        const scrolledPsychologist = searchParams.get('selected_psychologist');
        const isScrolledPsychologist = scrolledPsychologist === String(psychologist.id) || scrolledPsychologist === psychologist.name;

        useEffect(() => {
            if (isScrolledPsychologist) {
                setIsExpanded(true)
            }
        }, [isScrolledPsychologist])

        useEffect(() => {
            if (onExpand) onExpand();
        }, [isDescriptionExpanded, isExpanded]);

        return (
            <div ref={ref} id={id} className={`${styles.card} ${isSelected ? 'animate-pulse-highlight bg-[#F5F5F5]' : ''} ${isScrolledPsychologist ? styles.expanded : ''}`}>
                {/* Верхняя часть с фото и основной инфой */}
                <div className={styles.header}>
                    <div className={styles.avatarSection}>
                        <div className={styles.avatar} onClick={videoUrl ? handleVideoClick : undefined}>
                            {/* Плашка "Подходит больше всего" */}
                            {showBestMatch && (
                                <div className={styles.bestMatch}>
                                    Подходит больше всего
                                </div>
                            )}

                            {showVideo && videoUrl ? (
                                <div className={styles.videoWrapper}>
                                    <video
                                        ref={videoRef}
                                        src={getGoogleDriveVideoUrl(videoUrl) || undefined}
                                        playsInline
                                        loop
                                        // muted
                                        preload="metadata"
                                        className={styles.video}
                                        autoPlay
                                    />
                                    <button
                                        className={styles.playPauseButton}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (videoRef.current) {
                                                if (isPlaying) {
                                                    videoRef.current.pause();
                                                } else {
                                                    const playPromise = videoRef.current.play();
                                                    if (playPromise !== undefined) {
                                                        playPromise
                                                            .then(() => {
                                                                setIsPlaying(true);
                                                            })
                                                            .catch(error => {
                                                                console.error("Error playing video:", error);
                                                            });
                                                    }
                                                }
                                                setIsPlaying(!isPlaying);
                                            }
                                        }}
                                    >
                                        <Image
                                            src={isPlaying ? "/card/pause.svg" : "/card/play.svg"}
                                            alt={isPlaying ? "Пауза" : "Воспроизвести"}
                                            width={42}
                                            height={43}
                                            unoptimized
                                        />
                                    </button>
                                </div>
                            ) : (
                                <Image
                                    src={imageUrl.trimEnd()}
                                    alt={psychologist.name}
                                    width={214}
                                    height={351}
                                    className={styles.image}
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/images/default.jpg';
                                    }}
                                />
                            )}

                            {videoUrl && !showVideo && (
                                <button
                                    className={styles.playButton}
                                    onClick={() => setShowVideo(true)}
                                >
                                    <Image
                                        src="/card/play.svg"
                                        alt="Play"
                                        width={42}
                                        height={43}
                                        unoptimized
                                    />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={styles.info}>
                        <div className={styles.nameRow}>
                            <h2 className={styles.name}>
                                {psychologist.name}
                                {psychologist.age !== undefined && `, ${psychologist.age} ${getAgeWord(psychologist.age)}`}
                            </h2>
                            {inPopup && !hideClose ? (
                                <button
                                    className={"bg-gray-100 rounded-full p-2 hover:bg-gray-200 block lg:inline-block absolute right-4 top-4 z-10 lg:static"}
                                    onClick={onClose}
                                    aria-label="Закрыть"
                                    style={{ border: "none" }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                </button>
                            ) : (
                                <button
                                    className={styles.favoriteButton}
                                    onClick={handleFavoriteClick}
                                    aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                                >
                                    <Image
                                        src={isFavorite ? '/card/heart-filled.svg' : '/card/heart-outline.svg'}
                                        alt="Избранное"
                                        width={24}
                                        height={24}
                                        unoptimized
                                    />
                                </button>
                            )}
                        </div>
                        <Tooltip
                            text={`${psychologist.name.split(" ")[1]} как психолог придерживается этических правил и принципов сообщества, посещает супервизора, углубляет знания в психологии на наших мероприятиях`}
                            customMargin="35%"
                        >
                            <div className={`${styles.experienceWrapper} px-2 py-1 rounded-full w-fit bg-[#f5f5f5]`}>
                                {psychologist.experience && (
                                    <span className={styles.experience}>
                                        {
                                            (psychologist.group == "Супервизии" ? `Участник супервизионной группы Хранителей ${psychologist.experience}` : `Участник проекта Рука помощи ${psychologist.experience}`)
                                        }

                                    </span>
                                )}

                                {psychologist.verified && (
                                    <Image
                                        src="/card/verified.svg"
                                        alt="Verified"
                                        width={23}
                                        height={23}
                                        style={{ marginLeft: '6px' }}
                                        unoptimized
                                    />
                                )}
                            </div>
                        </Tooltip>

                        <div className={styles.approach}>
                            <div className={styles.approachBlock}>
                                <span className={styles.label}>Основной подход:</span>
                                <div className={styles.value}>
                                    {/* UPDATE: по-умолчанию значение - Аналитическая психология */}
                                    {psychologist.main_modal ? psychologist.main_modal : ''}
                                    {/* <Tooltip text={getMethodDescription(psychologist.main_modal) != '' ? getMethodDescription(psychologist.main_modal) : 'Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов.'} /> */}
                                </div>
                            </div>
                            {/* <div className={styles.approachBlock}>
                            <span className={styles.label}>Стоимость:</span>
                            <div className={styles.value}>
                                От {psychologist.min_session_price || 0} ₽
                                <Tooltip text="Стоимость сессии длительностью 50-55 минут в формате онлайн видеозвонка. Частоту и формат последующих встреч определяете вместе с психологом" />
                            </div>
                        </div> */}
                        </div>

                        <div className={styles.additionalApproaches}>
                            <span className={styles.label}>Дополнительные подходы:</span>
                            <div className={styles.approaches}>
                                {(Array.isArray(psychologist.additional_modals)
                                    ? psychologist.additional_modals
                                    // UPDATE: По-умолчанию значение - Нет дополнительной модальности
                                    : psychologist.additional_modals?.split(';') || ["Нет дополнительной модальности"]
                                ).map((approach: string, index: number) => (
                                    <div key={index} className={styles.approachItem}>
                                        {approach.trim()}
                                        {/* <Tooltip text={getMethodDescription(approach.trim()) ? getMethodDescription(approach.trim()) : "Дополнительные подходы, которые психолог использует в своей работе для более эффективной помощи клиентам."} /> */}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* UPDATE: Временно скрываем ближайшую запись если не нашли слоты */}
                        {/* {availableSlots?.length != 0 &&  */}
                        <div className={styles.nextSession}>
                            <span className={styles.label}>Ближайшая запись:</span>
                            {/* UPDATE: добавил надпись у У психолога пока нет свободного времени для записи если нет слотов */}
                            {availableSlots?.length ?
                                <div className={styles.dates}>
                                    {availableSlots.map((slot, index) => (
                                        <button
                                            key={index}
                                            className={
                                                `${styles.dateButton} bg-[#FAFAFA] rounded-[50px] px-[15px] py-[10px] transition-colors ` +
                                                'cursor-default opacity-60 pointer-events-none'
                                            }
                                            onClick={undefined}
                                            disabled={inPopup}
                                        >
                                            {slot.date.split('.').slice(0, 2).join('.')}/{slot.time}
                                        </button>
                                    ))}
                                </div> :
                                // ''
                                <p>У психолога пока нет свободного времени для записи</p>
                            }
                        </div>
                        {/* } */}
                    </div>
                </div>




                {/* О психологе */}
                {psychologist.short_description && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>О психологе</h3>
                        <div
                            ref={descriptionRef}
                            className={`${styles.description} ${isDescriptionExpanded ? styles.expanded : ''}`}
                            style={{
                                whiteSpace: 'pre-line',
                                ...(shouldShowGradient ? { height: isDescriptionExpanded ? 'auto' : '44px' } : {})
                            }}
                        >
                            {psychologist.short_description}
                        </div>
                        {shouldShowGradient && (
                            <button
                                className={styles.readMoreButton}
                                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                            >
                                {isDescriptionExpanded ? 'Свернуть' : 'Читать еще'}
                            </button>
                        )}
                    </div>
                )}



                {/* Дополнительная информация (показывается при раскрытии) */}
                <div className={`${styles.expandedContent} ${isExpanded ? styles.expanded : ''}`}>


                    {/* Образование */}
                    {/* UPDATE Правильно разобрал информацию об образовании психолога */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Образование</h3>
                        <div className={styles.education}>
                            {[...(psychologist.education ?? [])]
                                .sort((a, b) => (b.educationItemYear || 0) - (a.educationItemYear || 0))
                                .slice(0, showAllEducation ? undefined : 2)
                                .map((item, index, arr) => {
                                    const isLastVisible = !showAllEducation && index === arr.length - 1 && (psychologist.education ?? []).length > 2;
                                    return (
                                        <div key={index} className={styles.educationItem}>
                                            <h3><b>{item.educationItemProgramTitle}, {item.educationItemYear}</b></h3>
                                            <div className={isLastVisible ? `${styles.educationText} ${styles.withGradient}` : styles.educationText}>
                                                <p>{item.educationItemTitle}, {item.educationItemType}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            {(psychologist.education ?? []).length > 2 && (
                                <button
                                    className={styles.readMoreButton}
                                    onClick={() => setShowAllEducation((prev) => !prev)}
                                >
                                    {showAllEducation ? 'Свернуть' : 'Смотреть все'}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Запросы */}
                    <div className={styles.queries}>
                        <h3 className={styles.sectionTitle}>Запросы</h3>
                        <div className={styles.queriesList}>
                            {psychologist.queries?.split(';').slice(0, 6).map((query, index) => (
                                <TextTooltip key={index} text={query.trim()}>
                                    <button className={styles.queryButton + " w-full block text-left"}>
                                        {query.trim()}
                                    </button>
                                </TextTooltip>
                            ))}
                        </div>
                    </div>

                    {/* Диагностированные заболевания */}
                    {psychologist.works_with?.includes('Есть диагностированное психиатрическое заболевание (ПРЛ, БАР, ПТСР и др)') && (
                        <div className={styles.diagnoses}>
                            <h3 className={styles.sectionTitle}>Диагностированные заболевания</h3>
                            <div className={styles.diagnosesList}>
                                <div className={styles.diagnosisItem}>
                                    Работает с психическими заболеваниями (ПРЛ, БАР, ПТСР и др)
                                    <Tooltip text="Психолог работает с пациентами, у которых диагностированно психическое заболевание" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Подробнее о психологе */}
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>Подробнее о психологе</h3>
                        <div className={styles.links}>
                            {['vk', 'site', 'telegram'].map((platform) => {
                                const link = psychologist[platform as keyof IPsychologist];
                                if (!link) return null;

                                // Добавляем https:// если ссылка не содержит протокол
                                const formatLink = (url: string) => {
                                    if (url.startsWith('http://') || url.startsWith('https://')) {
                                        return url;
                                    }
                                    return `https://${url}`;
                                };

                                return (
                                    <Link
                                        key={platform}
                                        href={formatLink(String(link))}
                                        className={styles.socialLink}
                                        target="_blank"
                                    >
                                        <Image
                                            src={`/card/heart-outline.svg`}
                                            alt={platform}
                                            width={24}
                                            height={24}
                                            unoptimized
                                        />
                                        {platform === 'vk' ? 'VK' : platform === 'site' ? 'Сайт' : 'Telegram'}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Личная информация */}
                    <div className={styles.section}>
                        <div className={styles.personalInfo}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Личная терапия:</span>
                                <span className={styles.infoValue}>
                                    {psychologist.personal_therapy_duration ? 'Да' : 'Нет'}
                                    <Tooltip text="Психолог находится в личной терапии более 6 месяцев" />
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Посещает супервизию:</span>
                                <span className={styles.infoValue}>
                                    {/* {psychologist.supervision ? 'Да' : 'Нет'} */}
                                    Да
                                    <Tooltip text="Психолог посещает групповые супервизии в сообществе" />
                                </span>
                            </div>
                            {psychologist.is_married && <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Семейное положение:</span>
                                <span className={styles.infoValue}>{psychologist.is_married == null ? '-' : psychologist.is_married ? 'В браке' : 'Не в браке'} </span>
                            </div>}
                            {psychologist.has_children && <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Есть дети:</span>
                                <span className={styles.infoValue}>{psychologist.has_children == null ? '-' : psychologist.has_children ? 'Да' : 'Нет'}</span>
                            </div>}
                        </div>
                    </div>
                </div>

                {/* Кнопки действий */}
                <div className={styles.actions}>
                    {!inPopup && (
                        <>
                            <button
                                className={styles.detailsButton}
                                onClick={() => setIsExpanded(!isExpanded)}
                            >
                                {isExpanded ? 'Свернуть' : 'Подробнее о психологе'}
                            </button>
                            {/* <button className={styles.appointmentButton} onClick={handleOpenModal}>
                            Записаться на сессию
                        </button> */}
                        </>
                    )}
                </div>
            </div>
        );
    }
);

CardInner.displayName = "CardInner";

export const CardGroup = React.memo(CardInner);
