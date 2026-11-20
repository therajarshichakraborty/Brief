import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DetailScreen, FeedScreen, LatestScreen, PhoneFrame } from "./phone-mockups";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-neutral-200 px-4 py-1.5 text-sm text-neutral-600">
          <span className="relative flex size-1.5">
            <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative size-1.5 rounded-full bg-red-500" />
          </span>
          Refreshed every hour from 60+ news feeds
        </span>
        <h1 className="mt-6 animate-fade-up font-display text-4xl leading-[1.1] font-semibold tracking-tight text-balance text-neutral-900 [animation-delay:80ms] sm:text-5xl lg:text-6xl">
          All the news that matters. None of the noise.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-pretty text-neutral-500 [animation-delay:160ms]">
          Brief reads trusted newsrooms around the clock, groups every story across outlets and condenses each one into
          a three-sentence summary, so you can catch up on the world in minutes.
        </p>
        <div className="mt-9 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:240ms] sm:flex-row">
          <Button
            asChild
            className="group h-12 w-full rounded-2xl px-7 text-base shadow-lg shadow-black/20 hover:shadow-xl sm:w-auto"
          >
            <Link href="/signup">
              Get started free
              <ArrowRight className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-2xl border-neutral-200 px-7 text-base shadow-none sm:w-auto"
          >
            <a href="#how-it-works">See how it works</a>
          </Button>
        </div>
        <p className="mt-4 animate-fade-up text-sm text-neutral-400 [animation-delay:300ms]">
          Free to use. No credit card required.
        </p>
      </div>

      <div className="relative mt-16 animate-fade-up overflow-hidden rounded-[2.5rem] bg-linear-to-br from-[#2f7fc4] via-[#2563b0] to-[#1d4c99] px-6 pt-14 pb-16 [animation-delay:380ms] lg:mt-20">
        <div className="absolute -top-24 left-1/3 size-80 animate-float rounded-full bg-white/5 [animation-duration:9s]" />
        <div className="absolute -bottom-32 -left-20 size-96 animate-float rounded-full bg-white/5 [animation-delay:2s] [animation-duration:11s]" />
        <div className="absolute -right-24 bottom-0 size-80 animate-float rounded-full bg-white/5 [animation-delay:4s] [animation-duration:10s]" />

        <div className="relative flex items-start justify-center gap-10">
          <div className="mt-12 hidden animate-float [animation-delay:1.2s] lg:block">
            <PhoneFrame>
              <LatestScreen />
            </PhoneFrame>
          </div>
          <div className="animate-float">
            <PhoneFrame>
              <FeedScreen />
            </PhoneFrame>
          </div>
          <div className="mt-12 hidden animate-float [animation-delay:2.4s] md:block">
            <PhoneFrame>
              <DetailScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </section>
  );
}
