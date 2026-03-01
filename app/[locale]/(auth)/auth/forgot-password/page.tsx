"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShoppingBag, ArrowLeft, MailCheck } from "lucide-react";
import { LangSwitcher } from "@/components/common/lang-switcher";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "th";

  return (
    <div
      className="flex min-h-screen font-(family-name:--font-ibm-plex-sans-thai)"
      data-theme-domain="storefront"
    >
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden bg-(--storefront-background)">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-(--storefront-primary) opacity-40 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-(--storefront-accent) opacity-50 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-lg shadow-pink-200/60">
            <ShoppingBag className="h-10 w-10 text-(--storefront-primary-hover)" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-(--storefront-text)">Sanaeva Store</h1>
            <p className="mt-3 text-lg text-(--storefront-text)/70">ช้อปสินค้าที่คุณชอบ<br />ง่ายและรวดเร็ว</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex w-full lg:w-1/2 flex-col bg-white">
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

            {sent ? (
              <div className="text-center">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-primary-50 mb-6">
                  <MailCheck className="h-8 w-8 text-primary-500" />
                </div>
                <h2 className="text-2xl font-bold text-(--storefront-text)">ส่งอีเมลแล้ว!</h2>
                <p className="mt-2 text-sm text-(--storefront-text)/60 leading-relaxed">
                  กรุณาตรวจสอบกล่องจดหมายของคุณ<br />แล้วคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-(--storefront-text)">ลืมรหัสผ่าน?</h2>
                  <p className="mt-1 text-(--storefront-text)/60">
                    กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้
                  </p>
                </div>

                <div className="space-y-5">
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
                    />
                  </div>

                  <Button
                    onClick={() => setSent(true)}
                    className="w-full h-11 font-semibold text-white bg-primary-500 hover:bg-primary-hover transition-colors rounded-lg"
                  >
                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                  </Button>
                </div>
              </>
            )}

            <Link
              href={`/${locale}/auth/signin`}
              className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-hover transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              กลับไปหน้าเข้าสู่ระบบ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
