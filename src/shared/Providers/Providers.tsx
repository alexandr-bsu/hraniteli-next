'use client'

import { Provider } from "react-redux";
import { store } from '@/redux/store';
import { ModalProvider } from "./ModalProvider";
import { ToastProvider } from "./ToastProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ModalProvider />
      <ToastProvider />
    </Provider>
  );
}