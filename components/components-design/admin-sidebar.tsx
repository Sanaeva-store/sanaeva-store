"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

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
  ClipboardList,
  Tag,
  TicketPercent,
  TrendingUp,
  Camera,
  RotateCcw,
  Skull,
  DollarSign,
  AlertCircle,
  ArrowLeftRight,
  ScanLine,
  List,
  Shield,
  ScrollText,
  CheckSquare,
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
import { useBackofficeMeQuery } from "@/features/inventory/hooks/use-backoffice-auth"
import { useSignOutMutation } from "@/features/account/hooks/use-auth"
import { hasAnyRole, getRequiredBackofficeRoles } from "@/shared/lib/auth/backoffice-rbac"

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
    ],
  },
  {
    titleKey: "groups.purchasing",
    items: [
      { titleKey: "items.suppliers", url: "/admin-dasboard/purchasing/suppliers", icon: Truck },
      { titleKey: "items.purchaseOrders", url: "/admin-dasboard/purchasing/purchase-orders", icon: ClipboardList },
    ],
  },
  {
    titleKey: "groups.orders",
    items: [
      { titleKey: "items.orderList", url: "/admin-dasboard/orders", icon: ShoppingCart },
    ],
  },
  {
    titleKey: "groups.promotions",
    items: [
      { titleKey: "items.promotionList", url: "/admin-dasboard/promotions", icon: TicketPercent },
      { titleKey: "items.couponValidate", url: "/admin-dasboard/promotions/validate-coupon", icon: Tag },
    ],
  },
  {
    titleKey: "groups.reports",
    items: [
      { titleKey: "items.reportLowStock", url: "/admin-dasboard/reports/low-stock", icon: TrendingDown },
      { titleKey: "items.reportSnapshot", url: "/admin-dasboard/reports/snapshot", icon: Camera },
      { titleKey: "items.reportTurnover", url: "/admin-dasboard/reports/turnover", icon: TrendingUp },
      { titleKey: "items.reportAging", url: "/admin-dasboard/reports/aging", icon: RotateCcw },
      { titleKey: "items.reportDeadStock", url: "/admin-dasboard/reports/dead-stock", icon: Skull },
      { titleKey: "items.reportProfit", url: "/admin-dasboard/reports/profit", icon: DollarSign },
      { titleKey: "items.reportPriceCost", url: "/admin-dasboard/reports/price-cost-anomalies", icon: AlertCircle },
    ],
  },
  {
    titleKey: "groups.stockControl",
    items: [
      { titleKey: "items.stockTransfers", url: "/admin-dasboard/stock-control/transfers", icon: ArrowLeftRight },
      { titleKey: "items.cycleCount", url: "/admin-dasboard/stock-control/cycle-count", icon: ScanLine },
    ],
  },
  {
    titleKey: "groups.pricing",
    items: [
      { titleKey: "items.priceLists", url: "/admin-dasboard/pricing/price-lists", icon: List },
    ],
  },
  {
    titleKey: "groups.adminSecurity",
    items: [
      { titleKey: "items.adminUsers", url: "/admin-dasboard/admin/users", icon: Shield },
      { titleKey: "items.auditLogs", url: "/admin-dasboard/admin/audit-logs", icon: ScrollText },
      { titleKey: "items.approvals", url: "/admin-dasboard/admin/approvals", icon: CheckSquare },
    ],
  },
  {
    titleKey: "groups.management",
    items: [
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
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const { t } = useBackofficeTranslations("sidebar")
  const { data: me } = useBackofficeMeQuery()
  const signOutMutation = useSignOutMutation()

  const toLocaleUrl = (url: string) => `/${locale}${url}`
  const userRoles = me?.roles ?? []

  const canAccess = (url: string) => {
    const requiredRoles = getRequiredBackofficeRoles(url)
    if (!requiredRoles) return true
    return hasAnyRole(userRoles, requiredRoles)
  }

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
                {group.items.filter((item) => canAccess(item.url)).map((item) => {
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
                    <AvatarImage src="/avatars/shadcn.jpg" alt={me?.name ?? t("account.name")} />
                    <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold">{me?.name ?? t("account.name")}</span>
                    <span className="truncate text-xs text-muted-foreground">{me?.email ?? t("account.email")}</span>
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
                      <AvatarImage src="/avatars/shadcn.jpg" alt={me?.name ?? t("account.name")} />
                      <AvatarFallback className="rounded-lg">AD</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{me?.name ?? t("account.name")}</span>
                      <span className="truncate text-xs text-muted-foreground">{me?.email ?? t("account.email")}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 size-4" />
                  {t("account.accountSettings")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={signOutMutation.isPending}
                  onSelect={(event) => {
                    event.preventDefault()
                    signOutMutation.mutate(undefined, {
                      onSuccess: () => router.replace(`/${locale}`),
                      onError: () => router.replace(`/${locale}`),
                    })
                  }}
                >
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
