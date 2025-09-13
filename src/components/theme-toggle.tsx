'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current =
    theme === 'system'
      ? systemTheme
      : theme;

  if (!mounted) return null;

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded border h-10 w-10 flex items-center justify-center"
    >
      {current === 'dark' ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-slate-800" />
      )}
    </button>
  );
}
