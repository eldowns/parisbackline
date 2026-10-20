"use client";

import { useEffect, useRef } from "react";

const TOP_SPEED = 1080; // deg/s — below the rate where the 8 spokes would strobe at 60 Hz
const SPIN_UP_SECONDS = 0.55; // time constant while the pointer is over the mark
const COAST_SECONDS = 0.85; // friction time constant after the pointer leaves

// The hero asterisk behaves like a flywheel: hovering spins it up toward top speed,
// leaving lets it coast down under friction instead of stopping dead.
export default function Flywheel() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let angle = 0, velocity = 0, driven = false, frame = 0, last = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      velocity = driven
        ? velocity + (TOP_SPEED - velocity) * (1 - Math.exp(-dt / SPIN_UP_SECONDS))
        : velocity * Math.exp(-dt / COAST_SECONDS);
      angle = (angle + velocity * dt) % 360;
      svg.style.transform = `rotate(${angle}deg)`;
      if (!driven && velocity < 4) { frame = 0; velocity = 0; return; }
      frame = requestAnimationFrame(tick);
    };
    const start = () => { if (!frame) { last = performance.now(); frame = requestAnimationFrame(tick); } };
    const enter = () => { if (media.matches) return; driven = true; start(); };
    const leave = () => { driven = false; };

    svg.addEventListener("pointerenter", enter);
    svg.addEventListener("pointerleave", leave);
    return () => {
      svg.removeEventListener("pointerenter", enter);
      svg.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <svg ref={ref} className="pb-flywheel" viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 4v72M4 40h72M14.5 14.5l51 51M14.5 65.5l51-51" stroke="currentColor" strokeWidth="9"/></svg>;
}
