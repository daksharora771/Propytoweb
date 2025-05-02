'use client';

import { Toaster as Sonner } from 'sonner';
import type { CSSProperties } from 'react';

// Define extended options type that includes success and error styles
type ExtendedToastOptions = {
  style?: CSSProperties;
  success?: { style?: CSSProperties };
  error?: { style?: CSSProperties };
  duration?: number;
};

export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          background: '#12122D',
          color: 'white',
          border: '1px solid rgba(59, 130, 246, 0.2)',
        },
        success: {
          style: {
            background: 'rgba(22, 163, 74, 0.2)',
            border: '1px solid rgba(22, 163, 74, 0.5)',
            color: 'white',
          },
        },
        error: {
          style: {
            background: 'rgba(220, 38, 38, 0.2)',
            border: '1px solid rgba(220, 38, 38, 0.5)',
            color: 'white',
          },
        },
        duration: 5000,
      } as ExtendedToastOptions}
    />
  );
} 