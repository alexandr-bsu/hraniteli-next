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