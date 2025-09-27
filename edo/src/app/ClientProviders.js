"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
// ThemeProvider import removed

export default function ClientProviders({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
            retry: 2, // Reduce retries from default 3
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 5000), // Max 5s delay
            refetchOnWindowFocus: false, // Disable refetch on window focus
            refetchOnMount: false, // Only refetch if data is stale
          },
        },
      })
  );

  return (
    // ThemeProvider removed
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
