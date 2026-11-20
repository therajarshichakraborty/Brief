import natural from "natural";
import { ben, eng, removeStopwords } from "stopword";

const WORD_PATTERN = /[\p{L}\p{M}\p{N}]+(?:['’][\p{L}\p{M}]+)?/gu;
const BENGALI_SCRIPT = /\p{Script=Bengali}/u;

export function normalizeWhitespace(value: string): string {
  return value.normalize("NFC").replace(/\s+/g, " ").trim();
}

export function isBengali(value: string): boolean {
  return BENGALI_SCRIPT.test(value);
}

export function words(value: string): string[] {
  return value.match(WORD_PATTERN) ?? [];
}

export function countWords(value: string): number {
  return words(value).length;
}

export function tokenize(value: string): string[] {
  const lowered = words(value.toLowerCase());
  const stems = removeStopwords(lowered, [...eng, ...ben]).filter((word) => word.length > 1);
  return stems.map((word) => (isBengali(word) ? word : natural.PorterStemmer.stem(word)));
}
