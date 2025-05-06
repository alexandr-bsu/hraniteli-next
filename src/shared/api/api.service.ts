import axios, { AxiosError } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '@/shared/config/api.config';
import { IPsychologist, IPsychologistSearchResult } from '@/shared/types/psychologist.types';
import { IApplicationSubmitData } from '@/shared/types/application.types';

// Создаем инстанс axios с базовой конфигурацией
const apiClient = axios.create(API_CONFIG);

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const PsychologistService = {
  // Получение всех психологов
  async getAll(): Promise<IPsychologist[]> {
    try {
      const { data } = await apiClient.get<IPsychologist[]>(API_ENDPOINTS.GET_ALL_PSYCHOLOGISTS);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ApiError(
          error.response?.data?.message || 'Ошибка при получении списка психологов',
          error.response?.status,
          error.code
        );
      }
      throw new ApiError('Неизвестная ошибка при получении списка психологов');
    }
  },

  // Получение расписания психологов
  async getSchedule(params: IApplicationSubmitData) {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.GET_PSYCHOLOGIST_SCHEDULE, params);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ApiError(
          error.response?.data?.message || 'Ошибка при получении расписания',
          error.response?.status,
          error.code
        );
      }
      throw new ApiError('Неизвестная ошибка при получении расписания');
    }
  }
};

export const ApplicationService = {
  // Отправка заявки
  async submit(formData: IApplicationSubmitData): Promise<{ success: boolean; message?: string }> {
    try {
      const { data } = await apiClient.post(API_ENDPOINTS.SUBMIT_APPLICATION, formData);
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new ApiError(
          error.response?.data?.message || 'Ошибка при отправке заявки',
          error.response?.status,
          error.code
        );
      }
      throw new ApiError('Неизвестная ошибка при отправке заявки');
    }
  }
};

// Обработчик ошибок
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
); 