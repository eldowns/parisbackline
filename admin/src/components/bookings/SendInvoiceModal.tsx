"use client";

import { useState } from "react";

interface Props {
  bookingId: string;
  clientName: string;
  clientEmail: string | null;
  onClose: () => void;
  onSent: () => void;
}

interface InvoicePreview {
  invoiceNumber: string;
  grandTotal: number;
  pdfBase64: string;
  invoiceData: {
    date: string;
    dateStart: string;
    dateEnd: string;
    client: { name: string; email?: string | null; company?: string | null };
    equipment: { name: string; quantity: number; rentalPrice: number }[];
    subRentals: { description: string; provider: string; cost: number }[];
    deliveryFee: number;
  };
}

export default function SendInvoiceModal({ bookingId, clientName, clientEmail, onClose, onSent }: Props) {
  const [email, setEmail] = useState(clientEmail || "");
  const [preview, setPreview] = useState<InvoicePreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handlePreview() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, preview: true }),
      });
      if (res.ok) {
        const data = await res.json();
        setPreview(data);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to generate preview");
      }
    } catch (err) {
      setError(String(err));
    }
    setLoading(false);
  }

  async function handleSend() {
    if (!email) {
      setError("Please enter a recipient email");
      return;
    }
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, recipientEmail: email }),
      });
      if (res.ok) {
        setSent(true);
        onSent();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send");
      }
    } catch (err) {
      setError(String(err));
    }
    setSending(false);
  }

  // Auto-preview on mount
  if (!preview && !loading && !error) {
    handlePreview();
  }

  const d = preview?.invoiceData;
  const equipTotal = d?.equipment.reduce((s, e) => s + e.rentalPrice * e.quantity, 0) || 0;
  const subTotal = d?.subRentals.reduce((s, sr) => s + sr.cost, 0) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto border border-border"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: "1px", background: "#111118" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="text-lg tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            {sent ? "INVOICE SENT" : "SEND INVOICE"}
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-4">&#9993;</div>
            <p className="text-text-primary text-lg font-medium mb-2">Invoice sent to {email}</p>
            <p className="text-text-muted text-sm">Invoice {preview?.invoiceNumber} has been emailed with the PDF attached.</p>
          </div>
        ) : loading ? (
          <div className="p-10 text-center text-text-muted animate-pulse">Generating invoice preview...</div>
        ) : (
          <div className="p-5 space-y-5">
            {error && (
              <div className="border border-danger/30 text-danger text-xs p-3" style={{ borderRadius: "1px", background: "rgba(239,68,68,0.05)" }}>
                {error}
              </div>
            )}

            {/* Email mockup */}
            {d && (
              <div className="border border-border p-5 space-y-4" style={{ background: "#0d0d14" }}>
                <div className="flex items-center gap-2 text-xs text-text-muted border-b border-border pb-3">
                  <span>From: <span className="text-text-secondary">accounting@parisbackline.com</span></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted border-b border-border pb-3">
                  <span>To:</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 text-xs bg-transparent border-none outline-none text-text-primary"
                    placeholder="recipient@email.com"
                  />
                </div>
                <div className="text-xs text-text-muted border-b border-border pb-3">
                  Subject: <span className="text-text-secondary">Invoice {preview?.invoiceNumber} — Paris Backline</span>
                </div>

                {/* Email body preview */}
                <div className="space-y-3 pt-2">
                  <p className="text-sm text-text-secondary">Hi {d.client.name},</p>
                  {d.client.company && <p className="text-xs text-text-muted">Re: {d.client.company}</p>}
                  <p className="text-sm text-text-secondary">
                    Please find your invoice attached for the rental period {d.dateStart} – {d.dateEnd}.
                  </p>
                  <p className="text-2xl font-bold text-accent" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    Total Due: ${preview?.grandTotal.toFixed(2)}
                  </p>

                  {/* Line items summary */}
                  <div className="border border-border p-3 space-y-1">
                    {d.equipment.map((e, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-text-secondary">{e.name} x{e.quantity}</span>
                        <span className="text-text-primary">${(e.rentalPrice * e.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {d.subRentals.map((sr, i) => (
                      <div key={`sr-${i}`} className="flex justify-between text-xs">
                        <span className="text-text-secondary">{sr.description}</span>
                        <span className="text-text-primary">${sr.cost.toFixed(2)}</span>
                      </div>
                    ))}
                    {d.deliveryFee > 0 && (
                      <div className="flex justify-between text-xs">
                        <span className="text-text-secondary">Delivery</span>
                        <span className="text-text-primary">${d.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs border-t border-border pt-1 mt-1">
                      <span className="text-text-primary font-medium">Total</span>
                      <span className="text-accent font-bold">${preview?.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment info */}
                  <div className="border border-border p-3">
                    <p className="text-xs font-semibold text-text-primary mb-2">Payment — Bank Transfer (ACH)</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-text-muted">Account</p>
                        <p className="text-text-primary font-medium">103035011</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Routing</p>
                        <p className="text-text-primary font-medium">211370150</p>
                      </div>
                      <div>
                        <p className="text-text-muted">Type</p>
                        <p className="text-text-primary font-medium">Checking</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-text-muted">PDF invoice attached</p>
                </div>
              </div>
            )}

            {/* PDF download */}
            {preview?.pdfBase64 && (
              <a
                href={`data:application/pdf;base64,${preview.pdfBase64}`}
                download={`${preview.invoiceNumber}.pdf`}
                className="block text-center text-accent text-xs hover:text-accent-hover"
              >
                Download PDF Preview
              </a>
            )}

            {/* Send button */}
            <div className="flex gap-3">
              <button
                onClick={handleSend}
                disabled={sending || !email}
                className="flex-1 bg-accent text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:brightness-110 transition-all disabled:opacity-50"
                style={{ borderRadius: "1px" }}
              >
                {sending ? "Sending..." : `Send Invoice to ${email || "..."}`}
              </button>
              <button
                onClick={onClose}
                className="px-6 border border-border text-text-secondary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:text-text-primary transition-colors"
                style={{ borderRadius: "1px" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
