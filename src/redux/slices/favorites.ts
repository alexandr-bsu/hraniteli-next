import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPsychologist } from '@/shared/types/psychologist.types';

interface FavoritesState {
  items: IPsychologist[];
}

// Проверяем localStorage при инициализации
const getInitialState = (): FavoritesState => {
  if (typeof window !== 'undefined') {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        return { items: JSON.parse(savedFavorites) };
      } catch (e) {
        console.error('Ошибка при парсинге избранного из localStorage:', e);
      }
    }
  }
  return { items: [] };
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: getInitialState(),
  reducers: {
    addFavorite: (state, action: PayloadAction<IPsychologist>) => {
      // Проверяем, не добавлен ли психолог уже в избранное
      if (!state.items.some(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
        // Сохраняем в localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify(state.items));
        }
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Обновляем localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.items));
      }
    },
    clearFavorites: (state) => {
      state.items = [];
      // Очищаем localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('favorites');
      }
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer; 