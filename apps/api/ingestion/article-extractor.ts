import { Readability } from "@mozilla/readability";
import { JSDOM, VirtualConsole } from "jsdom";
import { fetchText } from "./http";
import { isBengali, normalizeWhitespace } from "./text";
import { resolveUrl } from "./url";

export interface ExtractedArticle {
  text: string;
  imageUrl: string | null;
}

const ARTICLE_TIMEOUT_MS = 10_000;
const ARTICLE_MAX_BYTES = 3 * 1024 * 1024;
const ARTICLE_ACCEPT = "text/html, application/xhtml+xml;q=0.9";
const BLOCK_SELECTOR = "p, li, blockquote, h2, h3, h4";
const TERMINAL_PUNCTUATION = /[.!?…।]["'”’)]*$/u;
const NON_CONTENT_TAGS = /<(style|script|noscript|svg)\b[^>]*>[\s\S]*?<\/\1>/gi;
const IMAGE_META_SELECTORS = [
  'meta[property="og:image:secure_url"]',
  'meta[property="og:image"]',
  'meta[name="twitter:image"]',
  'meta[name="twitter:image:src"]',
];

function readMetaImage(document: Document, baseUrl: string): string | null {
  for (const selector of IMAGE_META_SELECTORS) {
    const image = resolveUrl(document.querySelector(selector)?.getAttribute("content"), baseUrl);
    if (image) return image;
  }
  return null;
}

function toParagraphText(contentHtml: string): string {
  const fragment = JSDOM.fragment(contentHtml);
  return [...fragment.querySelectorAll(BLOCK_SELECTOR)]
    .filter((block) => !block.querySelector(BLOCK_SELECTOR))
    .map((block) => normalizeWhitespace(block.textContent ?? ""))
    .filter(Boolean)
    .map((paragraph) =>
      TERMINAL_PUNCTUATION.test(paragraph) ? paragraph : `${paragraph}${isBengali(paragraph) ? "।" : "."}`,
    )
    .join(" ");
}

export async function extractArticle(url: string): Promise<ExtractedArticle> {
  const html = await fetchText(url, {
    timeoutMs: ARTICLE_TIMEOUT_MS,
    maxBytes: ARTICLE_MAX_BYTES,
    accept: ARTICLE_ACCEPT,
  });

  const dom = new JSDOM(html.replace(NON_CONTENT_TAGS, ""), { url, virtualConsole: new VirtualConsole() });
  try {
    const { document } = dom.window;
    const imageUrl = readMetaImage(document, url);
    const parsed = new Readability(document).parse();
    return { text: parsed?.content ? toParagraphText(parsed.content) : "", imageUrl };
  } finally {
    dom.window.close();
  }
}
