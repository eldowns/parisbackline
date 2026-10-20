import { OG_SIZE, socialCard } from "@/components/site/og";

export const alt = "Paris Backline — Backline & wireless audio rental in Los Angeles";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return socialCard({ eyebrow: "Los Angeles, California", title: "Sound, in its element.", footer: "Backline & wireless audio rental · Greater Los Angeles" });
}
