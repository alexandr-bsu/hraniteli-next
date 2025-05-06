export const API_URL = 'https://n8n-v2.hrani.live/webhook';

export const API_ENDPOINTS = {
  // Психологи
  GET_ALL_PSYCHOLOGISTS: `${API_URL}/get-filtered-psychologists`,
  GET_PSYCHOLOGIST_SCHEDULE: `${API_URL}/get-aggregated-psychologist-schedule`,
  
  // Заявки
  SUBMIT_APPLICATION: `${API_URL}/submit-application`,
  
  // Слоты
  GET_AVAILABLE_SLOTS: `${API_URL}/get-available-slots`,
} as const;

// Конфиг для axios
export const API_CONFIG = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
} as const; 