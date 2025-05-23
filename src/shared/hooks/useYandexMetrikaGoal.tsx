// hooks/useYandexMetrika.ts
declare global {
  interface Window {
    ym?: (id: number, action: string, goalName: string) => void;
  }
}

import { useEffect } from 'react';

const useYandexMetrika = (goalName: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(100081518, 'reachGoal', goalName);
    }
  }, [goalName]);
};

export default useYandexMetrika;