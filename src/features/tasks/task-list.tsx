// 'use client';

// import { useEffect, useState } from 'react';
// import { useRecoilState } from 'recoil';
// import { tasksState, type Task } from '@/store/tasks';
// import { createTask, deleteTask, getTasks, updateTask } from './api';
// import { z } from 'zod';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';

// const schema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().default(''),
//   status: z.enum(['todo', 'in-progress', 'done']),
// });
// type FormInput = z.input<typeof schema>;
// type FormOutput = z.output<typeof schema>;

// export default function TaskList() {
//   const [tasks, setTasks] = useRecoilState(tasksState);
//   const [showNew, setShowNew] = useState(false);
//   const [editing, setEditing] = useState<Task | null>(null);
//   const [status, setStatus] = useState<string>('');

//   useEffect(() => {
//     getTasks()
//       .then(setTasks)
//       .catch(() => setStatus('Failed to load tasks'));
//   }, [setTasks]);

//   async function handleCreate(values: FormOutput) {
//     setStatus('Creating task...');
//     const optimistic: Task = { id: crypto.randomUUID(), ...values };
//     setTasks((prev) => [optimistic, ...prev]);
//     setShowNew(false);
//     try {
//       const created = await createTask(values);
//       setTasks((prev) => [created, ...prev.filter((t) => t.id !== optimistic.id)]);
//       setStatus('Task created');
//     } catch {
//       setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
//       setStatus('Create failed');
//     }
//   }

//   async function handleEdit(values: FormOutput) {
//     if (!editing) return;
//     setStatus('Updating task...');
//     const id = editing.id;
//     const prev = tasks;
//     setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...values } : t)));
//     setEditing(null);
//     try {
//       const updated = await updateTask(id, values);
//       setTasks((cur) => cur.map((t) => (t.id === id ? updated : t)));
//       setStatus('Task updated');
//     } catch {
//       setTasks(prev);
//       setStatus('Update failed');
//     }
//   }

//   async function handleDelete(id: string) {
//     setStatus('Deleting task...');
//     const prev = tasks;
//     setTasks((cur) => cur.filter((t) => t.id !== id));
//     try {
//       await deleteTask(id);
//       setStatus('Task deleted');
//     } catch {
//       setTasks(prev);
//       setStatus('Delete failed');
//     }
//   }

//   // Inline TaskDialog component: local, no export, so no serializable-props check
//   function TaskDialogLocal({
//     initial,
//     onSubmit,
//     onCancel,
//   }: {
//     initial?: Task;
//     onSubmit: (values: FormOutput) => Promise<void>;
//     onCancel: () => void;
//   }) {
//     const {
//       register,
//       handleSubmit,
//       formState: { errors, isSubmitting },
//     } = useForm<FormInput>({
//       resolver: zodResolver(schema),
//       defaultValues: initial
//         ? {
//             title: initial.title,
//             description: initial.description ?? '',
//             status: initial.status,
//           }
//         : { title: '', description: '', status: 'todo' },
//     });

//     const onValid: SubmitHandler<FormInput> = async (vals) => {
//       const parsed = schema.parse(vals);
//       await onSubmit(parsed);
//     };

//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//         <form
//           onSubmit={handleSubmit(onValid)}
//           className="w-full max-w-md rounded-lg border bg-background p-6 space-y-4"
//         >
//           <h2 className="text-xl font-semibold">{initial ? 'Edit Task' : 'New Task'}</h2>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Title</label>
//             <input {...register('title')} className="w-full rounded border px-3 py-2" />
//             {errors.title && (
//               <p className="text-sm text-red-600">{errors.title.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Description</label>
//             <textarea {...register('description')} className="w-full rounded border px-3 py-2" />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Status</label>
//             <select {...register('status')} className="w-full rounded border px-3 py-2">
//               <option value="todo">Todo</option>
//               <option value="in-progress">In progress</option>
//               <option value="done">Done</option>
//             </select>
//           </div>

//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-3 py-2 rounded border text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black text-sm disabled:opacity-50"
//             >
//               {isSubmitting ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Tasks</h2>
//         <button
//           onClick={() => setShowNew(true)}
//           className="px-3 py-2 rounded border text-sm"
//         >
//           New Task
//         </button>
//       </div>

//       {status && <p className="text-sm text-muted-foreground">{status}</p>}

