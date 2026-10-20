"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { equipment, categories } from "./equipment";
import { Arrow } from "./Chrome";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function Catalog() {
  const [category, setCategory] = useState<string>("All equipment");
  const [search, setSearch] = useState("");
  const [ready, setReady] = useState(false);

  // The full list is server-rendered for crawlers; deep-linked filters apply after hydration.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("category");
    setCategory(value && categories.some(item => item === value) ? value : "All equipment");
    setSearch(params.get("q") || "");
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    // Filters must be applied before motion measures and reveals the rows.
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("pb-content-ready")));
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  function update(nextCategory: string, nextSearch: string) {
    setCategory(nextCategory);
    setSearch(nextSearch);
    const url = new URL(window.location.href);
    if (nextCategory === "All equipment") url.searchParams.delete("category");
    else url.searchParams.set("category", nextCategory);
    if (nextSearch) url.searchParams.set("q", nextSearch);
    else url.searchParams.delete("q");
    window.history.replaceState({}, "", url);
  }

  const terms = normalize(search).split(" ").filter(Boolean);
  const filtered = equipment.filter(item => {
    const text = normalize(`${item.name} ${item.brand} ${item.category} ${item.type} ${item.description}`);
    return (category === "All equipment" || item.category === category) && terms.every(term => text.includes(term));
  });

  return <main id="main" className="pb-catalog-page">
    <div className="pb-catalog-title">
      <h1 data-pb-reveal="left" data-pb-glow>THE<br/>CATALOG<span>.</span></h1>
      <p data-pb-reveal="left">Backline & audio rental, selected for the stage.<br/>Ready for your next Los Angeles production.</p>
    </div>
    <div className="pb-catalog-tools" data-pb-reveal="left">
      <div className="pb-filter" aria-label="Equipment categories">
        {categories.map(value => <button key={value} aria-pressed={category === value} onClick={() => update(value, search)}>{value}</button>)}
      </div>
      <label className="pb-search">
        <span className="pb-visually-hidden">Search equipment</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>
        <input type="search" value={search} onChange={event => update(category, event.target.value)} placeholder="Search brand, model, or type" aria-controls="equipment-results"/>
      </label>
    </div>
    <div className="pb-results-meta" data-pb-reveal="left">
      <span role="status" aria-live="polite" aria-atomic="true">{filtered.length} {filtered.length === 1 ? "item" : "items"}{search.trim() ? ` matching “${search.trim()}”` : ""}</span>
      <span>RESULTS UPDATE AS YOU TYPE</span>
    </div>
    <div id="equipment-results" className="pb-equipment-list">
      {filtered.map(item => <article key={item.slug} className="pb-equipment">
        <Link href={`/catalog/${item.slug}`} className="pb-equipment-photo" data-pb-reveal="left" tabIndex={-1} aria-hidden="true"><img src={item.image} alt={`${item.brand} ${item.name}`} width={600} height={450} loading="lazy" decoding="async"/></Link>
        <div className="pb-equipment-info" data-pb-reveal="left">
          <span className="pb-equipment-brand">{item.brand} / {item.category}</span>
          <h2><Link href={`/catalog/${item.slug}`}>{item.name}</Link></h2>
          <p>{item.description}</p>
        </div>
        <div className="pb-equipment-end" data-pb-reveal="left"><span>{item.type}</span><Link href={`/?equipment=${encodeURIComponent(`${item.brand} ${item.name}`)}#inquire`} aria-label={`Inquire about ${item.brand} ${item.name}`}>Inquire <Arrow diagonal/></Link></div>
      </article>)}
    </div>
    {filtered.length === 0 && <div className="pb-empty" data-pb-reveal="left"><h2>No gear found.</h2><p>Try a different name or category. For equipment beyond our inventory, send us your rider.</p><button onClick={() => update("All equipment", "")}>Clear filters <Arrow/></button></div>}
    <aside className="pb-catalog-help"><h2 data-pb-reveal="left" data-pb-glow>NOT ON THE LIST?<br/>LET’S FIND IT.</h2><Link data-pb-reveal="left" href="/#inquire" className="pb-action pb-action-blue">Send us your rider <Arrow diagonal/></Link></aside>
  </main>;
}
