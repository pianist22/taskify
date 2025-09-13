import './globals.css';
import type { ReactNode } from 'react';
import MswProvider from './msw-provider';
import Providers from './providers';
import ThemeProviderClient from './theme-provider';
import Navbar from '@/components/navbar';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: "Taskify",
  description: "A Comprehensive Task Manager",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Start MSW as early as possible */}
        <Toaster richColors position="top-center" />
        <MswProvider />
        <ThemeProviderClient>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProviderClient>
      </body>
    </html>
  );
}
