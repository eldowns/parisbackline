import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "Paris Backline | Backline & Wireless Audio Rental · Los Angeles",
  description:
    "Paris Backline offers professional backline and wireless audio equipment rental across Greater Los Angeles. Sennheiser EW & EW-DX wireless systems, Midas M32 digital consoles, and Nord stage pianos — maintained to touring spec.",
  keywords:
    "backline rental Los Angeles, wireless audio rental LA, Sennheiser wireless rental, IEM rental Los Angeles, Midas M32 rental, audio equipment rental Greater LA, stage piano rental Los Angeles, wireless microphone rental LA",
  authors: [{ name: "Paris Backline" }],
  openGraph: {
    type: "website",
    siteName: "Paris Backline",
    title: "Paris Backline | Backline & Wireless Audio Rental · Los Angeles",
    description:
      "Professional backline and wireless audio rental across Greater Los Angeles. Sennheiser EW & EW-DX wireless, Midas M32 consoles, Nord stage pianos.",
    locale: "en_US",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Paris Backline — Backline & Wireless Audio Rental · Los Angeles" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paris Backline | Backline & Wireless Audio Rental · Los Angeles",
    description:
      "Professional backline and wireless audio rental across Greater Los Angeles. Sennheiser EW & EW-DX wireless, Midas M32 consoles, Nord stage pianos.",
    images: ["/og-image.svg"],
  },
};

export default function HomePage() {
  return <LandingPage />;
}
