# Типы данных API

## Основные типы

### Психолог
```typescript
interface Psychologist {
  id: string;
  name: string;
  age: number;
  sex: "male" | "female";
  education: Education[];
  works_with: string[];
  queries: string[];
  min_price: number;
  max_price: number;
  link_video: string | null;
  photo_url: string | null;
  telegram_id: string;
  description: string;
  experience_years: number;
  is_verified: boolean;
}
```

### Клиент
```typescript
interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  telegram_id?: string;
  anxieties?: string[];
  questions?: string[];
  diagnoses?: string[];
  client_states?: string[];
  contact_type?: string;
}
```

### Слот
```typescript
interface Slot {
  id: string;
  psychologist_id: string;
  date: string; // ISO format
  time: string; // HH:mm format
  duration: number; // minutes
  is_available: boolean;
  price: number;
  client_id?: string;
  status: SlotStatus;
}

type SlotStatus = "free" | "booked" | "confirmed" | "completed" | "cancelled";
```

### Образование
```typescript
interface Education {
  id: string;
  type: "diploma" | "certificate" | "other";
  title: string;
  institution: string;
  year: number;
  file_url?: string;
}
```

### Сессия
```typescript
interface Session {
  id: string;
  slot_id: string;
  psychologist_id: string;
  client_id: string;
  status: SessionStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

type SessionStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "refunded" | "failed";
```

### Заявка
```typescript
interface Request {
  id: string;
  form_data: {
    name: string;
    phone: string;
    email?: string;
    comment?: string;
  };
  utm: UTMParams;
  created_at: string;
  status: RequestStatus;
}

type RequestStatus = "new" | "processing" | "completed" | "rejected";
```

### UTM метки
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

## Вспомогательные типы

### Фильтры
```typescript
interface Filters {
  price_range?: [number, number];
  gender?: "male" | "female";
  has_video?: boolean;
  works_with?: string[];
  queries?: string[];
  available_dates?: string[];
  available_times?: string[];
}
```

### Ошибки
```typescript
interface APIError {
  code: number;
  message: string;
  details?: Record<string, any>;
}
```

### Пагинация
```typescript
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
```

## Расширенные типы

### Информация о клиенте психолога
```typescript
interface PsychologistClientInfo {
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
}
```

### Расписание
```typescript
interface Schedule {
  items: {
    pretty_date: string;
    slots: {
      [hour: string]: Array<{
        id: string;
        psychologist: string;
        time: string;
        date: string;
      }>;
    };
  }[];
}
```

### Диагностическая сессия
```typescript
interface DiagnosticSession {
  client_id: string;
  psychologist_id: string;
  slot_id: string;
  payment_info: {
    amount: number;
    status: "pending" | "completed" | "failed";
  };
  session_info?: {
    duration: number;
    notes: string;
    recommendations: string[];
  };
}
```

### Верификация психолога
```typescript
interface PsychologistVerification {
  telegram_id: string;
  code: string;
  education_files?: File[];
  photo?: File;
  video_link?: string;
  documents: {
    type: "diploma" | "certificate" | "license";
    file: File;
    issue_date: string;
  }[];
}
```

### Статистика и рейтинги
```typescript
interface PsychologistStats {
  total_sessions: number;
  completed_sessions: number;
  cancelled_sessions: number;
  rating: number;
  reviews_count: number;
  average_session_duration: number;
  specialization_effectiveness: {
    [key: string]: number;
  };
}
```

### Настройки уведомлений
```typescript
interface NotificationSettings {
  session_reminder: boolean;
  session_confirmation: boolean;
  payment_notifications: boolean;
  marketing_notifications: boolean;
  reminder_time: number; // hours before session
  preferred_channel: "telegram" | "email" | "sms";
}
```

### Платежная информация
```typescript
interface PaymentInfo {
  session_id: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string;
  transaction_id?: string;
  refund_reason?: string;
  created_at: string;
  updated_at: string;
}
```

### Отзывы и оценки
```typescript
interface Review {
  id: string;
  client_id: string;
  psychologist_id: string;
  session_id: string;
  rating: number;
  text: string;
  is_anonymous: boolean;
  created_at: string;
  helpful_count: number;
  response?: {
    text: string;
    created_at: string;
  };
}
```

## Дополнительные типы

### Планирование событий
```typescript
interface EventPlanning {
  id: string;
  psychologist: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  state: string;
  ticket: string;
  meeting_link: string;
  meeting_id: string;
  calendar_meeting_id: string;
  confirmed: boolean;
  auto_assigned: boolean;
  auto_canceled: boolean;
}
```

### Переназначение клиента
```typescript
interface ClientReassignment {
  lead_number: string;
  filtered_psychologists: string; // Имена психологов через запятую
  slots: string; // Формат: "DD.MM HH:mm;DD.MM HH:mm"
  queries: string; // Запросы через точку с запятой
}
```

### Расписание для перезаписи
```typescript
interface ReassignmentSchedule {
  lead_number: string;
  mode: "time" | "psychologist";
  available_slots: {
    date: string;
    time: string;
    psychologist: string;
  }[];
}
```

### Общие слоты
```typescript
interface GeneralSlots {
  psychologist_list: string; // Список психологов через запятую
  formated_result: string; // "Топ-3 наиболее свободных слота\n\nDD.MM HH:mm: N\nDD.MM HH:mm: N\n"
}
```

### Информация о заявке в слот
```typescript
interface SlotTicketInfo {
  secret: string;
  date: string; // DD.MM
  time: string; // HH:mm
  client_info: {
    name: string;
    contact: string;
    contact_type: string;
    requests: string[];
  };
}
```

### Управление расписанием
```typescript
interface ScheduleManagement {
  secret: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  slots: {
    date: string; // DD.MM
    time: string; // HH:mm
    is_available: boolean;
  }[];
}
```

### Агрегированное расписание
```typescript
interface AggregatedSchedule {
  utm_psy: string;
  userTimeOffsetMsk: number;
  schedule: {
    date: string;
    slots: {
      [time: string]: {
        id: string;
        is_available: boolean;
        price: number;
      }[];
    };
  }[];
}
```

### Настройки часового пояса
```typescript
interface TimezoneSettings {
  userTimeZone: string; // Например: "Europe/Moscow"
  userTimeOffsetMsk: number; // Смещение от московского времени в часах
  slots: {
    date: string; // DD.MM
    time: string; // HH:mm
    timezone: string;
  }[];
}
```

### Результаты поиска
```typescript
interface SearchResults<T> {
  items: T[];
  total: number;
  filtered: number;
  page: number;
  per_page: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  filters_applied: Record<string, any>;
}
``` 