"use client";

import type { PayoutBreakdown as PayoutType } from "@/lib/revenue";

export default function PayoutBreakdown({
  payout,
  rentalFee,
  deliveryFee,
}: {
  payout: PayoutType;
  rentalFee: number;
  deliveryFee: number;
}) {
  const totalJob = rentalFee + deliveryFee;

  return (
    <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border bg-accent/5">
        <h3 className="text-sm font-semibold text-accent">Live Payout Calculator</h3>
        <p className="text-xs text-text-muted mt-0.5">Updates as you fill in the form</p>
      </div>

      <div className="p-5 space-y-4 text-sm">
        {/* Summary */}
        <div className="space-y-2">
          <div className="flex justify-between text-text-secondary">
            <span>Total Job</span>
            <span className="font-semibold text-text-primary">${totalJob.toFixed(2)}</span>
          </div>
          {payout.referral.amount > 0 && (
            <div className="flex justify-between text-text-secondary">
              <span>Referral Fee</span>
              <span className="text-danger">-${payout.referral.amount.toFixed(2)}</span>
            </div>
          )}
          {payout.totalSubRentalCost > 0 && (
            <div className="flex justify-between text-text-secondary">
              <span>Sub-Rental Costs</span>
              <span className="text-warning">${payout.totalSubRentalCost.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 flex justify-between">
            <span className="text-text-secondary">Net Revenue</span>
            <span className="font-semibold">${payout.netRevenue.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-bg-tertiary rounded-lg p-2.5 text-center">
              <p className="text-text-muted text-xs">Gear Side</p>
              <p className="font-semibold">${payout.gearSide.toFixed(2)}</p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-2.5 text-center">
              <p className="text-text-muted text-xs">Admin Side</p>
              <p className="font-semibold">${payout.adminSide.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Eric */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-eric" />
              <span className="font-semibold text-eric">Eric</span>
            </div>
            <span className="font-bold text-lg">${payout.eric.total.toFixed(2)}</span>
          </div>
          <div className="space-y-1 ml-4">
            {payout.eric.details.map((d, i) => (
              <p key={i} className="text-xs text-text-muted">{d}</p>
            ))}
            {payout.eric.details.length === 0 && (
              <p className="text-xs text-text-muted">No allocation</p>
            )}
          </div>
        </div>

        {/* Marko */}
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-marko" />
              <span className="font-semibold text-marko">Marko</span>
            </div>
            <span className="font-bold text-lg">${payout.marko.total.toFixed(2)}</span>
          </div>
          <div className="space-y-1 ml-4">
            {payout.marko.details.map((d, i) => (
              <p key={i} className="text-xs text-text-muted">{d}</p>
            ))}
            {payout.marko.details.length === 0 && (
              <p className="text-xs text-text-muted">No allocation</p>
            )}
          </div>
        </div>

        {/* Third parties */}
        {Object.entries(payout.thirdParties).map(([name, data]) => (
          <div key={name} className="border-t border-border pt-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="font-semibold text-warning">{name}</span>
              </div>
              <span className="font-bold text-lg">
                ${(data.gear + data.subRentalCost).toFixed(2)}
              </span>
            </div>
            <div className="space-y-1 ml-4">
              {data.details.map((d, i) => (
                <p key={i} className="text-xs text-text-muted">{d}</p>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
