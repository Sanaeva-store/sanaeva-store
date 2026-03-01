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
import { useSignUpMutation, useCurrentUserQuery } from "@/features/account/hooks/use-auth";
import { Eye, EyeOff, Heart, ShoppingBag, Shield, Truck } from "lucide-react";
import { LangSwitcher } from "@/components/common/lang-switcher";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "th";
  const { data: user } = useCurrentUserQuery();
  const { mutate: signUp, isPending, error } = useSignUpMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = ({ name, email, password }: SignUpFormValues) => {
    signUp({ name, email, password }, {
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
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-20 h-96 w-96 rounded-full bg-(--storefront-accent) opacity-50 blur-3xl" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-(--storefront-primary) opacity-40 blur-3xl" />
          <div className="absolute top-1/3 left-1/3 h-48 w-48 rounded-full bg-(--storefront-primary-hover) opacity-15 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-pink-200/60">
              <Heart className="h-10 w-10 text-(--storefront-primary-hover)" strokeWidth={1.5} fill="currentColor" />
            </div>
            <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-(--storefront-primary-hover)">
              <span className="text-xs font-bold text-white">✦</span>
            </div>
          </div>

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-(--storefront-text)">
              เข้าร่วมกับเรา
            </h1>
            <p className="mt-3 text-lg text-(--storefront-text)/70 leading-relaxed">
              สมัครสมาชิก Sanaeva Store<br />เริ่มต้นช้อปปิ้งอย่างสนุก
            </p>
          </div>

          <div className="flex flex-col gap-4 text-left w-full max-w-xs">
            {[
              { icon: Heart, text: "สะสมแต้มทุกการช้อปปิ้ง" },
              { icon: Truck, text: "ฟรีค่าจัดส่งสำหรับสมาชิก" },
              { icon: Shield, text: "ระบบปลอดภัย เข้ารหัสข้อมูล" },
              { icon: ShoppingBag, text: "โปรโมชั่นพิเศษเฉพาะสมาชิก" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm">
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

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-6 sm:px-12">
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--storefront-background)">
                <ShoppingBag className="h-5 w-5 text-(--storefront-primary-hover)" strokeWidth={1.5} />
              </div>
              <span className="text-xl font-bold text-(--storefront-text)">Sanaeva Store</span>
            </div>

            <div className="mb-7">
              <h2 className="text-3xl font-bold text-(--storefront-text)">สร้างบัญชีใหม่</h2>
              <p className="mt-1 text-(--storefront-text)/60">กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error instanceof Error ? error.message : "สมัครสมาชิกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-(--storefront-text)">
                  ชื่อ-นามสกุล
                </Label>
                <Input
                  id="name"
                  placeholder="สมชาย ใจดี"
                  autoComplete="name"
                  className="h-11 border-(--storefront-border) bg-(--storefront-background) focus-visible:ring-primary-400 placeholder:text-gray-400"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

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
                <Label htmlFor="password" className="text-sm font-medium text-(--storefront-text)">
                  รหัสผ่าน
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-(--storefront-text)">
                  ยืนยันรหัสผ่าน
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    autoComplete="new-password"
                    className="h-11 pr-10 border-(--storefront-border) bg-(--storefront-background) focus-visible:ring-primary-400"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <p className="text-xs text-(--storefront-text)/50 leading-relaxed">
                การสมัครสมาชิกหมายความว่าคุณยอมรับ{" "}
                <Link href={`/${locale}/terms`} className="text-primary-500 hover:text-primary-hover underline-offset-2 hover:underline">
                  เงื่อนไขการใช้บริการ
                </Link>{" "}
                และ{" "}
                <Link href={`/${locale}/privacy`} className="text-primary-500 hover:text-primary-hover underline-offset-2 hover:underline">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </p>

              <Button
                type="submit"
                className="w-full h-11 font-semibold text-white bg-primary-500 hover:bg-primary-hover transition-colors rounded-lg"
                disabled={isPending}
              >
                {isPending ? "กำลังสร้างบัญชี…" : "สมัครสมาชิก"}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-(--storefront-text)/60">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                href={`/${locale}/auth/signin`}
                className="font-semibold text-primary-500 hover:text-primary-hover transition-colors"
              >
                เข้าสู่ระบบ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