//       {tasks.length === 0 ? (
//         <div className="rounded border p-8 text-center text-sm text-muted-foreground">
//           No tasks yet. Create your first task.
//         </div>
//       ) : (
//         <ul className="space-y-2">
//           {tasks.map((t) => (
//             <li
//               key={t.id}
//               className="rounded border p-4 flex items-start justify-between"
//             >
//               <div>
//                 <p className="font-medium">{t.title}</p>
//                 <p className="text-sm text-muted-foreground">{t.description}</p>
//                 <p className="mt-1 inline-block text-xs rounded bg-gray-200 dark:bg-gray-800 px-2 py-0.5">
//                   {t.status}
//                 </p>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={() => setEditing(t)}
//                   className="px-3 py-2 rounded border text-sm"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(t.id)}
//                   className="px-3 py-2 rounded border text-sm"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {showNew && (
//         <TaskDialogLocal
//           onCancel={() => setShowNew(false)}
//           onSubmit={handleCreate}
//         />
//       )}
//       {editing && (
//         <TaskDialogLocal
//           initial={editing}
//           onCancel={() => setEditing(null)}
//           onSubmit={handleEdit}
//         />
//       )}
//     </section>
//   );
// }

// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import { useRecoilState } from 'recoil';
// import { tasksState, type Task } from '@/store/tasks';
// import { createTask, deleteTask, getTasks, updateTask } from './api';
// import { z } from 'zod';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ensureMocks } from '@/lib/msw'; // await worker before fetch
// import { Circle, Edit2, Trash2 } from 'lucide-react';
// import { useTheme } from 'next-themes';

// const schema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().default(''),
//   status: z.enum(['todo', 'in-progress', 'done']),
// });
// type FormInput = z.input<typeof schema>;
// type FormOutput = z.output<typeof schema>;

// export default function TaskList() {
//   const { theme, systemTheme } = useTheme();
//   const currentTheme = theme === 'system' ? systemTheme : theme;

//   const [tasks, setTasks] = useRecoilState(tasksState);
//   const [showNew, setShowNew] = useState(false);
//   const [editing, setEditing] = useState<Task | null>(null);
//   const [status, setStatus] = useState<string>('');

//   // Gate fetch on MSW readiness in dev to avoid 404 before worker starts
//   const [mswReady, setMswReady] = useState(process.env.NODE_ENV !== 'development');

//   useEffect(() => {
//     let mounted = true;
//     async function boot() {
//       if (process.env.NODE_ENV === 'development') {
//         await ensureMocks(); // awaits worker.start()
//       }
//       if (!mounted) return;
//       setMswReady(true);
//     }
//     boot();
//     return () => { mounted = false; };
//   }, []);

//   useEffect(() => {
//     if (!mswReady) return;
//     getTasks()
//       .then(setTasks)
//       .catch(() => setStatus('Failed to load tasks'));
//   }, [mswReady, setTasks]);

//   async function handleCreate(values: FormOutput) {
//     setStatus('Creating task...');
//     const optimistic: Task = { id: crypto.randomUUID(), ...values };
//     setTasks((prev) => [optimistic, ...prev]);
//     setShowNew(false);
//     try {
//       const created = await createTask(values);
//       setTasks((prev) => [created, ...prev.filter((t) => t.id !== optimistic.id)]);
//       setStatus('Task created');
//     } catch {
//       setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
//       setStatus('Create failed');
//     }
//   }

//   async function handleEdit(values: FormOutput) {
//     if (!editing) return;
//     setStatus('Updating task...');
//     const id = editing.id;
//     const prev = tasks;
//     setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...values } : t)));
//     setEditing(null);
//     try {
//       const updated = await updateTask(id, values);
//       setTasks((cur) => cur.map((t) => (t.id === id ? updated : t)));
//       setStatus('Task updated');
//     } catch {
//       setTasks(prev);
//       setStatus('Update failed');
//     }
//   }

//   async function handleDelete(id: string) {
//     setStatus('Deleting task...');
//     const prev = tasks;
//     setTasks((cur) => cur.filter((t) => t.id !== id));
//     try {
//       await deleteTask(id);
//       setStatus('Task deleted');
//     } catch {
//       setTasks(prev);
//       setStatus('Delete failed');
//     }
//   }

//   function statusBadgeColors(status: Task['status']) {
//     switch (status) {
//       case 'todo':
//         return 'bg-gradient-to-r from-pink-400 to-pink-600 text-white';
//       case 'in-progress':
//         return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
//       case 'done':
//         return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
//       default:
//         return 'bg-gray-400 text-white';
//     }
//   }

