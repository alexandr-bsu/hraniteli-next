import { IPsychologist } from '@/shared/types/psychologist.types';

interface IEducationItem {
    educationItemTitle: string;
    educationItemType: string;
    educationItemYear: number;
    educationItemProgramTitle: string;
}

export const getPsychologistEducation = async (psychologistId: string): Promise<IEducationItem[]> => {
    try {
        const response = await fetch(`/api/download-psychologist-education?psychologist_id=${psychologistId}`);
        if (!response.ok) throw new Error('Failed to fetch education data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching psychologist education:', error);
        return [];
    }
};

export const getPsychologistFullInfo = async (psychologistId: string): Promise<Partial<IPsychologist>> => {
    try {
        const response = await fetch(`/api/load-psy-anketa?psychologist_id=${psychologistId}`);
        if (!response.ok) throw new Error('Failed to fetch psychologist info');
        return await response.json();
    } catch (error) {
        console.error('Error fetching psychologist info:', error);
        return {};
    }
}; 