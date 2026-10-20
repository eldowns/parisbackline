import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

// The original landing page, kept reachable for reference after the redesign moved to "/".
export const metadata: Metadata = {
  title: "Classic Site",
  robots: { index: false, follow: true },
};

export default function ClassicPage() {
  return <LandingPage />;
}
