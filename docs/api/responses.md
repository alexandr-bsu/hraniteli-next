# API Responses

## Психологи

### Получение секретного ключа психолога
```json
{
  "success": true,
  "secret": "string"
}
```

### Регистрация психолога
```json
{
  "success": true,
  "message": "Психолог успешно зарегистрирован"
}
```

### Добавление/удаление слотов
```json
{
  "success": true,
  "slots": [
    {
      "date": "string", // DD.MM
      "time": "string", // HH:mm
      "status": "available" | "booked" | "deleted"
    }
  ]
}
```

## Клиенты

### Получение информации о тикете для слота
```json
{
  "success": true,
  "ticket": {
    "id": "string",
    "client_name": "string",
    "client_phone": "string",
    "client_telegram": "string",
    "status": "new" | "confirmed" | "rejected",
    "slot": {
      "date": "string",
      "time": "string"
    }
  }
}
```

### Получение доступных слотов
```json
{
  "success": true,
  "slots": [
    {
      "date": "string",
      "time": "string",
      "psychologist": "string"
    }
  ]
}
```

### Обработка заявки с Tilda
```json
{
  "success": true,
  "ticket_id": "string",
  "message": "Заявка успешно обработана"
}
```

### Получение короткой ссылки на анкету психолога
```json
{
  "success": true,
  "short_link": "string"
}
```

## Telegram интеграция

### Получение Telegram ID психолога
```json
{
  "success": true,
  "telegram_id": "string"
}
```

### Отправка онбординг сообщений
```json
{
  "success": true,
  "message": "Сообщения успешно отправлены"
}
```

### Проверка кода
```json
{
  "success": true,
  "verified": true,
  "secret": "string" // если verified = true
}
```

## Диагностические сессии

### Обработка заявки на диагностическую сессию
```json
{
  "success": true,
  "ticket_id": "string",
  "psychologists": [
    {
      "name": "string",
      "rating": "number",
      "experience": "string",
      "specialization": "string[]"
    }
  ]
}
```

### Запись на сессию
```json
{
  "success": true,
  "session": {
    "id": "string",
    "date": "string",
    "time": "string",
    "psychologist": "string",
    "client_name": "string"
  }
}
```

## Анкеты и медиа

### Загрузка анкеты психолога
```json
{
  "success": true,
  "message": "Анкета успешно загружена"
}
```

### Проверка фото/видео
```json
{
  "success": true,
  "valid": true,
  "message": "string" // если valid = false
}
```

### Загрузка информации об образовании
```json
{
  "success": true,
  "education": "string[]"
}
```

## Слоты и расписание

### Выбор слота
```json
{
  "success": true,
  "slot": {
    "date": "string",
    "time": "string",
    "psychologist": "string",
    "status": "booked"
  }
}
```

### Получение тикетов помощи
```json
{
  "success": true,
  "tickets": [
    {
      "id": "string",
      "client_name": "string",
      "status": "new" | "confirmed" | "rejected",
      "created_at": "string",
      "slot": {
        "date": "string",
        "time": "string"
      }
    }
  ]
}
```

### Подтверждение тикета
```json
{
  "success": true,
  "ticket": {
    "id": "string",
    "status": "confirmed" | "rejected"
  }
}
```

### Назначение психолога клиенту
```json
{
  "success": true,
  "assigned_psychologist": "string",
  "ticket_id": "string"
}
```

### Агрегация расписания
```json
{
  "success": true,
  "schedule": [
    {
      "date": "string",
      "slots": [
        {
          "time": "string",
          "status": "available" | "booked"
        }
      ]
    }
  ]
}
```

## Ошибки

В случае ошибки все эндпоинты возвращают:

```json
{
  "success": false,
  "error": {
    "code": "number",
    "message": "string"
  }
}
```

### Коды ошибок

- 400 - Неверный запрос
- 401 - Не авторизован
- 403 - Доступ запрещен
- 404 - Не найдено
- 500 - Внутренняя ошибка сервера 