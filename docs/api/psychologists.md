# API Психологов

## Получение списка психологов

### Получение отфильтрованного списка
```http
GET /get-filtered-psychologists-test-contur
```

### Получение расписания
```http
GET /get-aggregated-psychologist-schedule-test-contur
```

## Регистрация и авторизация

### Получение секрета психолога
```http
POST /webhook/get-secret-by-telegram-id

Body:
{
  "user_id": string  // Telegram ID психолога
}

Response:
{
  "secret": string  // Секретный ключ психолога
}
```

### Регистрация психолога
```http
POST /webhook/register-psychologist

Body:
{
  "secret": string,  // Секретный ключ психолога
  "name": string,    // Имя психолога
  "age": number,     // Возраст психолога
  "sex": string,     // Пол психолога
  "education": string,  // Образование психолога
  "experience": string, // Опыт работы
  "works_with": string[], // Список проблем с которыми работает
  "queries": string[],    // Список запросов с которыми работает
  "link_video": string,   // Ссылка на видео-визитку
  "photo": string,        // Ссылка на фото
  "price": number,        // Цена за сессию
  "telegram_id": string   // Telegram ID психолога
}

Response:
{
  "success": boolean,
  "message": string
}
```

## Управление профилем

### Получение короткой ссылки на анкету
```http
GET /get-psy-anketa-short-link

Query Parameters:
{
  "telegram_id": string  // Telegram ID психолога
}

Response:
{
  "short_link": string  // Короткая ссылка на редактор анкеты психолога
}
```

### Загрузка анкеты
```http
GET /load-psy-anketa

Query Parameters:
{
  "psychologist_id": string  // Telegram ID психолога
}

Response: {
  // Все данные о психологе из таблицы hraniteli_psychologists
}
```

### Проверка наличия фото
```http
GET /has-photo

Query Parameters:
{
  "psychologist_id": string  // Telegram ID психолога
}

Response:
{
  "result": boolean
}
```

### Проверка наличия видео
```http
GET /has-video

Query Parameters:
{
  "psychologist_id": string  // Telegram ID психолога
}

Response:
{
  "result": boolean
}
```

## Образование

### Загрузка сведений об образовании
```http
POST /set-education

Body:
{
  "psychologist_id": string,  // Telegram ID психолога
  "education": [{
    "educationItemTitle": string,      // Название образовательной организации
    "educationItemType": string,       // Тип документа
    "educationItemYear": number,       // Год окончания программы
    "educationItemProgramTitle": string // Название образовательной программы
  }]
}
```

### Получение сведений об образовании
```http
GET /download-psychologist-education

Query Parameters:
{
  "psychologist_id": string  // Telegram ID психолога
}

Response:
[{
  "educationItemTitle": string,      // Название образовательной организации
  "educationItemType": string,       // Тип документа
  "educationItemYear": number,       // Год окончания программы
  "educationItemProgramTitle": string // Название образовательной программы
}]
```

## Верификация

### Верификация кода психолога
```http
POST /verify-psychologist-code

Body:
{
  "telegram_id": string,  // Telegram ID психолога
  "code": string         // Введённый код
}

Response:
{
  "result": "verified" | "not verified"
}
```

## Медиа файлы

### Загрузка фото и видео
```http
POST /upload-psychologist-photo
POST /upload-psychologist-video

Query Parameters:
{
  "psychologist": string,        // Telegram ID психолога
  "psychologist_name": string   // Имя и фамилия психолога
}

Body: binary data (файл)
```

## Управление психологами

### Управление слотами

#### Добавление слотов
```http
POST /add-slots-test-contur
Body: {
  "psychologist_id": string,
  "slots": [
    {
      "date": string,  // формат: "DD.MM"
      "time": string   // формат: "HH:mm"
    }
  ]
}
```

#### Удаление слотов
```http
POST /delete-slots-test-contur
Body: {
  "slot_ids": string[]
}
```

