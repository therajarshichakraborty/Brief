"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthForm } from "./auth-form";

export function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter();

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <h1 className="font-display text-2xl font-semibold text-neutral-900">Link expired</h1>
        <p className="text-neutral-500">This reset link is invalid or has expired. Please request a new one.</p>
        <Link
          href="/forgot-password"
          className="inline-block pt-4 text-sm font-medium text-neutral-900 hover:underline"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  async function resetPassword({ password = "", confirmPassword = "" }: Record<string, string>) {
    if (password !== confirmPassword) return "Passwords do not match";
    const { error } = await authClient.resetPassword({ newPassword: password, token: token ?? "" });
    if (error) return error.message ?? "Unable to reset your password";
    router.replace("/login");
    return null;
  }

  return (
    <AuthForm
      title="Set a new password"
      description="Choose a strong password with at least 8 characters."
      submitLabel="Update password"
      onSubmit={resetPassword}
      fields={[
        {
          name: "password",
          label: "New password",
          type: "password",
          autoComplete: "new-password",
          minLength: 8,
          showStrength: true,
        },
        {
          name: "confirmPassword",
          label: "Confirm password",
          type: "password",
          autoComplete: "new-password",
          minLength: 8,
        },
      ]}
    />
  );
}
