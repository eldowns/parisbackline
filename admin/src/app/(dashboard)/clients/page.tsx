"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface ClientData {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  bookings: { id: string; rentalFee: number; deliveryFee: number; status: string }[];
}

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", notes: "" });

  useEffect(() => {
    fetch("/api/clients").then((r) => r.json()).then((data) => { setClients(data); setLoading(false); });
  }, []);

  function resetForm() {
    setForm({ name: "", email: "", phone: "", company: "", notes: "" });
    setEditId(null);
    setShowForm(false);
  }

  function startEdit(c: ClientData) {
    setForm({ name: c.name, email: c.email || "", phone: c.phone || "", company: c.company || "", notes: c.notes || "" });
    setEditId(c.id);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/clients/${editId}` : "/api/clients";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) {
      const updated = await fetch("/api/clients").then((r) => r.json());
      setClients(updated);
      resetForm();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client? This will fail if they have bookings.")) return;
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) setClients(clients.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-text-secondary text-sm mt-1">{clients.length} total</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2.5 transition-colors cursor-pointer"
        >
          + Add Client
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border rounded-none p-5 mb-6 space-y-4">
          <h3 className="text-sm font-semibold">{editId ? "Edit Client" : "Add Client"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Client Name</label>
              <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full" placeholder="Company or project name" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Contact</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full" required placeholder="Contact person" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full" />
            </div>
            <div>
              <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Phone</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full" />
            </div>
            <div className="col-span-2">
              <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">Notes</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full h-20 resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2 cursor-pointer">
              {editId ? "Update" : "Add Client"}
            </button>
            <button type="button" onClick={resetForm} className="text-text-secondary text-sm hover:text-text-primary cursor-pointer">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-bg-secondary border border-border rounded-none overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Client</th>
              <th className="text-left px-5 py-3 font-medium">Contact</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Info</th>
              <th className="text-right px-5 py-3 font-medium">Bookings</th>
              <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Revenue</th>
              <th className="text-right px-5 py-3 font-medium hidden md:table-cell">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && [...Array(5)].map((_, i) => (
              <tr key={`skel-${i}`} className="animate-pulse">
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-28" /></td>
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-24" /></td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="h-3 bg-white/5 rounded w-36 mb-1" />
                  <div className="h-3 bg-white/5 rounded w-24" />
                </td>
                <td className="px-5 py-3"><div className="h-4 bg-white/5 rounded w-6 ml-auto" /></td>
                <td className="px-5 py-3 hidden md:table-cell"><div className="h-4 bg-white/5 rounded w-16 ml-auto" /></td>
                <td className="px-5 py-3 hidden md:table-cell"><div className="h-4 bg-white/5 rounded w-28 ml-auto" /></td>
              </tr>
            ))}
            {!loading && clients.map((c) => {
              const revenue = c.bookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.rentalFee + b.deliveryFee, 0);
              return (
                <tr key={c.id} className="hover:bg-bg-hover transition-colors cursor-pointer" onClick={() => startEdit(c)}>
                  <td className="px-5 py-3 font-medium">{c.company || c.name}</td>
                  <td className="px-5 py-3 text-text-secondary">{c.company ? c.name : "—"}</td>
                  <td className="px-5 py-3 text-text-secondary text-xs hidden md:table-cell">
                    {c.email && <span className="block">{c.email}</span>}
                    {c.phone && <span className="block">{c.phone}</span>}
                    {!c.email && !c.phone && "—"}
                  </td>
                  <td className="px-5 py-3 text-right">{c.bookings.length}</td>
                  <td className="px-5 py-3 text-right font-semibold hidden md:table-cell">${revenue.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right hidden md:table-cell">
                    <button onClick={() => startEdit(c)} className="text-accent hover:text-accent-hover text-xs font-medium mr-3 cursor-pointer">Edit</button>
                    <Link href={`/bookings?clientId=${c.id}`} className="text-text-secondary hover:text-text-primary text-xs font-medium mr-3">Bookings</Link>
                    <button onClick={() => handleDelete(c.id)} className="text-danger/60 hover:text-danger text-xs font-medium cursor-pointer">Delete</button>
                  </td>
                </tr>
              );
            })}
            {!loading && clients.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-12 text-center text-text-muted">No clients yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
