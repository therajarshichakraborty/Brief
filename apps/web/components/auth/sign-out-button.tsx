"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function signOut() {
    startTransition(async () => {
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    });
  }

  return (
    <Button
      variant="outline"
      onClick={signOut}
      disabled={isPending}
      className="group h-13 w-full rounded-2xl border-neutral-200 text-base text-red-600 shadow-none hover:border-red-200 hover:bg-red-50 hover:text-red-600"
    >
      <LogOut className="size-5 transition-transform duration-300 ease-out-expo group-hover:-translate-x-0.5" />
      {isPending ? "Signing out…" : "Sign out"}
    </Button>
  );
}
