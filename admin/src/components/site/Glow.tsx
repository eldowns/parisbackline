"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const FOLLOW = 0.18; // fraction of the remaining distance the head travels each frame
const TRAIL_FOLLOW = 0.235; // each trail point chases the one ahead of it by this fraction
const TRAIL_LENGTH = 20; // must match the trail layers on [data-pb-glow] in site.css
const TRAIL_FADE_DISTANCE = 24; // px of separation before a trail point is fully visible
const TRAIL_GAP = 10; // px from the point ahead before a trail point is fully visible

// Headings marked data-pb-glow have their background clipped to the letterforms (see site.css),
// so radial gradients that track the pointer read as light moving inside the letters. A chain
// of fainter points chases the head, leaving a comet-like trail that collapses at rest.
function attachGlow(title: HTMLElement, media: MediaQueryList) {
  const points = Array.from({ length: TRAIL_LENGTH + 1 }, () => ({ x: 0, y: 0 }));
  let targetX = 0, targetY = 0, frame = 0;

  const paint = () => {
    const reduced = media.matches;
    const [head] = points;
    head.x += (targetX - head.x) * (reduced ? 1 : FOLLOW);
    head.y += (targetY - head.y) * (reduced ? 1 : FOLLOW);
    let moving = Math.abs(targetX - head.x) + Math.abs(targetY - head.y) > 0.5;
    title.style.setProperty("--gx", `${head.x}px`);
    title.style.setProperty("--gy", `${head.y}px`);
    for (let i = 1; i < points.length; i++) {
      const point = points[i], ahead = points[i - 1];
      if (reduced) { point.x = head.x; point.y = head.y; }
      point.x += (ahead.x - point.x) * TRAIL_FOLLOW;
      point.y += (ahead.y - point.y) * TRAIL_FOLLOW;
      const spread = Math.hypot(point.x - head.x, point.y - head.y);
      const gap = Math.hypot(point.x - ahead.x, point.y - ahead.y);
      if (spread > 0.5) moving = true;
      title.style.setProperty(`--t${i}x`, `${point.x}px`);
      title.style.setProperty(`--t${i}y`, `${point.y}px`);
      // Points sitting on the head would only thicken it, and points bunched on the one ahead
      // (the tail's start before it stretches out) would stack into a bright spot, so both fade.
      title.style.setProperty(`--t${i}a`, String(Math.min(1, spread / TRAIL_FADE_DISTANCE) * Math.min(1, gap / TRAIL_GAP)));
    }
    frame = moving ? requestAnimationFrame(paint) : 0;
  };
  const aim = (event: PointerEvent) => {
    const rect = title.getBoundingClientRect();
    targetX = event.clientX - rect.left;
    targetY = event.clientY - rect.top;
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    aim(event);
    if (!frame) frame = requestAnimationFrame(paint);
  };
  const enter = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    // Start the glow (and its collapsed trail) under the pointer instead of sliding in from the last exit point.
    aim(event);
    points.forEach(point => { point.x = targetX; point.y = targetY; });
    cancelAnimationFrame(frame);
    frame = 0;
    paint();
    title.classList.add("pb-glowing");
  };
  const leave = () => title.classList.remove("pb-glowing");

  title.addEventListener("pointerenter", enter);
  title.addEventListener("pointermove", move);
  title.addEventListener("pointerleave", leave);
  return () => {
    title.removeEventListener("pointerenter", enter);
    title.removeEventListener("pointermove", move);
    title.removeEventListener("pointerleave", leave);
    cancelAnimationFrame(frame);
  };
}

export default function Glow() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cleanups = Array.from(document.querySelectorAll<HTMLElement>(".pb [data-pb-glow]")).map(title => attachGlow(title, media));
    return () => cleanups.forEach(cleanup => cleanup());
  }, [pathname]);

  return null;
}
