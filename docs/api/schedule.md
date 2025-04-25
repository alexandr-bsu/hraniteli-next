# API Расписания

## Получение расписания

### Агрегированное расписание психолога
```http
GET /get-aggregated-schedule-by-psychologist-test-contur

Query Parameters:
{
  "psychologist": string,       // имя и фамилия психолога
  "userTimeOffsetMsk": number  // разница с МСК в часах
}

Response:
[{
  "items": [{
    "pretty_date": string,
    "slots": {
      [hour: string]: [{
        "psychologist": string,
        "time": string,
        "date": string
      }]
    }
  }]
}]
```

### Агрегированное расписание для Руки помощи
```http
POST /get-agregated-schedule-helpful-hand

Body:
{
  // Стандартная структура запроса
  "utm_psy": string  // имя и фамилия психолога
}
```

### Получение количества свободных слотов
```http
GET /slot-counter

Response:
{
  "result": string  // Форматированная строка с количеством слотов
}
```

## Управление слотами

### Подбор слотов
```http
POST /get_general_slots

Body:
{
  "psychologist_list": string  // Список психологов через запятую
}

Response:
{
  "formated_result": string  // Топ-3 наиболее свободных слота
}
```

### Бронирование слота
```http
POST /assign-session

Body: {
  "id": string,
  "psychologist": string,
  "date": string,
  "time": string,
  "state": string,
  "ticket": string,
  "client_id": string,
  "meeting_link": string,
  "meeting_id": string,
  "calendar_meeting_id": string,
  "confirmed": boolean,
  "auto_assigned": boolean,
  "auto_canceled": boolean,
  "is_helpful_hand": boolean
}
```

### Отмена сессии
```http
POST /cancel-session

Body: {
  // Данные слота из таблицы hraniteli_slots
}
```

## Автоматизация

### Автоназначение
```http
POST /automatch

Body:
{
  "psychologists": string,    // Список психологов через ";"
  "slots": string,           // Список слотов "DD.MM HH:mm" через ";"
  "tiket_info": object,      // JSON из таблицы hraniteli_tickets
  "client_info": object,     // JSON из таблицы hraniteli_clients
  "slots_id": string         // Список ID слотов через ";"
}
```

### Планирование событий
```http
POST /plan-events

Body: {
  // Данные слота из таблицы hraniteli_slots
}
```

## CRON задачи

### Обновление количества сессий
```http
CRON /update-sessions-count
Запускается: каждый день в 21:00 МСК

Действие: Обновляет значение проведенных сессий в таблице hraniteli_psychologists
```

### Напоминания о слотах
```http
CRON /remind-slots
Запускается: среда и суббота в 19:00

Действие: Отправляет психологам напоминание проверить актуальность слотов
```

### Автоотмена сессий
```http
CRON /auto-cancel
Запускается: каждый час

Действие: Отменяет неподтвержденные сессии за 18 часов до начала
```

### Подтверждение сессий
```http
CRON /session-confirmation
Запускается: за 24 часа до сессии

Действия:
1. Отправка запроса на подтверждение
2. Повторный запрос через 22 часа
3. Сообщение от администратора через 23 часа
```

## Видеоконференции

### Генерация ссылки на встречу
```http
POST /generate-conference-link

Response:
{
  "link": string,  // Ссылка на конференцию (Zoom или Google Meet)
  "platform": "zoom" | "meet"
}
```

## Аналитика форм

### Инициализация трекера формы
```http
POST /init-form-tracking

Body:
{
  "ticket_id": string,   // Номер заявки
  "form_type": string,   // Тип формы
  "step": string        // Начальный шаг (всегда "Начало")
}
```

### Обновление шага формы
```http
PUT /update-tracking-step

Body:
{
  "ticket_id": string,  // Номер заявки
  "step": string       // Текущий шаг формы
}
``` 