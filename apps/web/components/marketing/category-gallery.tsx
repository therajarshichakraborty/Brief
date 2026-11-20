import { CATEGORIES, CATEGORY_LABELS } from "@news-aggrigator/contracts";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { categoryImage } from "@/lib/category-images";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";

const FEATURED = new Set(["world", "cricket"]);

export function CategoryGallery() {
  return (
    <section id="categories" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-24">
      <SectionHeading
        eyebrow="Categories"
        title="Every beat you care about"
        description="From world affairs to the last over of the match, eleven sections refreshed every hour, including Bangla news from Bengal's own newsrooms."
      />

      <ul className="mt-16 grid auto-rows-[11rem] grid-cols-2 gap-4 sm:auto-rows-[13rem] md:grid-cols-4">
        {CATEGORIES.map((category, index) => (
          <li key={category} className={cn(FEATURED.has(category) && "col-span-2 row-span-2")}>
            <Reveal delay={(index % 4) * 70} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-3xl shadow-lg shadow-black/10">
                <Image
                  src={categoryImage(category)}
                  alt=""
                  fill
                  sizes={FEATURED.has(category) ? "(min-width: 768px) 560px, 100vw" : "(min-width: 768px) 280px, 50vw"}
                  className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/5 to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-xl bg-black/45 px-3 py-1.5 font-display text-base font-semibold text-white backdrop-blur-md transition-transform duration-500 ease-out-expo group-hover:-translate-y-1">
                  {CATEGORY_LABELS[category]}
                </span>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
