'use client';

import { TRPCReactProvider } from "~/utils/trpc/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ClientProviders({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <TRPCReactProvider>
      {children}
      <ReactQueryDevtools />
    </TRPCReactProvider>
  );
}
