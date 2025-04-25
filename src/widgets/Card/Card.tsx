'use client'

import Image from "next/image";
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { openModal, closeModal } from "@/redux/slices/modal";
import { IPsychologist } from "@/shared/types/psychologist.types";
import { Button } from '@/shared/ui/Button';
import { Chip } from '@/shared/ui/Chip';
import { Text } from '@/shared/ui/Text';
import { Title } from '@/shared/ui/Title';
import { COLORS } from '@/shared/constants/colors';
import { ROUTES } from '@/shared/constants/routes';
import { useRouter } from 'next/router';
import { RootState } from "@/redux/store";
import styles from './Card.module.scss';

interface CardProps {
    psychologist: IPsychologist;
}

export const Card: FC<CardProps> = ({ psychologist }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const modal = useSelector((state: RootState) => state.modal);
    
    const [isShow, setShow] = useState(false);
    const [isShowInfo, setShowInfo] = useState(false);
    const [education, setEducation] = useState<string[]>([]);

    const works_with = psychologist.works_with?.split(';').map(item => item.trimStart()) || [];
    const queries = psychologist.queries?.split(';').map(item => item.trimStart()) || [];

    useEffect(() => {
        if (modal.isOpen) {
            const timeOutID = setTimeout(() => {
                dispatch(openModal('FilterTime'));
            }, 100);
            return () => clearTimeout(timeOutID);
        }
    }, [modal.isOpen, dispatch]);

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                if (!psychologist.id) return;
                const response = await fetch(`/api/education/${psychologist.id}`);
                const data = await response.json();
                setEducation(data);
            } catch (error) {
                console.error('Error fetching education:', error);
            }
        };
        
        if (psychologist.id) {
            fetchEducation();
        }
    }, [psychologist.id]);

    const handleOpenModal = () => {
        dispatch(openModal('FilterRequest'));
    };

    const handleNavigate = () => {
        router.push(`${ROUTES.PSYCHOLOGIST}/${psychologist.id}`);
    };

    const handleTimeStageComplete = () => {
        dispatch(closeModal());
        dispatch(openModal('FilterTime'));
    };

    console.log('tlegram_id',psychologist.link_photo)

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.avatar}>
                    <Image
                        src={psychologist.avatar || '/images/default-avatar.png'}
                        alt={psychologist.name}
                        width={80}
                        height={80}
                    />
                </div>
                <div className={styles.info}>
                    <Title 
                        level={3} 
                        className={styles.name}
                        onClick={handleNavigate}
                    >
                        {psychologist.name}
                    </Title>
                    <Text color={COLORS.text.secondary}>
                        Опыт работы: {psychologist.experience} лет
                    </Text>
                    {psychologist.main_modal && (
                        <div className={styles.approaches}>
                            <Chip>{psychologist.main_modal}</Chip>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.content}>
                {psychologist.specialization && (
                    <div className={styles.education}>
                        <Text weight={600}>Специализация:</Text>
                        <ul>
                            {psychologist.specialization.map((spec, index) => (
                                <li key={index}>
                                    <Text color={COLORS.text.secondary}>{spec}</Text>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className={styles.price}>
                    От {psychologist.min_session_price}
                </div>

                {psychologist.additional_modals && (
                    <div className={styles.additional_modals}>
                        <Text weight={600}>Дополнительные подходы:</Text>
                        <div className={styles.approaches}>
                            {Array.isArray(psychologist.additional_modals) ? (
                                psychologist.additional_modals.map((approach, index) => (
                                    <Chip key={index} color={COLORS.primary}>
                                        {approach}
                                    </Chip>
                                ))
                            ) : (
                                <Chip color={COLORS.primary}>{psychologist.additional_modals}</Chip>
                            )}
                        </div>
                    </div>
                )}

                <div className={styles.queries}>
                    <Text weight={600}>Запросы:</Text>
                    <div className={styles.queries_content}>
                        <div className="lg:hidden overflow-x-auto pb-2 hide-scrollbar">
                            <ul className="flex gap-[10px] mt-[5px] w-max">
                                {queries.map((item, i) => (
                                    <li 
                                        key={i}
                                        className="min-w-[200px] text-[14px] rounded-[20px] border-[1px] border-[#D4D4D4] text-[#116466] font-semibold leading-[25px]"
                                    >
                                        <button className="w-full h-full p-[8px] text-left whitespace-normal">
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <ul className="hidden lg:grid grid-cols-2 gap-[10px] mt-[5px]">
                            {queries.map((item, i) => (
                                <li 
                                    key={i}
                                    className="text-[18px] rounded-[20px] border-[1px] border-[#D4D4D4] text-[#116466] font-semibold leading-[25px]"
                                >
                                    <button className="w-full h-full p-[8px] text-left whitespace-normal">
                                        {item}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className={styles.works_with}>
                    <Text weight={600}>Диагностированные заболевания:</Text>
                    <ul>
                        {works_with.map((item, i) => (
                            <li key={i} className={styles.works_with_item}>
                                {item}
                                <Image src={'/card/hint.svg'} alt="hint" height={23} width={23} />
                            </li>
                        ))}
                    </ul>
                </div>

                {psychologist.short_description && (
                    <div className={styles.description}>
                        <Text weight={600}>О хранителе:</Text>
                        <div className={styles.description_content}>
                            <div className={styles.description_text}>
                                <p className={`${isShowInfo ? '' : 'line-clamp-2'}`}>
                                    {psychologist.short_description}
                                </p>
                            </div>
                            {!isShowInfo && (
                                <div className={styles.description_gradient} />
                            )}
                        </div>
                        <button 
                            onClick={() => setShowInfo(prev => !prev)} 
                            className={styles.description_button}
                        >
                            {isShowInfo ? 'Свернуть' : 'Читать ещё'}
                        </button>
                    </div>
                )}

                <div className={styles.education}>
                    <Text weight={600}>Образование:</Text>
                    <ul>
                        {education.map((edu, index) => (
                            <li key={index}>
                                <Text color={COLORS.text.secondary}>{edu}</Text>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className={styles.platforms}>
                    <Text weight={600}>Контакты:</Text>
                    <ul>
                        {['vk', 'site', 'telegram'].map((platform) => (
                            psychologist[platform as keyof IPsychologist] && (
                                <li key={platform} className={styles.platform_item}>
                                    <Image src="/card/favorites_icon.svg" alt="favorites" height={40} width={40} />
                                    <span>{String(psychologist[platform as keyof IPsychologist])}</span>
                                </li>
                            )
                        ))}
                    </ul>
                </div>

                <div className={styles.personal_info}>
                    <Text weight={600}>Личная информация:</Text>
                    <ul>
                        <li className={styles.personal_item}>
                            <Text color={COLORS.text.secondary}>Посещает супервизию:</Text>
                            <span>Да</span>
                        </li>
                        <li className={styles.personal_item}>
                            <Text color={COLORS.text.secondary}>Семейное положение:</Text>
                            <span>
                                {psychologist.sex === 'Мужчина' && (psychologist.is_married && psychologist.has_children) && 'Женат, дети'}
                                {psychologist.sex === 'Женщина' && (psychologist.is_married && psychologist.has_children) && 'Замужем, дети'}
                                {psychologist.sex === 'Мужчина' && (psychologist.is_married === false) && 'Не женат'}
                                {psychologist.sex === 'Женщина' && (psychologist.is_married === false) && 'Не замужем'}
                            </span>
                        </li>
                        <li className={styles.personal_item}>
                            <Text color={COLORS.text.secondary}>Есть дети:</Text>
                            <span>{psychologist.has_children ? 'Да' : 'Нет'}</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className={styles.footer}>
                <Text className={styles.price}>
                    От {psychologist.min_session_price} ₽/сессия
                </Text>
                <Button onClick={handleOpenModal}>
                    Подробнее
                </Button>
            </div>
        </div>
    );
};
