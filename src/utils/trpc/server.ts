import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import { AppRouter, createCaller } from '~/server/api/root';
import { createHydrationHelpers } from '@trpc/react-query/rsc';
import { createQueryClient } from '../react-query';

const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');
  return {
    headers: heads,
  };
});

const getQueryClient = cache(createQueryClient);

const caller = createCaller(createContext);

export const { HydrateClient, trpc: api } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
