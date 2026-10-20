import type { Metadata } from "next";
import Link from "next/link";
import { Arrow } from "@/components/site/Chrome";
import JsonLd from "@/components/site/JsonLd";
import RiderBuilder from "@/components/site/RiderBuilder";
import { breadcrumbSchema } from "@/components/site/schema";
import { BUSINESS_ID, OG_BASE, WEBSITE_ID, absoluteUrl } from "@/lib/site";

const description = "Build a clean, professional backline rider in minutes. Add your artist and contact details, list your backline one item at a time, and download a formatted PDF — free.";

export const metadata: Metadata = {
  title: "Free Backline Rider Builder — Create a Rider PDF",
  description,
  alternates: { canonical: "/rider-builder" },
  openGraph: { ...OG_BASE, type: "website", url: "/rider-builder", title: "Backline Rider Builder — Paris Backline", description },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "WebPage", "@id": `${absoluteUrl("/rider-builder")}#webpage`, url: absoluteUrl("/rider-builder"), name: "Backline Rider Builder", description, isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": BUSINESS_ID } },
    breadcrumbSchema([{ name: "Rider builder", path: "/rider-builder" }]),
  ],
};

export default function RiderBuilderPage() {
  return <main id="main" className="pb-catalog-page pb-rider-page">
    <JsonLd data={schema}/>
    <div className="pb-catalog-title">
      <h1 data-pb-reveal="left" data-pb-glow>BUILD<br/>YOUR RIDER<span>.</span></h1>
      <p data-pb-reveal="left">A simple backline rider, formatted for you.<br/>Add your gear one item at a time, then export a PDF.</p>
    </div>
    <RiderBuilder/>
    <aside className="pb-catalog-help"><h2 data-pb-reveal="left" data-pb-glow>NEED THE GEAR<br/>ON THE RIDER?</h2><Link data-pb-reveal="left" href="/#inquire" className="pb-action pb-action-blue">Send it to us <Arrow diagonal/></Link></aside>
  </main>;
}

