import { Reveal } from "@/components/motion/reveal";

const NEWSROOMS = [
  "BBC News",
  "The Guardian",
  "The New York Times",
  "Al Jazeera",
  "NPR",
  "The Hindu",
  "Anandabazar Patrika",
  "The Indian Express",
  "ESPNcricinfo",
  "TechCrunch",
  "The Verge",
  "Wired",
  "Variety",
];

export function Sources() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="text-center text-sm font-medium text-neutral-400">Stories from the newsrooms you already trust</p>
      </Reveal>
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {NEWSROOMS.map((name, index) => (
          <li key={name}>
            <Reveal delay={index * 40}>
              <span className="cursor-default font-display text-lg font-semibold text-neutral-300 transition-colors duration-300 hover:text-neutral-600">
                {name}
              </span>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
