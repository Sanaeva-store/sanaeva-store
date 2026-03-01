"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSignInMutation, useCurrentUserQuery } from "@/features/account/hooks/use-auth";
import { Eye, EyeOff, ShoppingBag, Sparkles, Star } from "lucide-react";
import { LangSwitcher } from "@/components/common/lang-switcher";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "th";
  const { data: user } = useCurrentUserQuery();
  const { mutate: signIn, isPending, error } = useSignInMutation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (values: SignInFormValues) => {
    signIn(values, {
      onSuccess: () => router.replace("/"),
    });
  };

  return (
    <div
      className="flex min-h-screen font-(family-name:--font-ibm-plex-sans-thai)"
      data-theme-domain="storefront"
    >
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-(--storefront-background)">
        {/* Gradient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-(--storefront-primary) opacity-40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-(--storefront-accent) opacity-50 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-(--storefront-primary-hover) opacity-20 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-pink-200/60">
            <ShoppingBag className="h-10 w-10 text-(--storefront-primary-hover)" strokeWidth={1.5} />
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-(--storefront-text)">
              Sanaeva Store
            </h1>
            <p className="mt-3 text-lg text-(--storefront-text)/70 leading-relaxed">
              ช้อปสินค้าที่คุณชอบ<br />ง่ายและรวดเร็ว
            </p>
          </div>

          <div className="flex flex-col gap-3 text-left w-full max-w-xs">
            {[
              { icon: Sparkles, text: "สินค้าคุณภาพคัดสรรพิเศษ" },
              { icon: Star, text: "จัดส่งรวดเร็ว ทั่วประเทศ" },
              { icon: ShoppingBag, text: "ช้อปง่าย คืนสินค้าได้ภายใน 30 วัน" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-sm">
                  <Icon className="h-4 w-4 text-(--storefront-primary-hover)" />
                </div>
                <span className="text-sm text-(--storefront-text)/80">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-1/2 flex-col bg-white">
        {/* Top bar with lang switcher */}
        <div className="flex justify-end px-6 pt-5">
          <LangSwitcher variant="light" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-12">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--storefront-background)">
                <ShoppingBag className="h-5 w-5 text-(--storefront-primary-hover)" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-bold text-(--storefront-text)">Sanaeva Store</span>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-(--storefront-text)">ยินดีต้อนรับ</h2>
              <p className="mt-1 text-(--storefront-text)/60">เข้าสู่ระบบเพื่อเริ่มช้อปปิ้ง</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-(--storefront-text)">
                  อีเมล
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-11 border-(--storefront-border) bg-(--storefront-background) focus-visible:ring-primary-400 placeholder:text-gray-400"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-(--storefront-text)">
                    รหัสผ่าน
                  </Label>
                  <Link
                    href={`/${locale}/auth/forgot-password`}
                    className="text-xs text-primary-500 hover:text-primary-hover transition-colors"
                  >
                    ลืมรหัสผ่าน?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-11 pr-10 border-(--storefront-border) bg-(--storefront-background) focus-visible:ring-primary-400"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-white bg-primary-500 hover:bg-primary-hover transition-colors rounded-lg"
                disabled={isPending}
              >
                {isPending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-(--storefront-text)/60">
              ยังไม่มีบัญชี?{" "}
              <Link
                href={`/${locale}/auth/signup`}
                className="font-semibold text-primary-500 hover:text-primary-hover transition-colors"
              >
                สมัครสมาชิก
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
