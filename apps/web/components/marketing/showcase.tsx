import { CATEGORIES, CATEGORY_LABELS } from "@news-aggrigator/contracts";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { DetailScreen, PhoneFrame } from "./phone-mockups";
import { SectionHeading } from "./section-heading";

const POINTS = [
  "The gist of every story in under a minute",
  "Reading time, source and publish time at a glance",
  "One tap to the original article when you want depth",
];

export function Showcase() {
  return (
    <section id="categories" className="scroll-mt-20 bg-neutral-50/70 py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Built for busy mornings"
            title="Read the gist. Go deeper when it matters."
            description="Every story opens to a clean summary with the context you need, and every beat you follow is one tap away."
          />

          <ul className="mt-8 space-y-3">
            {POINTS.map((point, index) => (
              <li key={point}>
                <Reveal delay={index * 90} className="flex items-center gap-3 text-neutral-700">
                  <span className="flex size-6 items-center justify-center rounded-full bg-neutral-900 text-neutral-50">
                    <Check className="size-3.5" />
                  </span>
                  {point}
                </Reveal>
              </li>
            ))}
          </ul>

          <ul className="mt-10 flex flex-wrap gap-2.5">
            {CATEGORIES.map((category, index) => (
              <li
                key={category}
                className={
                  index === 0
                    ? "rounded-2xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-50 shadow-lg shadow-black/20"
                    : "cursor-default rounded-2xl bg-background px-4 py-2.5 text-sm font-medium text-neutral-500 transition-all duration-300 ease-out-expo hover:-translate-y-0.5 hover:text-neutral-900 hover:shadow-md"
                }
              >
                {CATEGORY_LABELS[category]}
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={120}>
          <div className="relative flex justify-center overflow-hidden rounded-[2.5rem] bg-linear-to-br from-[#2f7fc4] via-[#2563b0] to-[#1d4c99] px-6 py-14">
            <div className="absolute -top-20 -right-16 size-72 animate-float rounded-full bg-white/5 [animation-duration:9s]" />
            <div className="absolute -bottom-24 -left-16 size-72 animate-float rounded-full bg-white/5 [animation-delay:3s] [animation-duration:11s]" />
            <div className="relative animate-float">
              <PhoneFrame>
                <DetailScreen />
              </PhoneFrame>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
