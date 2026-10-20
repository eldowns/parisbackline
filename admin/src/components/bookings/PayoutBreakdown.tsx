"use client";

import type { PayoutView } from "@/lib/booking-payout";

const DOT: Record<string, string> = { eric: "bg-eric", marko: "bg-marko" };
const TEXT: Record<string, string> = { eric: "text-eric", marko: "text-marko" };

export default function PayoutBreakdown({ view }: { view: PayoutView }) {
  return (
    <div className="bg-bg-secondary border border-border rounded-none overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-accent/5">
        <h3 className="text-sm font-semibold text-accent">Live Payout Calculator</h3>
        <p className="text-xs text-text-muted mt-0.5">Updates as you fill in the form</p>
      </div>

      <div className="p-5 space-y-4 text-sm">
        {/* Summary */}
        <div className="space-y-2">
          {view.rows.map((row) => (
            <div key={row.label} className="flex justify-between text-text-secondary">
              <span>{row.label}</span>
              <span
                className={
                  row.tone === "minus"
                    ? "text-danger"
                    : row.tone === "warning"
                      ? "text-warning"
                      : row.tone === "muted"
                        ? "text-text-muted"
                        : row.tone === "total"
                          ? "font-semibold text-text-primary"
                          : "text-text-primary"
                }
              >
                {row.tone === "minus" ? "-" : row.tone === "plus" ? "+" : ""}${row.amount.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-text-secondary">{view.netLabel}</span>
            <span className="font-semibold">${view.net.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {view.tiles.map((tile) => (
              <div key={tile.label} className="bg-bg-tertiary rounded-none p-2.5 text-center">
                <p className="text-text-muted text-xs">{tile.label}</p>
                <p className="font-semibold">${tile.amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* People */}
        {view.people.map((person) => (
          <div key={person.key} className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${DOT[person.key] || "bg-warning"}`} />
                <span className={`font-semibold ${TEXT[person.key] || "text-warning"}`}>{person.name}</span>
              </div>
              <span className="font-bold text-lg">${person.total.toFixed(2)}</span>
            </div>
            <div className="space-y-1 ml-4">
              {person.details.map((d, i) => (
                <p key={i} className="text-xs text-text-muted">{d}</p>
              ))}
              {person.details.length === 0 && <p className="text-xs text-text-muted">No allocation</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
