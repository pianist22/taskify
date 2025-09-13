
'use client';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { authTokenState } from '@/store/auth';
import { tasksState, type Task } from '@/store/tasks';


export default function DebugPage() {
  const [token, setToken] = useRecoilState(authTokenState);
  const [tasks, setTasks] = useRecoilState(tasksState);
  const [msg, setMsg] = useState<string>('');

  async function doLogin() {
    setMsg('Logging in...');
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'test', password: 'test123' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (res.ok) {
      setToken(data.token);
      setMsg('Login OK');
    } else {
      setMsg(`Login failed: ${data.message}`);
    }
  }

  async function loadTasks() {
    setMsg('Loading tasks...');
    const res = await fetch('/api/tasks');
    const data: Task[] = await res.json();
    setTasks(data);
    setMsg(`Loaded ${data.length} tasks`);
  }

  async function addTask() {
    setMsg('Adding task...');
    const res = await fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify({ title: 'New', description: 'From debug', status: 'todo' }),
      headers: { 'Content-Type': 'application/json' },
    });
    const created: Task = await res.json();
    setTasks(prev => [created, ...prev]);
    setMsg('Task created');
  }

  return (
    <main className="p-6 space-y-4">
      <div className="space-x-2">
        <button onClick={doLogin} className="px-3 py-2 border rounded">Login</button>
        <button onClick={loadTasks} className="px-3 py-2 border rounded">Load Tasks</button>
        <button onClick={addTask} className="px-3 py-2 border rounded">Add Task</button>
      </div>
      <div>Token: {token ?? 'none'}</div>
      <div>Tasks: {tasks.length}</div>
      <div>Status: {msg}</div>
      <ul className="list-disc pl-6">
        {tasks.map(t => <li key={t.id}>{t.title} — {t.status}</li>)}
      </ul>
    </main>
  );
}
