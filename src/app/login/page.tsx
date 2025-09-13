'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRecoilState } from 'recoil';
import { authTokenState } from '@/store/auth';
import { saveToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const router = useRouter();
  const [, setToken] = useRecoilState(authTokenState);
  const [error, setError] = useState<string | null>(null);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null);
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data?.message ?? 'Login failed');
      return;
    }
    setToken(data.token);
    saveToken(data.token);
    router.replace('/dashboard');
  }

  if (!mounted) return null; // Prevent hydration issues

  return (
    <main
      className={`min-h-screen grid place-items-center px-4 relative overflow-hidden transition-colors duration-700 ease-in-out
        ${
          currentTheme === 'dark'
            ? 'bg-gradient-to-br from-violet-950 via-purple-900 to-pink-900'
            : 'bg-gradient-to-br from-indigo-200 via-pink-200 to-white'
        }`}
    >
      <div
        className={`absolute inset-0 z-0 pointer-events-none blur-3xl opacity-20 transition-colors duration-700 ease-in-out 
          ${
            currentTheme === 'dark'
              ? 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900'
              : 'bg-gradient-to-tr from-indigo-400 via-purple-300 to-pink-300'
          }`}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`relative z-10 w-full max-w-sm rounded-3xl p-10 flex flex-col gap-7 
          border transition-colors duration-700 ease-in-out
          ${
            currentTheme === 'dark'
              ? 'bg-slate-900/95 border-gray-700 shadow-indigo-900 shadow-lg'
              : 'bg-white/95 border-gray-200 shadow-pink-300 shadow-lg'
          }`}
      >
        <div className="text-center space-y-2 mb-2">
          <h1
            className={`text-4xl font-extrabold tracking-tight py-1 bg-clip-text text-transparent 
              ${
                currentTheme === 'dark'
                  ? 'bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500'
              }`}
          >
            Sign in to Taskify
          </h1>
          <p
            className={`text-sm
            ${
              currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Use <span className="font-semibold text-indigo-500 dark:text-purple-400">test</span> /{' '}
            <span className="font-semibold text-pink-500 dark:text-pink-400">test123</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <label
            className={`text-sm font-semibold 
              ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
            htmlFor="username"
          >
            Username
          </label>
          <input
            id="username"
            {...register('username')}
            placeholder="test"
            autoComplete="username"
            className={`w-full rounded-xl border px-4 py-3  
              transition-colors duration-300 ease-in-out
              ${
                currentTheme === 'dark'
                  ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500'
                  : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-indigo-400 focus:border-indigo-400'
              }`}
          />
          {errors.username && (
            <p className="text-xs text-pink-600">{errors.username.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label
            className={`text-sm font-semibold 
              ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            {...register('password')}
            type="password"
            placeholder="test123"
            autoComplete="current-password"
            className={` w-full rounded-xl border px-4 py-3 
              transition-colors duration-300 ease-in-out
              ${
                currentTheme === 'dark'
                  ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-500 focus:ring-pink-500 focus:border-pink-500'
                  : 'border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-indigo-400 focus:border-indigo-400'
              }`}
          />
          {errors.password && (
            <p className="text-xs text-pink-600">{errors.password.message}</p>
          )}
        </div>

        {error && (
          <p
            className={`text-xs text-center 
              ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-12 rounded-2xl font-extrabold shadow-lg transition-all duration-300 ease-in-out
            ${
              currentTheme === 'dark'
                ? 'bg-gradient-to-r from-pink-400 via-purple-600 to-indigo-600 text-white  disabled:opacity-60 active:scale-95'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white hover:scale-105 disabled:opacity-60 active:scale-95'
            }`}
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