//   function TaskDialogLocal({
//     initial,
//     onSubmit,
//     onCancel,
//   }: {
//     initial?: Task;
//     onSubmit: (values: FormOutput) => Promise<void>;
//     onCancel: () => void;
//   }) {
//     const {
//       register,
//       handleSubmit,
//       formState: { errors, isSubmitting },
//     } = useForm<FormInput>({
//       resolver: zodResolver(schema),
//       defaultValues: initial
//         ? { title: initial.title, description: initial.description ?? '', status: initial.status }
//         : { title: '', description: '', status: 'todo' },
//     });

//     const onValid: SubmitHandler<FormInput> = async (vals) => {
//       const parsed = schema.parse(vals);
//       await onSubmit(parsed);
//     };

//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//         <form
//           onSubmit={handleSubmit(onValid)}
//           className={`w-full max-w-md rounded-lg border bg-background p-6 space-y-4 shadow-lg transition-colors
//             ${currentTheme === 'dark' ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'}`}
//         >
//           <h2 className="text-xl font-semibold">{initial ? 'Edit Task' : 'New Task'}</h2>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Title</label>
//             <input
//               {...register('title')}
//               className={`w-full rounded border px-3 py-2 transition-colors
//                 ${currentTheme === 'dark' ? 'border-gray-600 bg-gray-800 placeholder-gray-400' : 'border-gray-300 bg-gray-50 placeholder-gray-500'}`}
//             />
//             {errors.title && <p className="text-sm text-pink-600">{errors.title.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Description</label>
//             <textarea
//               {...register('description')}
//               className={`w-full rounded border px-3 py-2 transition-colors
//                 ${currentTheme === 'dark' ? 'border-gray-600 bg-gray-800 placeholder-gray-400' : 'border-gray-300 bg-gray-50 placeholder-gray-500'}`}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Status</label>
//             <select
//               {...register('status')}
//               className={`w-full rounded border px-3 py-2 transition-colors
//                 ${currentTheme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'}`}
//             >
//               <option value="todo">Todo</option>
//               <option value="in-progress">In progress</option>
//               <option value="done">Done</option>
//             </select>
//           </div>

//           <div className="flex gap-2 justify-end">
//             <button
//               type="button"
//               onClick={onCancel}
//               className={`px-3 py-2 rounded border text-sm transition-colors
//                 ${currentTheme === 'dark' ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-3 py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg hover:brightness-110 disabled:opacity-60 transition"
//             >
//               {isSubmitting ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (!mswReady) {
//     return <div className="py-12 text-center text-sm text-muted-foreground">Loading…</div>;
//   }

//   return (
//     <section className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h2>
//         <button
//           className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 transition"
//           onClick={() => setShowNew(true)}
//         >
//           New Task
//         </button>
//       </div>

//       {status && <p className={`text-sm text-center ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{status}</p>}

//       {tasks.length === 0 ? (
//         <div className="rounded-lg p-8 text-center text-gray-400 dark:text-gray-500 bg-white/60 dark:bg-gray-800/60 shadow-lg">
//           No tasks yet. Create your first task.
//         </div>
//       ) : (
//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tasks.map((task) => (
//             <li
//               key={task.id}
//               className="relative rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold text-gray-900 dark:text-white truncate">{task.title}</h3>
//                 <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium select-none uppercase tracking-wide ${statusBadgeColors(task.status)}`}>
//                   <Circle size={14} />
//                   {task.status.replace('-', ' ')}
//                 </span>
//               </div>

//               <p className="text-sm text-gray-700 dark:text-gray-300 mb-6 line-clamp-3">{task.description}</p>

//               <div className="absolute bottom-4 right-4 flex gap-3">
//                 <button aria-label="Edit Task" onClick={() => setEditing(task)} className="rounded-full p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition">
//                   <Edit2 size={18} className="stroke-indigo-600 dark:stroke-indigo-300" />
//                 </button>
//                 <button aria-label="Delete Task" onClick={() => handleDelete(task.id)} className="rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-800 transition">
//                   <Trash2 size={18} className="stroke-red-600 dark:stroke-red-400" />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {showNew && <TaskDialogLocal onCancel={() => setShowNew(false)} onSubmit={handleCreate} />}
//       {editing && <TaskDialogLocal initial={editing} onCancel={() => setEditing(null)} onSubmit={handleEdit} />}
//     </section>
//   );
// }

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRecoilState } from 'recoil';
// import { tasksState, type Task } from '@/store/tasks';
// import { createTask, deleteTask, getTasks, updateTask } from './api';
// import { z } from 'zod';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { ensureMocks } from '@/lib/msw'; // Ensures MSW worker initialized
// import { Circle, Edit2, Trash2 } from 'lucide-react';
// import { useTheme } from 'next-themes';
// import Spinner from '@/components/loader';

