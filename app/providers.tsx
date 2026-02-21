"use client";

import type { PropsWithChildren } from "react";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { AppQueryProvider } from "@/shared/lib/query/query-client";

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AppQueryProvider>{children}</AppQueryProvider>
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
}
