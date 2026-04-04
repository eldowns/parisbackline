"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EquipmentLine {
  manufacturer: string;
  model: string;
  quantity: number;
  rate: number;
  internalValue: number;
  serialNumber: string;
  notes: string;
}

const emptyLine = (): EquipmentLine => ({
  manufacturer: "",
  model: "",
  quantity: 1,
  rate: 0,
  internalValue: 0,
  serialNumber: "",
  notes: "",
});

export default function PartnerOnboardingPage() {
  const router = useRouter();
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    bankAccount: "",
    bankRouting: "",
  });
  const [lines, setLines] = useState<EquipmentLine[]>([emptyLine()]);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateLine(i: number, patch: Partial<EquipmentLine>) {
    setLines((prev) => prev.map((l, j) => (j === i ? { ...l, ...patch } : l)));
  }

  function removeLine(i: number) {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((_, j) => j !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, equipment: lines }),
      });
      if (!res.ok) throw new Error("Failed");
      router.push("/partner/thank-you");
    } catch {
      alert("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2.5 text-sm border outline-none transition-colors";
  const inputStyle = {
    background: "#12121a",
    borderColor: "#2a2a3a",
    color: "#e0e0e8",
    borderRadius: "1px",
    fontFamily: "'Inter', sans-serif",
  };
  const focusStyle = { borderColor: "#c8a44a" };
  const labelClass = "block text-xs font-medium uppercase tracking-wider mb-1.5";
  const labelStyle = { color: "#6a6a7a", letterSpacing: "0.14em" };

  return (
    <div className="min-h-screen" style={{ background: "#09090f", color: "#e0e0e8" }}>
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-10">
          <h1
            className="text-4xl md:text-5xl mb-2"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            PARIS{" "}
            <span style={{ color: "#c8a44a" }}>BACKLINE</span>
          </h1>
          <p
            className="text-xs uppercase tracking-widest mb-8"
            style={{ color: "#6a6a7a", letterSpacing: "0.28em" }}
          >
            Equipment Partner Program
          </p>
        </div>

        {/* Partnership Overview */}
        <div
          className="border p-6 md:p-8 mb-8"
          style={{ background: "#0f0f17", borderColor: "#2a2a3a", borderRadius: "1px" }}
        >
          <h2
            className="text-xl mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#c8a44a", letterSpacing: "0.06em" }}
          >
            HOW IT WORKS
          </h2>
          <div style={{ color: "#a0a0b0", fontSize: "0.875rem", lineHeight: 1.8 }}>
            <p className="mb-4">
              Paris Backline operates a rental network across Greater Los Angeles, connecting professional-grade
              backline and audio equipment with productions, venues, and touring artists. As an equipment partner,
              you list your gear through our platform and earn revenue each time it&apos;s rented.
            </p>
            <p className="mb-4">
              <strong style={{ color: "#e0e0e8" }}>Revenue split:</strong> You receive{" "}
              <strong style={{ color: "#c8a44a" }}>50%</strong> of the rental fee for your equipment.
              Paris Backline retains 50% to cover client acquisition, booking management, invoicing, logistics
              coordination, and insurance administration.
            </p>
            <p className="mb-4">
              <strong style={{ color: "#e0e0e8" }}>What we expect:</strong> By joining this program, you confirm
              that all equipment you list is fully functional, rent-ready, and will be accessible for pickup
              when rented. Gear that is not available when booked disrupts the rental pipeline and may result
              in removal from the program.
            </p>
            <p>
              <strong style={{ color: "#e0e0e8" }}>A note on risk:</strong> Though it is in Paris Backline&apos;s
              best interest for all parties to enjoy a seamless rental experience, the nature of renting exposes
              your equipment to an environment of potential wear and even damage. Although our rental agreement
              holds the renter liable for any damage or loss of equipment, we encourage you to obtain your own
              insurance if this is a concern to you. Paris Backline is not responsible for damage to or loss of
              partner equipment beyond what is recovered from the renter.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Contact Information */}
          <div
            className="border p-6 md:p-8 mb-8"
            style={{ background: "#0f0f17", borderColor: "#2a2a3a", borderRadius: "1px" }}
          >
            <h2
              className="text-xl mb-6"
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#c8a44a", letterSpacing: "0.06em" }}
            >
              YOUR INFORMATION
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className={labelClass} style={labelStyle}>Name *</label>
                <input
                  required
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className={labelClass} style={labelStyle}>Phone *</label>
                <input
                  required
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                  placeholder="(310) 555-0100"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className={labelClass} style={labelStyle}>Email *</label>
              <input
                required
                type="email"
                value={contact.email}
                onChange={(e) => setContact({ ...contact, email: e.target.value })}
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                placeholder="jane@example.com"
              />
            </div>

            <div className="mb-6">
              <label className={labelClass} style={labelStyle}>Address *</label>
              <input
                required
                type="text"
                value={contact.address}
                onChange={(e) => setContact({ ...contact, address: e.target.value })}
                className={inputClass}
                style={inputStyle}
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                placeholder="123 Sunset Blvd, Los Angeles, CA 90028"
              />
            </div>

            <div
              className="border-t pt-6"
              style={{ borderColor: "#2a2a3a" }}
            >
              <h3
                className="text-sm font-medium uppercase tracking-wider mb-4"
                style={{ color: "#6a6a7a", letterSpacing: "0.14em" }}
              >
                Banking Information
              </h3>
              <p className="text-xs mb-4" style={{ color: "#55556a", lineHeight: 1.6 }}>
                Used for direct deposit of your rental earnings. This information is kept confidential.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} style={labelStyle}>Account Number *</label>
                  <input
                    required
                    type="text"
                    value={contact.bankAccount}
                    onChange={(e) => setContact({ ...contact, bankAccount: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                    placeholder="Account number"
                  />
                </div>
                <div>
                  <label className={labelClass} style={labelStyle}>Routing Number *</label>
                  <input
                    required
                    type="text"
                    value={contact.bankRouting}
                    onChange={(e) => setContact({ ...contact, bankRouting: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                    placeholder="Routing number"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div
            className="border p-6 md:p-8 mb-8"
            style={{ background: "#0f0f17", borderColor: "#2a2a3a", borderRadius: "1px" }}
          >
            <div className="flex items-start justify-between mb-2">
              <h2
                className="text-xl"
                style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#c8a44a", letterSpacing: "0.06em" }}
              >
                YOUR EQUIPMENT
              </h2>
            </div>
            <p className="text-xs mb-6" style={{ color: "#55556a", lineHeight: 1.6 }}>
              Add each piece of equipment you&apos;d like to make available for rental. Set a daily rate for each
              item &mdash; this is the per-day price the client pays.
            </p>
            <p className="text-xs mt-2" style={{ color: "#6a6a7a", lineHeight: 1.6 }}>
              <strong>Weekly pricing:</strong> Rentals of 4 or more days are billed as a single week at the
              daily rate &times; 4. Additional days beyond the first week follow the same pattern (e.g., 8 days
              = 2 weeks).
            </p>

            <div className="space-y-6">
              {lines.map((line, i) => (
                <div
                  key={i}
                  className="border p-4 md:p-5 relative"
                  style={{ background: "#0a0a12", borderColor: "#1e1e2e", borderRadius: "1px" }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#55556a" }}
                    >
                      Item {i + 1}
                    </span>
                    {lines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLine(i)}
                        className="text-xs cursor-pointer transition-colors"
                        style={{ color: "#6a6a7a" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#e05555")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6a7a")}
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className={labelClass} style={labelStyle}>Manufacturer *</label>
                      <input
                        required
                        type="text"
                        value={line.manufacturer}
                        onChange={(e) => updateLine(i, { manufacturer: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                        placeholder="e.g. Sennheiser"
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Model *</label>
                      <input
                        required
                        type="text"
                        value={line.model}
                        onChange={(e) => updateLine(i, { model: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                        placeholder="e.g. EW-DX 835-S"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                    <div>
                      <label className={labelClass} style={labelStyle}>Qty *</label>
                      <input
                        required
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) => updateLine(i, { quantity: parseInt(e.target.value) || 1 })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Daily Rate *</label>
                      <input
                        required
                        type="number"
                        min={0}
                        step={0.01}
                        value={line.rate || ""}
                        onChange={(e) => updateLine(i, { rate: parseFloat(e.target.value) || 0 })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                        placeholder="$/day"
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Replacement Value *</label>
                      <input
                        required
                        type="number"
                        min={0}
                        step={0.01}
                        value={line.internalValue || ""}
                        onChange={(e) => updateLine(i, { internalValue: parseFloat(e.target.value) || 0 })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                        placeholder="$"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass} style={labelStyle}>Serial Number</label>
                      <input
                        type="text"
                        value={line.serialNumber}
                        onChange={(e) => updateLine(i, { serialNumber: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className={labelClass} style={labelStyle}>Notes</label>
                      <input
                        type="text"
                        value={line.notes}
                        onChange={(e) => updateLine(i, { notes: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: "#2a2a3a" })}
                        placeholder="Condition, accessories included, etc."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLines([...lines, emptyLine()])}
              className="mt-4 text-xs font-medium uppercase tracking-wider px-4 py-2.5 border transition-colors cursor-pointer"
              style={{
                color: "#c8a44a",
                borderColor: "#c8a44a33",
                background: "transparent",
                borderRadius: "1px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#c8a44a12";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              + Add Another Item
            </button>
          </div>

          {/* Agreement & Submit */}
          <div
            className="border p-6 md:p-8"
            style={{ background: "#0f0f17", borderColor: "#2a2a3a", borderRadius: "1px" }}
          >
            <label className="flex items-start gap-3 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 shrink-0 cursor-pointer"
                style={{ accentColor: "#c8a44a" }}
              />
              <span className="text-sm" style={{ color: "#a0a0b0", lineHeight: 1.7 }}>
                I agree to the terms and conditions listed above, including the revenue split, equipment
                readiness requirements, and risk acknowledgment. I understand that I may withdraw my equipment
                and name from this partnership at any time by contacting Paris Backline in writing.
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed || submitting}
              className="w-full py-3 text-sm font-semibold uppercase tracking-widest transition-all cursor-pointer"
              style={{
                background: agreed ? "#c8a44a" : "#2a2a3a",
                color: agreed ? "#09090f" : "#55556a",
                borderRadius: "1px",
                letterSpacing: "0.16em",
                border: "none",
                opacity: submitting ? 0.6 : 1,
              }}
            >
              {submitting ? "SUBMITTING..." : "SUBMIT APPLICATION"}
            </button>
          </div>
        </form>

        <p className="text-center text-xs mt-8" style={{ color: "#3a3a4a" }}>
          Questions? Reach us at{" "}
          <a href="mailto:parisbackline@gmail.com" style={{ color: "#6a6a7a" }}>
            parisbackline@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
