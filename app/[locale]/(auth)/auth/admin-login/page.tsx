"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBackofficeSignInMutation } from "@/features/account/hooks/use-backoffice-auth";
import { Eye, EyeOff, LayoutDashboard, Lock, ShieldCheck, Users, BarChart3 } from "lucide-react";
import { LangSwitcher } from "@/components/common/lang-switcher";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: signIn, isPending, error } = useBackofficeSignInMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = (values: FormValues) => {
    signIn(values, {
      onSuccess: () => router.replace(`/${locale}/admin-dasboard`),
    });
  };

  return (
    <div
      className="flex min-h-screen font-(family-name:--font-ibm-plex-sans-thai)"
      data-theme-domain="backoffice"
    >
      {/* Left panel — dark sidebar using brand primary colors */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between bg-secondary-900 px-12 py-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
            <LayoutDashboard className="h-5 w-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg font-semibold text-white tracking-tight">Sanaeva Admin</span>
        </div>

        {/* Center content */}
        <div className="flex flex-col gap-10">
          <div>
            <h1 className="text-3xl font-bold text-white leading-snug">
              Backoffice<br />Management
            </h1>
            <p className="mt-3 text-sm text-secondary-100/70 leading-relaxed">
              ระบบจัดการหลังบ้านสำหรับผู้ดูแลระบบ<br />เข้าถึงเครื่องมือทั้งหมดได้จากที่นี่
            </p>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-3">
            {[
              { icon: BarChart3, label: "Analytics", desc: "รายงานยอดขายและสถิติ" },
              { icon: Users, label: "User Management", desc: "จัดการบัญชีผู้ใช้งาน" },
              { icon: ShieldCheck, label: "Security", desc: "ระบบรักษาความปลอดภัย" },
            ].map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-xl bg-white/5 px-4 py-3 border border-white/10"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-500/20">
                  <Icon className="h-4 w-4 text-primary-300" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-secondary-100/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-secondary-300/50">
          © {new Date().getFullYear()} Sanaeva Store. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full lg:w-3/5 flex-col bg-secondary-50">
        {/* Top bar with lang switcher */}
        <div className="flex justify-end px-6 pt-5">
          <LangSwitcher variant="light" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 sm:px-16">
          <div className="w-full max-w-md">
            {/* Mobile header */}
            <div className="flex lg:hidden items-center gap-3 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500">
                <LayoutDashboard className="h-5 w-5 text-white" strokeWidth={1.5} />
              </div>
              <span className="text-lg font-semibold text-secondary-900">Sanaeva Admin</span>
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-col gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 mb-2">
                <Lock className="h-6 w-6 text-primary-700" strokeWidth={1.5} />
              </div>
              <h2 className="text-2xl font-bold text-secondary-900">Admin Sign In</h2>
              <p className="text-sm text-secondary-300">เข้าสู่ระบบจัดการ Backoffice Dashboard</p>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
              noValidate
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : "เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง"}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-secondary-900">
                  อีเมลผู้ดูแลระบบ
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@sanaeva.com"
                  className="h-11 border-secondary-100 bg-white focus-visible:ring-primary-400 placeholder:text-gray-400"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-secondary-900">
                  รหัสผ่าน
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="h-11 pr-10 border-secondary-100 bg-white focus-visible:ring-primary-400"
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

            <div className="mt-8 rounded-xl border border-secondary-100 bg-white p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                <p className="text-xs text-secondary-300 leading-relaxed">
                  พื้นที่นี้สำหรับผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น การเข้าถึงโดยไม่ได้รับอนุญาตจะถูกบันทึกไว้
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
