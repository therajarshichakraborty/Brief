import type { Metadata } from "next";
import { AUTH_PHOTOS, AuthSplit } from "@/components/auth/auth-split";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthSplit
      photo={AUTH_PHOTOS.login}
      photoSide="left"
      headline={
        <>
          Your daily paper, <span className="italic">without the paper.</span>
        </>
      }
      subline="Every story that matters from 60+ trusted newsrooms, condensed into three sentences."
    >
      <LoginForm />
    </AuthSplit>
  );
}
