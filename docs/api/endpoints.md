# API Endpoints

## Психологи

### Получение секрета психолога
```http
POST https://n8n-v2.hrani.live/webhook/get-secret-by-telegram-id

Параметры:
{
  "user_id": string // Telegram ID психолога
}
```

### Регистрация психолога
```http
POST https://n8n-v2.hrani.live/webhook/get-secret-by-telegram-id

Body:
{
  "psychologist": string, // Фамилия и имя психолога
  "telegram_id": string  // Telegram ID психолога
}

Response:
{
  "short_link": string // Короткая ссылка на редактор анкеты психолога
}
```

### Управление слотами

#### Добавление слота
```http
POST https://n8n-v2.hrani.live/webhook/add-slot

Body:
{
  "secret": string,  // Секретный ключ к редактору расписания
  "slot": string     // Формат "дд.мм чч:мм" по МСК
}
```

#### Удаление слота
```http
POST https://n8n-v2.hrani.live/webhook/delete-slot

Body:
{
  "secret": string,  // Секретный ключ к редактору расписания
  "slot": string     // Формат "дд.мм чч:мм" по МСК
}
```

### Получение информации о слотах

#### Информация о заявке в слот
```http
GET https://n8n-v2.hrani.live/webhook/get-ticket-for-slot

Query:
{
  "secret": string,  // Секретный ключ к редактору расписания
  "date": string,    // Формат "дд.мм" по МСК
  "time": string     // Формат "чч:мм" по МСК
}
```

#### Получение слотов психолога
```http
GET https://n8n-v2.hrani.live/webhook/get-slot

Query:
{
  "secret": string,      // Секретный ключ к редактору расписания
  "startDate": string,   // Начальная дата (гггг-мм-дд)
  "endDate": string      // Конечная дата (гггг-мм-дд)
}
```

## Клиенты

### Обработка заявки с тильды
```http
POST https://n8n-v2.hrani.live/webhook/tilda-zayavka

Body: {
  "anxieties": string[],
  "questions": string[],
  "customQuestion": string[],
  "diagnoses": string[],
  "diagnoseInfo": boolean,
  "diagnoseMedicaments": string,
  "traumaticEvents": string[],
  "clientStates": string[],
  "selectedPsychologistsNames": string[],
  "age": string,
  "slots": string[],
  "slots_objects": string[],
  "contactType": string,
  "contact": string,
  "name": string,
  "promocode": string,
  "ticket_id": string,
  "userTimeZone": string,
  "formPsyClientInfo": {
    "age": string,
    "city": string,
    "sex": string,
    "psychoEducated": string,
    "hasPsychoExperience": string,
    "meetType": string,
    "selectionСriteria": string,
    "importancePsycho": string[],
    "customImportance": string,
    "sexPsycho": string,
    "priceLastSession": string,
    "durationSession": string,
    "reasonCancel": string,
    "is_adult": boolean,
    "occupation": string
  }
}
```

## Telegram интеграция

### Получение Telegram ID психолога
```http
GET /get-psy-telegram-id

Response:
{
  "telegram_id": string
}
```

### Отправка онбординг сообщения
```http
POST /send-onboarding-message-after-slot-setup

Body:
{
  "psychologist_id": string
}
```

### Верификация кода психолога
```http
POST /verify-psychologist-code

Body:
{
  "code": string,
  "psychologist_id": string
}

Response:
{
  "verified": boolean
}
```

## Диагностические сессии

### Обработка запроса на диагностическую сессию
```http
POST /process-diagnostic-session-request

Body:
{
  "client_id": string,
  "psychologist_id": string
}
```

## Анкеты и медиа

### Загрузка анкеты психолога
```http
GET /load-psy-anketa

Query:
{
  "psychologist_id": string
}
```

### Загрузка образования
```http
POST /set-education

Body:
{
  "psychologist_id": string,
  "education": {
    "type": string,
    "institution": string,
    "year": number,
    "specialization": string
  }[]
}
```

### Получение образования
```http
GET /download-psychologist-education

Query:
{
  "psychologist_id": string
}
``` 