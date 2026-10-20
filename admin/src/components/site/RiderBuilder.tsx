"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Arrow } from "./Chrome";
import { equipment } from "./equipment";
import { emptyRider, missingFields, riderFileName, showLine, type Rider } from "./rider";

const STORAGE_KEY = "pb-rider-draft";

const fromCatalog = equipment.map(item => `${item.brand} ${item.name}`);

const blankLine = { item: "", quantity: 1, notes: "" };

export default function RiderBuilder() {
  const [rider, setRider] = useState<Rider>(emptyRider);
  const [line, setLine] = useState(blankLine);
  const [status, setStatus] = useState<"idle" | "building" | "error">("idle");
  const [loaded, setLoaded] = useState(false);
  const itemInput = useRef<HTMLInputElement>(null);

  // Drafts are a per-browser convenience; the page works the same without storage.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        // Older drafts carried a per-item category; it is no longer part of the rider.
        setRider({ ...emptyRider, ...draft, items: (draft.items ?? []).map(({ id, item, quantity, notes }: Rider["items"][number]) => ({ id, item, quantity, notes })) });
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rider)); } catch {}
  }, [rider, loaded]);

  const set = (field: keyof Omit<Rider, "items">) => (event: { target: { value: string } }) => setRider(current => ({ ...current, [field]: event.target.value }));

  function addItem(event: FormEvent) {
    event.preventDefault();
    if (!line.item.trim()) { itemInput.current?.focus(); return; }
    const item = { ...line, item: line.item.trim(), notes: line.notes.trim(), quantity: Math.max(1, Math.round(line.quantity) || 1), id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` };
    setRider(current => ({ ...current, items: [...current.items, item] }));
    setLine(blankLine);
    itemInput.current?.focus();
  }

  const removeItem = (id: string) => setRider(current => ({ ...current, items: current.items.filter(item => item.id !== id) }));
  const moveItem = (id: string, step: -1 | 1) => setRider(current => {
    const items = [...current.items];
    const index = items.findIndex(item => item.id === id);
    const target = index + step;
    if (index < 0 || target < 0 || target >= items.length) return current;
    [items[index], items[target]] = [items[target], items[index]];
    return { ...current, items };
  });

  const missing = missingFields(rider);

  async function download() {
    if (missing.length) return;
    setStatus("building");
    try {
      const [{ pdf }, { default: RiderPdf }] = await Promise.all([import("@react-pdf/renderer"), import("./RiderPdf")]);
      const blob = await pdf(<RiderPdf rider={rider}/>).toBlob();
      const url = URL.createObjectURL(blob);
      const link = Object.assign(document.createElement("a"), { href: url, download: riderFileName(rider) });
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    if (window.confirm("Clear this rider and start over?")) { setRider(emptyRider); setLine(blankLine); }
  }

  const show = showLine(rider);

  return <div className="pb-rider">
    <div className="pb-rider-form">
      <fieldset className="pb-rider-step">
        <legend><span>01</span>Artist & contact</legend>
        <div className="pb-fields">
          <label>Artist / band name *<input value={rider.artist} onChange={set("artist")} placeholder="The artist on the bill" autoComplete="organization"/></label>
          <label>Contact name *<input value={rider.contactName} onChange={set("contactName")} placeholder="Tour or production manager" autoComplete="name"/></label>
          <label>Phone<input type="tel" value={rider.phone} onChange={set("phone")} placeholder="(555) 555-0123" autoComplete="tel"/></label>
          <label>Email<input type="email" value={rider.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email"/></label>
        </div>
        <p className="pb-rider-hint">Add a phone number, an email, or both.</p>
      </fieldset>

      <fieldset className="pb-rider-step">
        <legend><span>02</span>Show details <em>optional</em></legend>
        <div className="pb-fields">
          <label>Show or tour<input value={rider.show} onChange={set("show")} placeholder="Tour name or event"/></label>
          <label>Date<input type="date" value={rider.date} onChange={set("date")}/></label>
          <label className="pb-rider-wide">Venue / city<input value={rider.venue} onChange={set("venue")} placeholder="Venue name, city"/></label>
        </div>
      </fieldset>

      <fieldset className="pb-rider-step">
        <legend><span>03</span>Backline</legend>
        <form className="pb-rider-add" onSubmit={addItem} aria-label="Add a backline item">
          <label className="pb-rider-item">Item — make & model<input ref={itemInput} value={line.item} onChange={event => setLine({ ...line, item: event.target.value })} placeholder="e.g. Nord Stage 3 88" list="pb-rider-catalog"/></label>
          <label className="pb-rider-qty">Qty<input type="number" min={1} max={99} value={line.quantity} onChange={event => setLine({ ...line, quantity: Number(event.target.value) })}/></label>
          <label className="pb-rider-notes">Notes<input value={line.notes} onChange={event => setLine({ ...line, notes: event.target.value })} placeholder="Stand, pedals, spares…"/></label>
          <button type="submit" className="pb-rider-add-button">Add item <span aria-hidden="true">+</span></button>
          <datalist id="pb-rider-catalog">{fromCatalog.map(option => <option key={option} value={option}/>)}</datalist>
        </form>
        <div className="pb-rider-quick" aria-label="Quick add from our catalog">
          <span>From our catalog</span>
          {fromCatalog.map(option => <button key={option} type="button" onClick={() => { setLine({ ...line, item: option }); itemInput.current?.focus(); }}>{option}</button>)}
        </div>
        {rider.items.length > 0 ? <ol className="pb-rider-list">
          {rider.items.map((item, index) => <li key={item.id}>
            <span className="pb-rider-list-qty">{item.quantity}×</span>
            <span className="pb-rider-list-item"><strong>{item.item}</strong>{item.notes && <small>{item.notes}</small>}</span>
            <span className="pb-rider-list-actions">
              <button type="button" onClick={() => moveItem(item.id, -1)} disabled={index === 0} aria-label={`Move ${item.item} up`}>↑</button>
              <button type="button" onClick={() => moveItem(item.id, 1)} disabled={index === rider.items.length - 1} aria-label={`Move ${item.item} down`}>↓</button>
              <button type="button" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.item}`}>×</button>
            </span>
          </li>)}
        </ol> : <p className="pb-rider-empty">No items yet. Add them one at a time — include stands, pedals and spares.</p>}
      </fieldset>

      <fieldset className="pb-rider-step">
        <legend><span>04</span>Notes <em>optional</em></legend>
        <label className="pb-rider-wide">Anything else the backline provider should know<textarea rows={4} value={rider.notes} onChange={set("notes")} placeholder="Load-in time, power needs, who to call on show day…"/></label>
      </fieldset>

      <div className="pb-rider-actions">
        <button type="button" className="pb-submit" onClick={download} disabled={missing.length > 0 || status === "building"}>{status === "building" ? "Building PDF…" : "Download PDF"}<Arrow/></button>
        <p className="pb-form-note" aria-live="polite">{missing.length ? `Still needed: ${missing.join(", ")}.` : "Ready to export. Your draft is saved in this browser."}</p>
        {status === "error" && <p className="pb-form-error" role="alert">The PDF couldn’t be created. Please try again.</p>}
        <button type="button" className="pb-rider-reset" onClick={reset}>Clear and start over</button>
      </div>
    </div>

    <aside className="pb-rider-preview" aria-label="Rider preview">
      <span className="pb-rider-preview-label">Preview</span>
      <div className="pb-rider-sheet">
        <div className="pb-rider-sheet-top"><div><small>ARTIST</small><h2>{rider.artist || "Artist name"}</h2></div><b>BACKLINE<br/>RIDER</b></div>
        {show && <p className="pb-rider-sheet-show">{show}</p>}
        <dl className="pb-rider-sheet-contact">
          <div><dt>Contact</dt><dd>{rider.contactName || "—"}</dd></div>
          {rider.phone && <div><dt>Phone</dt><dd>{rider.phone}</dd></div>}
          {rider.email && <div><dt>Email</dt><dd>{rider.email}</dd></div>}
        </dl>
        {rider.items.length > 0 && <section>
          <h3>Backline</h3>
          <ul>{rider.items.map(item => <li key={item.id}><b>{item.quantity}×</b><span>{item.item}</span><em>{item.notes}</em></li>)}</ul>
        </section>}
        {!rider.items.length && <p className="pb-rider-sheet-empty">Your backline items will appear here.</p>}
        {rider.notes.trim() && <div className="pb-rider-sheet-notes"><small>ADDITIONAL NOTES</small><p>{rider.notes}</p></div>}
      </div>
    </aside>
  </div>;
}
