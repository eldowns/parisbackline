export default function PartnerThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#09090f" }}>
      <div className="max-w-md w-full text-center">
        <h1
          className="text-5xl mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
        >
          PARIS{" "}
          <span style={{ color: "#c8a44a" }}>BACKLINE</span>
        </h1>
        <p
          className="text-xs uppercase tracking-widest mb-10"
          style={{ color: "#6a6a7a", letterSpacing: "0.28em" }}
        >
          Equipment Partner Program
        </p>
        <h2
          className="text-3xl mb-4"
          style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#c8a44a", letterSpacing: "0.06em" }}
        >
          THANK YOU
        </h2>
        <p style={{ color: "#a0a0b0", fontSize: "0.9rem", lineHeight: 1.8 }}>
          Your application has been received. We&apos;ll review your submission and
          be in touch shortly.
        </p>
        <p className="mt-6" style={{ color: "#3a3a4a", fontSize: "0.8rem" }}>
          Questions? Reach us at{" "}
          <a href="mailto:parisbackline@gmail.com" style={{ color: "#6a6a7a" }}>
            parisbackline@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
