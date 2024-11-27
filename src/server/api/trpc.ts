import superjson from 'superjson';
import { ZodError } from 'zod';
import { initTRPC } from '@trpc/server';

export const t = initTRPC
  .context()
  .meta()
  .create({
    defaultMeta: {
      allowAnonymousSC: false,
    },
    errorFormatter({ error, shape }) {
      return {
        ...shape,
        data: {
          ...shape.data,
          zodError: error.cause instanceof ZodError ? error.cause.flatten() : undefined,
        },
      };
    },
    transformer: superjson,
  });

export type InitTRPCCreate = typeof t;

export const { createCallerFactory } = t;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;