/**
 * Утилита для работы с UTM параметрами
 */

/**
 * Получает значение UTM параметра из URL
 * @param paramName - название UTM параметра (например, 'utm_anketa')
 * @returns значение параметра или null если не найден
 */
export const getUtmParam = (paramName: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(paramName);
};

/**
 * Проверяет, равен ли UTM параметр определенному значению
 * @param paramName - название UTM параметра
 * @param expectedValue - ожидаемое значение
 * @returns true если параметр равен ожидаемому значению
 */
export const isUtmParamEqual = (paramName: string, expectedValue: string): boolean => {
  const paramValue = getUtmParam(paramName);
  return paramValue === expectedValue;
};

/**
 * Проверяет, должны ли отображаться подписи "опытные психологи - Хранители"
 * @returns true если utm_anketa = rp1
 */
export const shouldShowKeeperLabels = (): boolean => {
  return isUtmParamEqual('utm_anketa', 'rp1');
};

/** Параметры маркировки из URL (как в Application PhoneStage) + utm_anketa из лендингов */
export const MARKETING_PARAM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_client',
  'utm_anketa',
] as const;

export type MarketingParamKey = (typeof MARKETING_PARAM_KEYS)[number];

const MARKETING_STORAGE_KEY = 'hrani_marketing_params_v1';

/**
 * Сохранить из текущего URL все известные маркетинговые параметры в sessionStorage,
 * чтобы они не потерялись при навигации без query string.
 */
export const captureMarketingParamsFromUrl = (): void => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  let stored: Partial<Record<MarketingParamKey, string>> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(MARKETING_STORAGE_KEY) || '{}');
  } catch {
    stored = {};
  }

  let updated = false;
  for (const key of MARKETING_PARAM_KEYS) {
    const v = params.get(key);
    if (v !== null && v !== '') {
      stored[key] = v;
      updated = true;
    }
  }

  if (updated) {
    sessionStorage.setItem(MARKETING_STORAGE_KEY, JSON.stringify(stored));
  }
};

/**
 * Значения для тела запроса на бэкенд: как в PhoneStage других форм — отсутствие даёт строку "null".
 */
export const getMarketingParamsForPayload = (): Record<MarketingParamKey, string> => {
  const defaults = Object.fromEntries(
    MARKETING_PARAM_KEYS.map((k) => [k, 'null'])
  ) as Record<MarketingParamKey, string>;

  if (typeof window === 'undefined') return defaults;

  let stored: Partial<Record<MarketingParamKey, string>> = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(MARKETING_STORAGE_KEY) || '{}');
  } catch {
    stored = {};
  }

  const params = new URLSearchParams(window.location.search);
  const out = { ...defaults };

  for (const key of MARKETING_PARAM_KEYS) {
    const fromUrl = params.get(key);
    if (fromUrl !== null && fromUrl !== '') {
      out[key] = fromUrl;
    } else if (stored[key]) {
      out[key] = stored[key]!;
    }
  }

  return out;
};