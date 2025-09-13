'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { authTokenState } from '@/store/auth';
import { loadToken } from '@/lib/auth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useRecoilState(authTokenState);

  useEffect(() => {
    const t = token ?? loadToken();
    if (!t) router.replace('/login');
    else if (!token) setToken(t);
  }, [router, token, setToken]);

  return <>{children}</>;
}
