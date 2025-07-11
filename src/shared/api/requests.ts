import axios from 'axios';

export const getAvailableRequests = async (): Promise<string[]> => {
  try {
    // Получаем всех психологов
    const response = await axios.get('http://127.0.0.1:8001/cards');
    const psychologists = response.data;

    // Собираем все уникальные запросы
    const allRequests = new Set<string>();
    psychologists.forEach((psy: any) => {
      if (psy.queries) {
        const queries = psy.queries.split(';').map((q: string) => q.trim());
        queries.forEach((q: string) => allRequests.add(q));
      }
    });


    return Array.from(allRequests);
  } catch (error) {
    console.error('Error fetching available requests:', error);
    return [];
  }
}; 