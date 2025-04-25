'use client'

import Image from "next/image";
import { FC, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "@/redux/slices/modal";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { Text } from '@/shared/ui/Text';
import { Title } from '@/shared/ui/Title';
import { COLORS } from '@/shared/constants/colors';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';
import { RootState } from "@/redux/store";
import styles from './Card.module.scss';
import { getPsychologistEducation, getPsychologistFullInfo } from '@/shared/api/psychologist';

const getGoogleDriveImageUrl = (url: string | undefined) => {
    if (!url) return '/images/default-avatar.png';
    if (!url.includes('drive.google.com')) return url;
    
    const fileId = url.match(/\/d\/(.+?)\//)?.[1];
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
}

export const Card: FC<CardProps> = ({ psychologist }) => {
    const dispatch = useDispatch();
    const modal = useSelector((state: RootState) => state.modal);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [education, setEducation] = useState<any[]>([]);
    const [fullInfo, setFullInfo] = useState<Partial<IPsychologist>>({});

    const [isShow, setShow] = useState(false);
    const [isShowInfo, setShowInfo] = useState(false);

    const works_with = psychologist.works_with?.split(';').map(item => item.trimStart()) || [];
    const queries = psychologist.queries?.split(';').map(item => item.trimStart()) || [];
    const imageUrl = getGoogleDriveImageUrl(psychologist.link_photo);
    const videoUrl = getGoogleDriveVideoUrl(psychologist.link_video);

    useEffect(() => {
        const loadExpandedData = async () => {
            if (isExpanded && psychologist.id) {
                const [educationData, fullInfoData] = await Promise.all([
                    getPsychologistEducation(psychologist.id),
                    getPsychologistFullInfo(psychologist.id)
                ]);
                
                setEducation(educationData);
                setFullInfo(fullInfoData);
            }
        };

        loadExpandedData();
    }, [isExpanded, psychologist.id]);

    const handleOpenModal = () => {
        dispatch(openModal('FilterRequest'));
    };

    const handleTimeStageComplete = () => {
        dispatch(closeModal());
        dispatch(openModal('FilterTime'));
    };

    const handleVideoClick = () => {
        if (!videoRef.current) return;
        
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleFavoriteClick = () => {
        setIsFavorite(!isFavorite);
    };

    return (
        <div className={styles.card}>
            {/* Плашка "Подходит больше всего" */}
            <div className={styles.bestMatch}>
                Подходит больше всего
            </div>

            {/* Верхняя часть с фото и основной инфой */}
            <div className={styles.header}>
                <div className={styles.avatarSection}>
                    <div className={styles.avatar} onClick={videoUrl ? handleVideoClick : undefined}>
                        {videoUrl ? (
                            <>
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    poster={imageUrl}
                                    playsInline
                                    loop
                                />
                                {!isPlaying && (
                                    <div className={styles.playButton}>
                                        <Image
                                            src="/images/play-button.svg"
                                            alt="Play"
                                            width={24}
                                            height={24}
                                            unoptimized
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <Image
                                src={imageUrl}
                                alt={psychologist.name}
                                width={160}
                                height={160}
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/images/default-avatar.png';
                                }}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.info}>
                    <div className={styles.nameRow}>
                        <Link href={`${ROUTES.PSYCHOLOGIST}/${psychologist.id}`}>
                            <h2 className={styles.name}>{psychologist.name}, {psychologist.age} лет</h2>
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

                    <div className={styles.experience}>
                        {psychologist.experience} в сообществе
                        <Image 
                            src="/card/verified.svg" 
                            alt="Verified" 
                            width={16} 
                            height={16}
                            unoptimized
                        />
                    </div>

                    <div className={styles.approach}>
                        <div className={styles.approachBlock}>
                            <span className={styles.label}>Основной подход:</span>
                            <div className={styles.value}>
                                {psychologist.main_modal}
                                <button className={styles.infoButton}>?</button>
                            </div>
                        </div>
                        <div className={styles.approachBlock}>
                            <span className={styles.label}>Стоимость:</span>
                            <div className={styles.value}>
                                От {psychologist.min_session_price} ₽
                                <button className={styles.infoButton}>?</button>
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
                                    <button className={styles.infoButton}>?</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.nextSession}>
                        <span className={styles.label}>Ближайшая запись:</span>
                        <div className={styles.dates}>
                            <button className={styles.dateButton}>28.01/ 13:00</button>
                            <button className={styles.dateButton}>28.01/ 13:00</button>
                            <button className={styles.dateButton}>28.01/ 13:00</button>
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
                            <button className={styles.infoButton}>?</button>
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
                                        src={`/card/${platform}-icon.svg`} 
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
                    <h3 className={styles.sectionTitle}>Личная информация</h3>
                    <div className={styles.personalInfo}>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Личная терапия:</span>
                            <span className={styles.infoValue}>
                                {fullInfo.personal_therapy ? 'Да' : 'Нет'}
                                <button className={styles.infoButton}>?</button>
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Посещает супервизию:</span>
                            <span className={styles.infoValue}>
                                {fullInfo.supervision ? 'Да' : 'Нет'}
                                <button className={styles.infoButton}>?</button>
                            </span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Семейное положение:</span>
                            <span className={styles.infoValue}>{fullInfo.marital_status || 'Не указано'}</span>
                        </div>
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Есть дети:</span>
                            <span className={styles.infoValue}>{fullInfo.has_children ? 'Да' : 'Нет'}</span>
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
                <button className={styles.appointmentButton} onClick={() => dispatch(openModal('FilterRequest'))}>
                    Оставить заявку
                </button>
            </div>
        </div>
    );
};
