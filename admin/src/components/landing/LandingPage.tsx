"use client";

import { useEffect } from "react";
import "./landing.css";

export default function LandingPage() {
  useEffect(() => {
    // Nav scroll effect
    const nav = document.getElementById("nav");
    const handleScroll = () => {
      nav?.classList.toggle("scrolled", window.scrollY > 48);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Scroll reveals
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // Film grain animation
    const grainEl = document.getElementById("grain-seed");
    let seed = 0,
      tick = 0,
      raf: number;
    if (grainEl) {
      (function loop() {
        if (++tick % 3 === 0) grainEl.setAttribute("seed", String((seed = (seed + 1) % 200)));
        raf = requestAnimationFrame(loop);
      })();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const btn = form.querySelector(".form-submit") as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = "Sending\u2026";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.style.display = "none";
        document.getElementById("form-success")?.classList.add("visible");
      } else {
        btn.disabled = false;
        btn.textContent = "Send Inquiry \u2192";
      }
    } catch {
      btn.disabled = false;
      btn.textContent = "Send Inquiry \u2192";
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://parisbackline.com/#business",
        name: "Paris Backline",
        description: "Professional backline and wireless audio equipment rental serving Greater Los Angeles. Sennheiser wireless specialists, Midas digital consoles, IEM systems, and Nord stage pianos — maintained to touring spec.",
        url: "https://parisbackline.com",
        telephone: "",
        email: "parisbackline@gmail.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Los Angeles",
          addressRegion: "CA",
          addressCountry: "US",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 34.0522,
          longitude: -118.2437,
        },
        areaServed: [
          { "@type": "City", name: "Los Angeles" },
          { "@type": "City", name: "Hollywood" },
          { "@type": "City", name: "West Hollywood" },
          { "@type": "City", name: "Santa Monica" },
          { "@type": "City", name: "Burbank" },
          { "@type": "City", name: "Glendale" },
          { "@type": "City", name: "Pasadena" },
          { "@type": "City", name: "Long Beach" },
          { "@type": "City", name: "Downtown Los Angeles" },
          { "@type": "AdministrativeArea", name: "Greater Los Angeles" },
        ],
        priceRange: "$$",
        image: "https://parisbackline.com/opengraph-image",
        sameAs: [],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Backline & Audio Equipment Rental",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Backline Rental Los Angeles", description: "Professional backline equipment rental for live events, tours, and productions across Greater Los Angeles" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wireless Microphone Rental", description: "Sennheiser EW-500 G4 and EW-DX digital wireless microphone and bodypack system rental" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "IEM Rental Los Angeles", description: "Sennheiser EW IEM G4 in-ear monitor wireless system rental for live performance" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Console Rental", description: "Midas M32R, M32C, DL32, Allen & Heath C1500 and CDM48 digital mixing console rental" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Stage Piano Rental", description: "Nord Stage 3 weighted stage piano rental for live performance" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Audio Equipment Delivery Los Angeles", description: "Reliable equipment delivery and on-call support across Greater Los Angeles" } },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://parisbackline.com/#website",
        url: "https://parisbackline.com",
        name: "Paris Backline",
        publisher: { "@id": "https://parisbackline.com/#business" },
      },
      {
        "@type": "WebPage",
        "@id": "https://parisbackline.com/#webpage",
        url: "https://parisbackline.com",
        name: "Los Angeles Backline Rental | Paris Backline",
        isPartOf: { "@id": "https://parisbackline.com/#website" },
        about: { "@id": "https://parisbackline.com/#business" },
        description: "Professional backline and wireless audio equipment rental across Greater Los Angeles.",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* NAV */}
      <nav id="nav">
        <a href="#" className="nav-logo"><span className="text-gold">PARIS</span> BACKLINE</a>
        <a href="#contact" className="nav-cta">Inquire</a>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-glow"></div>
        <div className="hero-orb"></div>
        <div className="hero-grain" aria-hidden="true">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <filter id="grain-f" colorInterpolationFilters="sRGB">
              <feTurbulence id="grain-seed" type="fractalNoise" baseFrequency="0.88" numOctaves={4} stitchTiles="stitch" />
              <feColorMatrix type="saturate" values="0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#grain-f)" opacity="0.065" />
          </svg>
        </div>
        <div className="hero-beams" aria-hidden="true">
          <div className="beam beam-1"></div>
          <div className="beam beam-2"></div>
          <div className="beam beam-3"></div>
          <div className="beam beam-4"></div>
        </div>
        <div className="hero-floor-glow" aria-hidden="true"></div>
        <svg className="hero-rig" viewBox="0 0 1440 280" preserveAspectRatio="xMidYMax meet" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="108" y1="0" x2="108" y2="280" stroke="rgba(200,164,74,0.13)" strokeWidth="1.5"/>
          <line x1="118" y1="0" x2="118" y2="280" stroke="rgba(200,164,74,0.06)" strokeWidth="1"/>
          <line x1="1322" y1="0" x2="1322" y2="280" stroke="rgba(200,164,74,0.13)" strokeWidth="1.5"/>
          <line x1="1332" y1="0" x2="1332" y2="280" stroke="rgba(200,164,74,0.06)" strokeWidth="1"/>
          <line x1="108" y1="36" x2="1332" y2="36" stroke="rgba(200,164,74,0.17)" strokeWidth="1.5"/>
          <line x1="108" y1="50" x2="1332" y2="50" stroke="rgba(200,164,74,0.09)" strokeWidth="1"/>
          <polyline points="108,36 148,50 188,36 228,50 268,36 308,50 348,36 388,50 428,36 468,50 508,36 548,50 588,36 628,50 668,36 708,50 748,36 788,50 828,36 868,50 908,36 948,50 988,36 1028,50 1068,36 1108,50 1148,36 1188,50 1228,36 1268,50 1308,36 1332,44" stroke="rgba(200,164,74,0.065)" strokeWidth="0.75" fill="none"/>
          <line x1="0" y1="270" x2="1440" y2="270" stroke="rgba(200,164,74,0.09)" strokeWidth="1"/>
          {/* Fixtures */}
          {[240, 460, 720, 980, 1200].map((x) => (
            <g key={x}>
              <line x1={x} y1="50" x2={x} y2="72" stroke="rgba(200,164,74,0.13)" strokeWidth="1"/>
              <line x1={x-12} y1="72" x2={x+12} y2="72" stroke="rgba(200,164,74,0.15)" strokeWidth="1.5"/>
              <circle cx={x} cy={80} r={7} fill="rgba(200,164,74,0.035)" stroke="rgba(200,164,74,0.17)" strokeWidth="1"/>
              <polygon points={`${x},87 ${x-48},270 ${x+48},270`} fill="rgba(200,164,74,0.016)"/>
              <line x1={x} y1="87" x2={x} y2="270" stroke="rgba(200,164,74,0.04)" strokeWidth="0.75"/>
            </g>
          ))}
        </svg>

        <div className="hero-rule"></div>
        <p className="hero-label">Greater Los Angeles &nbsp;&middot;&nbsp; Wireless Specialists</p>
        <h1 className="hero-title"><span className="text-gold">PARIS</span><br/>BACKLINE</h1>
        <p className="hero-sub">Los Angeles backline rental — professional wireless systems and audio production equipment, available across Greater LA.</p>
        <div className="hero-actions">
          <a href="#catalog" className="btn-gold">View Catalog</a>
          <a href="#contact" className="btn-outline">Get in Touch</a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-bar"></div>
          <span>Scroll</span>
        </div>
      </div>

      {/* FEATURES */}
      <div className="features-wrap">
        <div className="features-grid">
          <div className="feature reveal">
            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="10" r="3"/><path d="M12 2C7.58 2 4 5.58 4 10c0 5.5 8 12 8 12s8-6.5 8-12c0-4.42-3.58-8-8-8z"/>
            </svg>
            <h3 className="feat-title">Greater Los Angeles</h3>
            <p className="feat-desc">We serve venues, tours, festivals, and private events throughout the Greater LA area — with reliable delivery and on-call support.</p>
          </div>
          <div className="feature reveal reveal-delay-1">
            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M1.5 8.5C6.7 3.3 17.3 3.3 22.5 8.5"/><path d="M5 12c3.87-3.87 10.13-3.87 14 0"/><path d="M8.5 15.5c1.93-1.93 5.07-1.93 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
            </svg>
            <h3 className="feat-title">Wireless Specialists</h3>
            <p className="feat-desc">Sennheiser EW Series and EW-DX digital wireless systems — IEMs, handhelds, and bodypacks configured for any production.</p>
          </div>
          <div className="feature reveal reveal-delay-2">
            <svg className="feat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="10" rx="1"/><line x1="6" y1="11" x2="6" y2="13"/><line x1="9" y1="10" x2="9" y2="14"/><line x1="12" y1="11" x2="12" y2="14"/><line x1="15" y1="10" x2="15" y2="13"/><line x1="18" y1="11" x2="18" y2="13"/>
            </svg>
            <h3 className="feat-title">Midas Digital</h3>
            <p className="feat-desc">M32 consoles and DL32 stage boxes — the touring standard for digital audio, maintained to spec and ready for your show.</p>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* CATALOG */}
      <div className="catalog-wrap" id="catalog">
        <div className="catalog-head">
          <p className="eyebrow reveal">What we carry</p>
          <h2 className="section-title reveal reveal-delay-1">OUR GEAR</h2>
          <p className="section-sub reveal reveal-delay-2">A focused, professional-grade inventory kept in touring condition.</p>
        </div>

        {/* Wireless Systems */}
        <div className="cat-row">
          <div className="cat-header reveal">
            <span className="cat-name">Wireless Systems</span>
            <span className="cat-count">3 systems</span>
          </div>
          <div className="gear-grid">
            <div className="gear-card reveal">
              <span className="gear-badge">Sennheiser</span>
              <h3 className="gear-name">EW IEM G4</h3>
              <p className="gear-desc">Professional in-ear monitor system with 1680 tunable frequencies. Bodypack transmitter and receiver with transparent, low-latency audio for stage monitoring.</p>
            </div>
            <div className="gear-card reveal reveal-delay-1">
              <span className="gear-badge">Sennheiser</span>
              <h3 className="gear-name">EW-500 G4</h3>
              <p className="gear-desc">Flagship handheld and bodypack wireless series. Wide RF bandwidth, robust transmission, and the sonic signature that&apos;s defined professional live sound for decades.</p>
            </div>
            <div className="gear-card reveal reveal-delay-2">
              <span className="gear-badge">Sennheiser &nbsp;&middot;&nbsp; Digital</span>
              <h3 className="gear-name">EW-DX</h3>
              <p className="gear-desc">Next-generation digital wireless supporting both wireless microphone and wireless instrument bodypacks. Ultra-low latency, dynamic UHF frequency management, and automatic interference avoidance — built for the most demanding stages.</p>
            </div>
          </div>
        </div>

        {/* Digital Mixing */}
        <div className="cat-row">
          <div className="cat-header reveal">
            <span className="cat-name">Digital Mixing</span>
            <span className="cat-count">5 units</span>
          </div>
          <div className="gear-grid">
            <div className="gear-card reveal">
              <span className="gear-badge">Midas</span>
              <h3 className="gear-name">M32R</h3>
              <p className="gear-desc">40-input live digital console with 32 Midas microphone preamps and 16 motorized faders. World-class onboard processing and a roadworthy chassis built for touring.</p>
            </div>
            <div className="gear-card reveal reveal-delay-1">
              <span className="gear-badge">Midas</span>
              <h3 className="gear-name">M32C</h3>
              <p className="gear-desc">The full M32 feature set in a compact 1U rack-mount form factor. Pairs seamlessly with the DL32 for flexible remote mixing without sacrificing a single channel.</p>
            </div>
            <div className="gear-card reveal reveal-delay-2">
              <span className="gear-badge">Midas</span>
              <h3 className="gear-name">DL32</h3>
              <p className="gear-desc">32-input / 16-output stage box with 32 Midas preamps. Connects to the M32 via AES50, delivering 64 channels of ultra-low-latency audio over a single Cat5 run.</p>
            </div>
            <div className="gear-card reveal">
              <span className="gear-badge">Allen &amp; Heath</span>
              <h3 className="gear-name">C1500</h3>
              <p className="gear-desc">Compact analogue mixer built for installed and portable sound. Clean Edac preamps, intuitive EQ, and rugged construction make it a dependable workhorse for any venue.</p>
            </div>
            <div className="gear-card reveal reveal-delay-1">
              <span className="gear-badge">Allen &amp; Heath</span>
              <h3 className="gear-name">CDM48</h3>
              <p className="gear-desc">48-channel digital mix engine with configurable I/O and deep onboard processing. Designed for demanding live and install applications where flexibility is key.</p>
            </div>
          </div>
        </div>

        {/* Keys */}
        <div className="cat-row" style={{ marginBottom: 0 }}>
          <div className="cat-header reveal">
            <span className="cat-name">Keys</span>
            <span className="cat-count">1 unit</span>
          </div>
          <div className="gear-grid cols-1">
            <div className="gear-card reveal">
              <span className="gear-badge">Nord</span>
              <h3 className="gear-name">Nord Stage 3 Piano</h3>
              <p className="gear-desc">Premium weighted stage piano with Nord&apos;s renowned piano, organ, and synthesizer engines. A rider-friendly instrument for any performance.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      {/* EXTENDED BACKLINE */}
      <div className="extended-backline reveal" style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <p className="eyebrow">Beyond our inventory</p>
        <h2 className="section-title" style={{ marginBottom: 24 }}>IF WE DON&apos;T HAVE IT,<br/>WE&apos;LL GET IT</h2>
        <p className="section-sub" style={{ maxWidth: 640, margin: "0 auto", fontSize: "1.08rem", lineHeight: 1.7, opacity: 0.82 }}>
          What you see above is just our house stock. Through a trusted network of partners across Los Angeles, we have access to a near-infinite extended backline. If it&apos;s not on our shelf, that won&apos;t stop us from putting it on your stage.
        </p>
      </div>

      <div className="divider"></div>

      {/* CONTACT */}
      <div className="contact-wrap" id="contact">
        <div className="contact-inner" style={{ paddingTop: 100 }}>
          <div className="contact-aside">
            <p className="eyebrow reveal">Book equipment</p>
            <h2 className="section-title reveal reveal-delay-1">LET&apos;S<br/>TALK</h2>
            <p className="section-sub reveal reveal-delay-2">Tell us about your event and we&apos;ll get back to you promptly. We service the Greater Los Angeles area.</p>
            <p className="contact-note reveal reveal-delay-3">Paris Backline &middot; Los Angeles, CA<br/>Serving the Greater LA area</p>
          </div>

          <form id="inquiry-form" className="contact-form reveal" action="https://formspree.io/f/mnjgvwgr" method="POST" onSubmit={handleFormSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" name="name" placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="your@email.com" required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Event Date</label>
                <input type="date" id="date" name="date" />
              </div>
              <div className="form-group">
                <label htmlFor="venue">Venue / Location</label>
                <input type="text" id="venue" name="venue" placeholder="Venue name or city" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">What do you need?</label>
              <textarea id="message" name="message" rows={5} placeholder="Tell us about your event, what gear you're looking for, and any other details..." required></textarea>
            </div>
            <button type="submit" className="form-submit">Send Inquiry &nbsp;&rarr;</button>
          </form>

          <div id="form-success" className="form-success">
            <div className="form-success-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="form-success-title">MESSAGE RECEIVED</h3>
            <p className="form-success-msg">Thanks for getting in touch — we&apos;ll review your inquiry and get back to you as soon as possible. We look forward to working with you.</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <span className="footer-logo">PARIS BACKLINE</span>
        <a href="/login" className="footer-admin" aria-label="Admin login">&#9884;</a>
        <span className="footer-copy">&copy; 2026 Paris Backline &middot; Los Angeles, CA</span>
      </footer>
    </>
  );
}
