import Link from "next/link";
import { cn } from "@/lib/utils";

interface WordmarkProps {
  className?: string;
}

export function Wordmark({ className }: WordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display text-[1.65rem] leading-none font-semibold italic",
        className,
      )}
    >
      Brief
      <span className="text-red-500 not-italic">.</span>
    </span>
  );
}

interface LogoProps extends WordmarkProps {
  href?: string;
}

export function Logo({ href = "/", className }: LogoProps) {
  return (
    <Link href={href} aria-label="Brief home" className="transition-opacity duration-300 hover:opacity-80">
      <Wordmark className={className} />
    </Link>
  );
}
