// app/msw-provider.tsx
'use client';
import { useEffect } from 'react';

export default function MswProvider() {
  useEffect(() => {
    async function boot() {
      if (process.env.NEXT_PUBLIC_ENABLE_MSW === 'true') {
        const { ensureMocks } = await import('@/lib/msw');
        await ensureMocks();
      }
    }
    boot();
  }, []);
  return null;
}
