import LegacyFonts from "@/components/ui/LegacyFonts";
import GoogleAnalytics from "@/components/site/GoogleAnalytics";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <><GoogleAnalytics /><LegacyFonts />{children}</>;
}
