# Основная информация об API

## Базовые URL

```bash
BASE_URL="https://n8n-v2.hrani.live/webhook"
TEST_URL="https://n8n-v2.hrani.live/webhook/-test-contur"
```

## Правила использования

1. Все учётные параметры для блоков вызова API должны храниться в блоках "переменные скрипта"
2. Тестовый API имеет приставку `-test-contur` в конце URL
3. Название тестового API в n8n начинается с `[Тест]` и имеет тег "test"
4. Все даты передаются в формате DD.MM
5. Все временные метки учитывают часовой пояс клиента

## Базовая структура запроса

```typescript
interface BaseRequest {
  // Основные данные
  anxieties: string[];
  questions: string[];
  customQuestion: string[];
  diagnoses: string[];  // Одноэлементный массив с указанием диагноза
  diagnoseInfo: boolean;  // true если клиент принимает медикаменты
  diagnoseMedicaments: string;
  
  // События и состояния
  traumaticEvents: string[];  // травматические события
  clientStates: string[];     // состояние клиента
  customTraumaticEvent?: string;  // произвольная травма
  customState?: string;       // произвольное состояние
  
  // Данные о психологах
  selectedPsychologistsNames: string[];
  filtered_by_automatch_psy_names?: string[];  // подобранные психологи
  
  // Информация о клиенте
  age: string;
  name: string;
  contact: string;
  contactType: "Telegram" | "WhatsApp" | "Phone";
  lastExperience?: string;  // опыт работы с психологом
  question_to_psychologist?: string;  // описание запроса
  
  // Слоты и расписание
  slots: string[];           // формат "DD.MM HH:mm" по МСК
  slots_objects: string[];   // ID слотов
  emptySlots?: boolean;
  
  // Дополнительная информация
  promocode?: string;
  ticket_id: string;        // 7-значный номер заявки
  userTimeZone: string;     // формат "МСК±N"
  bid?: number;             // Номер строки в таблице исследование клиента (hraniteli_research)
  rid?: number;             // Номер строки в таблице исследование клиента (гугл таблица)
  
  // UTM метки
  utm_client?: string;
  utm_tarif?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_term?: string;
  utm_psy?: string;
  
  // Расширенная информация о клиенте
  formPsyClientInfo?: {
    age: string;
    city: string;
    sex: "Мужской" | "Женский";
    psychoEducated: string;
    hasPsychoExperience: string;
    meetType: "Онлайн" | "Оффлайн";
    selectionСriteria: string;
    importancePsycho: string[];
    customImportance?: string;
    sexPsycho: string;
    priceLastSession?: string;
    durationSession?: string;
    reasonCancel?: string;
    is_adult: boolean;
    occupation: string;
  };
}
```

## Основные эндпоинты

### Получение секрета психолога
```http
POST /get-secret-by-telegram-id

Body:
{
  "user_id": string  // Telegram ID психолога
}
```

### Регистрация психолога
```http
POST /get-secret-by-telegram-id

Body:
{
  "psychologist": string,  // Фамилия и имя психолога
  "telegram_id": string   // Telegram ID психолога
}

Response:
{
  "short_link": string  // Короткая ссылка на редактор анкеты психолога
}
```

### Управление слотами

#### Добавление слота
```http
POST /add-slot

Body:
{
  "secret": string,  // Секретный ключ к редактору расписания
  "slot": string    // Формат "DD.MM HH:mm" по МСК
}
```

#### Удаление слота
```http
POST /delete-slot

Body:
{
  "secret": string,  // Секретный ключ к редактору расписания
  "slot": string    // Формат "DD.MM HH:mm" по МСК
}
```

### Получение информации

#### Информация о заявке в слот
```http
GET /get-ticket-for-slot

Query Parameters:
{
  "secret": string,  // Секретный ключ к редактору расписания
  "date": string,   // Формат "DD.MM" по МСК
  "time": string    // Формат "HH:mm" по МСК
}
```

#### Получение слотов психолога
```http
GET /get-slot

Query Parameters:
{
  "secret": string,     // Секретный ключ к редактору расписания
  "startDate": string,  // Формат "YYYY-MM-DD"
  "endDate": string    // Формат "YYYY-MM-DD"
}
```

### Обработка заявок

#### Заявка с Tilda
```http
POST /tilda-zayavka

Body: BaseRequest  // См. структуру BaseRequest выше
```

## Коды ответов

| Код | Описание |
|-----|----------|
| 200 | Успешное выполнение |
| 400 | Неверный запрос |
| 401 | Не авторизован |
| 403 | Доступ запрещен |
| 404 | Ресурс не найден |
| 500 | Внутренняя ошибка сервера |

## Заголовки запросов

```http
Content-Type: application/json
Authorization: Bearer <token>
``` 