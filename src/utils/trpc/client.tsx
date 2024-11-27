'use client';

import type { ReactNode } from 'react';
import { useMemo } from 'react';
import transformer from 'superjson';
import { AppRouter } from '~/server/api/root';
import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import {
  loggerLink,
  TRPCClientError,
  TRPCLink,
  unstable_httpBatchStreamLink
} from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { observable } from '@trpc/server/observable';
import { createQueryClient } from '../react-query';
import { endpoint } from './shared';

let clientQueryClientSingleton: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === 'undefined' || process.env['USE_SINGLETON_QUERY_CLIENT'] === 'false') {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= createQueryClient());
};

function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // In the browser, we return a relative URL
    return '';
  }
  // When rendering on the server, we return an absolute URL

  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  const trpcClient = useMemo(() => {
    const url = getBaseUrl() + endpoint;
    const links: TRPCLink<any>[] = [
      // Prevent server-side fetches
      () =>
        ({ next, op }) =>
          observable((observer) => {
            if (typeof window === 'undefined') {
              // If this happens, it means that a `useSuspenseQuery()` was called somewhere in the React-tree while server-side rendering
              const message = `Tried fetching ${op.path} while server-side rendering. Did you forget to add a prefetch? (eg. \`void api.${op.path}.prefetch()\`)`;
              console.warn(message);
              observer.error(new TRPCClientError(message));
              return;
            }
            return next(op).subscribe(observer);
          }),
      loggerLink({
        enabled: (op) =>
          process.env.NODE_ENV === 'development' ||
          (op.direction === 'down' && op.result instanceof Error),
      }),
      unstable_httpBatchStreamLink({
        headers: () => {
          const parameters = new URLSearchParams(window.location.search);
          const headers = new Headers();
          headers.set('x-trpc-source', 'nextjs-react');
          headers.set('x-trpc-token', parameters.get('token') ?? '');
          return headers;
        },
        transformer,
        url,
      }),
    ];
    return api.createClient({ links });
  }, []);

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </api.Provider>
  );
}
