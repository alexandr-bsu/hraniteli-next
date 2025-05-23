declare global {
  interface Window {
    ym?: (id: number, action: string, goalName: string) => void;
  }
}