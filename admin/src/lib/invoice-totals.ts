// Client-facing invoice lines and totals, shared by the invoice email, PDF and preview.
// Only the final price is shown to clients — never the internal split.

import { billingDays, splitInputFromBooking, type BookingForPayout } from "./booking-payout";
import { calculateSplit } from "./split";

export interface InvoiceBooking extends Omit<BookingForPayout, "equipment" | "subRentals"> {
  equipment: {
    quantity: number;
    rentalPrice: number;
    customName: string | null;
    equipment: { owner: string; name: string; manufacturer: string | null; model: string | null } | null;
  }[];
  subRentals: { provider: string; description: string; cost: number; clientPrice: number | null }[];
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  ratePerDay: number | null; // rate × qty for one day; null for flat-priced lines
  total: number;
}

export interface InvoiceTotalRow {
  label: string;
  amount: number;
  discount?: boolean;
}

export interface InvoiceTotals {
  items: InvoiceItem[];
  rows: InvoiceTotalRow[];
  grandTotal: number;
}

function itemName(be: InvoiceBooking["equipment"][number]) {
  return be.equipment
    ? [be.equipment.manufacturer, be.equipment.model].filter(Boolean).join(" ") || be.equipment.name
    : be.customName || "Custom Item";
}

export function invoiceTotals(b: InvoiceBooking): InvoiceTotals {
  const days = billingDays(b.dateStart, b.dateEnd) || 1;
  const equipmentItems: InvoiceItem[] = b.equipment.map((be) => ({
    name: itemName(be),
    quantity: be.quantity,
    ratePerDay: be.rentalPrice * be.quantity,
    total: be.rentalPrice * be.quantity * days,
  }));
  const equipmentTotal = equipmentItems.reduce((s, i) => s + i.total, 0);

  if (b.payoutVersion >= 2) {
    const split = calculateSplit(splitInputFromBooking(b));
    const items = [
      ...equipmentItems,
      ...b.subRentals.map((sr) => ({
        name: sr.description,
        quantity: 1,
        ratePerDay: null,
        total: sr.clientPrice ?? sr.cost,
      })),
    ];
    const rows: InvoiceTotalRow[] = [{ label: "Subtotal", amount: split.rentalSubtotal }];
    if (split.discount > 0) {
      rows.push({
        label: `Discount${b.discountType === "percent" && !split.discountCapped ? ` (${b.discountValue}%)` : ""}`,
        amount: split.discount,
        discount: true,
      });
    }
    if (split.minimumAdjustment > 0) rows.push({ label: "Minimum order adjustment", amount: split.minimumAdjustment });
    if (split.dropoff) rows.push({ label: "Drop-off", amount: split.dropoff.fee });
    if (split.pickup) rows.push({ label: "Pick-up", amount: split.pickup.fee });
    return { items, rows, grandTotal: split.clientTotal };
  }

  // Old structure: unchanged from before payout v2
  const subRentalTotal = b.subRentals.reduce((s, sr) => s + sr.cost, 0);
  const subtotal = equipmentTotal + subRentalTotal;
  const discountAmount =
    b.discountValue > 0 ? (b.discountType === "percent" ? subtotal * (b.discountValue / 100) : b.discountValue) : 0;
  const items = [
    ...equipmentItems,
    ...b.subRentals.map((sr) => ({
      name: `${sr.description} (via ${sr.provider})`,
      quantity: 1,
      ratePerDay: null,
      total: sr.cost,
    })),
  ];
  const rows: InvoiceTotalRow[] = [{ label: "Equipment", amount: equipmentTotal }];
  if (subRentalTotal > 0) rows.push({ label: "Sub-Rentals", amount: subRentalTotal });
  if (discountAmount > 0) {
    rows.push({ label: "Subtotal", amount: subtotal });
    rows.push({
      label: `Discount${b.discountType === "percent" ? ` (${b.discountValue}%)` : ""}`,
      amount: discountAmount,
      discount: true,
    });
  }
  if (b.deliveryFee > 0) rows.push({ label: "Delivery", amount: b.deliveryFee });
  return { items, rows, grandTotal: subtotal - discountAmount + b.deliveryFee };
}
