"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";

interface BookingData {
  id: string;
  clientId: string;
  client: { name: string };
  dateStart: string;
  dateEnd: string;
  rentalFee: number;
  deliveryFee: number;
  deliveryBy: string | null;
  referralFee: number;
  referralPercent: number;
  referralName: string | null;
  leadPartner: string;
  commPartner: string;
  invoicePartner: string;
  accountPartner: string;
  invoiceSent: boolean;
  invoicePaid: boolean;
  status: string;
  notes: string | null;
  equipment: {
    id: string;
    quantity: number;
    rentalPrice: number;
    equipment: { name: string; manufacturer: string | null; model: string | null; owner: string; category: string };
  }[];
  subRentals: { provider: string; description: string; cost: number }[];
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function formatDate(d: string) {
  // Parse as UTC to avoid timezone shift
  const date = new Date(d);
  return format(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), "MMM d");
}

function BookingRow({ b }: { b: BookingData }) {
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.offsetHeight);
    }
  }, [open]);

  const statusColor =
    b.status === "confirmed" ? "text-accent" :
    b.status === "completed" ? "text-success" :
    "text-danger";

  return (
    <div className="border-b border-border">
      {/* Summary row */}
      <div className="flex items-center px-5 py-4 hover:bg-bg-hover transition-colors">
        <button
          onClick={() => setOpen(!open)}
          className="mr-3 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
        >
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-6">
          <span className="font-medium text-sm w-40 truncate">{b.client.name}</span>
          <span className="text-text-secondary text-sm w-36">
            {formatDate(b.dateStart)} – {formatDate(b.dateEnd)}
          </span>
          <span className="text-sm font-semibold w-24 text-right">${b.rentalFee.toLocaleString()}</span>
          <span className={`text-xs font-medium uppercase tracking-wider ${statusColor}`}>
            {b.status}
          </span>
        </div>

        <Link
          href={`/bookings/${b.id}/edit`}
          className="text-accent hover:text-accent-hover text-xs font-medium ml-4 cursor-pointer"
        >
          Edit
        </Link>
      </div>

      {/* Expanded details */}
      <div
        className="overflow-hidden"
        style={{
          height: open ? height : 0,
          transition: "height 350ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div ref={innerRef} className="px-10 pb-8 pt-3 ml-7 mr-5 space-y-5">
          <div className="grid grid-cols-3 gap-6 text-sm">
            {/* Equipment */}
            {b.equipment.length > 0 && (
              <div>
                <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-2">Equipment</p>
                <div className="space-y-1">
                  {b.equipment.map((be) => {
                    const name = [be.equipment.manufacturer, be.equipment.model].filter(Boolean).join(" ") || be.equipment.name;
                    return (
                      <div key={be.id} className="flex justify-between text-text-secondary">
                        <span>
                          {name}
                          {be.quantity > 1 && <span className="text-text-muted"> x{be.quantity}</span>}
                          <span className={`ml-1 text-xs ${be.equipment.owner === "eric" ? "text-eric" : "text-marko"}`}>
                            ({capitalize(be.equipment.owner)})
                          </span>
                        </span>
                        <span className="font-medium text-text-primary">${(be.rentalPrice * be.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admin */}
            <div>
              <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-2">Admin</p>
              <div className="space-y-1 text-text-secondary">
                {[
                  { label: "Lead", value: b.leadPartner },
                  { label: "Communication", value: b.commPartner },
                  { label: "Invoicing", value: b.invoicePartner },
                  { label: "Accounting", value: b.accountPartner },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span>{r.label}</span>
                    <span className={r.value === "eric" ? "text-eric font-medium" : "text-marko font-medium"}>
                      {capitalize(r.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery, Referral, Invoice */}
            <div className="space-y-3">
              {(b.deliveryFee > 0 || b.deliveryBy) && (
                <div>
                  <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Delivery</p>
                  <p className="text-text-secondary">
                    ${b.deliveryFee.toFixed(2)}
                    {b.deliveryBy && <span className="text-text-muted"> — {capitalize(b.deliveryBy)}</span>}
                  </p>
                </div>
              )}

              {b.referralName && (
                <div>
                  <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Referral</p>
                  <p className="text-text-secondary">
                    {b.referralName} — {b.referralPercent}% (${b.referralFee.toFixed(2)})
                  </p>
                </div>
              )}

              {b.subRentals.length > 0 && (
                <div>
                  <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Sub-Rentals</p>
                  {b.subRentals.map((sr, i) => (
                    <p key={i} className="text-text-secondary">
                      {sr.provider}: {sr.description} — ${sr.cost.toFixed(2)}
                    </p>
                  ))}
                </div>
              )}

              <div>
                <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Invoice</p>
                <p className="text-text-secondary">
                  {b.invoicePaid ? (
                    <span className="text-success">Paid</span>
                  ) : b.invoiceSent ? (
                    <span className="text-warning">Sent, unpaid</span>
                  ) : (
                    <span className="text-danger">Not sent</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {b.notes && (
            <div>
              <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Notes</p>
              <p className="text-text-secondary text-sm">{b.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingsList({ bookings }: { bookings: BookingData[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-text-secondary text-sm mt-1">{bookings.length} total</p>
        </div>
        <Link
          href="/bookings/new"
          className="bg-accent hover:bg-accent-hover text-bg-primary text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer"
          style={{ borderRadius: "1px" }}
        >
          + New Booking
        </Link>
      </div>

      <div className="bg-bg-secondary border border-border" style={{ borderRadius: "1px" }}>
        {bookings.map((b) => (
          <BookingRow key={b.id} b={b} />
        ))}
        {bookings.length === 0 && (
          <p className="text-text-muted text-sm text-center py-12">No bookings yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
}
