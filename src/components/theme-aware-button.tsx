'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeAwareButton() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Avoid hydration mismatch

  // Determine whether dark mode is active
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Conditional class names
  const bgClass = isDark ? 'bg-white text-black border-gray-200 hover:bg-gray-200' : 'bg-gray-900 text-white border-gray-800 hover:bg-gray-700';

  return (
    <Link
      href="/login"
      className={`inline-flex h-10 items-center rounded border px-4 shadow-sm transition-colors ${bgClass}`}
    >
      Get started
    </Link>
  );
}
