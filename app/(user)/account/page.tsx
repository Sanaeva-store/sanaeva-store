import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account - Sanaeva Store",
  description: "Manage your account settings and preferences",
};

export default function AccountPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">My Account</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your profile and account settings
      </p>
    </div>
  );
}
