// app/providers.tsx
'use client';
import { RecoilRoot } from 'recoil';
import { PropsWithChildren } from 'react';

export default function Providers({ children }: PropsWithChildren) {
  return <RecoilRoot>{children}</RecoilRoot>;
}