// const schema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().default(''),
//   status: z.enum(['todo', 'in-progress', 'done']),
// });

// type FormInput = z.infer<typeof schema>;
// type FormOutput = z.output<typeof schema>;

// export default function TaskList() {
//   const { theme, systemTheme } = useTheme();
//   const currentTheme = theme === 'system' ? systemTheme : theme;

//   const [tasks, setTasks] = useRecoilState(tasksState);
//   const [showNew, setShowNew] = useState(false);
//   const [editing, setEditing] = useState<Task | null>(null);
//   const [status, setStatus] = useState('');
//   const [mswReady, setMswReady] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   // Initialize MSW on mount
//   useEffect(() => {
//     let mounted = true;
//     async function init() {
//       if (process.env.NODE_ENV === 'development') {
//         await ensureMocks();
//       }
//       if (mounted) setMswReady(true);
//     }
//     init();
//     return () => {
//       mounted = false;
//     };
//   }, []);

//   // Fetch tasks after MSW is ready and show loader for 2s for UX
//   useEffect(() => {
//     if (!mswReady) return;
//     setIsLoading(true);
//     getTasks()
//       .then((data) => {
//         setTasks(data);
//         setTimeout(() => setIsLoading(false), 2000);
//       })
//       .catch(() => {
//         setStatus('Failed to load tasks');
//         setIsLoading(false);
//       });
//   }, [mswReady, setTasks]);

//   async function handleCreate(values: FormOutput) {
//     setStatus('Creating task...');
//     const optimistic: Task = { id: crypto.randomUUID(), ...values };
//     setTasks((prev) => [optimistic, ...prev]);
//     setShowNew(false);
//     try {
//       const created = await createTask(values);
//       setTasks((prev) => [created, ...prev.filter((t) => t.id !== optimistic.id)]);
//       setStatus('Task created');
//     } catch {
//       setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
//       setStatus('Create failed');
//     }
//   }

//   async function handleEdit(values: FormOutput) {
//     if (!editing) return;
//     setStatus('Updating task...');
//     const id = editing.id;
//     const prev = [...tasks];
//     setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...values } : t)));
//     setEditing(null);
//     try {
//       const updated = await updateTask(id, values);
//       setTasks((cur) => cur.map((t) => (t.id === id ? updated : t)));
//       setStatus('Task updated');
//     } catch {
//       setTasks(prev);
//       setStatus('Update failed');
//     }
//   }

//   async function handleDelete(id: string) {
//     setStatus('Deleting task...');
//     const prev = [...tasks];
//     setTasks((cur) => cur.filter((t) => t.id !== id));
//     try {
//       await deleteTask(id);
//       setStatus('Task deleted');
//     } catch {
//       setTasks(prev);
//       setStatus('Delete failed');
//     }
//   }

//   function statusBadgeColors(status: Task['status']) {
//     switch (status) {
//       case 'todo':
//         return 'bg-gradient-to-r from-pink-400 to-pink-600 text-white';
//       case 'in-progress':
//         return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
//       case 'done':
//         return 'bg-gradient-to-r from-green-400 to-green-600 text-white';
//       default:
//         return 'bg-gray-400 text-white';
//     }
//   }

//   function TaskDialogLocal({
//     initial,
//     onSubmit,
//     onCancel,
//   }: {
//     initial?: Task;
//     onSubmit: (values: FormOutput) => Promise<void>;
//     onCancel: () => void;
//   }) {
//     const {
//       register,
//       handleSubmit,
//       formState: { errors, isSubmitting },
//     } = useForm<FormInput>({
//       resolver: zodResolver(schema),
//       defaultValues: initial
//         ? { title: initial.title, description: initial.description ?? '', status: initial.status }
//         : { title: '', description: '', status: 'todo' },
//     });

