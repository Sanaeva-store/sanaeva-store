"use client";

import type { PropsWithChildren } from "react";
import { UserAccountShell } from "@/components/components-design/user/user-account-shell";

export default function UserLayout({ children }: PropsWithChildren) {
  return <UserAccountShell>{children}</UserAccountShell>;
}
