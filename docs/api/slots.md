# Слоты и расписание

## Получение расписания

### Получение расписания психолога
```http
GET /get-slot

Query params:
{
  "psychologist": string  // имя и фамилия психолога
}

Response:
[
  {
    "res": [
      "Расписание на первую неделю (DD.MM-DD.MM)\n\n🟩 Свободно:\n\nDD.MM Дн: HH:mm, HH:mm\n\n✅Забронировано\n\n...",
      "Расписание на вторую неделю...",
      "Расписание на третью неделю...",
      "Расписание на четвёртую неделю..."
    ]
  }
]
```

## Аналитика и отслеживание

### Инициализация трекера формы
```http
POST /init-form-tracking

Body:
{
  "ticket_id": string,   // Номер заявки
  "form_type": string,   // Тип формы
  "step": string        // При инициализации всегда "Начало"
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

## Анкеты и профили

### Анкета психолога
```http
POST /psychologist-form

Body:
{
  "anketa": {
    "name": string,
    "about": string,
    "age": number,
    "sexClient": string,           // "Не имеет значения" | ...
    "minClientAge": number,
    "maxClientAge": number,
    "psychologistPersonalTherapyType": string,
    "psychologistPersonalTherapyDuration": string,
    "mainModal": string,
    "additionalModals": string[],
    "skills": string[],
    "queries": string[],
    "telegram_link": string,
    "site_link": string,
    "vk_link": string,
    "minPrice": number,
    "maxPrice": number,
    "isMarried": boolean,
    "hasChildren": boolean,
    "allWithPriceMode": boolean,
    "firstFreeMode": boolean,
    "helpHandMode": boolean,
    "education": [
      {
        "educationItemProgramTitle": string,
        "educationItemTitle": string,
        "educationItemType": string,
        "educationItemYear": number
      }
    ]
  },
  "psychologist_id": string  // telegram id психолога
}
```

## Автоматизированные процессы

### Обновление количества сессий [CRON]
Обновляет значение проведенных в этом месяце сессий `number_of_clients_provided` в таблице `hraniteli_psychologists`. Запускается каждый день в 21:00 мск.

### Напоминания о сессиях [CRON]
Срабатывает каждый час. Отправляет напоминания психологу и клиенту за 2 часа до начала сессии. Сообщения содержат:
- Ссылки на рекомендации по подготовке
- Ссылку на видео связь

### Напоминания об отзывах [CRON]
Срабатывает каждый час. Для сессий, которые закончились час назад:
- Находит соответствующих клиентов и психологов
- Отправляет обоим участникам просьбу заполнить анкеты и оставить отзывы

## Регистрация и обработка событий

### Регистрация клиента
```http
POST /client-registration

Body:
{
  "user_id": string  // telegram id клиента
}
```

### Обработка событий брони/отмены
Webhook из supabase при изменении статуса в таблице `hraniteli_slots`:
```http
POST /notify-update
```

### Генерация ссылки на видеовстречу
```http
POST /generate-conference-link
```
Генерирует ссылку на конференцию:
- Сначала пытается создать в Zoom
- Если есть конфликт или постоянное событие, создает в Google Meet

## Получение доступных слотов

### Получение слотов психолога
```http
GET /get-slot
```

Параметры:
- `secret` - Секретный ключ к редактору расписания психолога
- `startDate` - начальная дата (YYYY-MM-DD)
- `endDate` - конечная дата (YYYY-MM-DD)

### Агрегированное расписание
```http
GET /get-aggregated-schedule-by-psychologist-test-contur
```

Параметры:
- `utm_psy` - имя психолога
- `userTimeOffsetMsk` - смещение времени от МСК

## Управление слотами

### Добавление слота
```http
POST /add-slot
```

Тело запроса:
```json
{
  "secret": "string",
  "slot": "DD.MM HH:mm"
}
```

### Удаление слота
```http
POST /delete-slot
```

Тело запроса:
```json
{
  "secret": "string",
  "slot": "DD.MM HH:mm"
}
```

## Информация о слотах

### Получение информации о заявке в слот
```http
GET /get-ticket-for-slot
```

Параметры:
- `secret` - Секретный ключ
- `date` - дата (DD.MM)
- `time` - время (HH:mm)

### Подбор оптимальных слотов
```http
POST /get_general_slots
```

Тело запроса:
```json
{
  "psychologist_list": "string" // Список психологов через запятую
}
```

Ответ:
```json
{
  "formated_result": "Топ-3 наиболее свободных слота\n\nDD.MM HH:mm: N\nDD.MM HH:mm: N\n"
}
```

## Планирование событий

### Планирование событий для клиента
```http
POST /plan-client-events
```

Тело запроса:
```json
{
  "id": "string",
  "psychologist": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:mm",
  "state": "string",
  "ticket": "string",
  "meeting_link": "string",
  "meeting_id": "string",
  "calendar_meeting_id": "string",
  "confirmed": boolean,
  "auto_assigned": boolean,
  "auto_canceled": boolean
}
```

## Работа с временными зонами

### Структура временных зон
```typescript
interface TimeZoneData {
  userTimeZone: string;     // Например: "Europe/Moscow"
  userTimeOffsetMsk: number; // Смещение от московского времени в часах
  slots: {
    date: string;          // Формат: "DD.MM"
    time: string;          // Формат: "HH:mm"
    timezone: string;      // Временная зона слота
  }[];
}
```

## Переназначение сессий

### Переназначение клиента
```http
POST /reassign
```

Тело запроса:
```json
{
  "lead_number": "string",
  "filtered_psychologists": "string", // Имена психологов через запятую
  "slots": "string", // Формат: "DD.MM HH:mm;DD.MM HH:mm"
  "_queries": "string" // Запросы через точку с запятой
}
```

### Получение расписания для перезаписи
```http
GET /get-reassignment-schedule
```

Параметры:
- `lead_number` - номер лида
- `mode` - режим перезаписи ("time" | "psychologist") 

# API Слотов и Расписания

## Получение расписания

### Получение расписания психолога
```http
GET /get-aggregated-schedule-by-psychologist-test-contur

