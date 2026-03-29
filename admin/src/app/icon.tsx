import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
        {/* Subtle border */}
        <div
          style={{
            position: "absolute",
            inset: "1px",
            border: "1px solid rgba(200,164,74,0.3)",
          }}
        />
        {/* P */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "0px",
            marginTop: "2px",
          }}
        >
          <span
            style={{
              fontSize: "19px",
              fontWeight: 800,
              fontFamily: "system-ui",
              background: "linear-gradient(135deg, #ddb95e, #a07830)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            P
          </span>
          <span
            style={{
              fontSize: "19px",
              fontWeight: 800,
              fontFamily: "system-ui",
              color: "#f1f5f9",
            }}
          >
            B
          </span>
        </div>
        {/* Gold accent line */}
        <div
          style={{
            position: "absolute",
            bottom: "4px",
            left: "6px",
            right: "6px",
            height: "1px",
            backgroundColor: "rgba(200,164,74,0.5)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
