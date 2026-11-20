import { describe, expect, it } from "vitest";
import { summarize } from "./summarizer";

const ARTICLE = [
  "The central bank raised interest rates by a quarter point on Wednesday to fight persistent inflation.",
  "Officials said inflation remains well above the bank's two percent target despite recent progress.",
  "The decision was widely expected by economists and financial markets.",
  "Sign up for our daily newsletter to get the latest stories in your inbox.",
  "Stock markets rose modestly after the interest rate announcement as investors welcomed the guidance.",
  "The bank signalled that further interest rate increases are possible if inflation does not cool.",
  "Mortgage holders will face higher monthly payments as lenders pass on the higher rates.",
  "Analysts said the bank is likely to pause later this year if price growth continues to slow.",
].join(" ");

describe("summarize", () => {
  it("returns null when there is no usable sentence", () => {
    expect(summarize("")).toBeNull();
    expect(summarize("Too short.")).toBeNull();
  });

  it("returns short text as-is", () => {
    const text = "Lawmakers approved the national budget after a long debate in parliament on Friday.";
    expect(summarize(text)).toBe(text);
  });

  it("selects the requested number of sentences in original order", () => {
    const summary = summarize(ARTICLE, 3) ?? "";
    const sentences = summary.match(/[^.]+\./g) ?? [];

    expect(sentences).toHaveLength(3);
    const positions = sentences.map((sentence) => ARTICLE.indexOf(sentence.trim()));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it("never repeats a sentence that appears twice in the article", () => {
    const repeated =
      "Officials said inflation remains well above the bank's two percent target despite recent progress.";
    const summary = summarize(`${ARTICLE} ${repeated}`, 7) ?? "";
    expect(summary.split(repeated)).toHaveLength(2);
  });

  it("drops boilerplate sentences", () => {
    expect(summarize(ARTICLE, 7)).not.toMatch(/newsletter/i);
  });

  it("splits Bengali text on the danda and keeps original order", () => {
    const bengali = [
      "রাজ্য সরকার শুক্রবার নতুন শিক্ষানীতি ঘোষণা করেছে যা আগামী বছর থেকে কার্যকর হবে।",
      "শিক্ষামন্ত্রী জানিয়েছেন নতুন নীতিতে প্রাথমিক স্তরে মাতৃভাষায় পড়াশোনার উপর জোর দেওয়া হবে।",
      "আরও পড়ুন এই বিষয়ে আমাদের বিশেষ প্রতিবেদন এবং অন্যান্য খবর।",
      "বিরোধী দলগুলি এই নীতির কয়েকটি দিক নিয়ে আপত্তি জানিয়েছে এবং আলোচনার দাবি তুলেছে।",
      "শিক্ষাবিদদের একাংশ মনে করছেন নতুন নীতি গ্রামের স্কুলগুলিতে পড়ুয়াদের উপস্থিতি বাড়াবে।",
      "সরকার জানিয়েছে আগামী মাসে শিক্ষকদের জন্য প্রশিক্ষণ শিবির শুরু হবে নতুন নীতি অনুযায়ী।",
    ].join(" ");

    const summary = summarize(bengali, 3) ?? "";
    const sentences = summary.split(/(?<=।)\s+/);

    expect(sentences).toHaveLength(3);
    expect(summary).not.toContain("আরও পড়ুন");
    const positions = sentences.map((sentence) => bengali.indexOf(sentence));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });
});
