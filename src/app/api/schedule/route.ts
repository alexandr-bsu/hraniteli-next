import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch('https://n8n-v2.hrani.live/webhook/get-agregated-schedule-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Получили ответ от сервера:', data);

    // Обрабатываем разные форматы ответа
    if (Array.isArray(data)) {
      console.log('Массив психологов:', data);
      return NextResponse.json({ items: data });
    }
    
    if (data && typeof data === 'object') {
      if (data.items) {
        console.log('Объект с items:', data);
        return NextResponse.json(data);
      }
      if (data.psychologists) {
        console.log('Объект с psychologists:', data);
        return NextResponse.json({ items: data.psychologists });
      }
      if (data.data) {
        console.log('Объект с data:', data);
        return NextResponse.json({ 
          items: Array.isArray(data.data) ? data.data : [data.data] 
        });
      }
    }

    console.error('Некорректный формат данных:', data);
    return NextResponse.json({ items: [] });

  } catch (error) {
    console.error('Ошибка в API расписания:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error }, { status: 500 });
  }
} 