export const JOKE_CATEGORIES = [
  "general",
  "programming",
  "dad",
  "science",
] as const;

export type JokeCategory = (typeof JOKE_CATEGORIES)[number];

export const DEFAULT_JOKE_CATEGORY: JokeCategory = "general";
