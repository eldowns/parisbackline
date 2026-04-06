"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

interface EquipmentItem {
  id: string;
  manufacturer: string | null;
  model: string | null;
  name: string;
  category: string;
  owner: string;
  quantity: number;
  dayRate: number;
  internalValue: number;
  serialNumber: string | null;
  notes: string | null;
  active: boolean;
}

interface SubmissionItem {
  id: string;
  manufacturer: string;
  model: string;
  quantity: number;
  rate: number;
  internalValue: number;
  serialNumber: string | null;
  notes: string | null;
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  equipment: SubmissionItem[];
}

const categories = ["Wireless Mic", "IEM", "Console", "Keyboard/Piano", "DI/Splitter", "Cable/Adapter", "Case/Rack", "Monitor", "Amplifier", "Other"];
const PARTNERS = ["eric", "marko"];

export default function EquipmentPage() {
  const { addToast } = useToast();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ manufacturer: "", model: "", category: "Wireless Mic", owner: "eric", quantity: 1, dayRate: 0, internalValue: 0, serialNumber: "", notes: "" });
  const [ownerType, setOwnerType] = useState<"eric" | "marko" | "3rd-party">("eric");
  const [ownerCustom, setOwnerCustom] = useState("");
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/equipment").then((r) => r.json()),
      fetch("/api/partner").then((r) => r.json()),
    ]).then(([eq, subs]) => {
      setEquipment(eq);
      setSubmissions(Array.isArray(subs) ? subs : []);
      setLoading(false);
    });
  }, []);

  function resetForm() {
    setForm({ manufacturer: "", model: "", category: "Wireless Mic", owner: "eric", quantity: 1, dayRate: 0, internalValue: 0, serialNumber: "", notes: "" });
    setOwnerType("eric");
    setOwnerCustom("");
    setEditId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(eq: EquipmentItem) {
    const isPartner = PARTNERS.includes(eq.owner);
    setOwnerType(isPartner ? eq.owner as "eric" | "marko" : "3rd-party");
    setOwnerCustom(isPartner ? "" : eq.owner);
    setForm({ manufacturer: eq.manufacturer || "", model: eq.model || "", category: eq.category, owner: eq.owner, quantity: eq.quantity, dayRate: eq.dayRate, internalValue: eq.internalValue, serialNumber: eq.serialNumber || "", notes: eq.notes || "" });
    setEditId(eq.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const resolvedOwner = ownerType === "3rd-party" ? ownerCustom.trim() : ownerType;
    if (!resolvedOwner) { setError("Please enter the 3rd party owner name"); return; }
    const payload = { ...form, owner: resolvedOwner };
    const url = editId ? `/api/equipment/${editId}` : "/api/equipment";
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        const updated = await fetch("/api/equipment").then((r) => r.json());
        setEquipment(updated);
        resetForm();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError(String(err));
    }
  }

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this equipment?")) return;
    await fetch(`/api/equipment/${id}`, { method: "DELETE" });
    setEquipment(equipment.map((e) => e.id === id ? { ...e, active: false } : e));
  }

  async function handleSubmission(id: string, status: "accepted" | "declined") {
    const label = status === "accepted" ? "accept" : "decline";
    if (!confirm(`Are you sure you want to ${label} this submission?`)) return;
    try {
      const res = await fetch(`/api/partner/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setSubmissions((prev) => prev.filter((s) => s.id !== id));
        if (status === "accepted") {
          const updated = await fetch("/api/equipment").then((r) => r.json());
          setEquipment(updated);
          addToast("Submission accepted — equipment added", "success");
        } else {
          addToast("Submission declined", "info");
        }
      }
    } catch {
      addToast("Something went wrong", "error");
    }
  }

  function copyInviteLink() {
    const url = `${window.location.origin}/partner`;
    navigator.clipboard.writeText(url).then(() => {
      addToast("Link copied!", "success");
    });
  }

  const filtered = equipment.filter((e) => {
    if (!e.active) return false;
    if (filter === "") return true;
    if (filter === "3rd-party") return !PARTNERS.includes(e.owner);
    return e.owner === filter;
  });

  const totalValue = filtered.reduce((sum, e) => sum + e.internalValue * e.quantity, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Equipment</h1>
          <p className="text-text-secondary text-sm mt-1">
            {filtered.length} items &middot; ${totalValue.toLocaleString()} total value
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={copyInviteLink}
            className="flex items-center gap-2 border border-accent/30 text-accent text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-4 py-2.5 transition-colors cursor-pointer hover:bg-accent/10"
            style={{ borderRadius: "1px" }}
          >
            Invite
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-accent hover:brightness-110 text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-4 py-2.5 transition-colors cursor-pointer"
            style={{ borderRadius: "1px" }}
          >
            + Add Equipment
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {[
          { value: "", label: "All" },
          { value: "eric", label: "Eric" },
          { value: "marko", label: "Marko" },
          { value: "3rd-party", label: "3rd Party" },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-none transition-colors cursor-pointer ${
              filter === f.value ? "bg-accent text-bg-primary" : "bg-bg-tertiary text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Pending Submissions */}
      {submissions.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-text-muted">
            Pending Submissions
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[0.6rem] font-bold bg-warning/20 text-warning rounded-full">
              {submissions.length}
            </span>
          </h2>
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-bg-secondary border border-border overflow-hidden"
              style={{ borderRadius: "1px" }}
            >
              <div className="px-5 py-4 border-b border-border flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold">{sub.name}</p>
                  <p className="text-text-muted text-xs">
                    {sub.email} &middot; {sub.phone}
                    {sub.address && <span> &middot; {sub.address}</span>}
                  </p>
                  <p className="text-text-muted text-[0.65rem] mt-1">
                    Submitted {new Date(sub.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSubmission(sub.id, "accepted")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-success border border-success/30 hover:bg-success/10 transition-colors cursor-pointer"
                    style={{ borderRadius: "1px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Accept
                  </button>
                  <button
                    onClick={() => handleSubmission(sub.id, "declined")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-danger border border-danger/30 hover:bg-danger/10 transition-colors cursor-pointer"
                    style={{ borderRadius: "1px" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Decline
                  </button>
                </div>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-2 font-medium">Equipment</th>
                    <th className="text-center px-5 py-2 font-medium">Qty</th>
                    <th className="text-right px-5 py-2 font-medium">Rate</th>
                    <th className="text-right px-5 py-2 font-medium hidden md:table-cell">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sub.equipment.map((item) => (
                    <tr key={item.id}>
                      <td className="px-5 py-2.5">
                        <span className="font-medium">{item.manufacturer} {item.model}</span>
                        {item.serialNumber && <span className="text-text-muted text-xs ml-2">SN: {item.serialNumber}</span>}
                        {item.notes && <p className="text-text-muted text-xs mt-0.5">{item.notes}</p>}
                      </td>
                      <td className="px-5 py-2.5 text-center">{item.quantity}</td>
                      <td className="px-5 py-2.5 text-right text-accent">${item.rate.toFixed(2)}/day</td>
                      <td className="px-5 py-2.5 text-right hidden md:table-cell">${item.internalValue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onMouseDown={(e) => { if (e.target === e.currentTarget) resetForm(); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) resetForm(); }} />
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl mx-4 border border-border p-6 space-y-5"
            style={{ borderRadius: "1px", background: "#111118" }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {editId ? "EDIT EQUIPMENT" : "ADD EQUIPMENT"}
              </h3>
              <button type="button" onClick={resetForm} className="text-text-muted hover:text-text-primary cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {error && (
              <div className="border border-danger/30 text-danger text-xs p-3" style={{ borderRadius: "1px", background: "rgba(239,68,68,0.05)" }}>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Manufacturer</label>
                <input value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className="w-full" placeholder="e.g., Sennheiser" />
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Model</label>
                <input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} className="w-full" placeholder="e.g., EW-DX" />
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Owner</label>
                <select value={ownerType} onChange={(e) => { setOwnerType(e.target.value as "eric" | "marko" | "3rd-party"); if (e.target.value !== "3rd-party") setOwnerCustom(""); }} className="w-full">
                  <option value="eric">Eric</option>
                  <option value="marko">Marko</option>
                  <option value="3rd-party">3rd Party</option>
                </select>
              </div>
              {ownerType === "3rd-party" && (
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Partner Name</label>
                <input value={ownerCustom} onChange={(e) => setOwnerCustom(e.target.value)} className="w-full" placeholder="e.g., Zach Jurkovich" required />
              </div>
              )}
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Quantity</label>
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })} className="w-full" required />
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Day Rate ($)</label>
                <input type="number" step="0.01" value={form.dayRate || ""} onChange={(e) => setForm({ ...form, dayRate: parseFloat(e.target.value) || 0 })} className="w-full" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Internal Value ($)</label>
                <input type="number" step="0.01" value={form.internalValue || ""} onChange={(e) => setForm({ ...form, internalValue: parseFloat(e.target.value) || 0 })} className="w-full" required />
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Notes</label>
                <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full" placeholder="Optional" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-accent text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:brightness-110 transition-all"
                style={{ borderRadius: "1px" }}
              >
                {editId ? "Update Equipment" : "Add Equipment"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 border border-border text-text-secondary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:text-text-primary transition-colors"
                style={{ borderRadius: "1px" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-bg-secondary border border-border rounded-none overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Equipment</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Owner</th>
              <th className="text-center px-5 py-3 font-medium">Qty</th>
              <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Value</th>
              <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && [...Array(6)].map((_, i) => (
              <tr key={`skel-${i}`} className="animate-pulse">
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-32" /></td>
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-20" /></td>
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-14" /></td>
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-6 mx-auto" /></td>
                <td className="px-5 py-3 hidden md:table-cell"><div className="h-4 bg-white/5 rounded w-16 ml-auto" /></td>
                <td className="px-5 py-3 hidden md:table-cell"><div className="h-4 bg-white/5 rounded w-24 ml-auto" /></td>
              </tr>
            ))}
            {!loading && filtered.map((eq) => (
              <tr key={eq.id} className="hover:bg-bg-hover transition-colors cursor-pointer" onClick={() => startEdit(eq)}>
                <td className="px-5 py-3">
                  <span className="font-medium">{[eq.manufacturer, eq.model].filter(Boolean).join(" ") || eq.name}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{eq.category}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-none ${
                    eq.owner === "eric" ? "bg-eric/10 text-eric" :
                    eq.owner === "marko" ? "bg-marko/10 text-marko" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {eq.owner.charAt(0).toUpperCase() + eq.owner.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">{eq.quantity}</td>
                <td className="px-5 py-3 text-right font-semibold hidden md:table-cell">${eq.internalValue.toLocaleString()}</td>
                <td className="px-5 py-3 text-right hidden md:table-cell">
                  <button onClick={() => startEdit(eq)} className="text-accent hover:text-accent-hover text-xs font-medium mr-3 cursor-pointer">Edit</button>
                  <button onClick={() => handleDeactivate(eq.id)} className="text-danger/60 hover:text-danger text-xs font-medium cursor-pointer">Remove</button>
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted">No equipment found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
