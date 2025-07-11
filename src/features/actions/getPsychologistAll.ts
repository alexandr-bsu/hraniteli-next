export async function getPsychologistAll() {
    try {
        const res = await fetch('http://127.0.0.1:8001/cards', {
            cache: 'no-cache'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('API Response:', {
            status: res.status,
            data: data,
        });
        
        // Убедимся что данные - это массив
        if (!Array.isArray(data)) {
            console.error('API returned non-array data:', data);
            return [];
        }

        // TODO: Добавляем тестовое видео для первого психолога
        if (data.length > 0) {
            data[0] = {
                ...data[0],
                link_video: null
            };
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching psychologists:', error);
        return [];
    }
}