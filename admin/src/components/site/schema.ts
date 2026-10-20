import { BUSINESS_ID, SERVICE_AREAS, SITE_DESCRIPTION, SITE_EMAIL, SITE_NAME, SITE_URL, WEBSITE_ID, absoluteUrl } from "@/lib/site";
import { categories, equipment } from "./equipment";

export const businessSchema = {
  "@type": "LocalBusiness",
  "@id": BUSINESS_ID,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  email: SITE_EMAIL,
  logo: absoluteUrl("/apple-icon"),
  image: absoluteUrl("/opengraph-image"),
  address: { "@type": "PostalAddress", addressLocality: "Los Angeles", addressRegion: "CA", addressCountry: "US" },
  areaServed: [
    ...SERVICE_AREAS.map(name => ({ "@type": "City", name })),
    { "@type": "AdministrativeArea", name: "Greater Los Angeles" },
  ],
  knowsAbout: ["Backline rental", "Wireless microphone systems", "In-ear monitoring", "Digital mixing consoles", "Stage keyboards", "Live event production", "Touring production"],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Backline & audio equipment rental",
    itemListElement: categories.filter(category => category !== "All equipment").map(category => ({
      "@type": "OfferCatalog",
      name: `${category} rental`,
      itemListElement: equipment.filter(item => item.category === category).map(item => ({
        "@type": "Offer",
        url: absoluteUrl(`/catalog/${item.slug}`),
        itemOffered: { "@type": "Service", name: `${item.brand} ${item.name} rental`, description: item.description },
      })),
    })),
  },
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  inLanguage: "en-US",
  publisher: { "@id": BUSINESS_ID },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
