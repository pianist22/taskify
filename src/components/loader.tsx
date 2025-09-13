'use client';
import { Loader2 } from 'lucide-react';

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
      <Loader2 className="w-16 h-16 animate-spin text-indigo-500" />
    </div>
  );
}
