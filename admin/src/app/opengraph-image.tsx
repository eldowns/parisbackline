import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Paris Backline — Los Angeles Backline & Wireless Audio Rental";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090f",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric glow - center */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "200px",
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,164,74,0.12) 0%, transparent 70%)",
          }}
        />
        {/* Atmospheric glow - left */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "-100px",
            width: "500px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,164,74,0.08) 0%, transparent 70%)",
          }}
        />
        {/* Atmospheric glow - right */}
        <div
          style={{
            position: "absolute",
            top: "-30px",
            right: "-80px",
            width: "480px",
            height: "380px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,164,74,0.07) 0%, transparent 70%)",
          }}
        />
        {/* Floor glow */}
        <div
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "200px",
            width: "800px",
            height: "200px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(200,164,74,0.1) 0%, transparent 70%)",
          }}
        />

        {/* Top truss line */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "100px",
            right: "100px",
            height: "2px",
            background: "linear-gradient(90deg, transparent 0%, rgba(200,164,74,0.25) 20%, rgba(200,164,74,0.3) 50%, rgba(200,164,74,0.25) 80%, transparent 100%)",
          }}
        />
        {/* Second truss line */}
        <div
          style={{
            position: "absolute",
            top: "56px",
            left: "100px",
            right: "100px",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(200,164,74,0.15) 20%, rgba(200,164,74,0.2) 50%, rgba(200,164,74,0.15) 80%, transparent 100%)",
          }}
        />

        {/* Left vertical truss */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "100px",
            width: "1px",
            height: "100%",
            background: "linear-gradient(180deg, rgba(200,164,74,0.2) 0%, rgba(200,164,74,0.1) 100%)",
          }}
        />
        {/* Right vertical truss */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: "100px",
            width: "1px",
            height: "100%",
            background: "linear-gradient(180deg, rgba(200,164,74,0.2) 0%, rgba(200,164,74,0.1) 100%)",
          }}
        />

        {/* Fixture dots on truss */}
        {[300, 500, 600, 700, 900].map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              top: "44px",
              left: `${x - 4}px`,
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "rgba(200,164,74,0.35)",
            }}
          />
        ))}

        {/* Vignette overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 65% 60% at 50% 45%, transparent 0%, rgba(9,9,15,0.85) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            gap: 0,
          }}
        >
          {/* Gold rule above eyebrow */}
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "linear-gradient(90deg, #a07830, #e8c878, #a07830)",
              marginBottom: "20px",
              opacity: 0.7,
            }}
          />

          {/* Eyebrow */}
          <div
            style={{
              color: "#c8a44a",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "6px",
              opacity: 0.7,
              marginBottom: "36px",
              fontFamily: "system-ui",
            }}
          >
            GREATER LOS ANGELES · WIRELESS SPECIALISTS
          </div>

          {/* PARIS */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              letterSpacing: "8px",
              lineHeight: 1,
              background: "linear-gradient(90deg, #a07830, #e8c878, #a07830)",
              backgroundClip: "text",
              color: "transparent",
              fontFamily: "system-ui",
            }}
          >
            PARIS
          </div>

          {/* BACKLINE */}
          <div
            style={{
              fontSize: "96px",
              fontWeight: 800,
              letterSpacing: "8px",
              lineHeight: 1,
              color: "#f1f5f9",
              marginTop: "-4px",
              fontFamily: "system-ui",
            }}
          >
            BACKLINE
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              fontWeight: 300,
              letterSpacing: "1px",
              marginTop: "28px",
              opacity: 0.7,
              fontFamily: "system-ui",
            }}
          >
            Professional wireless systems and audio production equipment
          </div>

          {/* Bottom rule */}
          <div
            style={{
              width: "120px",
              height: "1px",
              backgroundColor: "rgba(200,164,74,0.3)",
              marginTop: "28px",
            }}
          />

          {/* Brand tags */}
          <div
            style={{
              color: "#c8a44a",
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "4px",
              marginTop: "20px",
              opacity: 0.5,
              fontFamily: "system-ui",
            }}
          >
            SENNHEISER · MIDAS · ALLEN & HEATH · NORD
          </div>
        </div>

        {/* URL at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "24px",
            color: "#94a3b8",
            fontSize: "11px",
            letterSpacing: "2px",
            opacity: 0.3,
            fontFamily: "system-ui",
          }}
        >
          PARISBACKLINE.COM
        </div>

        {/* Subtle border */}
        <div
          style={{
            position: "absolute",
            inset: "8px",
            border: "1px solid rgba(200,164,74,0.08)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
