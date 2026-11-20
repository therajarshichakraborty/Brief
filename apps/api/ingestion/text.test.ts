import { describe, expect, it } from "vitest";
import { countWords, isBengali, tokenize, words } from "./text";

describe("words", () => {
  it("keeps Bengali words intact including vowel signs", () => {
    expect(words("প্রধানমন্ত্রী আজ কলকাতায় এসেছেন।")).toEqual(["প্রধানমন্ত্রী", "আজ", "কলকাতায়", "এসেছেন"]);
  });

  it("counts English words", () => {
    expect(countWords("The bank's decision surprised markets.")).toBe(5);
  });
});

describe("tokenize", () => {
  it("removes Bengali stopwords without stemming", () => {
    const tokens = tokenize("তিনি এবং প্রধানমন্ত্রী কলকাতায় এসেছেন");
    expect(tokens).toContain("প্রধানমন্ত্রী");
    expect(tokens).not.toContain("এবং");
  });

  it("stems English tokens and drops stopwords", () => {
    expect(tokenize("The markets are rallying")).toEqual(["market", "ralli"]);
  });
});

describe("isBengali", () => {
  it("detects Bengali script", () => {
    expect(isBengali("কলকাতা")).toBe(true);
    expect(isBengali("Kolkata")).toBe(false);
  });
});