//     const onValid: SubmitHandler<FormInput> = async (vals) => {
//       const parsed = schema.parse(vals);
//       await onSubmit(parsed);
//     };

//     return (
//       <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
//         <form
//           onSubmit={handleSubmit(onValid)}
//           className={`w-full max-w-md rounded-lg border bg-background p-6 space-y-4 shadow-lg transition-colors ${
//             currentTheme === 'dark' ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'
//           }`}
//         >
//           <h2 className="text-xl font-semibold">{initial ? 'Edit Task' : 'New Task'}</h2>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Title</label>
//             <input
//               {...register('title')}
//               className={`w-full rounded border px-3 py-2 transition-colors ${
//                 currentTheme === 'dark' ? 'border-gray-600 bg-gray-800 placeholder-gray-400' : 'border-gray-300 bg-gray-50 placeholder-gray-500'
//               }`}
//             />
//             {errors.title && <p className="text-sm text-pink-600">{errors.title.message}</p>}
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Description</label>
//             <textarea
//               {...register('description')}
//               className={`w-full rounded border px-3 py-2 transition-colors ${
//                 currentTheme === 'dark' ? 'border-gray-600 bg-gray-800 placeholder-gray-400' : 'border-gray-300 bg-gray-50 placeholder-gray-500'
//               }`}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm font-medium">Status</label>
//             <select
//               {...register('status')}
//               className={`w-full rounded border px-3 py-2 transition-colors ${
//                 currentTheme === 'dark' ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
//               }`}
//             >
//               <option value="todo">Todo</option>
//               <option value="in-progress">In progress</option>
//               <option value="done">Done</option>
//             </select>
//           </div>

//           <div className="flex gap-2 justify-end">
//             <button
//               type="button"
//               onClick={onCancel}
//               className={`px-3 py-2 rounded border text-sm transition-colors ${
//                 currentTheme === 'dark' ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-3 py-2 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg hover:brightness-110 disabled:opacity-60 transition"
//             >
//               {isSubmitting ? 'Saving...' : 'Save'}
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   if (!mswReady || isLoading) {
//     return (
//       <div className="flex h-full w-full items-center justify-center">
//         <Spinner/>
//       </div>
//     );
//   }

//   return (
//     <section className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tasks</h2>
//         <button
//           className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 transition"
//           onClick={() => setShowNew(true)}
//         >
//           New Task
//         </button>
//       </div>

//       {status && <p className={`text-sm text-center ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{status}</p>}

//       {tasks.length === 0 ? (
//         <div className="rounded-lg p-8 text-center text-gray-400 dark:text-gray-500 bg-white/60 dark:bg-gray-800/60 shadow-lg">
//           No tasks available. Create some to get started.
//         </div>
//       ) : (
//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tasks.map((task) => (
//             <li
//               key={task.id}
//               className="relative rounded-xl p-6 shadow-lg border border-gray-200 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer dark:border-gray-800"
//             >
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold truncate text-gray-900 dark:text-white">{task.title}</h3>
//                 <span
//                   className={`inline-flex items-center gap-1 rounded-full px-3 py-1 select-none uppercase tracking-wide text-xs font-medium ${statusBadgeColors(
//                     task.status
//                   )}`}
//                 >
//                   <Circle size={14} />
//                   {task.status.replace('-', ' ')}
//                 </span>
//               </div>

//               <p className="text-sm line-clamp-3 mb-6 text-gray-700 dark:text-gray-300">{task.description}</p>

//               <div className="absolute bottom-4 right-4 flex gap-3">
//                 <button
//                   aria-label="Edit Task"
//                   onClick={() => setEditing(task)}
//                   className="rounded-full p-1 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition"
//                 >
//                   <Edit2 size={18} className="stroke-indigo-600 dark:stroke-indigo-300" />
//                 </button>

//                 <button
//                   aria-label="Delete Task"
//                   onClick={() => handleDelete(task.id)}
//                   className="rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-800 transition"
//                 >
//                   <Trash2 size={18} className="stroke-red-600 dark:stroke-red-400" />
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}

//       {showNew && <TaskDialogLocal onCancel={() => setShowNew(false)} onSubmit={handleCreate} />}
//       {editing && <TaskDialogLocal initial={editing} onCancel={() => setEditing(null)} onSubmit={handleEdit} />}
//     </section>
//   );
// }

'use client';

