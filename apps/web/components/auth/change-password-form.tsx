"use client";

import { Check, KeyRound } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const MIN_PASSWORD_LENGTH = 8;

const FIELDS = [
  { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
  { name: "newPassword", label: "New password", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
] as const;

type Feedback = { tone: "error" | "success"; message: string };

export function ChangePasswordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      setFeedback({ tone: "error", message: `Use at least ${MIN_PASSWORD_LENGTH} characters.` });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ tone: "error", message: "New passwords do not match." });
      return;
    }

    startTransition(async () => {
      const { error } = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      if (error) {
        setFeedback({ tone: "error", message: error.message ?? "Could not update your password." });
        return;
      }
      form.reset();
      setFeedback({ tone: "success", message: "Password updated. Your other devices have been signed out." });
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 text-neutral-700">
            <KeyRound className="size-5" />
          </span>
          <div>
            <p className="font-medium text-neutral-900">Password</p>
            <p className="text-sm text-neutral-500">Change the password you sign in with.</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen((open) => !open);
            setFeedback(null);
          }}
          aria-expanded={isOpen}
          className="h-10 shrink-0 rounded-xl border-neutral-200 shadow-none"
        >
          {isOpen ? "Cancel" : "Change"}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="animate-fade-up space-y-4">
          {FIELDS.map(({ name, label, autoComplete }) => (
            <div key={name} className="space-y-2">
              <Label htmlFor={name} className="text-neutral-700">
                {label}
              </Label>
              <Input
                id={name}
                name={name}
                type="password"
                autoComplete={autoComplete}
                required
                className="h-12 rounded-2xl border-neutral-200 px-4 text-base shadow-none transition-shadow focus-visible:shadow-lg focus-visible:shadow-black/5"
              />
            </div>
          ))}
          <Button type="submit" disabled={isPending} className="h-12 w-full rounded-2xl text-base">
            {isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      )}

      {feedback && (
        <p
          role={feedback.tone === "error" ? "alert" : "status"}
          className={cn(
            "flex animate-fade-up items-center gap-2 text-sm",
            feedback.tone === "error" ? "text-destructive" : "text-emerald-600",
          )}
        >
          {feedback.tone === "success" && <Check className="size-4" />}
          {feedback.message}
        </p>
      )}
    </div>
  );
}
