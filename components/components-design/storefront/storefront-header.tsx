"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User as UserIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/shared/lib/i18n";
import { useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartTotals } from "@/features/cart/store/cart.selectors";

export function StorefrontHeader() {
  const locale = useLocale();
  const { totalItems } = useCartTotals();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dict = useMemo(
    () => ({
      nav: {
        home: locale === "th" ? "หน้าแรก" : "Home",
        shop: locale === "th" ? "ร้านค้า" : "Shop",
        collections: locale === "th" ? "คอลเลกชัน" : "Collections",
        ourStory: locale === "th" ? "เรื่องราวของเรา" : "Our Story",
        search: locale === "th" ? "ค้นหาสินค้า..." : "Search products...",
        account: locale === "th" ? "บัญชี" : "Account",
        cart: locale === "th" ? "ตะกร้า" : "Cart",
      },
      brand: "Sanaeva",
    }),
    [locale]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-accent hover:text-accent-foreground transition-all"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open main menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] sm:w-[400px] px-0">
              <SheetHeader className="px-6 pt-6">
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 px-4 pt-4">
                <Link
                  href={`/${locale}`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dict.nav.home}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dict.nav.shop}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dict.nav.collections}
                </Link>
                <Link
                  href={`/${locale}/products`}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {dict.nav.ourStory}
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Logo - Center */}
        <div className="flex flex-1 items-center justify-center lg:hidden">
          <Link href={`/${locale}`} className="flex items-center space-x-2 transition-transform hover:scale-105 duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
              <span className="text-sm font-bold">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">{dict.brand}</span>
          </Link>
        </div>

        {/* Spacer for mobile */}
        <div className="flex items-center w-10 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 hover:scale-105"
            asChild
          >
            <Link href={`/${locale}/cart`}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-bold text-primary-foreground ring-2 ring-background shadow-md animate-in zoom-in-50 duration-200">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">{dict.nav.cart}</span>
            </Link>
          </Button>
        </div>

        {/* Logo & Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href={`/${locale}`} className="flex items-center space-x-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
              <span className="text-base font-bold">S</span>
            </div>
            <span className="font-bold text-lg tracking-tight">{dict.brand}</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm font-medium">
            <Link
              href={`/${locale}`}
              className="relative px-4 py-2.5 transition-all duration-200 text-foreground rounded-lg hover:bg-accent/80 hover:text-foreground font-medium"
            >
              {dict.nav.home}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="relative px-4 py-2.5 transition-all duration-200 text-foreground/70 rounded-lg hover:bg-accent/80 hover:text-foreground"
            >
              {dict.nav.shop}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="relative px-4 py-2.5 transition-all duration-200 text-foreground/70 rounded-lg hover:bg-accent/80 hover:text-foreground"
            >
              {dict.nav.collections}
            </Link>
            <Link
              href={`/${locale}/products`}
              className="relative px-4 py-2.5 transition-all duration-200 text-foreground/70 rounded-lg hover:bg-accent/80 hover:text-foreground"
            >
              {dict.nav.ourStory}
            </Link>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-3 ml-auto">
          {/* Search */}
          <div className="hidden md:block w-auto md:flex-none">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-200" />
              <Input
                type="search"
                placeholder={dict.nav.search}
                className="h-10 pl-10 pr-4 w-[200px] lg:w-[280px] rounded-full border-border/60 bg-muted/30 focus:bg-background focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Account & Cart - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href={`/${locale}/auth/signin`}>
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">{dict.nav.account}</span>
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 rounded-full hover:bg-accent/80 hover:text-accent-foreground transition-all duration-200 hover:scale-105"
              asChild
            >
              <Link href={`/${locale}/cart`}>
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-[10px] font-bold text-primary-foreground ring-2 ring-background shadow-md animate-in zoom-in-50 duration-200">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">{dict.nav.cart}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
