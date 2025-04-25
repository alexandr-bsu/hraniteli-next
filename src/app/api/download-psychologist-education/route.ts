import { NextResponse } from 'next/server';
import { API_BASE_URL } from '@/shared/config';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const psychologistId = searchParams.get('psychologist_id');

        if (!psychologistId) {
            return NextResponse.json({ error: 'Psychologist ID is required' }, { status: 400 });
        }

        console.log('Trying to fetch from:', `${API_BASE_URL}/download-psychologist-education?psychologist_id=${psychologistId}`);
        
        const response = await fetch(`${API_BASE_URL}/download-psychologist-education?psychologist_id=${psychologistId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error in download-psychologist-education:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 