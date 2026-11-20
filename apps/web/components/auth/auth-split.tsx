import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo, Wordmark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export interface AuthPhoto {
  src: string;
  /** CSS object-position, used to keep the subject in frame when the photo is cropped. */
  position?: string;
  credit: string;
}

interface AuthSplitProps {
  photo: AuthPhoto;
  photoSide: "left" | "right";
  headline: React.ReactNode;
  subline: string;
  highlights?: readonly string[];
  children: React.ReactNode;
}

function PhotoPanel({ photo, headline, subline, highlights }: Omit<AuthSplitProps, "children" | "photoSide">) {
  return (
    <div className="relative h-full min-h-[calc(100dvh-2rem)] overflow-hidden rounded-[2rem] bg-neutral-900 shadow-2xl shadow-black/15">
      <Image
        src={photo.src}
        alt=""
        fill
        priority
        sizes="50vw"
        className="animate-fade-in object-cover"
        style={{ objectPosition: photo.position ?? "center" }}
      />
      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-black/60 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/85 via-black/45 to-transparent" />

      <div className="relative flex h-full min-h-[calc(100dvh-2rem)] flex-col justify-between p-10 text-white xl:p-12">
        <div className="flex items-center justify-between">
          <Logo className="text-white drop-shadow" />
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-md">
            <span className="relative flex size-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative size-1.5 rounded-full bg-red-500" />
            </span>
            Updated hourly
          </span>
        </div>

        <div className="max-w-lg animate-fade-up space-y-5 [animation-delay:150ms]">
          <p className="font-display text-[2.75rem] leading-[1.05] font-semibold tracking-tight text-balance drop-shadow-sm xl:text-5xl">
            {headline}
          </p>
          <p className="max-w-md text-lg leading-relaxed text-white/80">{subline}</p>
          {highlights && (
            <ul className="flex flex-wrap gap-2 pt-1">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur-md"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
          <p className="pt-3 text-xs text-white/50">Photo: {photo.credit}</p>
        </div>
      </div>
    </div>
  );
}

export function AuthSplit({ photo, photoSide, headline, subline, highlights, children }: AuthSplitProps) {
  const photoOnRight = photoSide === "right";

  return (
    <main className="flex min-h-dvh flex-col bg-background lg:grid lg:grid-cols-2">
      {/* Mobile photo banner */}
      <div className="relative lg:hidden">
        <Link href="/" className="relative block h-64 overflow-hidden">
          <Image
            src={photo.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: photo.position ?? "center" }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/55 via-transparent to-black/30" />
          <Wordmark className="absolute top-6 left-6 text-3xl text-white drop-shadow" />
        </Link>
        <ThemeToggle overlay className="absolute top-6 right-6" />
      </div>

      {/* Desktop photo panel */}
      <section className={cn("hidden p-4 lg:block", photoOnRight && "lg:order-2")}>
        <div className="sticky top-4">
          <PhotoPanel photo={photo} headline={headline} subline={subline} highlights={highlights} />
        </div>
      </section>

      {/* Form panel */}
      <section className="relative z-10 -mt-8 flex flex-1 flex-col rounded-t-[2rem] bg-background lg:mt-0 lg:rounded-none">
        <div className="relative hidden items-center justify-between px-12 pt-10 lg:flex">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            <ArrowLeft className="size-4 transition-transform duration-300 ease-spring group-hover:-translate-x-1" />
            Back to home
          </Link>
          <ThemeToggle />
        </div>

        <div className="relative flex flex-1 justify-center px-6 pt-9 pb-12 lg:items-center lg:px-12 lg:pt-0">
          <div className="w-full max-w-[26rem] animate-fade-up [animation-delay:100ms]">{children}</div>
        </div>

        <p className="relative hidden px-12 pb-8 text-center text-xs text-neutral-400 lg:block">
          Headlines belong to their respective publishers. Summaries link back to the original reporting.
        </p>
      </section>
    </main>
  );
}

export const AUTH_PHOTOS = {
  login: {
    src: "/images/auth/login.jpg",
    position: "50% 40%",
    credit: "Roman Kraft (CC0)",
  },
  signup: {
    src: "/images/auth/signup.jpg",
    position: "55% 50%",
    credit: "Tran Mau Tri Tam (CC0)",
  },
} as const satisfies Record<string, AuthPhoto>;
