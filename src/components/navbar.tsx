'use client';

import Link from 'next/link';
import { useRecoilState } from 'recoil';
import { authTokenState } from '@/store/auth';
import { clearToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import ThemeToggle from './theme-toggle';

export default function Navbar() {
  const [token, setToken] = useRecoilState(authTokenState);
  const router = useRouter();

  function doLogout() {
    clearToken();
    setToken(null);
    router.replace('/login');
  }

  return (
    <header className="w-full sticky top-0 z-40 border-b bg-background/60 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold tracking-tight">
          <span className="text-xl inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Taskify
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {token ? (
            <button
              onClick={doLogout}
              className="px-3 py-2 rounded border text-sm"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="px-3 py-2 rounded border text-sm"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
