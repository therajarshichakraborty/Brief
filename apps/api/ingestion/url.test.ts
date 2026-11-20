import { describe, expect, it } from "vitest";
import { canonicalizeUrl, resolveUrl } from "./url";

describe("canonicalizeUrl", () => {
  it("strips tracking parameters and fragments", () => {
    expect(canonicalizeUrl("https://example.com/story?id=7&utm_source=rss&fbclid=abc#top")).toBe(
      "https://example.com/story?id=7",
    );
  });

  it("rejects invalid and non-http urls", () => {
    expect(canonicalizeUrl("not a url")).toBeNull();
    expect(canonicalizeUrl("javascript:alert(1)")).toBeNull();
  });
});

describe("resolveUrl", () => {
  it("resolves relative paths against the base", () => {
    expect(resolveUrl("/images/a.jpg", "https://example.com/news/story")).toBe("https://example.com/images/a.jpg");
  });

  it("returns null for empty or unsafe values", () => {
    expect(resolveUrl(undefined, "https://example.com")).toBeNull();
    expect(resolveUrl("data:image/png;base64,AAAA", "https://example.com")).toBeNull();
  });
});
