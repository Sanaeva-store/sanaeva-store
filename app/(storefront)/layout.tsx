import type { PropsWithChildren } from "react";
import { StorefrontHeader } from "@/components/components-design/storefront/storefront-header";
import { StorefrontFooter } from "@/components/components-design/storefront/storefront-footer";

export default function StorefrontLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader />
      <main className="flex-1">{children}</main>
      <StorefrontFooter />
    </div>
  );
}
