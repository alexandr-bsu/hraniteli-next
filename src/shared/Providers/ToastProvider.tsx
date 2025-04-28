'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right" 
      toastOptions={{
        duration: 3000,
        style: {
          background: '#FFFFFF',
          color: '#333333',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          width: '270px',
        },
      }} 
    />
  );
} 