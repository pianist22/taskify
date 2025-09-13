import { http, HttpResponse } from 'msw';

type Task = { id: string; title: string; description: string; status: 'todo'|'in-progress'|'done' };

let memTasks: Task[] = [];

function isBrowser() {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}
function load() {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem('tasks');
    if (raw) memTasks = JSON.parse(raw) as Task[];
  } catch {}
}
function save() {
  if (!isBrowser()) return;
  try {
    localStorage.setItem('tasks', JSON.stringify(memTasks));
  } catch {}
}

// Sync at module init so the first request reflects persisted data
load();

export const handlers = [
  http.post('/api/login', async ({ request }) => {
    const { username, password } = await request.json() as { username: string; password: string };
    if (username === 'test' && password === 'test123') {
      return HttpResponse.json({ token: 'fake-jwt' }, { status: 200 });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  http.get('/api/tasks', async () => {
    load();
    return HttpResponse.json(memTasks, { status: 200 });
  }),

  http.post('/api/tasks', async ({ request }) => {
    load();
    const body = (await request.json()) as Omit<Task, 'id'>;
    const newTask: Task = { id: crypto.randomUUID(), ...body };
    memTasks = [newTask, ...memTasks];
    save();
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put('/api/tasks/:id', async ({ params, request }) => {
    load();
    const { id } = params as { id: string };
    const body = (await request.json()) as Partial<Task>;
    memTasks = memTasks.map(t => (t.id === id ? { ...t, ...body } : t));
    save();
    const updated = memTasks.find(t => t.id === id);
    return HttpResponse.json(updated, { status: 200 });
  }),

  http.delete('/api/tasks/:id', async ({ params }) => {
    load();
    const { id } = params as { id: string };
    memTasks = memTasks.filter(t => t.id !== id);
    save();
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
