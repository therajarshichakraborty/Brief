import { Plus } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "./section-heading";

const QUESTIONS = [
  {
    question: "Where do the stories come from?",
    answer:
      "Brief reads public RSS feeds from established newsrooms such as BBC News, The Guardian, The Hindu, ESPNcricinfo and TechCrunch, plus Bangla outlets including BBC Bangla and Sangbad Pratidin. Anandabazar Patrika headlines are included too, but because they do not allow automated reading, those stories link straight to their site without a summary. Every story links back to its original publisher.",
  },
  {
    question: "How are the summaries written?",
    answer:
      "They are extracted, not generated. Brief ranks every sentence in an article by how central it is to the story and keeps the top three in their original order, so nothing is paraphrased or made up.",
  },
  {
    question: "How often is the news updated?",
    answer:
      "A scheduled sync runs every hour, and you can trigger one yourself at any time with the sync button. Top stories are recalculated on every sync.",
  },
  {
    question: "How are top stories chosen?",
    answer:
      "Articles from the last 24 hours are grouped by topic. Stories covered by the most independent newsrooms rank highest, with newer stories breaking ties.",
  },
  {
    question: "What data do you keep about me?",
    answer:
      "Only your name, email address, password hash and the stories you save. There are no ads, no third-party trackers and no reading history profile.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-6 py-24">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything you need to know about how Brief works."
      />

      <Reveal className="mt-12 divide-y divide-neutral-100 border-y border-neutral-100">
        {QUESTIONS.map(({ question, answer }) => (
          <details key={question} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-semibold text-neutral-900 transition-colors hover:text-neutral-600 [&::-webkit-details-marker]:hidden">
              {question}
              <Plus className="size-5 shrink-0 text-neutral-400 transition-transform duration-300 ease-spring group-open:rotate-45 group-open:text-neutral-900" />
            </summary>
            <p className="mt-3 leading-relaxed text-neutral-500 group-open:animate-fade-up">{answer}</p>
          </details>
        ))}
      </Reveal>
    </section>
  );
}
