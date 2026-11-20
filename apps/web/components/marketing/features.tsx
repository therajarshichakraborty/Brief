import { AlignLeft, Heart, Layers, type LucideIcon, RefreshCw, Search, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

const FEATURES: readonly { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: RefreshCw,
    title: "Always current",
    description: "Every feed is read on the hour, every hour. Need it sooner? One tap syncs on demand.",
  },
  {
    icon: AlignLeft,
    title: "Three-sentence summaries",
    description:
      "The sentences that carry each story, picked from the article itself and kept in their original order.",
  },
  {
    icon: Layers,
    title: "Ranked by coverage",
    description: "When many newsrooms report the same story, it rises to the top. Duplicates collapse into one.",
  },
  {
    icon: Search,
    title: "Search everything",
    description: "Find any headline or summary across every category in an instant.",
  },
  {
    icon: Heart,
    title: "Save for later",
    description: "Keep the stories you want to come back to, all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description: "No ads, no trackers and no reading profile. We store only your account and saved stories.",
  },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 bg-neutral-50/70 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to stay informed"
          description="Brief does the reading so you do not have to, and gets out of the way when you want the full story."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 3) * 90}>
              <article className="group h-full rounded-3xl border border-neutral-100 bg-background p-7 transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-neutral-200 hover:shadow-xl hover:shadow-black/5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-neutral-900 text-neutral-50 transition-transform duration-500 ease-spring group-hover:scale-110 group-hover:-rotate-6">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-6 font-display text-lg font-semibold text-neutral-900">{title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-500">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
