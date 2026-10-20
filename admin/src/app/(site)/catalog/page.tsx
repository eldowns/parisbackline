import type {Metadata} from "next";
import Catalog from "@/components/site/Catalog";
import JsonLd from "@/components/site/JsonLd";
import { breadcrumbSchema } from "@/components/site/schema";
import { equipment } from "@/components/site/equipment";
import { BUSINESS_ID, OG_BASE, WEBSITE_ID, absoluteUrl } from "@/lib/site";

const description = "Rent Sennheiser EW-DX, EW 500 G4 and EW IEM G4 wireless, Midas M32R, M32C and DL32, Allen & Heath dLive C1500 and CDM48, and the Nord Stage 3 across Greater Los Angeles.";

export const metadata:Metadata={
  title:"Backline & Audio Rental Catalog, Los Angeles",
  description,
  alternates:{canonical:"/catalog"},
  openGraph:{...OG_BASE,type:"website",url:"/catalog",title:"Equipment Catalog — Paris Backline",description},
};

const catalogSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/catalog")}#webpage`,
      url: absoluteUrl("/catalog"),
      name: "Backline & audio equipment rental catalog",
      description,
      isPartOf: { "@id": WEBSITE_ID },
      about: { "@id": BUSINESS_ID },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: equipment.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: `${item.brand} ${item.name}`, url: absoluteUrl(`/catalog/${item.slug}`) })),
      },
    },
    breadcrumbSchema([{ name: "Catalog", path: "/catalog" }]),
  ],
};

export default function CatalogPage(){return <><JsonLd data={catalogSchema}/><Catalog/></>}
