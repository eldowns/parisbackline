import type { MetadataRoute } from "next";
import { equipment } from "@/components/site/equipment";
import { sortedPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = sortedPosts.map(post => post.updated ?? post.published).sort().at(-1);
  return [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/catalog"), changeFrequency: "weekly", priority: 0.9 },
    ...equipment.map(item => ({ url: absoluteUrl(`/catalog/${item.slug}`), changeFrequency: "monthly" as const, priority: 0.8, images: [absoluteUrl(item.image)] })),
    { url: absoluteUrl("/rider-builder"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.7 },
    ...sortedPosts.map(post => ({ url: absoluteUrl(`/blog/${post.slug}`), lastModified: post.updated ?? post.published, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