import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { tasksState, type Task } from '@/store/tasks';
import { createTask, deleteTask, getTasks, updateTask } from './api';
import { z } from 'zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ensureMocks } from '@/lib/msw';
import { Circle, Edit2, Trash2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import Spinner from '@/components/loader';
import { toast } from 'sonner';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  // default() returns a string at output, but accepts string | undefined at input
  description: z.string().default(''),
  status: z.enum(['todo', 'in-progress', 'done']),
});

// Use input/output types explicitly to satisfy RHF + Zod with default()
type FormInput = z.input<typeof schema>;   // { title: string; status: ...; description?: string | undefined }
type FormOutput = z.output<typeof schema>; // { title: string; status: ...; description: string }

export default function TaskList() {
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;

  const [tasks, setTasks] = useRecoilState(tasksState);
  const [showNew, setShowNew] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [status, setStatus] = useState('');
  const [mswReady, setMswReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Ensure MSW is ready before any fetch to prevent 404s/races
  useEffect(() => {
    let mounted = true;
    async function init() {
      if (process.env.NODE_ENV === 'development') {
        await ensureMocks();
      }
      if (mounted) setMswReady(true);
    }
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch after MSW is ready; show a 2s loader for a smooth “backend-like” feel
  useEffect(() => {
    if (!mswReady) return;
    setIsLoading(true);
    getTasks()
      .then((data) => {
        setTasks(data);
        setTimeout(() => setIsLoading(false), 2000);
      })
      .catch(() => {
        setStatus('Failed to load tasks');
        setIsLoading(false);
      });
  }, [mswReady, setTasks]);

  async function handleCreate(values: FormOutput) {
    setStatus('Creating task...');
    const optimistic: Task = { id: crypto.randomUUID(), ...values };
    setTasks((prev) => [optimistic, ...prev]);
    setShowNew(false);
    try {
      const created = await createTask(values);
      setTasks((prev) => [created, ...prev.filter((t) => t.id !== optimistic.id)]);
      setStatus('Task created');
      toast.success('Task created');
      
    } catch {
      setTasks((prev) => prev.filter((t) => t.id !== optimistic.id));
      setStatus('Create failed');
      toast.error('Create failed');
    }
  }

  async function handleEdit(values: FormOutput) {
    if (!editing) return;
    setStatus('Updating task...');
    const id = editing.id;
    const prev = [...tasks];
    setTasks((cur) => cur.map((t) => (t.id === id ? { ...t, ...values } : t)));
    setEditing(null);
    try {
      const updated = await updateTask(id, values);
      setTasks((cur) => cur.map((t) => (t.id === id ? updated : t)));
      setStatus('Task updated');
      toast.success('Task updated');
    } catch {
      setTasks(prev);
      setStatus('Update failed');
      toast.error('Update failed');
    }
  }

  async function handleDelete(id: string) {
    setStatus('Deleting task...');
    const prev = [...tasks];
    setTasks((cur) => cur.filter((t) => t.id !== id));
    try {
      await deleteTask(id);
      setStatus('Task deleted');
      toast.success('Task deleted');
    } catch {
      setTasks(prev);
      setStatus('Delete failed');
      toast.error('Delete failed');
    }
  }

  function statusBadgeColors(s: Task['status']) {
    switch (s) {
      case 'todo':
        return 'bg-gradient-to-r from-pink-500 to-rose-600 text-white';
      case 'in-progress':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white';
      case 'done':
        return 'bg-gradient-to-r from-emerald-400 to-green-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  }

  // Local dialog component with correct RHF + Zod typing
  function TaskDialogLocal({
    initial,
    onSubmit,
    onCancel,
  }: {
    initial?: Task;
    onSubmit: (values: FormOutput) => Promise<void>;
    onCancel: () => void;
  }) {
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<FormInput>({
      resolver: zodResolver(schema),
      defaultValues: initial
        ? { title: initial.title, description: initial.description ?? '', status: initial.status }
        : { title: '', description: '', status: 'todo' },
    });

    // RHF expects SubmitHandler<FormInput>; transform to FormOutput with schema.parse
    const onValid: SubmitHandler<FormInput> = async (vals) => {
      const parsed = schema.parse(vals); // parsed is FormOutput
      await onSubmit(parsed);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit(onValid)}
          className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-xl transition-colors ${
            currentTheme === 'dark'
              ? 'border-gray-700 bg-gray-900 text-white'
              : 'border-gray-200 bg-white text-gray-900'
          }`}
        >
          <h2 className="text-xl font-bold">
            {initial ? 'Edit Task' : 'New Task'}
          </h2>

          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <input
              {...register('title')}
              className={`w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                currentTheme === 'dark'
                  ? 'border-gray-600 bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500'
                  : 'border-gray-300 bg-gray-50 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400'
              }`}
              placeholder="e.g., Plan sprint"
            />
            {errors.title && (
              <p className="text-xs text-rose-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...register('description')}
              className={`w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                currentTheme === 'dark'
                  ? 'border-gray-600 bg-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500'
                  : 'border-gray-300 bg-gray-50 placeholder-gray-500 focus:ring-2 focus:ring-indigo-400'
              }`}
              rows={3}
              placeholder="Optional details…"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              {...register('status')}
              className={`w-full rounded-lg border px-3 py-2 outline-none transition-colors ${
                currentTheme === 'dark'
                  ? 'border-gray-600 bg-gray-800 focus:ring-2 focus:ring-indigo-500'
                  : 'border-gray-300 bg-gray-50 focus:ring-2 focus:ring-indigo-400'
              }`}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className={`px-3 py-2 rounded-lg text-sm transition-colors border ${
                currentTheme === 'dark'
                  ? 'border-gray-600 hover:bg-gray-800'
                  : 'border-gray-300 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md hover:brightness-110 active:scale-95 disabled:opacity-60 transition"
            >
              {isSubmitting ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (!mswReady || isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2
          className={`text-4xl font-extrabold tracking-tight ${
            currentTheme === 'dark'
              ? 'text-white'
              : 'text-gray-900'
          }`}
        >
          Tasks
        </h2>
        <button
          className={`px-4 py-2 rounded-lg shadow-md transition ${
            currentTheme === 'dark'
              ? 'bg-white text-gray-900 hover:bg-gray-200'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
          onClick={() => setShowNew(true)}
        >
          New Task
        </button>
      </div>

      {/* {status && (
        <p
          className={`text-sm text-center ${
            currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
        >
          {status}
        </p>
      )} */}

      {tasks.length === 0 ? (
        <div
          className={`rounded-xl p-10 text-center shadow-md ${
            currentTheme === 'dark'
              ? 'bg-gray-900/70 border border-gray-800 text-gray-400'
              : 'bg-white/80 border border-gray-200 text-gray-500'
          }`}
        >
          No tasks yet. Create your first task.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={`relative rounded-2xl p-6 border shadow-lg transition-all hover:shadow-xl hover:scale-[1.015] ${
                currentTheme === 'dark'
                  ? 'border-gray-800 bg-gray-900/80'
                  : 'border-gray-200 bg-white/90'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3
                  className={`font-semibold leading-snug truncate ${
                    currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}
                  title={task.title}
                >
                  {task.title}
                </h3>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold leading-none select-none uppercase tracking-wide 
                    border 
                    ${
                      currentTheme === 'dark' 
                        ? 'border-transparent shadow-none bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 text-white' 
                        : 'border-gray-300 shadow-sm bg-gradient-to-r from-yellow-400 via-yellow-600 to-orange-500 '
                    }
                  `}
                >
                  <Circle className={currentTheme === 'dark' ? 'stroke-white' : 'stroke-pink-50'} size={14} />
                  {task.status.replace('-', ' ')}
                </span>

              </div>

              <p
                className={`text-sm line-clamp-3 mb-8 ${
                  currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {task.description}
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  aria-label="Edit Task"
                  onClick={() => setEditing(task)}
                  className={`rounded-lg px-3 py-2 text-sm border transition ${
                    currentTheme === 'dark'
                      ? 'border-indigo-700 text-indigo-300 hover:bg-indigo-900/40'
                      : 'border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Edit2 size={16} /> Edit
                  </span>
                </button>

                <button
                  aria-label="Delete Task"
                  onClick={() => handleDelete(task.id)}
                  className={`rounded-lg px-3 py-2 text-sm border transition ${
                    currentTheme === 'dark'
                      ? 'border-rose-800 text-rose-300 hover:bg-rose-900/40'
                      : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Trash2 size={16} /> Delete
                  </span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showNew && (
        <TaskDialogLocal
          onCancel={() => setShowNew(false)}
          onSubmit={handleCreate}
        />
      )}
      {editing && (
        <TaskDialogLocal
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={handleEdit}
        />
      )}
    </section>
  );
}
