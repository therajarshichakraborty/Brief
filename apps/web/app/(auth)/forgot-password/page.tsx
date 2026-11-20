import type { Metadata } from "next";
import { AUTH_PHOTOS, AuthSplit } from "@/components/auth/auth-split";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthSplit
      photo={AUTH_PHOTOS.login}
      photoSide="left"
      headline="Locked out? It happens."
      subline="We'll email you a secure link so you can get back to your briefing."
    >
      <ForgotPasswordForm />
    </AuthSplit>
  );
}
