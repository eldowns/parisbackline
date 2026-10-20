import { socialCard } from "@/components/site/og";
import { getPost, readingMinutes, sortedPosts } from "@/lib/blog";

// A plain route (rather than the opengraph-image convention) keeps the URL stable,
// so the article's meta tags and JSON-LD can reference the same image.
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => sortedPosts.map(post => ({ slug: post.slug }));

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return socialCard({
    eyebrow: `Blog / ${post.category}`,
    title: post.title,
    footer: `${readingMinutes(post)} min read · Live production guides from Los Angeles`,
  });
}
