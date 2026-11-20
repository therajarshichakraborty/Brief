import type { Metadata } from "next";
import { AUTH_PHOTOS, AuthSplit } from "@/components/auth/auth-split";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  const { token, error } = await searchParams;
  const validToken = typeof token === "string" && !error ? token : null;
  return (
    <AuthSplit
      photo={AUTH_PHOTOS.login}
      photoSide="left"
      headline="A fresh start."
      subline="Choose a new password and you'll be back to the headlines in seconds."
    >
      <ResetPasswordForm token={validToken} />
    </AuthSplit>
  );
}
