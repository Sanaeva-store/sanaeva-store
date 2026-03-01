"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Search, Bell, ChevronDown, User, Settings, CreditCard, LogOut, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { useBackofficeTranslations, useLocale } from "@/shared/lib/i18n"
import { LanguageSwitcher } from "@/components/common/language-switcher"
import { useBackofficeMeQuery } from "@/features/inventory/hooks/use-backoffice-auth"
import { useSignOutMutation } from "@/features/account/hooks/use-auth"

export function AdminNavbar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const locale = useLocale()
  const { t } = useBackofficeTranslations("navbar")
  const { data: me } = useBackofficeMeQuery()
  const signOutMutation = useSignOutMutation()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const userDisplayName = me?.name ?? t("name")
  const userDisplayEmail = me?.email ?? t("email")
  const userDisplayRole = me?.roles?.[0] ?? t("role")

  const onSignOut = () => {
    signOutMutation.mutate(undefined, {
      onSuccess: () => router.replace(`/${locale}`),
      onError: () => router.replace(`/${locale}`),
    })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
      </div>

      <div className="flex flex-1 items-center gap-4">
        <div className="relative max-w-xl flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="h-10 w-full bg-muted/50 pl-10 pr-4 transition-colors focus:bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher />

        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && (
            <>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">{t("toggleTheme")}</span>
            </>
          )}
        </Button>

        <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
          <Bell className="h-5 w-5" />
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
            3
          </Badge>
          <span className="sr-only">{t("notifications")}</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-10 gap-2 px-3">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/avatars/shadcn.jpg" alt={userDisplayName} />
                <AvatarFallback className="bg-primary text-xs text-primary-foreground">AD</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col items-start text-sm md:flex">
                <span className="font-medium">{userDisplayName}</span>
                <span className="text-xs text-muted-foreground">{userDisplayRole}</span>
              </div>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/avatars/shadcn.jpg" alt={userDisplayName} />
                  <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold">{userDisplayName}</p>
                  <p className="text-xs text-muted-foreground">{userDisplayEmail}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{t("profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>{t("settings")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer gap-2">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span>{t("billing")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 text-destructive"
              disabled={signOutMutation.isPending}
              onSelect={(event) => {
                event.preventDefault()
                onSignOut()
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>{signOutMutation.isPending ? `${t("logout")}...` : t("logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