## Расписание

### Получение расписания конкретного психолога
```http
GET /get-aggregated-schedule-by-psychologist-test-contur

Query params:
  utm_psy: string           // имя психолога
  userTimeOffsetMsk: number // смещение времени от МСК
```

## Фильтрация

### Параметры фильтрации
```typescript
interface FilterParams {
  gender: "male" | "female";
  price_range: {
    min: number;
    max: number;
  };
  available_dates: string[];
  available_times: string[];
  has_video: boolean;
  mental_illness_experience: boolean;
  specializations: string[];
}
```

### Структура запроса на фильтрацию
```typescript
interface FilterRequest {
  anxieties: string[];
  questions: string[];
  diagnoses: string[];
  traumaticEvents: string[];
  clientStates: string[];
  age: string;
  slots: string[];
  slots_objects: string[];
  userTimeZone: string;
  filtered_by_automatch_psy_names: string[];
}
```

## Управление фото и видео

### Загрузка фото
```http
POST /upload-psychologist-photo

Query Parameters:
{
  "psychologist": string,     // telegram id психолога
  "psychologist_name": string // имя и фамилия психолога
}

Body: binary data (фото файл)
```

### Загрузка видео
```http
POST /upload-psychologist-video

Query Parameters:
{
  "psychologist": string,     // telegram id психолога
  "psychologist_name": string // имя и фамилия психолога
}

Body: binary data (видео файл)
```

## Управление слотами

### Подбор слотов
```http
POST /get_general_slots

Body:
{
  "psychologist_list": string  // Список Фаимилий и Имён психологов через запятую
}

Response:
{
  "formated_result": string  // "Топ-3 наиболее свободных слота\n\n10.04 18:00: 2\n10.04 19:00: 2\n"
}
```

## Работа с заявками

### Получение заявок руки помощи
```http
POST /get-help-hand-tickets

Query Parameters:
{
  "telegram_id": string,  // telegram id психолога
  "price": string        // фильтр по цене: "Бесплатно" | "300 руб" | "500 руб" | "1000 руб" | "1500 руб" | "Все"
}
```

### Бронирование заявки руки помощи
```http
POST /confirm-help-hand-by-psychologist

Query Parameters:
{
  "telegram_id": string,  // telegram id психолога
  "link_id": string      // номер заявки (hh_ + 7 символов)
}
```

## Управление клиентами

### Получение списка клиентов
```http
GET /get-list-clients

Query Parameters:
{
  "psychologist_name": string  // имя и фамилия психолога
}
```

### Закрепление психолога за клиентом
```http
POST /assign-psychologist

Body:
{
  "lead_number": string  // номер лида выбранного психологом клиента
}
```

### Заполнение данных о выбранных клиентах
```http
POST /assign-psychologist-to-sheets

Body:
{
  "data": string,      // JSON строка с данными о клиентах
  "psychologist": string,  // telegram id психолога
  "selected": string   // JSON строка с выбранными клиентами
}
```

## Анкетирование

### Заполнение анкеты психолога
```http
POST /update-psychologist-profile

Body:
{
  "anketa": {
    "name": string,
    "about": string,
    "age": number,
    "sexClient": string,
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
    "education": [{
      "educationItemProgramTitle": string,
      "educationItemTitle": string,
      "educationItemType": string,
      "educationItemYear": number
    }]
  },
  "psychologist_id": string  // telegram id психолога
}
```

## Онбординг

### Отправка сообщения после внесения слотов
```http
POST /send-onboarding-message-after-slot-setup

Query Parameters:
{
  "secret": string  // Секретный ключ к редактору расписания
}
```

## Сообщество

### Получение ссылки на сообщество
```http
GET /get-community-link

Query Parameters:
{
  "telegram_id": string  // Telegram ID психолога
}

Response:
{
  "link": string  // Ссылка на сообщество с нужной модальностью
}
``` 