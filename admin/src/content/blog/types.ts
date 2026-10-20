export type BlogCategory = "Guides" | "Wireless" | "Mixing" | "Keys" | "Touring" | "Events";

export type Post = {
  slug: string;
  title: string;
  /** Shorter <title> when the headline runs long. */
  seoTitle?: string;
  description: string;
  category: BlogCategory;
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated?: string;
  keywords: string[];
  /** Equipment photo shown as the article plate. */
  image?: string;
  related?: string[];
  /** Markdown. */
  body: string;
};
