import Link from "next/link";
import { Arrow } from "./Chrome";
import { formatDate, readingMinutes, type Post } from "@/lib/blog";

export default function PostRow({ post, headingLevel = "h3" }: { post: Post; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return <Link href={`/blog/${post.slug}`} className="pb-post-row">
    <div className="pb-post-meta" data-pb-reveal="left"><span>{post.category}</span><span><time dateTime={post.published}>{formatDate(post.published)}</time> · {readingMinutes(post)} min read</span></div>
    <div className="pb-post-text" data-pb-reveal="left"><Heading>{post.title}</Heading><p>{post.description}</p></div>
    <Arrow diagonal/>
  </Link>;
}
