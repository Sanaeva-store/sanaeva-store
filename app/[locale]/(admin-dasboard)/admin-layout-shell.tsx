"use client";

import type { PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/components-design/admin-sidebar";
import { AdminNavbar } from "@/components/components-design/admin-navbar";
import { Separator } from "@/components/ui/separator";

export function AdminLayoutShell({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen={false} data-theme-domain="backoffice">
      <AdminSidebar />
      <SidebarInset>
        <AdminNavbar />
        <Separator />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
