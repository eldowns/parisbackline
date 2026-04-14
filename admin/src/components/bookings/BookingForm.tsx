"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { calculatePayout } from "@/lib/revenue";
import PayoutBreakdown from "./PayoutBreakdown";
import SendInvoiceButton from "./SendInvoiceButton";

interface Client {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
}

interface EquipmentItem {
  id: string;
  manufacturer: string | null;
  model: string | null;
  name: string;
  category: string;
  owner: string;
  dayRate: number;
  internalValue: number;
}

interface SubRentalEntry {
  provider: string;
  description: string;
  cost: number;
}

interface BookingData {
  id?: string;
  clientId: string;
  description: string;
  dateStart: string;
  dateEnd: string;
  rentalFee: number;
  deliveryFee: number;
  deliveryBy: string;
  referralFee: number;
  referralPercent: number;
  referralName: string;
  discountType: "amount" | "percent";
  discountValue: number;
  leadPartner: string;
  commPartner: string;
  invoicePartner: string;
  accountPartner: string;
  notes: string;
  status: string;
  equipment: { equipmentId: string; quantity: number; rentalPrice: number }[];
  subRentals: SubRentalEntry[];
}

export default function BookingForm({
  clients,
  equipment,
  initialData,
}: {
  clients: Client[];
  equipment: EquipmentItem[];
  initialData?: BookingData;
}) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState<BookingData>(
    initialData || {
      clientId: "",
      description: "",
      dateStart: "",
      dateEnd: "",
      rentalFee: 0,
      deliveryFee: 0,
      deliveryBy: "",
      referralFee: 0,
      referralPercent: 10,
      referralName: "",
      discountType: "amount",
      discountValue: 0,
      leadPartner: "eric",
      commPartner: "eric",
      invoicePartner: "eric",
      accountPartner: "eric",
      notes: "",
      status: "confirmed",
      equipment: [],
      subRentals: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", company: "" });

  function update(fields: Partial<BookingData>) {
    setForm((prev) => ({ ...prev, ...fields }));
  }

  // Equipment
  function addEquipment(eqId: string) {
    if (form.equipment.find((e) => e.equipmentId === eqId)) return;
    const eq = equipment.find((e) => e.id === eqId);
    const rate = eq?.dayRate || 0;
    update({ equipment: [...form.equipment, { equipmentId: eqId, quantity: 1, rentalPrice: rate }] });
  }

  function removeEquipment(eqId: string) {
    update({ equipment: form.equipment.filter((e) => e.equipmentId !== eqId) });
  }

  function updateEquipmentField(eqId: string, fields: Partial<{ quantity: number; rentalPrice: number }>) {
    update({
      equipment: form.equipment.map((e) =>
        e.equipmentId === eqId ? { ...e, ...fields } : e
      ),
    });
  }

  // Calculate billing days from date range using backline week rule (4 days = 1 week)
  const rentalDays = useMemo(() => {
    if (!form.dateStart || !form.dateEnd) return 0;
    const start = new Date(form.dateStart + "T12:00:00Z");
    const end = new Date(form.dateEnd + "T12:00:00Z");
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(diff + 1, 0);
  }, [form.dateStart, form.dateEnd]);

  const billingDays = useMemo(() => {
    if (rentalDays === 0) return 0;
    const weeks = Math.floor(rentalDays / 7);
    const remaining = rentalDays % 7;
    return weeks * 4 + Math.min(remaining, 4);
  }, [rentalDays]);

  const equipmentTotal = form.equipment.reduce((sum, e) => sum + e.rentalPrice * e.quantity * billingDays, 0);

  // Equipment availability check
  const [conflicts, setConflicts] = useState<Record<string, { totalBooked: number; bookings: { client: string }[] }>>({});

  useEffect(() => {
    if (!form.dateStart || !form.dateEnd || form.equipment.length === 0) {
      setConflicts({});
      return;
    }
    const params = new URLSearchParams({ dateStart: form.dateStart, dateEnd: form.dateEnd });
    if (initialData?.id) params.set("excludeBookingId", initialData.id);
    fetch(`/api/equipment/availability?${params}`)
      .then((r) => r.json())
      .then(setConflicts)
      .catch(() => {});
  }, [form.dateStart, form.dateEnd, form.equipment.length, initialData?.id]);

  // Sub-rentals
  function addSubRental() {
    update({ subRentals: [...form.subRentals, { provider: "", description: "", cost: 0 }] });
  }

  function updateSubRental(idx: number, fields: Partial<SubRentalEntry>) {
    const updated = [...form.subRentals];
    updated[idx] = { ...updated[idx], ...fields };
    update({ subRentals: updated });
  }

  function removeSubRental(idx: number) {
    update({ subRentals: form.subRentals.filter((_, i) => i !== idx) });
  }

  // Rental subtotal before discount
  const rentalSubtotal = equipmentTotal > 0 ? equipmentTotal : form.rentalFee;
  const discountAmount =
    form.discountType === "percent"
      ? rentalSubtotal * (Math.max(0, form.discountValue) / 100)
      : Math.max(0, form.discountValue);
  const effectiveRentalFee = Math.max(0, rentalSubtotal - discountAmount);

  // Referral fee calculated from % of discounted rental total (not including delivery)
  const calculatedReferralFee = form.referralName
    ? effectiveRentalFee * (form.referralPercent / 100)
    : 0;

  // Payout
  const payout = useMemo(() => {
    const selectedEquip = form.equipment
      .map((fe) => equipment.find((e) => e.id === fe.equipmentId))
      .filter(Boolean) as EquipmentItem[];

    return calculatePayout({
      rentalFee: effectiveRentalFee,
      deliveryFee: form.deliveryFee,
      deliveryBy: form.deliveryBy || null,
      referralFee: calculatedReferralFee,
      leadPartner: form.leadPartner,
      commPartner: form.commPartner,
      invoicePartner: form.invoicePartner,
      accountPartner: form.accountPartner,
      gearItems: selectedEquip.map((e) => ({
        owner: e.owner,
        internalValue: e.internalValue * (form.equipment.find((fe) => fe.equipmentId === e.id)?.quantity || 1),
      })),
      subRentals: form.subRentals.filter((s) => s.provider && s.cost > 0),
    });
  }, [form, equipment, equipmentTotal, effectiveRentalFee, calculatedReferralFee]);

  async function handleCreateClient() {
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newClient),
    });
    if (res.ok) {
      const client = await res.json();
      clients.push(client);
      update({ clientId: client.id });
      setShowNewClient(false);
      setNewClient({ name: "", email: "", phone: "", company: "" });
    }
  }

  async function handleSubmit(e: React.FormEvent, statusOverride?: string) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const url = isEdit ? `/api/bookings/${initialData!.id}` : "/api/bookings";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rentalFee: effectiveRentalFee,
          referralFee: calculatedReferralFee,
          discountType: form.discountType,
          discountValue: form.discountValue,
          ...(statusOverride ? { status: statusOverride } : {}),
        }),
      });

      if (res.ok) {
        const booking = await res.json();
        router.push(`/bookings/${booking.id}`);
        router.refresh();
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to save booking");
      }
    } catch (err) {
      setFormError(String(err));
    }
    setSaving(false);
  }

  const labelClass = "block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider";
  const sectionClass = "bg-bg-secondary border border-border rounded-none p-5 space-y-4";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="text-text-muted text-xs hover:text-accent transition-colors cursor-pointer"
        >
          &larr; Back
        </button>

        {formError && (
          <div className="border border-danger/30 text-danger text-sm p-4" style={{ borderRadius: "1px", background: "rgba(239,68,68,0.05)" }}>
            {formError}
          </div>
        )}

        {/* Booking Details */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Booking Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Client</label>
              <div className="flex gap-2">
                <select
                  value={form.clientId}
                  onChange={(e) => update({ clientId: e.target.value })}
                  className="flex-1"
                  required
                >
                  <option value="">Select client...</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.company || c.name}{c.company ? ` (${c.name})` : ""}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewClient(!showNewClient)}
                  className="px-3 bg-bg-tertiary border border-border text-accent hover:text-accent-hover text-sm cursor-pointer"
                  style={{ borderRadius: "1px" }}
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" value={form.dateStart} onChange={(e) => update({ dateStart: e.target.value })} className="w-full" required />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" value={form.dateEnd} onChange={(e) => update({ dateEnd: e.target.value })} className="w-full" required />
            </div>
          </div>

          {showNewClient && (
            <div className="bg-bg-tertiary border border-border p-4 space-y-3" style={{ borderRadius: "1px" }}>
              <p className="text-xs font-semibold text-text-secondary uppercase">Quick Add Client</p>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Client Name" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
                <input placeholder="Contact *" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} required />
                <input placeholder="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                <input placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
              </div>
              <button type="button" onClick={handleCreateClient} className="bg-accent text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-3 py-1.5 cursor-pointer" style={{ borderRadius: "1px" }}>
                Add Client
              </button>
            </div>
          )}

          <div>
            <label className={labelClass}>Status</label>
            <select value={form.status} onChange={(e) => update({ status: e.target.value })} className="w-full">
              <option value="draft">Draft</option>
              <option value="confirmed">Confirmed</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Complete</option>
              <option value="invoice_sent">Invoice Sent</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Equipment */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Equipment</h3>
              {rentalDays > 0 && (
                <p className="text-xs text-text-muted mt-0.5">
                  {rentalDays} {rentalDays === 1 ? "day" : "days"} &rarr; billed as {billingDays} {billingDays === 1 ? "day" : "days"}
                </p>
              )}
            </div>
            <p className="text-sm font-semibold text-accent">Total: ${equipmentTotal.toFixed(2)}</p>
          </div>

          {form.equipment.length > 0 && (
            <div className="space-y-2 mb-4">
              {form.equipment.map((fe, idx) => {
                const eq = equipment.find((e) => e.id === fe.equipmentId);
                if (!eq) return null;
                const displayName = [eq.manufacturer, eq.model].filter(Boolean).join(" ") || eq.name;
                return (
                  <div key={`${fe.equipmentId}-${idx}`} className="flex items-center gap-3 p-3 bg-accent/5" style={{ borderRadius: "1px" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{displayName}</p>
                      <p className="text-xs text-text-muted">
                        {eq.category} &middot;{" "}
                        <span className={eq.owner === "eric" ? "text-eric" : "text-marko"}>
                          {eq.owner.charAt(0).toUpperCase() + eq.owner.slice(1)}
                        </span>
                      </p>
                      {conflicts[fe.equipmentId] && (
                        <p className="text-xs text-warning mt-0.5">
                          ⚠ Booked by {conflicts[fe.equipmentId].bookings.map((c) => c.client).join(", ")} for these dates
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div>
                        <label className="block text-text-muted text-[0.6rem] uppercase tracking-wider mb-0.5">Qty</label>
                        <input
                          type="number"
                          min={1}
                          value={fe.quantity}
                          onChange={(e) => updateEquipmentField(fe.equipmentId, { quantity: parseInt(e.target.value) || 1 })}
                          className="w-14 text-center text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-text-muted text-[0.6rem] uppercase tracking-wider mb-0.5">Rate ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={fe.rentalPrice || ""}
                          onChange={(e) => updateEquipmentField(fe.equipmentId, { rentalPrice: parseFloat(e.target.value) || 0 })}
                          className="w-24 text-sm"
                          placeholder="0.00"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEquipment(fe.equipmentId)}
                        className="text-danger/60 hover:text-danger text-xs mt-4 cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <select
            onChange={(e) => { if (e.target.value) { addEquipment(e.target.value); e.target.value = ""; } }}
            className="w-full"
            defaultValue=""
          >
            <option value="">+ Add equipment from inventory...</option>
            {equipment
              .filter((eq) => !form.equipment.find((fe) => fe.equipmentId === eq.id))
              .map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {[eq.manufacturer, eq.model].filter(Boolean).join(" ") || eq.name} — {eq.category} ({eq.owner})
                </option>
              ))}
          </select>
        </div>

        {/* Sub-Rentals */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-primary">Sub-Rentals</h3>
            <button
              type="button"
              onClick={addSubRental}
              className="text-accent hover:text-accent-hover text-xs font-medium cursor-pointer"
            >
              + Add Sub-Rental
            </button>
          </div>
          {form.subRentals.map((sr, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-3 items-end">
              <div>
                <label className={labelClass}>Provider</label>
                <input value={sr.provider} onChange={(e) => updateSubRental(idx, { provider: e.target.value })} className="w-full" placeholder="e.g., Dario" />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input value={sr.description} onChange={(e) => updateSubRental(idx, { description: e.target.value })} className="w-full" placeholder="What gear?" />
              </div>
              <div>
                <label className={labelClass}>Cost ($)</label>
                <input type="number" step="0.01" value={sr.cost || ""} onChange={(e) => updateSubRental(idx, { cost: parseFloat(e.target.value) || 0 })} className="w-full" />
              </div>
              <button type="button" onClick={() => removeSubRental(idx)} className="text-danger hover:text-danger/70 text-xs font-medium pb-2 cursor-pointer">
                Remove
              </button>
            </div>
          ))}
          {form.subRentals.length === 0 && (
            <p className="text-text-muted text-sm text-center py-2">No sub-rentals for this booking</p>
          )}
        </div>

        {/* Discount */}
        <div className={sectionClass}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text-primary">Discount</h3>
            {discountAmount > 0 && (
              <p className="text-sm font-semibold text-accent">
                −${discountAmount.toFixed(2)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.discountType}
                onChange={(e) => update({ discountType: e.target.value as "amount" | "percent" })}
                className="w-full"
              >
                <option value="amount">$ Amount</option>
                <option value="percent">% Percent</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>
                {form.discountType === "percent" ? "Discount (%)" : "Discount ($)"}
              </label>
              <input
                type="number"
                step={form.discountType === "percent" ? "0.5" : "0.01"}
                min={0}
                max={form.discountType === "percent" ? 100 : undefined}
                value={form.discountValue || ""}
                onChange={(e) => update({ discountValue: parseFloat(e.target.value) || 0 })}
                className="w-full"
                placeholder="0"
              />
            </div>
            <div>
              <label className={labelClass}>Rental After Discount</label>
              <p className="text-sm font-semibold text-text-primary py-2">
                ${effectiveRentalFee.toFixed(2)}
                {discountAmount > 0 && (
                  <span className="text-text-muted font-normal ml-1">
                    (from ${rentalSubtotal.toFixed(2)})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Delivery</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Delivery Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.deliveryFee || ""}
                onChange={(e) => update({ deliveryFee: parseFloat(e.target.value) || 0 })}
                className="w-full"
              />
            </div>
            <div>
              <label className={labelClass}>Delivered By</label>
              <select value={form.deliveryBy} onChange={(e) => update({ deliveryBy: e.target.value })} className="w-full">
                <option value="">N/A</option>
                <option value="eric">Eric</option>
                <option value="marko">Marko</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Referral */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Referral</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Referrer</label>
              <input
                value={form.referralName}
                onChange={(e) => update({ referralName: e.target.value })}
                className="w-full"
                placeholder="Who referred?"
              />
            </div>
            <div>
              <label className={labelClass}>Referral %</label>
              <input
                type="number"
                step="0.5"
                min={0}
                max={100}
                value={form.referralPercent}
                onChange={(e) => update({ referralPercent: parseFloat(e.target.value) || 0 })}
                className="w-full"
              />
            </div>
            <div>
              <label className={labelClass}>Referral Fee</label>
              <p className="text-sm font-semibold text-text-primary py-2">
                ${calculatedReferralFee.toFixed(2)}
                {form.referralName && (
                  <span className="text-text-muted font-normal ml-1">
                    ({form.referralPercent}% of ${effectiveRentalFee.toFixed(2)})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Admin */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Admin (25% each)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: "leadPartner" as const, label: "Lead" },
              { key: "commPartner" as const, label: "Communication" },
              { key: "invoicePartner" as const, label: "Invoicing" },
              { key: "accountPartner" as const, label: "Accounting" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <select value={form[key]} onChange={(e) => update({ [key]: e.target.value })} className="w-full">
                  <option value="eric">Eric</option>
                  <option value="marko">Marko</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className={sectionClass}>
          <label className={labelClass}>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update({ notes: e.target.value })}
            className="w-full h-24 resize-none"
            placeholder="Any additional notes..."
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-6 py-2.5 transition-all disabled:opacity-50 cursor-pointer hover:brightness-110"
            style={{ borderRadius: "1px" }}
          >
            {saving ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
          </button>
          {!isEdit && (
            <button
              type="button"
              disabled={saving}
              onClick={(e) => handleSubmit(e, "draft")}
              className="border border-border text-text-secondary hover:text-text-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-6 py-2.5 transition-all disabled:opacity-50 cursor-pointer"
              style={{ borderRadius: "1px" }}
            >
              {saving ? "Saving..." : "Save as Draft"}
            </button>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            className="border border-border text-text-secondary hover:text-text-primary font-medium px-6 py-2.5 transition-colors cursor-pointer"
            style={{ borderRadius: "1px" }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right sidebar — live payout breakdown */}
      <div className="lg:col-span-1">
        <div className="sticky top-8">
          <PayoutBreakdown payout={payout} rentalFee={effectiveRentalFee} deliveryFee={form.deliveryFee} />
          {isEdit && initialData?.id && (
            <SendInvoiceButton
              bookingId={initialData.id}
              clientName={clients.find((c) => c.id === form.clientId)?.name || ""}
              clientEmail={clients.find((c) => c.id === form.clientId)?.email || null}
            />
          )}
        </div>
      </div>
    </form>
  );
}
