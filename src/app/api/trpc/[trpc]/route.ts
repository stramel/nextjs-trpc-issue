import { NextRequest } from 'next/server';
import { appRouter } from '~/server/api/root';
import { endpoint } from '~/utils/trpc/shared';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

function handler(request: NextRequest) {
  return fetchRequestHandler({
    createContext: () => ({ headers: request.headers }),
    endpoint,
    req: request,
    router: appRouter,
  });
}

export const GET = handler;
export const POST = handler;
