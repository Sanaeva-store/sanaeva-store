"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Home,
  ShoppingCart,
  Package,
  Users,
  Settings,
  FileText,
  BarChart3,
  LogOut,
  Warehouse,
  PackagePlus,
  PackageMinus,
  TrendingDown,
  History,
  Truck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useBackofficeTranslations, useLocale } from "@/shared/lib/i18n"

type MenuItem = {
  titleKey: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

type MenuGroup = {
  titleKey: string
  items: MenuItem[]
}

const menuItems: MenuGroup[] = [
  {
    titleKey: "groups.overview",
    items: [
      { titleKey: "items.dashboard", url: "/admin-dasboard", icon: Home },
      { titleKey: "items.analytics", url: "/admin-dasboard/analytics", icon: BarChart3 },
    ],
  },
  {
    titleKey: "groups.inventory",
    items: [
      { titleKey: "items.inventoryDashboard", url: "/admin-dasboard/inventory/dashboard", icon: Warehouse },
      { titleKey: "items.productSku", url: "/admin-dasboard/inventory/products", icon: Package },
      { titleKey: "items.initialStock", url: "/admin-dasboard/inventory/initial-stock", icon: PackagePlus },
      { titleKey: "items.adjustment", url: "/admin-dasboard/inventory/adjustment", icon: PackageMinus },
      { titleKey: "items.receiving", url: "/admin-dasboard/inventory/receiving", icon: Truck },
      { titleKey: "items.lowStock", url: "/admin-dasboard/inventory/low-stock", icon: TrendingDown },
      { titleKey: "items.transactions", url: "/admin-dasboard/inventory/transactions", icon: History },
      { titleKey: "items.suppliers", url: "/admin-dasboard/inventory/suppliers", icon: Users },
    ],
  },
  {
    titleKey: "groups.management",
    items: [
      { titleKey: "items.orders", url: "/admin-dasboard/order-management", icon: ShoppingCart },
      { titleKey: "items.customers", url: "/admin-dasboard/customers", icon: Users },
    ],
  },
  {
    titleKey: "groups.settings",
    items: [
      { titleKey: "items.general", url: "/admin-dasboard/settings/general", icon: Settings },
      { titleKey: "items.reports", url: "/admin-dasboard/settings/reports", icon: FileText },
    ],
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const locale = useLocale()
  const { t } = useBackofficeTranslations("sidebar")

  const toLocaleUrl = (url: string) => `/${locale}${url}`

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/80 shadow-sm">
            <div className="absolute inset-0 rounded-lg bg-primary/20 blur-sm" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="relative h-5 w-5 text-primary-foreground"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.9" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">Sanaeva</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.titleKey}>
            <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const localizedUrl = toLocaleUrl(item.url)
                  const isActive = pathname === localizedUrl

                  return (
                    <SidebarMenuItem key={item.titleKey}>
                      <SidebarMenuButton asChild isActive={isActive} tooltip={t(item.titleKey)}>
                        <Link href={localizedUrl}>
                          <item.icon className="size-4" />
                          <span>{t(item.titleKey)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src="/avatars/shadcn.jpg" alt={t("account.name")} />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{t("account.name")}</span>
                    <span className="truncate text-xs text-muted-foreground">{t("account.email")}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src="/avatars/shadcn.jpg" alt={t("account.name")} />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{t("account.name")}</span>
                      <span className="truncate text-xs text-muted-foreground">{t("account.email")}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  {t("account.accountSettings")}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 size-4" />
                  {t("account.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
