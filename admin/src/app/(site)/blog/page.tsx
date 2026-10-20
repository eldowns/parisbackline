import type { Metadata } from "next";
import JsonLd from "@/components/site/JsonLd";
import PostRow from "@/components/site/PostRow";
import { breadcrumbSchema } from "@/components/site/schema";
import { sortedPosts } from "@/lib/blog";
import type { BlogCategory } from "@/content/blog";
import { BUSINESS_ID, OG_BASE, WEBSITE_ID, absoluteUrl } from "@/lib/site";

const description = "Practical guides to live production from Paris Backline in Los Angeles: wireless and in-ear monitors, Midas and Allen & Heath consoles, Nord keyboards, tech riders, fly dates and touring.";

export const metadata: Metadata = {
  title: "Blog — Live Production, Wireless & Touring Guides",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { ...OG_BASE, type: "website", url: "/blog", title: "The Paris Backline Blog", description },
};

const sections: { category: BlogCategory; title: string }[] = [
  { category: "Guides", title: "BACKLINE BASICS" },
  { category: "Wireless", title: "WIRELESS & IN-EARS" },
  { category: "Mixing", title: "CONSOLES & STAGE BOXES" },
  { category: "Keys", title: "KEYS" },
  { category: "Touring", title: "TOURING & ADVANCING" },
  { category: "Events", title: "EVENTS" },
];

const blogSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      "@id": `${absoluteUrl("/blog")}#blog`,
      url: absoluteUrl("/blog"),
      name: "The Paris Backline Blog",
      description,
      inLanguage: "en-US",
      isPartOf: { "@id": WEBSITE_ID },
      publisher: { "@id": BUSINESS_ID },
      blogPost: sortedPosts.map(post => ({ "@type": "BlogPosting", headline: post.title, url: absoluteUrl(`/blog/${post.slug}`), datePublished: post.published, dateModified: post.updated ?? post.published })),
    },
    breadcrumbSchema([{ name: "Blog", path: "/blog" }]),
  ],
};

export default function BlogIndex() {
  return <main id="main" className="pb-catalog-page pb-blog-page">
    <JsonLd data={blogSchema}/>
    <div className="pb-catalog-title">
      <h1 data-pb-reveal="left" data-pb-glow>THE<br/>BLOG<span>.</span></h1>
      <p data-pb-reveal="left">Field notes on wireless, consoles, keys and touring.<br/>From the Paris Backline crew in Los Angeles.</p>
    </div>
    <nav className="pb-catalog-tools pb-blog-topics" aria-label="Blog topics" data-pb-reveal="left">
      <div className="pb-filter">{sections.map(section => <a key={section.category} href={`#${section.category.toLowerCase()}`}>{section.title.toLowerCase()}</a>)}</div>
      <span className="pb-blog-count">{sortedPosts.length} articles</span>
    </nav>
    {sections.map(section => {
      const items = sortedPosts.filter(post => post.category === section.category);
      if (!items.length) return null;
      return <section key={section.category} id={section.category.toLowerCase()} className="pb-blog-section" aria-labelledby={`${section.category.toLowerCase()}-title`}>
        <h2 id={`${section.category.toLowerCase()}-title`} data-pb-reveal="left" data-pb-glow>{section.title}</h2>
        <div>{items.map(post => <PostRow key={post.slug} post={post}/>)}</div>
      </section>;
    })}
  </main>;
}
