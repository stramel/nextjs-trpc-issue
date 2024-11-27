import { setTimeout } from "timers/promises";
import { z } from "zod";
import { createCallerFactory, createTRPCRouter, publicProcedure } from "./trpc";

export const countRef = { current: 0 };

const routers = {
  greeting: publicProcedure
    .input(
      z.object({
        name: z.string().nullish(),
      }).nullish(),
    )
    .query(async ({ input }) => {
      countRef.current += 1;
      console.debug('[DEBUG] Increased count to:', countRef.current);
      // Artificial delay
      await setTimeout(1000);
      // This is what you're returning to your client
      return {
        text: `hello ${input?.name ?? 'world'}`,
        count: countRef.current,
      };
    }),
} satisfies Parameters<typeof createTRPCRouter>[0];

export const appRouter = createTRPCRouter(routers);

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
