import { Marked, type Tokens } from "marked";
import { posts, type Post } from "@/content/blog";

export type { Post };

const WORDS_PER_MINUTE = 230;

export const slugify = (text: string) =>
  text.toLowerCase().replace(/&[a-z]+;|<[^>]+>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const marked = new Marked({
  gfm: true,
  renderer: {
    // Section anchors give each H2/H3 a stable deep link and power the table of contents.
    heading({ tokens, depth }: Tokens.Heading) {
      const html = this.parser.parseInline(tokens);
      return `<h${depth} id="${slugify(html)}">${html}</h${depth}>\n`;
    },
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      const external = /^https?:\/\//.test(href);
      const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}"${title ? ` title="${title}"` : ""}${attrs}>${text}</a>`;
    },
    table(token: Tokens.Table) {
      const head = token.header.map(cell => `<th scope="col">${this.parser.parseInline(cell.tokens)}</th>`).join("");
      const rows = token.rows.map(row => `<tr>${row.map(cell => `<td>${this.parser.parseInline(cell.tokens)}</td>`).join("")}</tr>`).join("");
      return `<div class="pb-table"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
    },
  },
});

// Array.prototype.sort is stable, so same-day posts keep their curated order.
export const sortedPosts = [...posts].sort((a, b) => b.published.localeCompare(a.published));

export const getPost = (slug: string) => posts.find(post => post.slug === slug);

export const renderPost = (post: Post) => marked.parse(post.body, { async: false });

export function tableOfContents(post: Post) {
  return marked.lexer(post.body)
    .filter((token): token is Tokens.Heading => token.type === "heading" && token.depth === 2)
    .map(token => ({ id: slugify(marked.parseInline(token.text, { async: false })), text: token.text.replace(/[*_`]/g, "") }));
}

export const readingMinutes = (post: Post) =>
  Math.max(1, Math.round(post.body.split(/\s+/).filter(Boolean).length / WORDS_PER_MINUTE));

export function relatedPosts(post: Post, count = 3) {
  const explicit = (post.related ?? []).map(getPost).filter((item): item is Post => Boolean(item));
  const sameCategory = sortedPosts.filter(item => item.category === post.category && item.slug !== post.slug);
  const rest = sortedPosts.filter(item => item.slug !== post.slug);
  return [...new Map([...explicit, ...sameCategory, ...rest].map(item => [item.slug, item])).values()].slice(0, count);
}

export const formatDate = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
