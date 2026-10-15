export async function getPsychologistAll(is_group: boolean = false) {
    try {
        const res = await fetch('https://cache-api.hrani.live/cards', {
            cache: 'no-cache'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        let data = await res.json();
        console.log('API Response:',is_group, {
            status: res.status,
            data: data,
        });

        if (is_group){
            // Фильтрация для страницы groups - исключаем "Сообщество" и "Старт практики"
            const beforeFilter = data.length
            data = data.filter((psy: any) => psy.group !== 'Сообщество' && psy.group !== 'Старт практики')
            console.log(`Groups page: filtered for groups: ${data.length} psychologists (was ${beforeFilter})`)
        } else {
            // Фильтрация для главной страницы - показываем "Сообщество" и "Старт практики"
            const beforeFilter = data.length
            data = data.filter((psy: any) => psy.group === 'Сообщество' || psy.group === 'Старт практики')
            console.log(`Main page: filtered for "Сообщество" & "Старт практики": ${data.length} psychologists (was ${beforeFilter})`)
        }
        console.log('API Response:',is_group, data)
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