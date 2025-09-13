'use client';
import { atom, selector } from 'recoil';

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
};

export const tasksState = atom<Task[]>({
  key: 'tasks',
  default: [],
});

export const doneCountState = selector<number>({
  key: 'doneCount',
  get: ({ get }) => get(tasksState).filter(t => t.status === 'done').length,
});
