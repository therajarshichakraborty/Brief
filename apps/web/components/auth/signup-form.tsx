"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthForm } from "./auth-form";

export function SignupForm() {
  const router = useRouter();

  async function signUp({ name = "", email = "", password = "" }: Record<string, string>) {
    const { error } = await authClient.signUp.email({ name: name.trim(), email, password });
    if (error) return error.message ?? "Unable to create your account";
    router.replace("/feed");
    router.refresh();
    return null;
  }

  return (
    <AuthForm
      eyebrow="Free forever · No card needed"
      title="Create your account"
      description="Join Brief and get the stories that matter from 60+ newsrooms, refreshed every hour."
      submitLabel="Create account"
      onSubmit={signUp}
      fields={[
        { name: "name", label: "Full name", type: "text", autoComplete: "name", placeholder: "Alex Kumar" },
        { name: "email", label: "Email", type: "email", autoComplete: "email" },
        {
          name: "password",
          label: "Password",
          type: "password",
          autoComplete: "new-password",
          minLength: 8,
          placeholder: "At least 8 characters",
          showStrength: true,
        },
      ]}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    />
  );
}
