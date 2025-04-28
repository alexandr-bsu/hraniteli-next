'use client'

import Image from "next/image";
import { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal, setSelectedPsychologist } from "@/redux/slices/modal";
import { addFavorite, removeFavorite } from "@/redux/slices/favorites";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';
import { RootState } from "@/redux/store";
import styles from './Card.module.scss';
import { getPsychologistEducation, getPsychologistFullInfo } from '@/shared/api/psychologist';
import axios from 'axios';
import { getTimeDifference } from '@/features/utils';
import { toast } from "sonner";
import { Tooltip } from '@/shared/ui/Tooltip';

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

const getGoogleDriveVideoUrl = (url: string | null | undefined) => {
    if (!url) return null;
    if (!url.includes('drive.google.com')) return url;
    
    const fileId = url.match(/\/d\/(.+?)\//)?.[1];
    if (!fileId) return null;
    
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
};

interface CardProps {
    psychologist: IPsychologist;
    id?: string;
    isSelected?: boolean;
    showBestMatch?: boolean;
}

export const Card: FC<CardProps> = ({ psychologist, id, isSelected, showBestMatch = false }) => {
    const dispatch = useDispatch();
    const modal = useSelector((state: RootState) => state.modal);
    const favorites = useSelector((state: RootState) => state.favorites.items);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [education, setEducation] = useState<any[]>([]);
    const [showVideo, setShowVideo] = useState(false);
    const [availableSlots, setAvailableSlots] = useState<{date: string, time: string}[]>([]);

    // Проверяем, находится ли психолог в избранном
    const isFavorite = favorites.some(item => item.id === psychologist.id);

    const imageUrl = getGoogleDriveImageUrl(psychologist.link_photo);
    const videoUrl = psychologist.link_video;

    useEffect(() => {
        const loadExpandedData = async () => {
            if (isExpanded && psychologist.id) {
                const educationData = await getPsychologistEducation(psychologist.id);
                setEducation(educationData);
            }
        };

        loadExpandedData();
    }, [isExpanded, psychologist.id]);

    useEffect(() => {
        const loadSlots = async () => {
            try {
                const timeDifference = getTimeDifference();
                const url = `https://n8n-v2.hrani.live/webhook/get-aggregated-schedule-by-psychologist-test-contur?utm_psy=${encodeURIComponent(psychologist.name)}&userTimeOffsetMsk=${timeDifference}`;
                
                const response = await axios.get(url);
                
                if (!response.data?.items?.length) {
                    setAvailableSlots([]);
                    return;
                }

                const slots: { date: string; time: string }[] = [];

                response.data.items.forEach((item: any) => {
                    if (item.slots) {
                        Object.entries(item.slots).forEach(([hour, slotArray]: [string, any]) => {
                            if (Array.isArray(slotArray) && slotArray.length > 0) {
                                slots.push({ 
                                    date: item.pretty_date, 
                                    time: hour 
                                });
                            }
                        });
                    }
                });

                
                const sortedSlots = slots.sort((a, b) => {
                    const dateA = new Date(a.date + ' ' + a.time);
                    const dateB = new Date(b.date + ' ' + b.time);
                    return dateA.getTime() - dateB.getTime();
                });

                setAvailableSlots(sortedSlots.slice(0, 3));
            } catch (error) {
                console.error('Error loading slots:', error);
            }
        };

        loadSlots();
    }, [psychologist.name]);

    const handleOpenModal = () => {
        dispatch(setSelectedPsychologist(psychologist.name));
        dispatch(openModal('Time'));
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

    const handleSlotClick = () => {
        dispatch(openModal('FilterTime'));
    };

    return (
        <div id={id} className={`${styles.card} ${isSelected ? 'animate-pulse-highlight' : ''}`}>
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
                                    muted
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
                                src={imageUrl}
                                alt={psychologist.name}
                                width={214}
                                height={351}
                                className={styles.image}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/default-avatar.png';
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
                        <Link href={`${ROUTES.PSYCHOLOGIST}/${psychologist.id}`}>
                            <h2 className={styles.name}>
                                {psychologist.name}
                                {psychologist.age !== undefined && `, ${psychologist.age} ${getAgeWord(psychologist.age)}`}
                            </h2>
                        </Link>
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
                    </div>

                    <div className={styles.experienceWrapper}>
                        {psychologist.experience && (
                            <span className={styles.experience}>
                                {psychologist.experience}
                            </span>
                        )}
                        {psychologist.in_community && (
                            <span className={styles.experience}>
                                в сообществе
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

                    <div className={styles.approach}>
                        <div className={styles.approachBlock}>
                            <span className={styles.label}>Основной подход:</span>
                            <div className={styles.value}>
                                {psychologist.main_modal}
                                <Tooltip text="Подход определяет основные методы и техники работы психолога. Этот подход наиболее эффективен для решения ваших запросов." />
                            </div>
                        </div>
                        <div className={styles.approachBlock}>
                            <span className={styles.label}>Стоимость:</span>
                            <div className={styles.value}>
                                От {psychologist.min_session_price || 0} ₽
                                <Tooltip text="Стоимость сессии длительностью 50-60 минут. Может меняться в зависимости от формата работы и длительности." />
                            </div>
                        </div>
                    </div>

                    <div className={styles.additionalApproaches}>
                        <span className={styles.label}>Дополнительные подходы</span>
                        <div className={styles.approaches}>
                            {(Array.isArray(psychologist.additional_modals) 
                                ? psychologist.additional_modals 
                                : psychologist.additional_modals?.split(';') || []
                            ).map((approach: string, index: number) => (
                                <div key={index} className={styles.approachItem}>
                                    {approach.trim()}
                                    <Tooltip text="Дополнительные подходы, которые психолог использует в своей работе для более эффективной помощи клиентам." />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.nextSession}>
                        <span className={styles.label}>Ближайшая запись:</span>
                        <div className={styles.dates}>
                            {availableSlots.map((slot, index) => (
                                <button 
                                    key={index} 
                                    className={styles.dateButton}
                                    onClick={handleSlotClick}
                                >
                                    {slot.date.split('.').slice(0, 2).join('.')}/{slot.time}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Запросы */}
            <div className={styles.queries}>
                <h3 className={styles.sectionTitle}>Запросы:</h3>
                <div className={styles.queriesList}>
                    {psychologist.queries?.split(';').map((query, index) => (
                        <button key={index} className={styles.queryButton}>
                            {query.trim()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Диагностированные заболевания */}
            <div className={styles.diagnoses}>
                <h3 className={styles.sectionTitle}>Диагностированные заболевания:</h3>
                <div className={styles.diagnosesList}>
                    {psychologist.works_with?.split(';').map((diagnosis, index) => (
                        <div key={index} className={styles.diagnosisItem}>
                            {diagnosis.trim()}
                            <Tooltip text="Психолог имеет опыт работы с данным диагнозом и может помочь в его коррекции или адаптации." />
                        </div>
                    ))}
                </div>
            </div>

            {/* Дополнительная информация (показывается при раскрытии) */}
            <div className={`${styles.expandedContent} ${isExpanded ? styles.expanded : ''}`}>
                {/* О хранителе */}
                {psychologist.short_description && (
                    <div className={styles.section}>
                        <h3 className={styles.sectionTitle}>О хранителе</h3>
                        <p className={styles.description}>
                            {psychologist.short_description}
                        </p>
                    </div>
                )}

                {/* Образование */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Образование</h3>
                    <div className={styles.education}>
                        {education.map((item, index) => (
                            <div key={index} className={styles.educationItem}>
                                <h4>{item.educationItemType}, {item.educationItemYear}</h4>
                                <p>{item.educationItemTitle}</p>
                                <p>{item.educationItemProgramTitle}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Подробнее о хранителе */}
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Подробнее о хранителе</h3>
                    <div className={styles.links}>
                        {['vk', 'site', 'telegram'].map((platform) => (
                            psychologist[platform as keyof IPsychologist] && (
                                <Link 
                                    key={platform} 
                                    href={String(psychologist[platform as keyof IPsychologist])} 
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
                            )
                        ))}
                    </div>
                </div>

                {/* Личная информация */}
                <div className={styles.section}>
                    <div className={styles.personalInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Личная терапия:</span>
                            <span className={styles.infoValue}>
                                {psychologist.personal_therapy_duration ? 'Да' : 'Нет'}
                                <Tooltip text="Личная терапия - важный опыт для психолога, позволяющий лучше понимать клиентов и работать над собой." />
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Посещает супервизию:</span>
                            <span className={styles.infoValue}>
                                {psychologist.supervision ? 'Да' : 'Нет'}
                                <Tooltip text="Супервизия - профессиональная поддержка психолога более опытным коллегой, что обеспечивает качество работы." />
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Семейное положение:</span>
                            <span className={styles.infoValue}>{psychologist.is_married ? 'В браке' : 'Не в браке'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Есть дети:</span>
                            <span className={styles.infoValue}>{psychologist.has_children ? 'Да' : 'Нет'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопки действий */}
            <div className={styles.actions}>
                <button 
                    className={styles.detailsButton} 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? 'Свернуть' : 'Подробнее о хранителе'}
                </button>
                <button className={styles.appointmentButton} onClick={handleOpenModal}>
                    Оставить заявку
                </button>
            </div>
        </div>
    );
};
