import type { Metadata } from "next";
import { AUTH_PHOTOS, AuthSplit } from "@/components/auth/auth-split";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthSplit
      photo={AUTH_PHOTOS.signup}
      photoSide="right"
      headline={
        <>
          Read less. <span className="italic">Know more.</span>
        </>
      }
      subline="Create a free account and catch up on the whole world in five minutes a day."
      highlights={["3-sentence summaries", "11 categories", "Save for later"]}
    >
      <SignupForm />
    </AuthSplit>
  );
}
