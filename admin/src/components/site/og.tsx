import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "public/site", file));

// Shared social card in the site's exhibition style: carbon canvas, heavy white type, periwinkle accents.
export async function socialCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const [black, regular] = await Promise.all([font("archivo-black.ttf"), font("archivo-regular.ttf")]);
  const size = title.length > 60 ? 68 : title.length > 36 ? 84 : 132;
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#171717", color: "#fafaf8", padding: "56px 64px", fontFamily: "Archivo" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 22, letterSpacing: 1 }}>
        <div style={{ display: "flex", fontWeight: 900, fontSize: 30, letterSpacing: -1 }}>PARIS BACKLINE<span style={{ color: "#8d9fff" }}>.</span></div>
        <div style={{ display: "flex", color: "#c4c4bd" }}>{eyebrow.toUpperCase()}</div>
      </div>
      <div style={{ display: "flex", fontWeight: 900, fontSize: size, lineHeight: 0.95, letterSpacing: -size * 0.04, maxWidth: 1060 }}>{title}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #42423e", paddingTop: 24, fontSize: 22, color: "#c4c4bd" }}>
        <span>{footer}</span>
        <span style={{ color: "#8d9fff" }}>parisbackline.com</span>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "Archivo", data: black, weight: 900, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}

export async function iconImage(px: number) {
  const black = await font("archivo-black.ttf");
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#171717", color: "#fafaf8", fontFamily: "Archivo", fontWeight: 900, fontSize: px * 0.72, position: "relative" }}>
      <span style={{ marginTop: -px * 0.04 }}>P</span>
      <div style={{ position: "absolute", width: px * 0.16, height: px * 0.16, borderRadius: "50%", background: "#8d9fff", right: px * 0.16, bottom: px * 0.2 }} />
    </div>,
    { width: px, height: px, fonts: [{ name: "Archivo", data: black, weight: 900, style: "normal" }] },
  );
}
