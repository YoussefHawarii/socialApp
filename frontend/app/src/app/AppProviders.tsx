import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { queryClient } from './queryClient';
import { Toaster } from '@/components/shared/Toaster';
import { GOOGLE_CLIENT_ID } from '@/lib/constants';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID} locale="en">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
