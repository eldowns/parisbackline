import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

const baseUrl = "https://parisbackline.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Los Angeles Backline Rental | Paris Backline — Wireless Audio & Equipment Rental LA",
  description:
    "Los Angeles backline rental by Paris Backline. Sennheiser EW-DX & EW-500 wireless systems, Midas M32 digital consoles, Allen & Heath, Nord stage pianos, and IEM rentals across Greater Los Angeles. Touring-spec gear, reliable delivery, on-call support.",
  keywords:
    "Los Angeles backline rental, backline rental LA, wireless audio rental Los Angeles, Sennheiser wireless rental LA, IEM rental Los Angeles, Midas M32 rental Los Angeles, audio equipment rental Los Angeles, stage piano rental LA, wireless microphone rental Los Angeles, live sound equipment rental LA, event equipment rental Los Angeles, backline company Los Angeles, PA rental LA, tour backline rental California, Greater Los Angeles audio rental",
  authors: [{ name: "Paris Backline" }],
  alternates: {
    canonical: baseUrl,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "Paris Backline",
    title: "Los Angeles Backline Rental | Paris Backline",
    description:
      "Professional backline and wireless audio equipment rental across Greater Los Angeles. Sennheiser wireless, Midas consoles, IEM systems, Nord pianos — maintained to touring spec.",
    url: baseUrl,
    locale: "en_US",
    images: [{ url: `${baseUrl}/opengraph-image`, width: 1200, height: 630, alt: "Paris Backline — Los Angeles Backline & Wireless Audio Rental" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Los Angeles Backline Rental | Paris Backline",
    description:
      "Professional backline and wireless audio rental across Greater Los Angeles. Sennheiser wireless, Midas consoles, IEM systems, Nord pianos.",
    images: [`${baseUrl}/opengraph-image`],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
