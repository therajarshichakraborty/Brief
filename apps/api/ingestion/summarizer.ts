import sbd from "sbd";
import { isBengali, normalizeWhitespace, tokenize, words } from "./text";

interface Sentence {
  text: string;
  position: number;
  tokens: Set<string>;
}

const DEFAULT_SENTENCE_COUNT = 3;
const MAX_SUMMARY_LENGTH = 700;
const MIN_SENTENCE_WORDS = 6;
const MAX_SENTENCE_WORDS = 60;
const MAX_SENTENCES_CONSIDERED = 80;
const DAMPING = 0.85;
const ITERATIONS = 40;
const LEAD_BIAS = 0.35;
const BOILERPLATE =
  /\b(sign up|newsletter|subscribe|click here|read more|follow us|all rights reserved|cookies?|advertisement|getty images|image caption|photo credit|copyright)\b/i;
const BENGALI_BOILERPLATE = new RegExp("আরও পড়ুন|বিজ্ঞাপন|সাবস্ক্রাইব|ফলো করুন|ছবি সৌজন্যে".normalize("NFC"), "u");
const BENGALI_SENTENCE_END = /(?<=[।!?.]["'”’)]*)\s+/u;

function rawSentences(text: string): string[] {
  const normalized = normalizeWhitespace(text);
  if (isBengali(normalized)) return normalized.split(BENGALI_SENTENCE_END);
  return sbd.sentences(normalized, { newline_boundaries: false, sanitize: false });
}

function isContentSentence(sentence: string): boolean {
  const count = words(sentence).length;
  return (
    count >= MIN_SENTENCE_WORDS &&
    count <= MAX_SENTENCE_WORDS &&
    !BOILERPLATE.test(sentence) &&
    !BENGALI_BOILERPLATE.test(sentence)
  );
}

function splitSentences(text: string): Sentence[] {
  const unique = new Set(rawSentences(text).map((raw) => raw.trim()));
  return [...unique]
    .filter(isContentSentence)
    .slice(0, MAX_SENTENCES_CONSIDERED)
    .map((raw, position) => ({ text: raw, position, tokens: new Set(tokenize(raw)) }));
}

function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size < 2 || b.size < 2) return 0;
  let overlap = 0;
  for (const token of a) if (b.has(token)) overlap += 1;
  return overlap / (Math.log(a.size) + Math.log(b.size));
}

function textRank(sentences: Sentence[]): number[] {
  const size = sentences.length;
  const weights = sentences.map((a, i) => sentences.map((b, j) => (i === j ? 0 : similarity(a.tokens, b.tokens))));
  const outgoing = weights.map((row) => row.reduce((sum, weight) => sum + weight, 0));
  let scores = new Array<number>(size).fill(1 / size);

  for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
    scores = scores.map((_, i) => {
      let rank = 0;
      for (let j = 0; j < size; j += 1) {
        const total = outgoing[j] ?? 0;
        if (total > 0) rank += ((weights[j]?.[i] ?? 0) / total) * (scores[j] ?? 0);
      }
      return (1 - DAMPING) / size + DAMPING * rank;
    });
  }

  return scores;
}

function fitToLength(sentences: Sentence[]): string {
  const picked: string[] = [];
  let length = 0;
  for (const { text } of sentences) {
    if (picked.length > 0 && length + text.length + 1 > MAX_SUMMARY_LENGTH) break;
    picked.push(text);
    length += text.length + 1;
  }
  return picked.join(" ");
}

export function summarize(text: string, sentenceCount = DEFAULT_SENTENCE_COUNT): string | null {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return null;
  if (sentences.length <= sentenceCount) return fitToLength(sentences);

  const scores = textRank(sentences);
  const leadWeight = (position: number) => 1 + LEAD_BIAS * (1 - position / sentences.length);

  const selected = sentences
    .map((sentence, index) => ({ sentence, score: (scores[index] ?? 0) * leadWeight(sentence.position) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, sentenceCount)
    .map(({ sentence }) => sentence)
    .sort((a, b) => a.position - b.position);

  return fitToLength(selected);
}
