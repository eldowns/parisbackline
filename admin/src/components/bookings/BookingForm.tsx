"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { calculatePayout } from "@/lib/revenue";
import PayoutBreakdown from "./PayoutBreakdown";

interface Client {
  id: string;
  name: string;
}

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  owner: string;
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
  referralName: string;
  leadPartner: string;
  commPartner: string;
  invoicePartner: string;
  accountPartner: string;
  invoiceSent: boolean;
  invoicePaid: boolean;
  notes: string;
  status: string;
  equipment: { equipmentId: string; quantity: number }[];
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
      referralName: "",
      leadPartner: "eric",
      commPartner: "eric",
      invoicePartner: "eric",
      accountPartner: "eric",
      invoiceSent: false,
      invoicePaid: false,
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

  // Equipment selection
  function toggleEquipment(eqId: string) {
    const exists = form.equipment.find((e) => e.equipmentId === eqId);
    if (exists) {
      update({ equipment: form.equipment.filter((e) => e.equipmentId !== eqId) });
    } else {
      update({ equipment: [...form.equipment, { equipmentId: eqId, quantity: 1 }] });
    }
  }

  function updateQuantity(eqId: string, quantity: number) {
    update({
      equipment: form.equipment.map((e) =>
        e.equipmentId === eqId ? { ...e, quantity } : e
      ),
    });
  }

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

  // Calculate payout
  const payout = useMemo(() => {
    const selectedEquip = form.equipment
      .map((fe) => equipment.find((e) => e.id === fe.equipmentId))
      .filter(Boolean) as EquipmentItem[];

    return calculatePayout({
      rentalFee: form.rentalFee,
      deliveryFee: form.deliveryFee,
      deliveryBy: form.deliveryBy || null,
      referralFee: form.referralFee,
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
  }, [form, equipment]);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const url = isEdit ? `/api/bookings/${initialData!.id}` : "/api/bookings";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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

  const inputClass = "w-full";
  const labelClass = "block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider";
  const sectionClass = "bg-bg-secondary border border-border rounded-xl p-5 space-y-4";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        {formError && (
          <div className="border border-danger/30 text-danger text-sm p-4" style={{ borderRadius: "1px", background: "rgba(239,68,68,0.05)" }}>
            {formError}
          </div>
        )}
        {/* Client & Dates */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4">
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
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewClient(!showNewClient)}
                  className="px-3 bg-bg-tertiary border border-border rounded-lg text-accent hover:text-accent-hover text-sm cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={form.status} onChange={(e) => update({ status: e.target.value })} className={inputClass}>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {showNewClient && (
            <div className="bg-bg-tertiary border border-border rounded-lg p-4 space-y-3">
              <p className="text-xs font-semibold text-text-secondary uppercase">Quick Add Client</p>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Name *" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} required />
                <input placeholder="Email" value={newClient.email} onChange={(e) => setNewClient({ ...newClient, email: e.target.value })} />
                <input placeholder="Phone" value={newClient.phone} onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                <input placeholder="Company" value={newClient.company} onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
              </div>
              <button type="button" onClick={handleCreateClient} className="bg-accent text-white text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer">
                Add Client
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Start Date</label>
              <input type="date" value={form.dateStart} onChange={(e) => update({ dateStart: e.target.value })} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>End Date</label>
              <input type="date" value={form.dateEnd} onChange={(e) => update({ dateEnd: e.target.value })} className={inputClass} required />
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update({ description: e.target.value })}
              className="w-full h-20 resize-none"
              placeholder="Event details, location, etc."
            />
          </div>
        </div>

        {/* Financials */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Financials</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Rental Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.rentalFee || ""}
                onChange={(e) => update({ rentalFee: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Delivery Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.deliveryFee || ""}
                onChange={(e) => update({ deliveryFee: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Delivery By</label>
              <select value={form.deliveryBy} onChange={(e) => update({ deliveryBy: e.target.value })} className={inputClass}>
                <option value="">N/A</option>
                <option value="eric">Eric</option>
                <option value="marko">Marko</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Referral Fee ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.referralFee || ""}
                onChange={(e) => update({ referralFee: parseFloat(e.target.value) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Referral Name</label>
              <input
                value={form.referralName}
                onChange={(e) => update({ referralName: e.target.value })}
                className={inputClass}
                placeholder="Who referred?"
              />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.invoiceSent} onChange={(e) => update({ invoiceSent: e.target.checked })} className="accent-accent w-4 h-4" />
                <span className="text-sm text-text-secondary">Invoice Sent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.invoicePaid} onChange={(e) => update({ invoicePaid: e.target.checked })} className="accent-accent w-4 h-4" />
                <span className="text-sm text-text-secondary">Paid</span>
              </label>
            </div>
          </div>
        </div>

        {/* Admin Roles */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Admin Roles (25% each)</h3>
          <div className="grid grid-cols-4 gap-4">
            {[
              { key: "leadPartner" as const, label: "Lead" },
              { key: "commPartner" as const, label: "Communication" },
              { key: "invoicePartner" as const, label: "Invoicing" },
              { key: "accountPartner" as const, label: "Accounting" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className={labelClass}>{label}</label>
                <select value={form[key]} onChange={(e) => update({ [key]: e.target.value })} className={inputClass}>
                  <option value="eric">Eric</option>
                  <option value="marko">Marko</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className={sectionClass}>
          <h3 className="text-sm font-semibold text-text-primary mb-2">Equipment</h3>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {equipment.map((eq) => {
              const selected = form.equipment.find((e) => e.equipmentId === eq.id);
              return (
                <div
                  key={eq.id}
                  onClick={() => toggleEquipment(eq.id)}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selected
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-border-light"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{eq.name}</p>
                    <p className="text-xs text-text-muted">
                      {eq.category} &middot;{" "}
                      <span className={eq.owner === "eric" ? "text-eric" : eq.owner === "marko" ? "text-marko" : "text-text-secondary"}>
                        {eq.owner.charAt(0).toUpperCase() + eq.owner.slice(1)}
                      </span>{" "}
                      &middot; ${eq.internalValue}
                    </p>
                  </div>
                  {selected && (
                    <input
                      type="number"
                      min={1}
                      value={selected.quantity}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateQuantity(eq.id, parseInt(e.target.value) || 1)}
                      className="w-14 text-center text-sm ml-2"
                    />
                  )}
                </div>
              );
            })}
            {equipment.length === 0 && (
              <p className="text-text-muted text-sm col-span-2 text-center py-4">
                No equipment yet. Add some in the Equipment section.
              </p>
            )}
          </div>
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
                <input
                  value={sr.provider}
                  onChange={(e) => updateSubRental(idx, { provider: e.target.value })}
                  className={inputClass}
                  placeholder="e.g., Dario"
                />
              </div>
              <div>
                <label className={labelClass}>Description</label>
                <input
                  value={sr.description}
                  onChange={(e) => updateSubRental(idx, { description: e.target.value })}
                  className={inputClass}
                  placeholder="What gear?"
                />
              </div>
              <div>
                <label className={labelClass}>Cost ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={sr.cost || ""}
                  onChange={(e) => updateSubRental(idx, { cost: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={() => removeSubRental(idx)}
                className="text-danger hover:text-danger/70 text-xs font-medium pb-2 cursor-pointer"
              >
                Remove
              </button>
            </div>
          ))}
          {form.subRentals.length === 0 && (
            <p className="text-text-muted text-sm text-center py-2">No sub-rentals for this booking</p>
          )}
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
            className="bg-accent hover:bg-accent-hover text-white font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : isEdit ? "Update Booking" : "Create Booking"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Right sidebar — live payout breakdown */}
      <div className="col-span-1">
        <div className="sticky top-8">
          <PayoutBreakdown payout={payout} rentalFee={form.rentalFee} deliveryFee={form.deliveryFee} />
        </div>
      </div>
    </form>
  );
}
