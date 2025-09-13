'use client';
import { atom } from 'recoil';

export const authTokenState = atom<string | null>({
  key: 'authToken',
  default: null,
});
