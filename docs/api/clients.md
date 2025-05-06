# API Клиентов

## Работа с сессиями

### Получение доступных слотов
```http
GET /get-available-slots-test-contur
```

### Обработка диагностической сессии
```http
POST /process-diagnostic-session-request-test-contur
Body: {
  "client_id": string,
  "psychologist_id": string,
  "slot_id": string,
  "payment_info": {
    "amount": number,
    "status": "pending" | "completed"
  }
}
```

## Управление профилем

### Получение Telegram ID
```http
GET /get-telegram-id-test-contur
```

### Верификация кода
```http
POST /verify-code-test-contur
Body: {
  "telegram_id": string,
  "code": string
}

Response: {
  "success": boolean,
  "verified": boolean,
  "token"?: string
}
```

## Заявки

### Создание заявки
```http
POST /submit-application-test-contur
Body: {
  "name": string,
  "age": number,
  "contact": {
    "type": "telegram" | "whatsapp" | "phone",
    "value": string
  },
  "selected_slots": string[],
  "preferences": {
    "gender": string,
    "price_max": number,
    "specializations": string[]
  }
}
```

### Получение информации о заявке
```http
GET /get-ticket-info

Body:
{
  "client_id": string,  // Номер лида
  "link_id": string    // Link ID заявки
}

Response:
{
  // Данные из таблицы hraniteli_tickets
}
```

### Отправка информации администратору
```http
POST /send-ticket-data-to-admin

Body:
{
  "psychologists": string,     // Список психологов через ";"
  "slots": string,            // Список слотов "DD.MM HH:mm" через ";"
  "tiket_info": object,       // JSON из таблицы hraniteli_tickets
  "client_info": object,      // JSON из таблицы hraniteli_clients
  "slots_id": string          // Список ID слотов через ";"
}
```

## Статусы сессий

```typescript
type SessionStatus = 
  | "pending"   // Ожидает подтверждения
  | "confirmed" // Подтверждена
  | "cancelled" // Отменена
  | "completed" // Завершена
  | "missed"    // Пропущена
```

## Диагностические сессии

### Запрос на диагностическую сессию
```http
POST /webhook/diagnostic-session-request

Body:
{
  "client_name": string,     // Имя клиента
  "client_phone": string,    // Телефон клиента
  "client_telegram": string, // Telegram клиента
  "client_email": string,    // Email клиента
  "request_text": string,    // Текст запроса
  "utm": {                   // UTM метки
    "source": string,
    "medium": string,
    "campaign": string,
    "content": string,
    "term": string
  }
}

Response:
{
  "success": boolean,
  "message": string,
  "ticket_id": string
}
```

### Получение информации о тикете
```http
GET /get-ticket-info

Query:
{
  "ticket_id": string  // ID тикета
}

Response:
{
  "ticket": {
    "id": string,
    "client_name": string,
    "client_phone": string,
    "client_telegram": string,
    "client_email": string,
    "request_text": string,
    "status": string,
    "created_at": string,
    "updated_at": string,
    "psychologist_name": string,
    "slot_time": string
  }
}
```

## Управление сессиями

### Подтверждение сессии клиентом
```http
POST /confirm-session-by-client

Body:
{
  "ticket_id": string,  // ID тикета
  "slot_time": string   // Выбранное время слота
}

Response:
{
  "success": boolean,
  "message": string
}
```

### Отмена сессии
```http
POST /cancel-session

Body:
{
  "ticket_id": string,        // ID тикета
  "cancellation_reason": string  // Причина отмены
}

Response:
{
  "success": boolean,
  "message": string
}
```

### Перенос сессии
```http
POST /reschedule-session

Body:
{
  "ticket_id": string,     // ID тикета
  "new_slot_time": string  // Новое время слота
}

Response:
{
  "success": boolean,
  "message": string
}
```

## Обратная связь

### Оценка сессии
```http
POST /rate-session

Body:
{
  "ticket_id": string,  // ID тикета
  "rating": number,     // Оценка от 1 до 5
  "feedback": string    // Текст отзыва
}

Response:
{
  "success": boolean,
  "message": string
}
```

### Получение истории сессий
```http
GET /client-sessions-history

Query:
{
  "client_telegram": string  // Telegram клиента
}

Response:
{
  "sessions": [{
    "ticket_id": string,
    "psychologist_name": string,
    "slot_time": string,
    "status": string,
    "rating": number,
    "feedback": string
  }]
}
```

### Обработка обратной связи
```http
POST /client-os

Body:
{
  "anketa": {
    "mark": string,                // Оценка клиента
    "feelings": string,            // Что клиент чувствовал
    "questions": string,           // Какие вопросы помогли
    "needs": string,              // Чего не хватило
    "status": string,             // Готовность продолжать
    "wantOtherPschologist": string, // Нужен другой психолог
    "secondSessionTime": string    // Когда готов обсудить время
  },
  "telegram_id": string,           // Telegram ID клиента
  "psychologist_name": string,     // Имя психолога
  "utm_client": string,           // Номер лида
  "client_name": string,          // Имя клиента
  "client_username": string,      // Контакт клиента
  "telegram_id_psychologist": string, // Telegram ID психолога
  "session_date": string,         // Время сессии
  "client_age": string,           // Возраст клиента
  "psychologist_contact": string   // Контакт психолога
}
```

