"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartItems, useCartTotals, useCartActions } from "@/features/cart/store/cart.selectors";
import { useLocale, formatCurrency } from "@/shared/lib/i18n";
import { useMemo } from "react";

export default function CartPage() {
  const locale = useLocale();
  const cartItems = useCartItems();
  const { subtotal, totalItems } = useCartTotals();
  const { removeItem, updateQuantity } = useCartActions();

  const dict = useMemo(() => ({
    cart: {
      title: locale === "th" ? "ตะกร้าสินค้า" : "Shopping Cart",
      empty: locale === "th" ? "ตะกร้าสินค้าว่างเปล่า" : "Your cart is empty",
      continueShopping: locale === "th" ? "เลือกซื้อสินค้าต่อ" : "Continue Shopping",
      checkout: locale === "th" ? "ชำระเงิน" : "Checkout",
      subtotal: locale === "th" ? "ยอดรวมสินค้า" : "Subtotal",
      shipping: locale === "th" ? "ค่าจัดส่ง" : "Shipping",
      total: locale === "th" ? "ยอดรวมทั้งหมด" : "Total",
      free: locale === "th" ? "ฟรี" : "Free",
      freeShippingNote: locale === "th" ? "จัดส่งฟรีสำหรับคำสั่งซื้อมากกว่า ฿1,000" : "Free shipping on orders over $30",
      itemSubtotal: locale === "th" ? "ยอดรวม" : "Subtotal",
      items: locale === "th" ? "รายการ" : "Cart Items",
      addProducts: locale === "th" ? "เพิ่มสินค้าเพื่อเริ่มต้น" : "Add some products to get started",
    },
  }), [locale]);

  const shipping = subtotal > 1000 ? 0 : 100;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">{dict.cart.empty}</h1>
          <p className="text-muted-foreground">{dict.cart.addProducts}</p>
          <Button asChild>
            <Link href={`/${locale}/products`}>{dict.cart.continueShopping}</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{dict.cart.title} ({totalItems})</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{dict.cart.items} ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.itemId}>
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border bg-muted">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-xs text-muted-foreground">No image</p>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold">{item.productName}</h3>
                        <p className="mt-1 font-semibold">
                          {formatCurrency(item.unitPrice, locale)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {dict.cart.itemSubtotal}: {formatCurrency(item.unitPrice * item.quantity, locale)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.itemId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="flex h-8 w-12 items-center justify-center rounded-md border text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.itemId, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.itemId)}
                      aria-label={`Remove ${item.productName}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>{locale === "th" ? "สรุปคำสั่งซื้อ" : "Order Summary"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{dict.cart.subtotal}</span>
                  <span>{formatCurrency(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{dict.cart.shipping}</span>
                  <span>{shipping === 0 ? dict.cart.free : formatCurrency(shipping, locale)}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">{dict.cart.freeShippingNote}</p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>{dict.cart.total}</span>
                  <span>{formatCurrency(total, locale)}</span>
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <Link href={`/${locale}/checkout`}>{dict.cart.checkout}</Link>
              </Button>

              <Button variant="outline" className="w-full" asChild>
                <Link href={`/${locale}/products`}>{dict.cart.continueShopping}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
