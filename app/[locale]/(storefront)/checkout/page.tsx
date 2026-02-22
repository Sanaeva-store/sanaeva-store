"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { AlertCircle, CheckCircle2, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useCartItems, useCartTotals, useCartActions } from "@/features/cart/store/cart.selectors";
import { usePlaceOrderMutation } from "@/features/storefront/hooks/use-checkout";
import type { PaymentMethod, ShippingAddress } from "@/features/storefront/api/checkout.api";

const STEPS = ["shipping", "payment", "review"] as const;
type Step = (typeof STEPS)[number];

const STEP_LABELS: Record<Step, string> = {
  shipping: "Shipping",
  payment: "Payment",
  review: "Review",
};

const shippingSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(9, "Invalid phone number"),
  address: z.string().min(5, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postalCode: z.string().min(5, "Invalid postal code"),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

const PAYMENT_OPTIONS: Array<{ value: PaymentMethod; label: string }> = [
  { value: "card", label: "Credit / Debit Card" },
  { value: "promptpay", label: "PromptPay" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartItems();
  const { subtotal } = useCartTotals();
  const { clearCart } = useCartActions();
  const { mutate: placeOrder, isPending, error, isSuccess } = usePlaceOrderMutation();

  const [step, setStep] = useState<Step>("shipping");
  const [shippingData, setShippingData] = useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");

  const idempotencyKey = useRef(crypto.randomUUID());
  const submitGuard = useRef(false);

  const shipping = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
  });

  const onShippingSubmit = (values: ShippingFormValues) => {
    setShippingData({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      phone: values.phone,
      address: values.address,
      city: values.city,
      state: values.state,
      postalCode: values.postalCode,
    });
    setStep("payment");
  };

  const handlePlaceOrder = () => {
    if (submitGuard.current || !shippingData) return;
    submitGuard.current = true;

    placeOrder(
      {
        idempotencyKey: idempotencyKey.current,
        items: cartItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        shippingAddress: shippingData,
        paymentMethod,
      },
      {
        onSuccess: (data) => {
          clearCart();
          router.push(`/order-confirmation?orderId=${data.orderId}`);
        },
        onError: () => {
          submitGuard.current = false;
        },
      },
    );
  };

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <p className="text-muted-foreground">Add some products before checking out</p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  i < stepIndex
                    ? "bg-primary text-primary-foreground"
                    : i === stepIndex
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {STEP_LABELS[s]}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`mx-2 h-px w-12 transition-colors ${
                  i < stepIndex ? "bg-primary" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping */}
          {step === "shipping" && (
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onShippingSubmit)} className="space-y-4" noValidate>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" {...register("firstName")} />
                      {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" {...register("lastName")} />
                      {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="0812345678" {...register("phone")} />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" {...register("address")} />
                    {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Bangkok" {...register("city")} />
                      {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Province</Label>
                      <Input id="state" placeholder="Bangkok" {...register("state")} />
                      {errors.state && <p className="text-sm text-destructive">{errors.state.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" placeholder="10110" {...register("postalCode")} />
                      {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Continue to Payment
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === "payment" && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      className="flex items-center space-x-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} />
                      <Label htmlFor={opt.value} className="flex-1 cursor-pointer font-normal">
                        {opt.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("shipping")}>
                    Back
                  </Button>
                  <Button className="flex-1" onClick={() => setStep("review")}>
                    Continue to Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review */}
          {step === "review" && shippingData && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Order failed</AlertTitle>
                    <AlertDescription>
                      {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <h3 className="mb-2 font-semibold">Shipping Address</h3>
                  <p className="text-sm text-muted-foreground">
                    {shippingData.firstName} {shippingData.lastName}<br />
                    {shippingData.address}<br />
                    {shippingData.city}, {shippingData.state} {shippingData.postalCode}<br />
                    {shippingData.email} · {shippingData.phone}
                  </p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => setStep("shipping")}
                  >
                    Edit
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-semibold">Payment Method</h3>
                  <p className="text-sm text-muted-foreground">
                    {PAYMENT_OPTIONS.find((o) => o.value === paymentMethod)?.label}
                  </p>
                  <Button
                    variant="link"
                    className="h-auto p-0 text-sm"
                    onClick={() => setStep("payment")}
                  >
                    Edit
                  </Button>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-2 font-semibold">Items ({cartItems.length})</h3>
                  <div className="space-y-1">
                    {cartItems.map((item) => (
                      <div key={item.itemId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.productName} × {item.quantity}
                        </span>
                        <span>฿{(item.unitPrice * item.quantity).toLocaleString("th-TH")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("payment")} disabled={isPending}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handlePlaceOrder}
                    disabled={isPending}
                  >
                    {isPending ? "Placing Order…" : "Place Order"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.itemId} className="flex justify-between text-sm">
                    <span className="line-clamp-1 text-muted-foreground">
                      {item.productName} ×{item.quantity}
                    </span>
                    <span className="shrink-0">
                      ฿{(item.unitPrice * item.quantity).toLocaleString("th-TH")}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>฿{subtotal.toLocaleString("th-TH")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `฿${shipping.toLocaleString("th-TH")}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-semantic-success-text">Free shipping on orders over ฿1,000</p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>฿{total.toLocaleString("th-TH")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
