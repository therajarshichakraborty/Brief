import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-b from-[#0b74c1] via-[#0a4a94] to-[#04205c] px-6 py-20 text-center text-white">
        <div className="absolute -top-24 -left-24 size-80 animate-float rounded-full bg-white/5 [animation-duration:9s]" />
        <div className="absolute -right-20 -bottom-28 size-80 animate-float rounded-full bg-white/5 [animation-delay:3s] [animation-duration:11s]" />
        <h2 className="relative mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Start every day already caught up
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/75">
          Create a free account and get your first briefing in under a minute.
        </p>
        <Button
          asChild
          variant="secondary"
          className="group relative mt-9 h-12 rounded-2xl bg-white px-7 text-base text-black shadow-xl shadow-black/20 hover:bg-white/90"
        >
          <Link href="/signup">
            Get started free
            <ArrowRight className="size-4 transition-transform duration-300 ease-spring group-hover:translate-x-1" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}
