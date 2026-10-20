import { describe, expect, it } from "vitest";
import { invoiceTotals, type InvoiceBooking } from "./invoice-totals";

const gear = (rentalPrice: number, quantity = 1) => ({
  quantity,
  rentalPrice,
  customName: null,
  equipment: { owner: "eric", name: "Mic", manufacturer: "Shure", model: "SM58" },
});

function booking(overrides: Partial<InvoiceBooking> = {}): InvoiceBooking {
  return {
    payoutVersion: 2,
    dateStart: "2027-01-30T12:00:00Z",
    dateEnd: "2027-01-30T12:00:00Z", // one billing day
    rentalFee: 0,
    deliveryFee: 0,
    deliveryBy: null,
    referralFee: 0,
    referralName: null,
    discountType: "amount",
    discountValue: 0,
    leadPartner: "eric",
    commPartner: "eric",
    invoicePartner: "eric",
    accountPartner: "eric",
    adminBy: "both",
    dropoffBy: null,
    pickupBy: null,
    equipment: [gear(50)],
    subRentals: [],
    ...overrides,
  };
}

describe("invoiceTotals — new structure", () => {
  it("shows the minimum order adjustment and both delivery legs", () => {
    const t = invoiceTotals(booking({ dropoffBy: "eric", pickupBy: "marko" }));
    expect(t.rows.map((r) => r.label)).toEqual(["Subtotal", "Minimum order adjustment", "Drop-off", "Pick-up"]);
    expect(t.rows.find((r) => r.label === "Minimum order adjustment")!.amount).toBe(50);
    expect(t.grandTotal).toBe(200);
  });

  it("leaves off a leg the client handles", () => {
    const t = invoiceTotals(booking({ equipment: [gear(150)], dropoffBy: "eric" }));
    expect(t.rows.map((r) => r.label)).toEqual(["Subtotal", "Drop-off"]);
    expect(t.grandTotal).toBe(200);
  });

  it("bills sub-rentals at the client price without naming the provider", () => {
    const t = invoiceTotals(
      booking({
        equipment: [gear(80)],
        subRentals: [{ provider: "SIR", description: "Midas M32", cost: 200, clientPrice: 250 }],
      })
    );
    expect(t.items[1]).toEqual({ name: "Midas M32", quantity: 1, ratePerDay: null, total: 250 });
    expect(t.grandTotal).toBe(330);
  });

  it("Jutes: $2400 rental, no delivery", () => {
    const t = invoiceTotals(
      booking({ dateStart: "2027-01-30T12:00:00Z", dateEnd: "2027-02-16T12:00:00Z", equipment: [gear(50, 4)] })
    );
    expect(t.grandTotal).toBe(2400);
  });
});

describe("invoiceTotals — old structure is unchanged", () => {
  it("matches the old invoice formula", () => {
    const t = invoiceTotals(
      booking({
        payoutVersion: 1,
        equipment: [gear(50)],
        subRentals: [{ provider: "SIR", description: "Console", cost: 200, clientPrice: null }],
        discountType: "percent",
        discountValue: 10,
        deliveryFee: 65,
      })
    );
    // old: (50 + 200) − 10% + 65, no minimum
    expect(t.grandTotal).toBe(290);
    expect(t.items[1].name).toBe("Console (via SIR)");
    expect(t.rows.map((r) => r.label)).toEqual(["Equipment", "Sub-Rentals", "Subtotal", "Discount (10%)", "Delivery"]);
  });
});

describe("payout panel", () => {
  it("shows the subtotal and discount before the job total", async () => {
    const { payoutViewForBooking } = await import("./booking-payout");
    const view = payoutViewForBooking(
      booking({
        dateStart: "2027-01-30T12:00:00Z",
        dateEnd: "2027-02-16T12:00:00Z",
        equipment: [gear(50, 4)],
        discountValue: 200,
      })
    );
    expect(view.rows.slice(0, 3)).toEqual([
      { label: "Rental Subtotal", amount: 2400 },
      { label: "Discount", amount: 200, tone: "minus" },
      { label: "Total Job", amount: 2200, tone: "total" },
    ]);
  });
});