Query:
{
  "psychologist": string,  // Имя и фамилия психолога
  "userTimeOffsetMsk": number  // Смещение времени от МСК
}

Response:
[
  {
    "res": [
      "Расписание на первую неделю (дд.мм-дд.мм)\n\n🟩 Свободно:\n\nдд.мм Пн: чч:мм\n\n✅Забронировано\n\nдд.мм Пн: чч:мм\n",
      "Расписание на вторую неделю...",
      "Расписание на третью неделю...",
      "Расписание на четвёртую неделю..."
    ]
  }
]
```

### Подбор слотов
```http
POST /get_general_slots

Body:
{
  "psychologist_list": string  // Список фамилий и имён психологов через запятую
}

Response:
{
  "formated_result": "Топ-3 наиболее свободных слота\n\nдд.мм чч:мм: N\nдд.мм чч:мм: N\n"
}
```

## Управление слотами

### Получение заявок руки помощи
```http
POST /get-help-hand-tickets

Query:
{
  "telegram_id": string,  // Telegram ID психолога
  "price": string        // Фильтр по цене: "Бесплатно" | "300 руб" | "500 руб" | "1000 руб" | "1500 руб" | "Все"
}
```

### Бронирование заявки руки помощи психологом
```http
POST /confirm-help-hand-by-psychologist

Query:
{
  "telegram_id": string,  // Telegram ID психолога
  "link_id": string      // Номер заявки (hh_ + 7 символов)
}
```

### Переназначение клиента
```http
POST /reassign

Body:
{
  "lead_number": string,  // Номер лида
  "filtered_psychologists": string,  // Имена подобранных психологов через запятую
  "slots": string,  // Выбранные клиентом слоты (формат: "дд.мм чч:мм;дд.мм чч:мм")
  "_queries": string  // Запросы клиента из предыдущей заявки через точку с запятой
}
```

### Получение информации для перезаписи

#### Получение расписания для перезаписи
```http
GET /get-ticket-info-for-reassigment

Query:
{
  "lead_number": string,  // Номер лида для перезаписи
  "mode": "time" | "psychologist"  // Режим перезаписи
}
```

#### Получение данных из заявки
```http
GET /get-ticket-info-for-reassigment-without-schedule

Query:
{
  "lead_number": string  // Номер лида для перезаписи
}
```

### Получение количества оставшихся сессий
```http
GET /get-assigment-coeff

Query:
{
  "psychologist_name": string  // Имя и фамилия психолога
}
```

## Автоматизация

### Автоназначение сессии
```http
POST /automatch
Body: {
  "psychologists": string, // Список психологов через ;
  "slots": string,        // Список слотов в формате "DD.MM HH:mm" через ;
  "ticket_info": object,  // Информация о заявке
  "client_info": object,  // Информация о клиенте
  "slots_id": string      // ID слотов через ;
}
```

### Планирование событий
```http
POST /plan-events
Body: {
  "slot_id": string,
  "events": {
    "confirmation": boolean,
    "reminder_22h": boolean,
    "reminder_21h": boolean,
    "auto_cancel": boolean
  }
}
```

## CRON задачи

- Автоотмена сессий (проверка каждый час)
- Напоминания о подтверждении (за 24ч, 22ч, 21ч)
- Напоминание о внесении слотов (среда и суббота в 19:00)
- Обновление статусов сессий 