### Планирование следующей сессии
```http
POST /schedule_client_action_after_5_days
POST /schedule_client_action_after_3_weeks

// Планирует отправку расписания через указанный период
```

## Регистрация и управление

### Регистрация клиента
```http
POST /client-registration

Body:
{
  "user_id": string  // Telegram ID клиента
}
```

### Переход в бот
```http
POST /process-link

Body:
{
  "user_id": string,   // Telegram ID клиента
  "ticket_id": string  // Номер заявки
}
```

## Переназначение сессий

### Переназначение клиента
```http
POST /reassign

Body:
{
  "lead_number": string,           // Номер лида
  "filtered_psychologists": string, // Имена подобранных психологов через запятую
  "slots": string,                 // Выбранные клиентом слоты (формат: "11.03 10:00;11.03 11:00")
  "_queries": string              // Запросы клиента из предыдущей заявки (через точку с запятой)
}
```

### Получение информации для перезаписи
```http
GET /get-ticket-info-for-reassigment-without-schedule

Query Parameters:
{
  "lead_number": string  // Номер лида для перезаписи
}
```

### Получение расписания для перезаписи
```http
GET /get-reassignment-schedule

Query Parameters:
{
  "lead_number": string,  // Номер лида для перезаписи
  "mode": "time" | "psychologist"  // Режим перезаписи
}

Примечание:
- mode=time: показываются слоты только ранее выбранного психолога
- mode=psychologist: показываются слоты подобранных ранее психологов за исключением ранее выбранного
```

## Обработка событий

### Обработка событий брони/отмены слота
```http
POST /notify-update

Действие: Вызывается webhook из supabase при изменении статуса в таблице hraniteli_slots
- Если state меняется с свободного на забронированный: начинается процесс бронирования слота
- Если с забронированного на свободный: начинается процесс отмены
```

## Статистика

### Получение количества оставшихся сессий
```http
GET /get-assigment-coeff

Query Parameters:
{
  "psychologist_name": string  // Имя и фамилия психолога
}

Примечание: Возвращает количество оставшихся для назначения слотов психологу.
Коэффициент = debt - number_of_clients_provided - количество назначенных после сегодняшнего числа сессий до конца месяца
```

## Коммуникация

### Отправка сообщения администратору
```http
POST /send_user_message_to_admin

Body:
{
  // Сообщение от клиента
}
```

### Отправка сообщения клиенту
```http
POST /send_admin_message_to_user

Body:
{
  "command": string  // "br0722: текст сообщения"
}
```

## Исследовательская анкета

### Сохранение анкеты
```http
POST /research-tilda-zayavka

Body:
{
  // Стандартная структура запроса
}
```

### Получение номера строки
```http
GET /get-sheets-row-number

Response:
{
  "row": number  // Следующий свободный номер строки
}
```

### Обновление контактов
```http
PUT /update-contacts-stb

Body:
{
  // Стандартная структура запроса
}
```

## CRON задачи

### Проверка перехода по ссылке
```http
CRON /check-link-transition
Запускается: через 2 минуты после создания ссылки

Действие: Уведомляет администратора если клиент не перешел по ссылке
```

### Подтверждение заявки Рука помощи
```http
CRON /confirm-help-hand
Запускается: 
- Через 7 дней: первое подтверждение
- Через 14 дней: второе подтверждение
- Через 21 день: уведомление если не найден психолог

Действие: Отправляет запросы на подтверждение актуальности заявки
```

## Расписание и слоты

### Получить расписание психолога
`GET /get-schedule`
- Query параметры:
  - `psychologist`: имя и фамилия психолога
- Возвращает массив сообщений с расписанием по неделям, включая свободные и забронированные слоты

### Обновление количества сессий
`CRON` Ежедневно в 21:00 МСК обновляет `number_of_clients_provided` в таблице `hraniteli_psychologists`

## Аналитика

### Инициализация трекера формы
`POST /init-form-tracking`
```json
{
  "ticket_id": "string",
  "form_type": "string",
  "step": "Начало"
}
```

### Обновление шага формы
`PUT /update-tracking-step`
```json
{
  "ticket_id": "string", 
  "step": "string"
}
```

### Заполнение аналитики до показа слотов
`PUT /update-analytics-before-slots`
- Body: структура запроса из общих замечаний

## Видеовстречи

### Генерация ссылки на видеовстречу
`POST /generate-conference-link`
- Генерирует ссылку на Zoom или Google Meet в зависимости от занятости

## Напоминания

### Напоминание об обратной связи
`CRON` Каждый час проверяет завершенные сессии и отправляет напоминания клиенту и психологу

### Напоминание о сессии
`CRON` Каждый час проверяет предстоящие сессии и отправляет напоминания за 2 часа до начала

## События

### Обработка событий брони/отмены
`POST /notify-update`
- Webhook для обработки изменений статуса в `hraniteli_slots`
- Запускает процесс бронирования или отмены слота 