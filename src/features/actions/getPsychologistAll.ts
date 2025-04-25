export async function getPsychologistAll() {
    try {
        const res = await fetch('https://n8n-v2.hrani.live/webhook/get-filtered-psychologists-test-contur', {
            cache: 'no-cache'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('API Response:', {
            status: res.status,
            data: data,
            isArray: Array.isArray(data)
        });
        
        // Убедимся что данные - это массив
        if (!Array.isArray(data)) {
            console.error('API returned non-array data:', data);
            return [];
        }

        return data;
    } catch (error) {
        console.error('Error fetching psychologists:', error);
        return [];
    }
}