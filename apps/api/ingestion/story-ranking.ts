import { tokenize } from "./text";

export interface RankableArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  imageUrl: string | null;
  publishedAt: Date;
}

export interface RankedStory {
  lead: RankableArticle;
  coverage: number;
  score: number;
}

type Vector = Map<string, number>;

interface Cluster {
  centroid: Vector;
  members: RankableArticle[];
}

const SIMILARITY_THRESHOLD = 0.32;
const TITLE_WEIGHT = 2;
const SUMMARY_PREFIX_LENGTH = 400;
const RECENCY_HALF_LIFE_HOURS = 8;
const HOUR_IN_MS = 60 * 60 * 1000;

function termFrequencies(article: RankableArticle): Map<string, number> {
  const counts = new Map<string, number>();
  const add = (tokens: string[], weight: number) => {
    for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + weight);
  };
  add(tokenize(article.title), TITLE_WEIGHT);
  add(tokenize(article.summary.slice(0, SUMMARY_PREFIX_LENGTH)), 1);
  return counts;
}

function normalize(vector: Vector): Vector {
  let norm = 0;
  for (const value of vector.values()) norm += value * value;
  norm = Math.sqrt(norm);
  if (norm === 0) return vector;
  return new Map([...vector].map(([term, value]) => [term, value / norm]));
}

function buildVectors(articles: RankableArticle[]): Vector[] {
  const frequencies = articles.map(termFrequencies);
  const documentFrequency = new Map<string, number>();
  for (const terms of frequencies) {
    for (const term of terms.keys()) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  }

  const total = articles.length;
  return frequencies.map((terms) =>
    normalize(
      new Map(
        [...terms].map(([term, count]) => [term, count * Math.log(1 + total / (documentFrequency.get(term) ?? 1))]),
      ),
    ),
  );
}

function cosine(a: Vector, b: Vector): number {
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let dot = 0;
  for (const [term, value] of small) dot += value * (large.get(term) ?? 0);
  return dot;
}

function merge(centroid: Vector, vector: Vector, memberCount: number): Vector {
  const merged = new Map<string, number>();
  for (const [term, value] of centroid) merged.set(term, value * memberCount);
  for (const [term, value] of vector) merged.set(term, (merged.get(term) ?? 0) + value);
  return normalize(merged);
}

function clusterArticles(articles: RankableArticle[]): Cluster[] {
  const ordered = [...articles].sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
  const vectors = buildVectors(ordered);
  const clusters: Cluster[] = [];

  ordered.forEach((article, index) => {
    const vector = vectors[index] ?? new Map<string, number>();
    let best: Cluster | undefined;
    let bestScore = SIMILARITY_THRESHOLD;

    for (const cluster of clusters) {
      const score = cosine(cluster.centroid, vector);
      if (score >= bestScore) {
        best = cluster;
        bestScore = score;
      }
    }

    if (best) {
      best.centroid = merge(best.centroid, vector, best.members.length);
      best.members.push(article);
    } else {
      clusters.push({ centroid: vector, members: [article] });
    }
  });

  return clusters;
}

function pickLead(members: RankableArticle[]): RankableArticle {
  return [...members].sort((a, b) => {
    const imageOrder = Number(b.imageUrl !== null) - Number(a.imageUrl !== null);
    return imageOrder !== 0 ? imageOrder : b.publishedAt.getTime() - a.publishedAt.getTime();
  })[0] as RankableArticle;
}

export function rankStories(articles: RankableArticle[], now: Date, limit: number): RankedStory[] {
  return clusterArticles(articles)
    .map(({ members }) => {
      const coverage = new Set(members.map((member) => member.source)).size;
      const newest = Math.max(...members.map((member) => member.publishedAt.getTime()));
      const ageHours = Math.max(0, now.getTime() - newest) / HOUR_IN_MS;
      const recency = 2 ** (-ageHours / RECENCY_HALF_LIFE_HOURS);
      return { lead: pickLead(members), coverage, score: coverage + recency };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
