// 'use client';

// import { z } from 'zod';
// import { useForm, type SubmitHandler } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import type { Task } from '@/store/tasks';

// // Description defaults to '' but accepts undefined as input, returns string as output
// const schema = z.object({
//   title: z.string().min(1, 'Title is required'),
//   description: z.string().default(''),
//   status: z.enum(['todo', 'in-progress', 'done']),
// });

// // RHF should use the INPUT type of the schema
// type FormInput = z.input<typeof schema>;   // { title: string; status: ...; description?: string | undefined }
// type FormOutput = z.output<typeof schema>; // { title: string; status: ...; description: string }

// type Props = {
//   initial?: Task;
//   onSubmit: (values: FormOutput) => Promise<void>;
//   onCancel: () => void;
// };

// export default function TaskDialog({ initial, onSubmit, onCancel }: Props) {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormInput>({
//     resolver: zodResolver(schema),
//     defaultValues: initial
//       ? {
//           title: initial.title,
//           description: initial.description ?? '',
//           status: initial.status,
//         }
//       : { title: '', description: '', status: 'todo' },
//   });

//   // Ensure handleSubmit infers the same input type; convert to output for parent
//   const onValid: SubmitHandler<FormInput> = async (vals) => {
//     const parsed = schema.parse(vals); // parsed is FormOutput
//     await onSubmit(parsed);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
//       <form
//         onSubmit={handleSubmit(onValid)}
//         className="w-full max-w-md rounded-lg border bg-background p-6 space-y-4"
//       >
//         <h2 className="text-xl font-semibold">{initial ? 'Edit Task' : 'New Task'}</h2>

//         <div className="space-y-2">
//           <label className="text-sm font-medium">Title</label>
//           <input {...register('title')} className="w-full rounded border px-3 py-2" />
//           {errors.title && (
//             <p className="text-sm text-red-600">{errors.title.message}</p>
//           )}
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium">Description</label>
//           <textarea {...register('description')} className="w-full rounded border px-3 py-2" />
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm font-medium">Status</label>
//           <select {...register('status')} className="w-full rounded border px-3 py-2">
//             <option value="todo">Todo</option>
//             <option value="in-progress">In progress</option>
//             <option value="done">Done</option>
//           </select>
//         </div>

//         <div className="flex gap-2">
//           <button type="button" onClick={onCancel} className="px-3 py-2 rounded border text-sm">
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="px-3 py-2 rounded bg-black text-white dark:bg-white dark:text-black text-sm disabled:opacity-50"
//           >
//             {isSubmitting ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
