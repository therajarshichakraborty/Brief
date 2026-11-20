import type { Category } from "@news-aggrigator/contracts";

export interface NewsSource {
  name: string;
  category: Category;
  feedUrl: string;
  aggregated: boolean;
}

interface FeedOptions {
  aggregated?: boolean;
}

type FeedList = readonly (readonly [name: string, feedUrl: string, options?: FeedOptions])[];

const FEEDS: Record<Category, FeedList> = {
  world: [
    ["BBC News", "https://feeds.bbci.co.uk/news/world/rss.xml"],
    ["Al Jazeera", "https://www.aljazeera.com/xml/rss/all.xml"],
    ["The Guardian", "https://www.theguardian.com/world/rss"],
    ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/World.xml"],
    ["NPR", "https://feeds.npr.org/1004/rss.xml"],
    ["DW", "https://rss.dw.com/rdf/rss-en-world"],
    ["France 24", "https://www.france24.com/en/rss"],
  ],
  india: [
    ["The Hindu", "https://www.thehindu.com/news/national/feeder/default.rss"],
    ["The Indian Express", "https://indianexpress.com/section/india/feed/"],
    ["The Times of India", "https://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms"],
    ["BBC News", "https://feeds.bbci.co.uk/news/world/asia/india/rss.xml"],
    ["Hindustan Times", "https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml"],
    ["NDTV", "https://feeds.feedburner.com/ndtvnews-india-news"],
  ],
  business: [
    ["BBC News", "https://feeds.bbci.co.uk/news/business/rss.xml"],
    ["The Guardian", "https://www.theguardian.com/business/rss"],
    ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml"],
    ["CNBC", "https://www.cnbc.com/id/10001147/device/rss/rss.html"],
    ["NPR", "https://feeds.npr.org/1006/rss.xml"],
    ["The Hindu", "https://www.thehindu.com/business/feeder/default.rss"],
    ["The Economic Times", "https://economictimes.indiatimes.com/rssfeedstopstories.cms"],
    ["Mint", "https://www.livemint.com/rss/markets"],
  ],
  technology: [
    ["BBC News", "https://feeds.bbci.co.uk/news/technology/rss.xml"],
    ["The Verge", "https://www.theverge.com/rss/index.xml"],
    ["TechCrunch", "https://techcrunch.com/feed/"],
    ["Ars Technica", "https://feeds.arstechnica.com/arstechnica/index"],
    ["The Guardian", "https://www.theguardian.com/uk/technology/rss"],
    ["Wired", "https://www.wired.com/feed/rss"],
    ["Engadget", "https://www.engadget.com/rss.xml"],
  ],
  politics: [
    ["BBC News", "https://feeds.bbci.co.uk/news/politics/rss.xml"],
    ["The Guardian", "https://www.theguardian.com/politics/rss"],
    ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml"],
    ["Politico", "https://rss.politico.com/politics-news.xml"],
    ["NPR", "https://feeds.npr.org/1014/rss.xml"],
    ["The Indian Express", "https://indianexpress.com/section/political-pulse/feed/"],
  ],
  sports: [
    ["BBC Sport", "https://feeds.bbci.co.uk/sport/rss.xml"],
    ["The Guardian", "https://www.theguardian.com/uk/sport/rss"],
    ["ESPN", "https://www.espn.com/espn/rss/news"],
    ["The Times of India", "https://timesofindia.indiatimes.com/rssfeeds/4719148.cms"],
    ["The Indian Express", "https://indianexpress.com/section/sports/feed/"],
  ],
  cricket: [
    ["ESPNcricinfo", "https://www.espncricinfo.com/rss/content/story/feeds/0.xml"],
    ["BBC Sport", "https://feeds.bbci.co.uk/sport/cricket/rss.xml"],
    ["The Guardian", "https://www.theguardian.com/sport/cricket/rss"],
    ["The Times of India", "https://timesofindia.indiatimes.com/rssfeeds/54829575.cms"],
    ["The Indian Express", "https://indianexpress.com/section/sports/cricket/feed/"],
    ["The Hindu", "https://www.thehindu.com/sport/cricket/feeder/default.rss"],
    ["Hindustan Times", "https://www.hindustantimes.com/feeds/rss/cricket/rssfeed.xml"],
    ["NDTV Sports", "https://feeds.feedburner.com/ndtvsports-cricket"],
  ],
  science: [
    ["BBC News", "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"],
    ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"],
    ["The Guardian", "https://www.theguardian.com/science/rss"],
    ["ScienceDaily", "https://www.sciencedaily.com/rss/top/science.xml"],
    ["NPR", "https://feeds.npr.org/1007/rss.xml"],
    ["Ars Technica", "https://feeds.arstechnica.com/arstechnica/science"],
  ],
  health: [
    ["BBC News", "https://feeds.bbci.co.uk/news/health/rss.xml"],
    ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml"],
    ["The Guardian", "https://www.theguardian.com/society/health/rss"],
    ["NPR", "https://feeds.npr.org/1128/rss.xml"],
    ["The Hindu", "https://www.thehindu.com/sci-tech/health/feeder/default.rss"],
  ],
  entertainment: [
    ["BBC News", "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"],
    ["The Guardian", "https://www.theguardian.com/culture/rss"],
    ["The New York Times", "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml"],
    ["Variety", "https://variety.com/feed/"],
    ["Hindustan Times", "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml"],
    ["The Indian Express", "https://indianexpress.com/section/entertainment/feed/"],
  ],
  bangla: [
    [
      "Anandabazar Patrika",
      "https://news.google.com/rss/search?q=site:anandabazar.com&hl=bn&gl=IN&ceid=IN:bn",
      { aggregated: true },
    ],
    ["BBC Bangla", "https://feeds.bbci.co.uk/bengali/rss.xml"],
    ["Sangbad Pratidin", "https://www.sangbadpratidin.in/feed/"],
    ["ABP Ananda", "https://bengali.abplive.com/home/feed"],
  ],
};

export const NEWS_SOURCES: readonly NewsSource[] = Object.entries(FEEDS).flatMap(([category, feeds]) =>
  feeds.map(([name, feedUrl, options]) => ({
    name,
    feedUrl,
    category: category as Category,
    aggregated: options?.aggregated ?? false,
  })),
);
