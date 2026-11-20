import { describe, expect, it } from "vitest";
import { type RankableArticle, rankStories } from "./story-ranking";

const NOW = new Date("2026-11-20T12:00:00Z");

function article(id: string, source: string, title: string, hoursAgo: number, imageUrl: string | null = null) {
  return {
    id,
    source,
    title,
    summary: title,
    imageUrl,
    publishedAt: new Date(NOW.getTime() - hoursAgo * 60 * 60 * 1000),
  } satisfies RankableArticle;
}

describe("rankStories", () => {
  const articles = [
    article("a", "BBC News", "Central bank raises interest rates to fight inflation", 3),
    article(
      "b",
      "The Guardian",
      "Central bank raises interest rates again as inflation persists",
      2,
      "https://img/b.jpg",
    ),
    article("c", "NPR", "Inflation pushes central bank to raise interest rates", 1),
    article("d", "TechCrunch", "Startup unveils foldable electric scooter for city commuters", 1),
    article("e", "The Verge", "New smartphone camera sensor doubles low light performance", 5),
  ];

  it("groups coverage of the same story across sources", () => {
    const [top] = rankStories(articles, NOW, 10);
    expect(top?.coverage).toBe(3);
  });

  it("prefers a lead article with an image", () => {
    const [top] = rankStories(articles, NOW, 10);
    expect(top?.lead.id).toBe("b");
  });

  it("breaks coverage ties by recency", () => {
    const ranked = rankStories(articles, NOW, 10);
    expect(ranked.map((story) => story.lead.id)).toEqual(["b", "d", "e"]);
  });

  it("respects the limit", () => {
    expect(rankStories(articles, NOW, 2)).toHaveLength(2);
  });

  it("does not double count the same source", () => {
    const ranked = rankStories(
      [
        article("x", "BBC News", "Parliament passes landmark climate bill", 1),
        article("y", "BBC News", "Landmark climate bill passes parliament", 2),
      ],
      NOW,
      5,
    );
    expect(ranked[0]?.coverage).toBe(1);
  });
});
