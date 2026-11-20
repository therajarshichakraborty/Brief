import { CountUp } from "@/components/motion/count-up";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

const STEPS = [
  {
    title: "Collect",
    description:
      "Every hour Brief reads 60+ feeds from newsrooms across the world, India and Bengal, and opens each new article.",
  },
  {
    title: "Condense",
    description:
      "Each article is distilled into the three sentences that best represent it. Nothing is rewritten or invented.",
  },
  {
    title: "Rank",
    description:
      "Coverage of the same event is grouped together, and the stories reported most widely become today's top 25.",
  },
];

const STATS = [
  { value: 60, suffix: "+", label: "News feeds" },
  { value: 25, suffix: "+", label: "Newsrooms" },
  { value: 11, suffix: "", label: "Categories" },
  { value: 1, suffix: " hr", label: "Refresh cycle" },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading
        eyebrow="How it works"
        title="From hundreds of articles to one calm feed"
        description="A transparent pipeline that runs every hour, without paid AI models in the loop."
      />

      <ol className="mt-16 grid gap-5 md:grid-cols-3">
        {STEPS.map(({ title, description }, index) => (
          <li key={title}>
            <Reveal delay={index * 110} className="h-full">
              <div className="group h-full rounded-3xl border border-neutral-100 p-7 transition-all duration-500 ease-out-expo hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/5">
                <span className="font-mono text-sm text-neutral-400 transition-colors duration-300 group-hover:text-red-500">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-neutral-900">{title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-500">{description}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-16">
        <dl className="grid grid-cols-2 gap-y-10 rounded-3xl bg-neutral-900 px-6 py-10 text-center text-white md:grid-cols-4 dark:bg-neutral-50 dark:ring-1 dark:ring-neutral-100">
          {STATS.map(({ value, suffix, label }) => (
            <div key={label}>
              <dt className="text-sm text-white/60">{label}</dt>
              <dd className="mt-2 font-display text-4xl font-semibold">
                <CountUp value={value} suffix={suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
