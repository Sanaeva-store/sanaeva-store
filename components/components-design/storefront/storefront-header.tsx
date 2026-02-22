"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Menu, User, LogOut, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { useLocale } from "@/shared/lib/i18n";
import { useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCartTotals } from "@/features/cart/store/cart.selectors";
import { useCurrentUserQuery, useSignOutMutation } from "@/features/account/hooks/use-auth";

export function StorefrontHeader() {
  const router = useRouter();
  const locale = useLocale();
  const { totalItems } = useCartTotals();
  const { data: user, isLoading } = useCurrentUserQuery();
  const { mutate: signOut, isPending: isSigningOut } = useSignOutMutation();

  const dict = useMemo(() => ({
    nav: {
      home: locale === "th" ? "หน้าแรก" : "Home",
      products: locale === "th" ? "สินค้า" : "Products",
      account: locale === "th" ? "บัญชีของฉัน" : "My Account",
      orders: locale === "th" ? "คำสั่งซื้อของฉัน" : "My Orders",
      signin: locale === "th" ? "เข้าสู่ระบบ" : "Sign In",
      signout: locale === "th" ? "ออกจากระบบ" : "Sign Out",
      accountSettings: locale === "th" ? "ตั้งค่าบัญชี" : "Account Settings",
      cart: locale === "th" ? "ตรวจสอบตะกร้า" : "Cart",
      items: locale === "th" ? "รายการ" : "items",
    },
  }), [locale]);

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => router.push(`/${locale}`),
    });
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="flex flex-col gap-4 pt-4">
              <Link href={`/${locale}`} className="text-lg font-semibold">
                {dict.nav.home}
              </Link>
              <Link href={`/${locale}/products`} className="text-lg">
                {dict.nav.products}
              </Link>
              {user && (
                <>
                  <Link href={`/${locale}/account`} className="text-lg">
                    {dict.nav.account}
                  </Link>
                  <Link href={`/${locale}/orders`} className="text-lg">
                    {dict.nav.orders}
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center space-x-2">
          <span className="text-xl font-bold">Sanaeva</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-6">
          <Link
            href={`/${locale}/products`}
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            {dict.nav.products}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />
          {/* Account */}
          {isLoading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Account menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-normal">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/account`}>
                    <Settings className="mr-2 h-4 w-4" />
                    {dict.nav.accountSettings}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/orders`}>
                    <Package className="mr-2 h-4 w-4" />
                    {dict.nav.orders}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {dict.nav.signout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/${locale}/auth/signin`}>
                <User className="mr-2 h-4 w-4" />
                {dict.nav.signin}
              </Link>
            </Button>
          )}

          {/* Cart */}
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href={`/${locale}/cart`}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="sr-only">{dict.nav.cart} ({totalItems} {dict.nav.items})</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
