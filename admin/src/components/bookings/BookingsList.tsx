"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface BookingData {
  id: string;
  clientId: string;
  client: { name: string; company: string | null };
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (innerRef.current) {
      setHeight(innerRef.current.offsetHeight);
    }
  }, [open]);

  // Determine display status — auto "in progress" if today is within rental period
  const today = new Date();
  const start = new Date(b.dateStart);
  const end = new Date(b.dateEnd);
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const startUTC = Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  const endUTC = Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate());
  const isInProgress = b.status === "confirmed" && todayUTC >= startUTC && todayUTC <= endUTC;

  const displayStatus = isInProgress ? "in progress" : b.status;
  const statusColor =
    isInProgress ? "text-accent" :
    b.status === "confirmed" ? "text-eric" :
    b.status === "completed" ? "text-success" :
    "text-danger";

  return (
    <div className="border-b border-border">
      {/* Desktop summary row */}
      <div className="hidden md:flex items-center px-5 py-4 hover:bg-bg-hover active:opacity-60 transition-all duration-150 cursor-pointer">
        <div
          className="mr-3 text-text-muted hover:text-text-primary"
          onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        >
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <Link href={`/bookings/${b.id}/edit`} className="flex-1 min-w-0 flex items-center gap-6">
          <span className="w-40 truncate">
            <span className="font-medium text-sm block">{b.client.company || b.client.name}</span>
            {b.client.company && <span className="text-text-muted text-xs block">{b.client.name}</span>}
          </span>
          <span className="text-text-secondary text-sm w-36">
            {formatDate(b.dateStart)} – {formatDate(b.dateEnd)}
          </span>
          <span className="text-sm font-semibold w-24 text-right">${(b.rentalFee + b.deliveryFee).toLocaleString()}</span>
          <span className={`text-xs font-medium uppercase tracking-wider ${statusColor}`}>
            {displayStatus}
          </span>
        </Link>

        <span className={`text-xs ml-4 whitespace-nowrap ${b.invoiceSent ? "text-success" : "text-danger"}`}>
          {b.invoiceSent ? "Invoice sent" : "Invoice not sent"}
        </span>
      </div>

      {/* Mobile card layout */}
      <div className="md:hidden px-4 py-3 hover:bg-bg-hover active:opacity-60 transition-all duration-150 cursor-pointer">
        <div className="flex items-start justify-between">
          <Link href={`/bookings/${b.id}/edit`} className="flex-1 min-w-0">
            <p className="font-medium text-sm">{b.client.company || b.client.name}</p>
            {b.client.company && <p className="text-text-muted text-xs">{b.client.name}</p>}
            <div className="flex items-center gap-2 mt-1.5 text-xs text-text-secondary">
              <span>{formatDate(b.dateStart)} – {formatDate(b.dateEnd)}</span>
              <span className="text-text-muted">|</span>
              <span className="font-semibold text-text-primary">${(b.rentalFee + b.deliveryFee).toLocaleString()}</span>
              <span className="text-text-muted">|</span>
              <span className={`font-medium uppercase tracking-wider ${statusColor}`}>{displayStatus}</span>
            </div>
            <p className={`text-xs mt-1 ${b.invoiceSent ? "text-success" : "text-danger"}`}>
              {b.invoiceSent ? "Invoice sent" : "Invoice not sent"}
            </p>
          </Link>
          <div
            className="ml-2 mt-1 text-text-muted hover:text-text-primary"
            onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
          >
            <svg
              className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
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

          <div className="pt-2">
            <button
              onClick={() => router.push(`/bookings/new?duplicate=${b.id}`)}
              className="border border-border text-text-secondary hover:text-text-primary hover:bg-bg-hover text-xs font-medium px-4 py-2 transition-colors cursor-pointer"
              style={{ borderRadius: "1px" }}
            >
              Duplicate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingsList({ bookings }: { bookings: BookingData[] | null }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoiceFilter, setInvoiceFilter] = useState("");

  const filtered = bookings?.filter((b) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || (b.client.company || b.client.name).toLowerCase().includes(q) || b.client.name.toLowerCase().includes(q);
    const matchesStatus = !statusFilter || b.status === statusFilter;
    const matchesInvoice = !invoiceFilter ||
      (invoiceFilter === "paid" && b.invoicePaid) ||
      (invoiceFilter === "sent" && b.invoiceSent && !b.invoicePaid) ||
      (invoiceFilter === "unsent" && !b.invoiceSent);
    return matchesSearch && matchesStatus && matchesInvoice;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-text-secondary text-sm mt-1">{bookings ? `${filtered?.length} of ${bookings.length}` : "Loading..."}</p>
        </div>
        <Link
          href="/bookings/new"
          className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer"
          style={{ borderRadius: "1px" }}
        >
          + New Booking
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 md:max-w-xs"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full md:w-auto">
          <option value="">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={invoiceFilter} onChange={(e) => setInvoiceFilter(e.target.value)} className="w-full md:w-auto">
          <option value="">All Invoices</option>
          <option value="paid">Paid</option>
          <option value="sent">Sent, Unpaid</option>
          <option value="unsent">Not Sent</option>
        </select>
      </div>

      <div className="bg-bg-secondary border border-border" style={{ borderRadius: "1px" }}>
        {/* Column headings (desktop only) */}
        <div className="hidden md:flex items-center px-5 py-3 border-b border-border text-text-muted text-xs font-medium uppercase tracking-wider">
          <div className="w-4 mr-3 shrink-0" />
          <div className="flex-1 flex items-center gap-6">
            <span className="w-40">Client</span>
            <span className="w-36">Dates</span>
            <span className="w-24 text-right">Total</span>
            <span>Status</span>
          </div>
        </div>
        {bookings === null && (
          <div className="divide-y divide-border">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="hidden md:flex items-center px-5 py-4 gap-6 animate-pulse">
                <div className="w-4 h-4 bg-white/5 rounded mr-3 shrink-0" />
                <div className="w-40">
                  <div className="h-4 bg-white/5 rounded w-28 mb-1.5" />
                  <div className="h-3 bg-white/5 rounded w-20" />
                </div>
                <div className="h-4 bg-white/5 rounded w-36" />
                <div className="h-4 bg-white/5 rounded w-20 ml-auto" />
                <div className="h-3 bg-white/5 rounded w-16" />
                <div className="h-3 bg-white/5 rounded w-24" />
              </div>
            ))}
            {[...Array(4)].map((_, i) => (
              <div key={`m${i}`} className="md:hidden px-4 py-3 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-32 mb-2" />
                <div className="flex gap-2">
                  <div className="h-3 bg-white/5 rounded w-28" />
                  <div className="h-3 bg-white/5 rounded w-16" />
                  <div className="h-3 bg-white/5 rounded w-20" />
                </div>
                <div className="h-3 bg-white/5 rounded w-24 mt-1.5" />
              </div>
            ))}
          </div>
        )}
        {filtered?.map((b) => (
          <BookingRow key={b.id} b={b} />
        ))}
        {bookings && filtered?.length === 0 && (
          <p className="text-text-muted text-sm text-center py-12">{bookings.length === 0 ? "No bookings yet. Create your first one!" : "No bookings match your filters."}</p>
        )}
      </div>
    </div>
  );
}
