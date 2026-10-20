import type { Metadata } from "next";
import LegacyFonts from "@/components/ui/LegacyFonts";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <><LegacyFonts />{children}</>;
}
