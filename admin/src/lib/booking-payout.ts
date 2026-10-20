// Turns a saved booking into payout numbers for display, picking the structure
// the booking was made under: v1 = old 50/50 (revenue.ts), v2 = current (split.ts).
// No database or React imports, so client components can use it too.

import { calculatePayout, type PayoutBreakdown } from "./revenue";
import { calculateSplit, type SplitInput, type SplitResult } from "./split";

export interface BookingForPayout {
  payoutVersion: number;
  dateStart: Date | string;
  dateEnd: Date | string;
  rentalFee: number;
  deliveryFee: number;
  deliveryBy: string | null;
  referralFee: number;
  referralName: string | null;
  discountType: string;
  discountValue: number;
  leadPartner: string;
  commPartner: string;
  invoicePartner: string;
  accountPartner: string;
  adminBy: string;
  dropoffBy: string | null;
  pickupBy: string | null;
  equipment: { quantity: number; rentalPrice: number; equipment: { owner: string } | null }[];
  subRentals: { provider: string; cost: number; clientPrice: number | null }[];
}

export interface PartnerTotals {
  owners: number;
  gear: number;
  admin: number;
  delivery: number;
  total: number;
}

export interface PayoutView {
  rows: { label: string; amount: number; tone?: "total" | "minus" | "plus" | "warning" | "muted" }[];
  netLabel: string;
  net: number;
  tiles: { label: string; amount: number }[];
  people: { key: string; name: string; total: number; details: string[] }[];
  partners: { eric: PartnerTotals; marko: PartnerTotals };
}

// Backline week rule: each 7-day week is billed as 4 days
export function billingDays(start: Date | string, end: Date | string): number {
  const diff = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  const rentalDays = Math.max(diff + 1, 0);
  if (rentalDays === 0) return 0;
  return Math.floor(rentalDays / 7) * 4 + Math.min(rentalDays % 7, 4);
}

export function splitInputFromBooking(b: BookingForPayout): SplitInput {
  const days = billingDays(b.dateStart, b.dateEnd);
  return {
    items: b.equipment.map((be) => ({
      owner: be.equipment?.owner ?? null,
      amount: be.rentalPrice * be.quantity * days,
    })),
    subRentals: b.subRentals.map((sr) => ({
      provider: sr.provider,
      cost: sr.cost,
      clientPrice: sr.clientPrice ?? sr.cost,
    })),
    discountType: b.discountType === "percent" ? "percent" : "amount",
    discountValue: b.discountValue,
    referralName: b.referralName,
    adminBy: b.adminBy,
    dropoffBy: b.dropoffBy,
    pickupBy: b.pickupBy,
  };
}

export function legacyPayoutFromBooking(b: BookingForPayout): PayoutBreakdown {
  return calculatePayout({
    rentalFee: b.rentalFee,
    deliveryFee: b.deliveryFee,
    deliveryBy: b.deliveryBy,
    referralFee: b.referralFee,
    leadPartner: b.leadPartner,
    commPartner: b.commPartner,
    invoicePartner: b.invoicePartner,
    accountPartner: b.accountPartner,
    gearItems: b.equipment
      .filter((be) => be.equipment)
      .map((be) => ({ owner: be.equipment!.owner, revenue: be.rentalPrice * be.quantity })),
    subRentals: b.subRentals.map((sr) => ({ provider: sr.provider, cost: sr.cost })),
  });
}

export function payoutViewForBooking(b: BookingForPayout): PayoutView {
  return b.payoutVersion >= 2
    ? viewFromSplit(calculateSplit(splitInputFromBooking(b)))
    : viewFromLegacy(legacyPayoutFromBooking(b), b.rentalFee, b.deliveryFee);
}

