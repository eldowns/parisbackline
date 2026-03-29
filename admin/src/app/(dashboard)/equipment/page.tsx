"use client";

import { useState, useEffect } from "react";

interface EquipmentItem {
  id: string;
  manufacturer: string | null;
  model: string | null;
  name: string;
  category: string;
  owner: string;
  quantity: number;
  internalValue: number;
  serialNumber: string | null;
  notes: string | null;
  active: boolean;
}

const categories = ["Wireless Mic", "IEM", "Console", "Keyboard/Piano", "DI/Splitter", "Cable/Adapter", "Case/Rack", "Monitor", "Amplifier", "Other"];

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ manufacturer: "", model: "", category: "Wireless Mic", owner: "eric", quantity: 1, internalValue: 0, serialNumber: "", notes: "" });
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/equipment").then((r) => r.json()).then(setEquipment);
  }, []);

  function resetForm() {
    setForm({ manufacturer: "", model: "", category: "Wireless Mic", owner: "eric", quantity: 1, internalValue: 0, serialNumber: "", notes: "" });
    setEditId(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(eq: EquipmentItem) {
    setForm({ manufacturer: eq.manufacturer || "", model: eq.model || "", category: eq.category, owner: eq.owner, quantity: eq.quantity, internalValue: eq.internalValue, serialNumber: eq.serialNumber || "", notes: eq.notes || "" });
    setEditId(eq.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const url = editId ? `/api/equipment/${editId}` : "/api/equipment";
    const method = editId ? "PUT" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
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

  const filtered = equipment.filter((e) =>
    (filter === "" || e.owner === filter) && e.active
  );

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
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer"
        >
          + Add Equipment
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["", "eric", "marko"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
              filter === f ? "bg-accent text-white" : "bg-bg-tertiary text-text-secondary hover:text-text-primary border border-border"
            }`}
          >
            {f === "" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={resetForm}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl border border-border p-6 space-y-5"
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
                <select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="w-full">
                  <option value="eric">Eric</option>
                  <option value="marko">Marko</option>
                </select>
              </div>
              <div>
                <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">Quantity</label>
                <input type="number" min={1} value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })} className="w-full" required />
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
      <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Equipment</th>
              <th className="text-left px-5 py-3 font-medium">Category</th>
              <th className="text-left px-5 py-3 font-medium">Owner</th>
              <th className="text-center px-5 py-3 font-medium">Qty</th>
              <th className="text-right px-5 py-3 font-medium">Value</th>
              <th className="text-right px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((eq) => (
              <tr key={eq.id} className="hover:bg-bg-hover transition-colors">
                <td className="px-5 py-3">
                  <span className="font-medium">{[eq.manufacturer, eq.model].filter(Boolean).join(" ") || eq.name}</span>
                </td>
                <td className="px-5 py-3 text-text-secondary">{eq.category}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    eq.owner === "eric" ? "bg-eric/10 text-eric" :
                    eq.owner === "marko" ? "bg-marko/10 text-marko" :
                    "bg-accent/10 text-accent"
                  }`}>
                    {eq.owner.charAt(0).toUpperCase() + eq.owner.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">{eq.quantity}</td>
                <td className="px-5 py-3 text-right font-semibold">${eq.internalValue.toLocaleString()}</td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => startEdit(eq)} className="text-accent hover:text-accent-hover text-xs font-medium mr-3 cursor-pointer">Edit</button>
                  <button onClick={() => handleDeactivate(eq.id)} className="text-danger/60 hover:text-danger text-xs font-medium cursor-pointer">Remove</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted">No equipment found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
