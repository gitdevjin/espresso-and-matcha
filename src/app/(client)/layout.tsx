"use client";

import SessionProvider from "@/provider/session-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <SessionProvider>{children}</SessionProvider>
    </QueryClientProvider>
  );
}
