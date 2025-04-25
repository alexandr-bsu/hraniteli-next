# API Тикетов

## Управление тикетами

### Получение тикетов Helpful Hand
```http
GET /get-helpful-hand-tickets

Response:
{
  "tickets": [{
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
  }]
}
```

### Подтверждение тикета
```http
POST /confirm-ticket

Body:
{
  "ticket_id": string,         // ID тикета
  "psychologist_name": string  // Имя психолога
}

Response:
{
  "success": boolean,
  "message": string
}
```

### Назначение психолога на тикет
```http
POST /assign-psychologist

Body:
{
  "ticket_id": string,         // ID тикета
  "psychologist_name": string, // Имя психолога
  "slot_time": string         // Время слота
}

Response:
{
  "success": boolean,
  "message": string
}
```

### Обновление статуса тикета
```http
POST /update-ticket-status

Body:
{
  "ticket_id": string,  // ID тикета
  "status": string     // Новый статус
}

Response:
{
  "success": boolean,
  "message": string
}
```

## Автоматизация

### Автоматическое назначение психолога
```http
POST /auto-assign-psychologist

Body:
{
  "ticket_id": string,           // ID тикета
  "psychologist_list": string[], // Список доступных психологов
  "slot_time": string           // Предпочтительное время
}

Response:
{
  "success": boolean,
  "message": string,
  "assigned_psychologist": string
}
```

### Отправка уведомлений
```http
POST /send-ticket-notification

Body:
{
  "ticket_id": string,     // ID тикета
  "notification_type": string, // Тип уведомления
  "message": string       // Текст уведомления
}

Response:
{
  "success": boolean,
  "message": string
}
```

## CRON задачи

### Автоматическая отмена тикетов
```http
POST /auto-cancel-tickets

Response:
{
  "success": boolean,
  "cancelled_tickets": string[],
  "message": string
}
```

### Напоминания о сессиях
```http
POST /send-session-reminders

Response:
{
  "success": boolean,
  "sent_reminders": number,
  "message": string
}
```

### Обновление статусов
```http
POST /update-ticket-statuses

Response:
{
  "success": boolean,
  "updated_tickets": number,
  "message": string
}
``` 