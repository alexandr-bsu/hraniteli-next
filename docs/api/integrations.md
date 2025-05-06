# Интеграции

## Telegram интеграция

### Получение Telegram ID психолога
```http
GET /get-telegram-id-test-contur
```

### Отправка онбординг сообщений
```http
POST /send-onboarding-message-after-slot-setup
```

Параметры:
- `secret` - Секретный ключ к редактору расписания психолога

### Верификация кода
```http
POST /verify-psychologist-code
```

Тело запроса:
```json
{
  "telegram_id": "string",
  "code": "string"
}
```

Ответ (успешно):
```json
{
  "result": "verified"
}
```

Ответ (неуспешно):
```json
{
  "result": "not verified"
}
```

## Tilda интеграция

### Обработка заявок
```http
POST /process-request-from-tilda-test-contur
```

Тело запроса:
```json
{
  "form_data": {
    "name": "string",
    "phone": "string",
    "email": "string",
    "comment": "string"
  },
  "utm": {
    "source": "string",
    "medium": "string",
    "campaign": "string"
  }
}
```

### Обработка диагностической сессии
```http
POST /tilda-zayavka-diagnostic
```

## Загрузка материалов

### Загрузка образования
```http
POST /upload-education-info-test-contur
```

Тело запроса:
```json
{
  "psychologist_id": "string",
  "files": "File[]",
  "type": "diploma" | "certificate" | "other"
}
```

### Загрузка фото/видео
```http
POST /upload-psychologist-photo
POST /upload-psychologist-video
```

Параметры:
```json
{
  "psychologist": "string", // telegram id психолога
  "psychologist_name": "string" // имя и фамилия психолога
}
```

### Проверка фото/видео
```http
GET /check-photo-video-test-contur
```

Параметры:
- `psychologist_id` - ID психолога

Ответ:
```json
{
  "has_photo": "boolean",
  "has_video": "boolean"
}
```

## Верификация психологов

### Получение секретного ключа
```http
POST /get-psychologist-secret-key-test-contur
```

Тело запроса:
```json
{
  "psychologist_id": "string"
}
```

Ответ:
```json
{
  "secret_key": "string"
}
```

### Получение короткой ссылки на анкету
```http
GET /get-psy-anketa-short-link
```

Параметры:
- `telegram_id` - Telegram ID психолога

Ответ:
```json
{
  "short_link": "string"
}
```

### Получение ссылки на сообщество
```http
GET /get-community-link
```

Параметры:
- `telegram_id` - Telegram ID психолога

Ответ:
```json
{
  "link": "string"
}
```

## Работа с UTM-метками

### Структура UTM-меток
```typescript
interface UTMParams {
  utm_client?: string;
  utm_tarif?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_term?: string;
  utm_psy?: string;
}
```

## Загрузка медиа-материалов

### Загрузка фото и видео психолога
```http
POST /upload-psychologist-photo
POST /upload-psychologist-video

Query params:
{
  "psychologist": string,    // telegram id психолога
  "psychologist_name": string // имя и фамилия психолога
}

Body: binary data (file)
```

Загружает фото и видео материалы психолога на google drive. Ссылки сохраняются в таблице `hraniteli_psychologists` в полях `link_photo` и `link_video`.

## Работа с заявками

### Получение общих слотов
```http
POST /get_general_slots

Body:
{
  "psychologist_list": string  // Список Фамилий и Имён психологов через запятую
}

Response:
{
  "formated_result": string  // "Топ-3 наиболее свободных слота\n\nDD.MM HH:mm: N\n..."
}
```

### Получение заявок руки помощи
```http
POST /get-help-hand-tickets

Query params:
{
  "telegram_id": string,  // telegram id психолога
  "price": string        // фильтр по цене: "Бесплатно" | "300 руб" | "500 руб" | "1000 руб" | "1500 руб" | "Все"
}
```

### Регистрация заявки руки помощи
```http
POST /register-ticket-for-help-hand
POST /confirm-question-help-hand  // Подтверждение заявки
```

### Бронирование заявки руки помощи
```http
POST /confirm-help-hand-by-psychologist

Query params:
{
  "telegram_id": string,  // telegram id психолога
  "link_id": string      // номер заявки (hh_ + 7 символов)
}
```

## Работа с клиентами

### Получение списка клиентов
```http
GET /get-list-clients

Query params:
{
  "psychologist_name": string  // имя и фамилия психолога
}
```

### Назначение психолога
```http
POST /assign-psychologist

Body:
{
  "lead_number": string  // номер лида выбранного психологом клиента
}
```

### Назначение психолога в таблицы
```http
POST /assign-psychologist-to-sheets

Body:
{
  "data": string,       // JSON строка с данными клиентов
  "psychologist": string, // telegram id психолога
  "selected": string    // JSON объект с выбранными клиентами
}
```

## Переназначение клиентов

### Переназначение на новую сессию
```http
POST /reassign

Body:
{
  "lead_number": string,           // Номер лида
  "filtered_psychologists": string, // Имена подобранных психологов через запятую
  "slots": string,                 // выбранные слоты (формат: "DD.MM HH:mm;DD.MM HH:mm")
  "_queries": string               // запросы клиента через точку с запятой
}
```

### Получение информации для перезаписи
```http
GET /get-ticket-info-for-reassigment-without-schedule

Query params:
{
  "lead_number": string  // номер лида для перезаписи
}
```

## Статистика

### Получение коэффициента назначений
```http
GET /get-assigment-coeff

Query params:
{
  "psychologist_name": string  // имя и фамилия психолога
}
```

Возвращает количество оставшихся для назначения слотов психологу. Рассчитывается как:
```
Коэффициент = debt - number_of_clients_provided - количество назначенных после сегодняшнего числа сессий до конца месяца
``` 