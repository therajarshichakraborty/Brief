"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { AuthForm } from "./auth-form";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function requestReset({ email = "" }: Record<string, string>) {
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    if (error) return error.message ?? "Unable to send the reset link";
    setSentTo(email);
    return null;
  }

  if (sentTo) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-display text-2xl font-semibold text-neutral-900">Check your inbox</h1>
        <p className="text-neutral-500">
          If an account exists for <span className="font-medium text-neutral-900">{sentTo}</span>, a reset link is on
          its way.
        </p>
        <Link
          href="/login"
          className="inline-block pt-4 text-sm font-medium text-neutral-900 underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <AuthForm
      title="Forgot password"
      description="Enter your email and we'll send you a reset link."
      submitLabel="Send reset link"
      onSubmit={requestReset}
      fields={[{ name: "email", label: "Email", type: "email", autoComplete: "email" }]}
      footer={
        <Link href="/login" className="font-medium text-neutral-900 underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    />
  );
}
