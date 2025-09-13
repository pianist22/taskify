'use client';

import AuthGuard from '@/components/auth-guard';
import Navbar from '@/components/navbar';
import HeroHeading from '@/components/hero-heading';
import TaskList from '@/features/tasks/task-list';

export default function DashboardPage() {
  return (
    <>
      <AuthGuard>
        <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
          <HeroHeading />
          <TaskList />
        </main>
      </AuthGuard>
    </>
  );
}
