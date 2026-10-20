export const SITE_URL = "https://parisbackline.com";
export const SITE_NAME = "Paris Backline";
export const SITE_EMAIL = "parisbackline@gmail.com";
export const SITE_TAGLINE = "Backline & wireless audio rental in Los Angeles";
export const SITE_DESCRIPTION =
  "Professional backline and wireless audio rental across Greater Los Angeles. Sennheiser EW-DX, EW 500 G4 and IEM G4 wireless, Midas M32 and Allen & Heath dLive consoles, and Nord Stage 3 keys — with delivery and on-call support.";

export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const SERVICE_AREAS = [
  "Los Angeles",
  "Hollywood",
  "West Hollywood",
  "Downtown Los Angeles",
  "Santa Monica",
  "Burbank",
  "Glendale",
  "Pasadena",
  "Culver City",
  "Long Beach",
] as const;

// Child pages that set openGraph replace the root object, so they spread this back in.
export const OG_BASE = {
  siteName: SITE_NAME,
  locale: "en_US",
  images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Paris Backline — Backline & wireless audio rental in Los Angeles" }],
};

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
