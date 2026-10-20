import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/site/Chrome";
import JsonLd from "@/components/site/JsonLd";
import PostRow from "@/components/site/PostRow";
import { breadcrumbSchema } from "@/components/site/schema";
import { formatDate, getPost, readingMinutes, relatedPosts, renderPost, sortedPosts, tableOfContents } from "@/lib/blog";
import { BUSINESS_ID, OG_BASE, SITE_NAME, WEBSITE_ID, absoluteUrl } from "@/lib/site";
import { equipment } from "@/components/site/equipment";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => sortedPosts.map(post => ({ slug: post.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.seoTitle ?? post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: path },
    authors: [{ name: SITE_NAME, url: absoluteUrl("/") }],
    openGraph: {
      ...OG_BASE,
      type: "article",
      url: path,
      title: post.title,
      description: post.description,
      publishedTime: post.published,
      modifiedTime: post.updated ?? post.published,
      section: post.category,
      tags: post.keywords,
      images: [{ url: `${path}/social.png`, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description, images: [`${path}/social.png`] },
  };
}

export default async function BlogPost({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const toc = tableOfContents(post);
  const minutes = readingMinutes(post);
  const plated = equipment.find(item => item.image === post.image);
  const plateAlt = plated ? `${plated.brand} ${plated.name}` : "";
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${absoluteUrl(path)}#article`,
        headline: post.title,
        description: post.description,
        url: absoluteUrl(path),
        mainEntityOfPage: absoluteUrl(path),
        datePublished: post.published,
        dateModified: post.updated ?? post.published,
        image: [absoluteUrl(`${path}/social.png`), ...(post.image ? [absoluteUrl(post.image)] : [])],
        articleSection: post.category,
        keywords: post.keywords.join(", "),
        wordCount: post.body.split(/\s+/).filter(Boolean).length,
        timeRequired: `PT${minutes}M`,
        inLanguage: "en-US",
        author: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
        publisher: { "@id": BUSINESS_ID },
        isPartOf: [{ "@id": `${absoluteUrl("/blog")}#blog` }, { "@id": WEBSITE_ID }],
      },
      breadcrumbSchema([{ name: "Blog", path: "/blog" }, { name: post.title, path }]),
    ],
  };

  return <main id="main" className="pb-article-page">
    <JsonLd data={schema}/>
    <nav className="pb-crumbs" aria-label="Breadcrumb" data-pb-reveal="left"><Link href="/blog">Blog</Link><span aria-hidden="true">/</span><Link href={`/blog#${post.category.toLowerCase()}`}>{post.category}</Link></nav>
    <article>
      <header className="pb-article-head">
        <h1 data-pb-reveal="left" data-pb-glow>{post.title}</h1>
        <div className="pb-article-deck" data-pb-reveal="left">
          <p>{post.description}</p>
          <span>By {SITE_NAME} · <time dateTime={post.published}>{formatDate(post.published)}</time> · {minutes} min read</span>
        </div>
      </header>
      {post.image && <figure className="pb-article-plate" data-pb-reveal="left"><img src={post.image} alt={plateAlt} width={600} height={450} fetchPriority="high"/></figure>}
      <div className="pb-article-layout">
        {toc.length > 2 && <aside className="pb-article-toc" aria-label="On this page"><span>On this page</span><ol>{toc.map(item => <li key={item.id}><a href={`#${item.id}`}>{item.text}</a></li>)}</ol></aside>}
        <div className="pb-prose" dangerouslySetInnerHTML={{ __html: renderPost(post) }}/>
      </div>
    </article>
    <section className="pb-article-related" aria-labelledby="related-title">
      <h2 id="related-title" data-pb-reveal="left" data-pb-glow>KEEP READING</h2>
      <div>{relatedPosts(post).map(item => <PostRow key={item.slug} post={item}/>)}</div>
    </section>
    <aside className="pb-catalog-help"><h2 data-pb-reveal="left" data-pb-glow>YOUR NEXT<br/>GREAT SHOW.</h2><Link data-pb-reveal="left" href="/#inquire" className="pb-action pb-action-blue">Send us your rider <Arrow diagonal/></Link></aside>
  </main>;
}
