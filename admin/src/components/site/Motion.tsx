"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STAGGER_MS = 180;
// Large batches (fast scrolls, jump links) compress the step so order stays strict.
const MAX_STAGGER_TOTAL_MS = 1080;

export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.querySelector<HTMLElement>(".pb");
    const exhibition = document.querySelector<HTMLElement>(".pb-exhibition");
    let frame = 0;

    const paint = () => {
      frame = 0;
      const reduced = media.matches;
      root?.style.setProperty("--hero-shift", reduced ? "0px" : `${Math.min(window.scrollY * 0.12, 90)}px`);
      if (exhibition) {
        const rect = exhibition.getBoundingClientRect();
        // Expand while the photograph keeps moving up through normal document flow.
        const progress = reduced ? 0 : Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.85)));
        exhibition.style.setProperty("--open", String(progress));
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    paint();

    let contentReady = pathname !== "/catalog";
    if (contentReady) root?.classList.add("pb-motion-enabled", "pb-motion-mounted");
    const registered = new WeakSet<Element>();
    const waiting = new Set<HTMLElement>();

    const settle = (element: HTMLElement) => {
      waiting.delete(element);
      observer.unobserve(element);
      footerObserver.unobserve(element);
    };
    // Once an entrance finishes the animation is removed for good, so later style changes
    // (focus, hover, re-renders) can never restart it.
    const finish = (element: HTMLElement) => {
      settle(element);
      element.classList.add("pb-in-view", "pb-revealed");
    };

    const reveal = (entries: IntersectionObserverEntry[]) => {
      const triggered = entries.filter(entry => entry.isIntersecting).map(entry => entry.target as HTMLElement);
      if (!triggered.length) return;
      const rects = new Map<HTMLElement, DOMRect>();
      const rectOf = (element: HTMLElement) => {
        let rect = rects.get(element);
        if (!rect) { rect = element.getBoundingClientRect(); rects.set(element, rect); }
        return rect;
      };
      // Pull in pending targets that share a row with a triggered one, so every row enters
      // as a single right-to-left sequence even when its items cross the threshold at different times.
      const batch = new Set(triggered);
      waiting.forEach(element => {
        if (batch.has(element)) return;
        const rect = rectOf(element);
        if (!rect.width || rect.top >= window.innerHeight) return;
        if (triggered.some(target => { const other = rectOf(target); return rect.top < other.bottom && rect.bottom > other.top; })) batch.add(element);
      });
      // Group into rows by vertical overlap; rows play top to bottom, each from right to left.
      const rows: { top: number; bottom: number; items: HTMLElement[] }[] = [];
      [...batch].sort((a, b) => rectOf(a).top - rectOf(b).top).forEach(element => {
        const rect = rectOf(element);
        const row = rows[rows.length - 1];
        if (row && rect.top < row.bottom && rect.bottom > row.top) {
          row.items.push(element);
          row.bottom = Math.max(row.bottom, rect.bottom);
        } else rows.push({ top: rect.top, bottom: rect.bottom, items: [element] });
      });
      const ordered = rows.flatMap(row => row.items.sort((a, b) => rectOf(b).left - rectOf(a).left || rectOf(a).top - rectOf(b).top));
      const step = ordered.length > 1 ? Math.min(STAGGER_MS, MAX_STAGGER_TOTAL_MS / (ordered.length - 1)) : 0;
      ordered.forEach((element, index) => {
        const rect = rectOf(element);
        // The element's right edge starts beyond the left edge of the viewport.
        element.style.setProperty("--reveal-start", `${-(Math.max(0, rect.left) + rect.width + 32)}px`);
        element.style.setProperty("--reveal-delay", `${Math.round(index * step)}ms`);
        element.classList.add("pb-in-view");
        settle(element);
      });
    };
    const observer = new IntersectionObserver(reveal, { threshold: 0.22, rootMargin: "0px 0px -14% 0px" });
    // The final footer lines cannot scroll past an inset viewport boundary.
    const footerObserver = new IntersectionObserver(reveal, { threshold: 0.1 });

    const register = () => {
      if (!contentReady) return;
      root?.querySelectorAll<HTMLElement>("[data-pb-reveal]").forEach(element => {
        if (registered.has(element) || element.classList.contains("pb-in-view")) return;
        registered.add(element);
        if (media.matches) { finish(element); return; }
        waiting.add(element);
        if (element.closest(".pb-footer")) footerObserver.observe(element);
        else observer.observe(element);
      });
    };
    const onContentReady = () => {
      contentReady = true;
      root?.classList.add("pb-motion-enabled", "pb-motion-mounted");
      register();
    };
    window.addEventListener("pb-content-ready", onContentReady);
    register();
    // Search and form state can insert new content without changing the route.
    const mutations = new MutationObserver(register);
    if (root) mutations.observe(root, { childList: true, subtree: true });

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === "pb-reveal-left") finish(event.target as HTMLElement);
    };
    // Keyboard and pointer focus reveal the focused target (and its row group) immediately.
    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as Element;
      const group = target.closest(".pb-home-category, .pb-equipment, .pb-post-row");
      const elements = new Set<HTMLElement>(group ? Array.from(group.querySelectorAll<HTMLElement>("[data-pb-reveal]")) : []);
      for (let element = target.closest<HTMLElement>("[data-pb-reveal]"); element; element = element.parentElement?.closest<HTMLElement>("[data-pb-reveal]") ?? null) elements.add(element);
      elements.forEach(finish);
    };
    root?.addEventListener("animationend", onAnimationEnd);
    root?.addEventListener("focusin", onFocusIn);

    const revealForReducedMotion = () => {
      if (!media.matches) return;
      root?.querySelectorAll<HTMLElement>("[data-pb-reveal]").forEach(finish);
    };
    media.addEventListener("change", revealForReducedMotion);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
      observer.disconnect();
      footerObserver.disconnect();
      mutations.disconnect();
      window.removeEventListener("pb-content-ready", onContentReady);
      root?.removeEventListener("animationend", onAnimationEnd);
      root?.removeEventListener("focusin", onFocusIn);
      media.removeEventListener("change", revealForReducedMotion);
    };
  }, [pathname]);

  return null;
}
