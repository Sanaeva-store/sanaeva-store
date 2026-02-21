"use client";

import type { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Package, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const accountNavItems = [
  {
    title: "Profile",
    href: "/account",
    icon: User,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function UserAccountShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Account</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation */}
          <aside className="space-y-1">
            <nav className="flex flex-col gap-1">
              {accountNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === `/(user)${item.href}`;
                
                return (
                  <Link
                    key={item.href}
                    href={`/(user)${item.href}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-4">
              <Button variant="ghost" className="w-full justify-start gap-3">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="rounded-lg border bg-card p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