const money = (n: number) => `$${n.toFixed(2)}`;
const label = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function viewFromSplit(r: SplitResult): PayoutView {
  const rows: PayoutView["rows"] = [];
  if (r.discount > 0 || r.minimumAdjustment > 0) {
    rows.push({ label: "Rental Subtotal", amount: r.rentalSubtotal });
    if (r.discount > 0) rows.push({ label: "Discount", amount: r.discount, tone: "minus" });
    if (r.minimumAdjustment > 0) rows.push({ label: "Minimum Order Adjustment", amount: r.minimumAdjustment, tone: "plus" });
  }
  if (r.deliveryTotal > 0) rows.push({ label: "Delivery (paid per leg)", amount: r.deliveryTotal, tone: "muted" });
  rows.push({ label: "Total Job", amount: r.clientTotal, tone: "total" });
  if (r.subRentalCost > 0) rows.push({ label: "Sub-Rental Costs", amount: r.subRentalCost, tone: "warning" });
  rows.push({ label: "Gross", amount: r.gross });
  rows.push({ label: "Owner's Fee (15%)", amount: r.ownersFee, tone: "minus" });
  if (r.referralFee > 0) rows.push({ label: "Referral Fee", amount: r.referralFee, tone: "minus" });

  const people: PayoutView["people"] = [];
  const order = ["eric", "marko", ...Object.keys(r.payouts).filter((k) => k !== "eric" && k !== "marko")];
  for (const key of order) {
    const p = r.payouts[key];
    const details: string[] = [];
    if (p.owners) details.push(`Owner's Fee: ${money(p.owners)}`);
    if (p.admin) details.push(`Admin: ${money(p.admin)}`);
    if (p.gear) details.push(`Gear share: ${money(p.gear)}`);
    if (p.delivery) details.push(`Delivery: ${money(p.delivery)}`);
    if (p.subRental) details.push(`Sub-rental cost: ${money(p.subRental)}`);
    people.push({ key, name: label(key), total: p.total, details });
  }
  if (r.referralName) {
    people.push({ key: "referral", name: r.referralName, total: r.referralFee, details: [`Referral fee: ${money(r.referralFee)}`] });
  }

  const partner = (key: "eric" | "marko"): PartnerTotals => {
    const p = r.payouts[key];
    return { owners: p.owners, gear: p.gear, admin: p.admin, delivery: p.delivery, total: p.owners + p.gear + p.admin + p.delivery };
  };

  return {
    rows,
    netLabel: "Remainder",
    net: r.remainder,
    tiles: [
      { label: "Gear Side", amount: r.gearSide },
      { label: "Admin (25%)", amount: r.adminSide },
    ],
    people,
    partners: { eric: partner("eric"), marko: partner("marko") },
  };
}

export function viewFromLegacy(p: PayoutBreakdown, rentalFee: number, deliveryFee: number): PayoutView {
  const rows: PayoutView["rows"] = [{ label: "Total Job", amount: rentalFee + deliveryFee, tone: "total" }];
  if (p.referral.amount > 0) rows.push({ label: "Referral Fee", amount: p.referral.amount, tone: "minus" });
  if (p.totalSubRentalCost > 0) rows.push({ label: "Sub-Rental Costs", amount: p.totalSubRentalCost, tone: "warning" });

  const people: PayoutView["people"] = [
    { key: "eric", name: "Eric", total: p.eric.total, details: p.eric.details },
    { key: "marko", name: "Marko", total: p.marko.total, details: p.marko.details },
    ...Object.entries(p.thirdParties).map(([name, d]) => ({
      key: name,
      name,
      total: d.gear + d.subRentalCost,
      details: d.details,
    })),
  ];

  const partner = (x: PayoutBreakdown["eric"]): PartnerTotals => ({
    owners: 0,
    gear: x.gear,
    admin: x.admin,
    delivery: x.delivery,
    total: x.total,
  });

  return {
    rows,
    netLabel: "Net Revenue",
    net: p.netRevenue,
    tiles: [
      { label: "Gear Side", amount: p.gearSide },
      { label: "Admin Side", amount: p.adminSide },
    ],
    people,
    partners: { eric: partner(p.eric), marko: partner(p.marko) },
  };
}
