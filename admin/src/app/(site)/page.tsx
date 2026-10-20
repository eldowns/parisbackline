import type { Metadata } from "next";
import Link from "next/link";
import { equipment } from "@/components/site/equipment";
import Inquiry from "@/components/site/Inquiry";
import {Arrow} from "@/components/site/Chrome";
import Flywheel from "@/components/site/Flywheel";
import JsonLd from "@/components/site/JsonLd";
import { businessSchema, websiteSchema } from "@/components/site/schema";
import { OG_BASE, SITE_DESCRIPTION, SITE_URL, WEBSITE_ID, BUSINESS_ID } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Backline & Wireless Audio Rental Los Angeles | Paris Backline" },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { ...OG_BASE, type: "website", url: "/", title: "Paris Backline — Backline & Wireless Audio Rental, Los Angeles", description: SITE_DESCRIPTION },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    businessSchema,
    websiteSchema,
    { "@type": "WebPage", "@id": `${SITE_URL}/#webpage`, url: SITE_URL, name: "Backline & Wireless Audio Rental Los Angeles", description: SITE_DESCRIPTION, isPartOf: { "@id": WEBSITE_ID }, about: { "@id": BUSINESS_ID }, inLanguage: "en-US" },
  ],
};

export default function Home(){return <main id="main">
<JsonLd data={homeSchema}/>
<section className="pb-hero"><div className="pb-hero-title" data-pb-reveal="left"><h1 data-pb-glow><span>PARIS</span><span>BACKLINE<span className="pb-title-period" aria-hidden="true"><span/></span></span></h1><div className="pb-hero-side"><span>LIVE SOUND.<br/>FULL EXPRESSION.</span><Flywheel/></div></div><div className="pb-hero-bottom"><p data-pb-reveal="left">Professional backline & wireless audio rental.<br/>For the moments that move you.</p><span className="pb-hero-city" data-pb-reveal="left">BASED IN LOS ANGELES.<br/>BUILT FOR YOUR STAGE.</span></div></section>
<section className="pb-exhibition" aria-label="Live music photography"><div className="pb-exhibition-flow" data-pb-reveal="left"><div className="pb-image-frame"><img src="/site/live-stage.webp" alt="An outdoor concert crowd facing a brilliantly illuminated stage" width={1600} height={1067} fetchPriority="high" decoding="async"/><div className="pb-image-label"><span>THE MOMENT IS EVERYTHING.</span><span>SCROLL TO FEEL IT <svg className="pb-down-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3v17m-6-6 6 6 6-6"/></svg></span></div></div></div></section>
<section className="pb-home-catalog" aria-labelledby="home-catalog-title" id="catalog">
  <div className="pb-home-catalog-heading"><h2 id="home-catalog-title" data-pb-reveal="left" data-pb-glow>CATALOG</h2><Link data-pb-reveal="left" href="/catalog" className="pb-action">Browse all equipment <Arrow diagonal/></Link></div>
  <div className="pb-home-catalog-grid">{["EW-DX", "M32R", "Stage 3"].map((name) => {
    const item = equipment.find(item => item.name === name)!;
    return <Link className="pb-home-category" key={name} href={`/catalog?category=${encodeURIComponent(item.category)}`} aria-label={`Browse ${item.category} equipment`}>
      <div className="pb-home-product" data-pb-reveal="left"><img src={item.image} alt={`${item.brand} ${item.name}`} width={600} height={450} loading="lazy" decoding="async"/></div>
      <div className="pb-home-category-text" data-pb-reveal="left"><h3>{item.category}</h3><p>{item.brand} {item.name}</p><Arrow diagonal/></div>
    </Link>;
  })}</div>
</section>
<section className="pb-service" id="about"><div><h2 data-pb-reveal="left" data-pb-glow>IF WE DON’T HAVE IT,<br/>WE’LL HELP FIND IT.</h2><p data-pb-reveal="left">Our house stock is just the beginning. Through our network of partners across Los Angeles, we can help source the backline your production needs.</p><Link data-pb-reveal="left" href="#inquire">Send us your rider <Arrow diagonal/></Link></div></section>
<Inquiry/></main>}
