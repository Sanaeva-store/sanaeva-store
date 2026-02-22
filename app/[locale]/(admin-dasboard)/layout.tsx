"use client"

import * as React from "react"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/components-design/admin-sidebar"
import { AdminNavbar } from "@/components/components-design/admin-navbar"
import { Separator } from "@/components/ui/separator"

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen={false} data-theme-domain="backoffice">
      <AdminSidebar />
      <SidebarInset>
        <AdminNavbar />
        <Separator />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}