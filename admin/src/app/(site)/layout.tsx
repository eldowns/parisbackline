import Motion from "@/components/site/Motion";
import Glow from "@/components/site/Glow";
import { SiteNav, SiteFooter } from "@/components/site/Chrome";
import "@/components/site/site.css";
export default function SiteLayout({children}: {children:React.ReactNode}) {
  return <div className="pb pb-motion-enabled"><link rel="preload" href="/site/archivo-black.ttf" as="font" type="font/ttf" crossOrigin="anonymous"/><a className="pb-skip" href="#main">Skip to content</a><noscript><style>{`.pb [data-pb-reveal]{opacity:1!important;transform:none!important;animation:none!important}`}</style></noscript><script dangerouslySetInnerHTML={{ __html: `(function(){var r=document.currentScript.parentElement;window.setTimeout(function(){if(!r.classList.contains('pb-motion-mounted'))r.classList.remove('pb-motion-enabled')},4000)})();` }}/><Motion /><Glow /><SiteNav />{children}<SiteFooter /></div>;
}
