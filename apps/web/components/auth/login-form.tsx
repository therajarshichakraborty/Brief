"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthForm } from "./auth-form";

export function LoginForm() {
  const router = useRouter();

  async function signIn({ email = "", password = "" }: Record<string, string>) {
    const { error } = await authClient.signIn.email({ email, password });
    if (error) return error.message ?? "Unable to sign in";
    router.replace("/feed");
    router.refresh();
    return null;
  }

  return (
    <AuthForm
      eyebrow="Your briefing is ready"
      title="Welcome back"
      description="Sign in to catch up on today's top stories, summarised in three sentences each."
      submitLabel="Sign in"
      onSubmit={signIn}
      fields={[
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        { name: "password", label: "Password", type: "password", autoComplete: "current-password" },
      ]}
      aside={
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="-mt-1 text-sm font-medium text-neutral-500 underline-offset-4 transition-colors hover:text-neutral-900 underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
      }
      footer={
        <>
          New here?{" "}
          <Link href="/signup" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    />
  );
}
