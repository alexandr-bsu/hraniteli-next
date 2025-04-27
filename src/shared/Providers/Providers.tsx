'use client'

import { Provider } from "react-redux";
import { store } from '@/redux/store';
import { ModalProvider } from "./ModalProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {children}
      <ModalProvider />
    </Provider>
  );
}