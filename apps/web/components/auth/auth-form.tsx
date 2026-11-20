"use client";

import { ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useId, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Field {
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  minLength?: number;
  placeholder?: string;
  /** Show a live strength meter under a password field. */
  showStrength?: boolean;
}

interface AuthFormProps {
  title: string;
  description: string;
  fields: Field[];
  submitLabel: string;
  onSubmit: (values: Record<string, string>) => Promise<string | null>;
  footer?: React.ReactNode;
  aside?: React.ReactNode;
  eyebrow?: string;
}

const FIELD_ICONS = { text: UserRound, email: Mail, password: LockKeyhole } as const;

const DEFAULT_PLACEHOLDERS: Record<Field["type"], string> = {
  text: "Your name",
  email: "you@example.com",
  password: "••••••••",
};

const STRENGTH_LEVELS = [
  { label: "Too short", bar: "bg-neutral-200", text: "text-neutral-400" },
  { label: "Weak", bar: "bg-red-500", text: "text-red-500" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-600" },
  { label: "Good", bar: "bg-sky-500", text: "text-sky-600" },
  { label: "Strong", bar: "bg-emerald-500", text: "text-emerald-600" },
] as const;

function passwordScore(value: string): number {
  if (value.length < 8) return 0;
  let score = 1;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4);
}

function StrengthMeter({ value }: { value: string }) {
  const score = passwordScore(value);
  const level = STRENGTH_LEVELS[score] ?? STRENGTH_LEVELS[0];

  return (
    <div aria-live="polite" className="flex animate-fade-in items-center gap-3 pt-1">
      <div className="flex flex-1 gap-1.5">
        {[1, 2, 3, 4].map((step) => (
          <span
            key={step}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-500",
              score >= step ? level.bar : "bg-neutral-100",
            )}
          />
        ))}
      </div>
      <span className={cn("w-16 text-right text-xs font-medium transition-colors", level.text)}>{level.label}</span>
    </div>
  );
}

function FormField({ field }: { field: Field }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const Icon = FIELD_ICONS[field.type];
  const isPassword = field.type === "password";

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[13px] font-medium text-neutral-700">
        {field.label}
      </Label>
      <div className="group relative">
        <Icon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-neutral-400 transition-colors duration-300 group-focus-within:text-neutral-900"
          strokeWidth={1.75}
        />
        <input
          id={id}
          name={field.name}
          type={isPassword && visible ? "text" : field.type}
          autoComplete={field.autoComplete}
          minLength={field.minLength}
          placeholder={field.placeholder ?? DEFAULT_PLACEHOLDERS[field.type]}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
          className={cn(
            "h-13 w-full rounded-2xl border border-neutral-200 bg-neutral-50/60 pl-11.5 text-[15px] text-neutral-900 transition-all duration-300 outline-none placeholder:text-neutral-400",
            "hover:border-neutral-300 hover:bg-background",
            "focus:border-neutral-900 focus:bg-background focus:shadow-[0_0_0_4px_rgb(23_23_23/0.06)]",
            isPassword ? "pr-12" : "pr-4",
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-neutral-400 transition-colors duration-200 hover:bg-neutral-100 hover:text-neutral-900"
          >
            {visible ? (
              <EyeOff className="size-4.5" strokeWidth={1.75} />
            ) : (
              <Eye className="size-4.5" strokeWidth={1.75} />
            )}
          </button>
        )}
      </div>
      {field.showStrength && value.length > 0 && <StrengthMeter value={value} />}
    </div>
  );
}

export function AuthForm({ title, description, fields, submitLabel, onSubmit, footer, aside, eyebrow }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(fields.map(({ name }) => [name, String(formData.get(name) ?? "")]));

    startTransition(async () => {
      setError(await onSubmit(values));
    });
  }

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-background px-3 py-1 text-xs font-medium text-neutral-500 shadow-xs">
            <span className="size-1.5 rounded-full bg-red-500" />
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-[2.15rem] leading-[1.1] font-semibold tracking-tight text-neutral-900">
          {title}
        </h1>
        <p className="text-[15px] leading-relaxed text-neutral-500">{description}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <FormField key={field.name} field={field} />
        ))}

        {aside}

        {error && (
          <div
            role="alert"
            className="flex animate-fade-up items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <CircleAlert className="mt-0.5 size-4 shrink-0" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="group mt-1 h-13 w-full rounded-2xl text-[15px] shadow-lg shadow-black/15 hover:shadow-xl hover:shadow-black/20"
        >
          {isPending ? (
            <>
              <LoaderCircle className="size-4.5 animate-spin" />
              Please wait…
            </>
          ) : (
            <>
              {submitLabel}
              <ArrowRight className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      {footer && <p className="text-center text-sm text-neutral-500">{footer}</p>}
    </div>
  );
}
