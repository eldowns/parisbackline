import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow } from "@/components/site/Chrome";
import JsonLd from "@/components/site/JsonLd";
import { breadcrumbSchema } from "@/components/site/schema";
import { equipment, findEquipment } from "@/components/site/equipment";
import { BUSINESS_ID, OG_BASE, SERVICE_AREAS, WEBSITE_ID, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => equipment.map(item => ({ slug: item.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = findEquipment((await params).slug);
  if (!item) return {};
  const title = `${item.brand} ${item.name} Rental, Los Angeles`;
  const description = `Rent the ${item.brand} ${item.name} (${item.type.toLowerCase()}) in Los Angeles. ${item.description}`;
  const path = `/catalog/${item.slug}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...OG_BASE, type: "website", url: path, title: `${title} — Paris Backline`, description, images: [{ url: item.image, alt: `${item.brand} ${item.name}` }] },
    twitter: { card: "summary_large_image", images: [item.image] },
  };
}

export default async function EquipmentPage({ params }: Props) {
  const item = findEquipment((await params).slug);
  if (!item) notFound();
  const fullName = `${item.brand} ${item.name}`;
  const path = `/catalog/${item.slug}`;
  const related = equipment.filter(other => other.category === item.category && other.slug !== item.slug).slice(0, 3);
  const inquire = `/?equipment=${encodeURIComponent(fullName)}#inquire`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${absoluteUrl(path)}#service`,
        name: `${fullName} rental`,
        serviceType: `${item.type} rental`,
        description: item.overview,
        image: absoluteUrl(item.image),
        url: absoluteUrl(path),
        provider: { "@id": BUSINESS_ID },
        areaServed: SERVICE_AREAS.map(name => ({ "@type": "City", name })),
        brand: { "@type": "Brand", name: item.brand },
        category: item.category,
      },
      { "@type": "WebPage", "@id": `${absoluteUrl(path)}#webpage`, url: absoluteUrl(path), name: `${fullName} rental`, isPartOf: { "@id": WEBSITE_ID }, mainEntity: { "@id": `${absoluteUrl(path)}#service` } },
      breadcrumbSchema([{ name: "Catalog", path: "/catalog" }, { name: fullName, path }]),
    ],
  };

  return <main id="main" className="pb-detail-page">
    <JsonLd data={schema}/>
    <nav className="pb-crumbs" aria-label="Breadcrumb" data-pb-reveal="left"><Link href="/catalog">Catalog</Link><span aria-hidden="true">/</span><Link href={`/catalog?category=${encodeURIComponent(item.category)}`}>{item.category}</Link></nav>
    <section className="pb-detail-hero">
      <figure className="pb-detail-photo" data-pb-reveal="left"><img src={item.image} alt={fullName} width={600} height={450} fetchPriority="high"/></figure>
      <div className="pb-detail-intro" data-pb-reveal="left">
        <span className="pb-equipment-brand">{item.brand} / {item.type}</span>
        <h1 data-pb-glow>{item.name}</h1>
        <p>{item.overview}</p>
        <div className="pb-detail-actions"><Link href={inquire} className="pb-action pb-action-blue">Inquire about the {item.name} <Arrow diagonal/></Link><Link href="/catalog" className="pb-action">Full catalog <Arrow/></Link></div>
      </div>
    </section>
    <section className="pb-detail-specs">
      <div data-pb-reveal="left"><h2 data-pb-glow>Key features</h2><ul>{item.features.map(feature => <li key={feature}>{feature}</li>)}</ul></div>
      <div data-pb-reveal="left"><h2 data-pb-glow>Built for</h2><ul>{item.uses.map(use => <li key={use}>{use}</li>)}</ul></div>
    </section>
    <section className="pb-detail-rental" data-pb-reveal="left">
      <h2 data-pb-glow>RENTING IN<br/>LOS ANGELES.</h2>
      <p>We deliver the {fullName} across Greater Los Angeles — {SERVICE_AREAS.slice(0, 8).join(", ")} and beyond — with on-call support through your show. Availability and pricing are confirmed with your quote. Need something we don’t stock? Through our partner network, we’ll help you find it.</p>
    </section>
    {related.length > 0 && <section className="pb-detail-related" aria-labelledby="related-title">
      <h2 id="related-title" data-pb-reveal="left" data-pb-glow>MORE {item.category.toUpperCase()}</h2>
      <div className="pb-home-catalog-grid">{related.map(other => <Link className="pb-home-category" key={other.slug} href={`/catalog/${other.slug}`}>
        <div className="pb-home-product" data-pb-reveal="left"><img src={other.image} alt={`${other.brand} ${other.name}`} width={600} height={450} loading="lazy" decoding="async"/></div>
        <div className="pb-home-category-text" data-pb-reveal="left"><h3>{other.name}</h3><p>{other.brand} / {other.type}</p><Arrow diagonal/></div>
      </Link>)}</div>
    </section>}
  </main>;
}
