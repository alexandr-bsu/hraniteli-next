# API Обратной связи и сообщений

## Обратная связь после сессии

### Обработка обратной связи от клиента
```http
POST /process-feedback
Body: {
  "client_name": string,
  "psychologist": string,
  "session_date": string,
  "session_time": string,
  "feedback": {
    "rating": number,
    "comment": string,
    "will_continue": boolean
  }
}

Response: {
  "status": "success" | "error",
  "message": string
}
```

## Сообщения

### Отправка сообщения администратору
```http
POST /send-message-to-admin
Body: {
  "client_name": string,
  "message": string,
  "ticket_id": string
}
```

### Ответ администратора клиенту
```http
POST /admin-response-to-client
Body: {
  "client_name": string,
  "message": string,
  "ticket_id": string
}
```

### Отправка утренних сообщений
```http
POST /send-morning-messages
Body: {
  "recipients": "admins" | "psychologists",
  "message": string
}
```

## Уведомления

### Отправка уведомлений о сессии
```http
POST /send-session-notifications
Body: {
  "slot_id": string,
  "type": "confirmation" | "reminder" | "cancellation",
  "recipients": ["client", "psychologist"]
}
```

### Отправка ссылок на оплату
```http
POST /send-payment-links
Body: {
  "client_name": string,
  "slot_id": string,
  "payment_link": string
}
```

## Автоматические сообщения

### Планирование сообщений
```http
POST /schedule-messages
Body: {
  "slot_id": string,
  "messages": {
    "confirmation": {
      "time": string,
      "text": string
    },
    "reminder": {
      "time": string,
      "text": string
    }
  }
}
```

### Удаление запланированных сообщений
```http
POST /delete-scheduled-messages
Body: {
  "slot_id": string,
  "message_types": string[] // ["confirmation", "reminder", "payment"]
}
``` 