import Parser from "rss-parser";
import { fetchText } from "./http";
import { normalizeWhitespace } from "./text";
import { canonicalizeUrl, resolveUrl } from "./url";

interface MediaNode {
  $?: { url?: string; width?: string; medium?: string; type?: string };
}

interface FeedItemExtras {
  mediaContent?: MediaNode[];
  mediaThumbnail?: MediaNode[];
}

export interface FeedEntry {
  title: string;
  url: string;
  snippet: string;
  imageUrl: string | null;
  publishedAt: Date | null;
}

const FEED_TIMEOUT_MS = 15_000;
const FEED_MAX_BYTES = 5 * 1024 * 1024;
const FEED_ACCEPT = "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8";

const parser = new Parser<Record<string, unknown>, FeedItemExtras>({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail", { keepArray: true }],
    ],
  },
});

function isImage(node: MediaNode): boolean {
  const { medium, type } = node.$ ?? {};
  if (medium) return medium === "image";
  if (type) return type.startsWith("image/");
  return true;
}

function pickImage(item: Parser.Item & FeedItemExtras, base: string): string | null {
  const media = [...(item.mediaContent ?? []), ...(item.mediaThumbnail ?? [])]
    .filter(isImage)
    .sort((a, b) => Number(b.$?.width ?? 0) - Number(a.$?.width ?? 0));

  const candidate = media[0]?.$?.url ?? (item.enclosure?.type?.startsWith("image/") ? item.enclosure.url : undefined);

  return resolveUrl(candidate, base);
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toEntry(item: Parser.Item & FeedItemExtras, feedUrl: string): FeedEntry | null {
  const title = normalizeWhitespace(item.title ?? "");
  const url = item.link ? canonicalizeUrl(resolveUrl(item.link, feedUrl) ?? "") : null;
  if (!title || !url) return null;

  return {
    title,
    url,
    snippet: normalizeWhitespace(item.contentSnippet ?? item.summary ?? ""),
    imageUrl: pickImage(item, url),
    publishedAt: parseDate(item.isoDate ?? item.pubDate),
  };
}

export async function readFeed(feedUrl: string): Promise<FeedEntry[]> {
  const xml = await fetchText(feedUrl, {
    timeoutMs: FEED_TIMEOUT_MS,
    maxBytes: FEED_MAX_BYTES,
    accept: FEED_ACCEPT,
  });
  const feed = await parser.parseString(xml);

  return feed.items.map((item) => toEntry(item, feedUrl)).filter((entry): entry is FeedEntry => entry !== null);
}
