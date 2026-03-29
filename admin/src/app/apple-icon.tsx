import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090f",
          position: "relative",
        }}
      >
        {/* Subtle ambient glow */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            right: "20px",
            bottom: "20px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,164,74,0.1) 0%, transparent 70%)",
          }}
        />
        {/* Border */}
        <div
          style={{
            position: "absolute",
            inset: "4px",
            border: "1px solid rgba(200,164,74,0.2)",
          }}
        />
        {/* Letters */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            marginTop: "8px",
          }}
        >
          <span
            style={{
              fontSize: "100px",
              fontWeight: 800,
              fontFamily: "system-ui",
              background: "linear-gradient(135deg, #ddb95e, #a07830)",
              backgroundClip: "text",
              color: "transparent",
              letterSpacing: "-2px",
            }}
          >
            P
          </span>
          <span
            style={{
              fontSize: "100px",
              fontWeight: 800,
              fontFamily: "system-ui",
              color: "#f1f5f9",
              letterSpacing: "-2px",
            }}
          >
            B
          </span>
        </div>
        {/* Gold accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            left: "32px",
            right: "32px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(200,164,74,0.6), transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
