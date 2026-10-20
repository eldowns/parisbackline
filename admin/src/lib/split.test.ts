import { describe, expect, it } from "vitest";
import { calculateSplit, subRentalClientPrice, type SplitInput } from "./split";

function rental(amount: number, opts: Partial<SplitInput> = {}): SplitInput {
  return { items: [{ owner: "eric", amount }], adminBy: "eric", ...opts };
}

describe("calculateSplit — waterfall (rental only)", () => {
  const cases: [string, number, boolean, number, number, number, number][] = [
    // label, rental, outside referral, owner's fee, referral fee, admin, gear
    ["$50 billed as $100", 50, false, 15.0, 0, 21.25, 63.75],
    ["$150 with referral", 150, true, 22.5, 12.75, 28.69, 86.06],
    ["$300", 300, false, 45.0, 0, 63.75, 191.25],
    ["$500 with referral", 500, true, 75.0, 42.5, 95.63, 286.87],
    ["$1000", 1000, false, 150.0, 0, 212.5, 637.5],
    ["$1000 with referral", 1000, true, 150.0, 85.0, 191.25, 573.75],
    ["$1200", 1200, false, 180.0, 0, 255.0, 765.0],
    ["$2400", 2400, false, 360.0, 0, 510.0, 1530.0],
    ["$2400 with referral", 2400, true, 360.0, 204.0, 459.0, 1377.0],
  ];

  it.each(cases)("%s", (_label, amount, referred, owners, referral, admin, gear) => {
    const r = calculateSplit(rental(amount, { referralName: referred ? "Sam" : null }));
    expect(r.ownersFee).toBe(owners);
    expect(r.referralFee).toBe(referral);
    expect(r.adminSide).toBe(admin);
    expect(r.gearSide).toBe(gear);
    expect(r.ownersFee + r.referralFee + r.adminSide + r.gearSide).toBeCloseTo(r.gross, 10);
  });

  it("splits the Owner's Fee equally between Eric and Marko", () => {
    const r = calculateSplit(rental(1000));
    expect(r.payouts.eric.owners).toBe(75);
    expect(r.payouts.marko.owners).toBe(75);
  });
});

describe("minimum order and discount", () => {
  it("adds a minimum order adjustment up to $100", () => {
    const r = calculateSplit(rental(50));
    expect(r.minimumAdjustment).toBe(50);
    expect(r.rentalTotal).toBe(100);
    expect(r.gross).toBe(100);
  });

  it("caps a discount so the rental never drops below $100", () => {
    const r = calculateSplit(rental(110, { discountType: "amount", discountValue: 20 }));
    expect(r.discount).toBe(10);
    expect(r.discountCapped).toBe(true);
    expect(r.minimumAdjustment).toBe(0);
    expect(r.rentalTotal).toBe(100);
  });

  it("allows no discount when the rental is already under $100", () => {
    const r = calculateSplit(rental(80, { discountType: "percent", discountValue: 10 }));
    expect(r.discount).toBe(0);
    expect(r.minimumAdjustment).toBe(20);
    expect(r.rentalTotal).toBe(100);
  });

  it("applies a normal discount above the minimum", () => {
    const r = calculateSplit(rental(500, { discountType: "amount", discountValue: 20 }));
    expect(r.discount).toBe(20);
    expect(r.discountCapped).toBe(false);
    expect(r.rentalTotal).toBe(480);
  });
});

describe("delivery", () => {
  it("charges $50 per leg, outside the waterfall", () => {
    const r = calculateSplit(rental(150, { dropoffBy: "eric", pickupBy: "marko" }));
    expect(r.deliveryTotal).toBe(100);
    expect(r.clientTotal).toBe(250);
    expect(r.gross).toBe(150);
    expect(r.ownersFee).toBe(22.5);
    expect(r.payouts.eric.delivery).toBe(50);
    expect(r.payouts.marko.delivery).toBe(50);
  });

  it("a $100 order with both legs comes to $200", () => {
    expect(calculateSplit(rental(100, { dropoffBy: "eric", pickupBy: "eric" })).clientTotal).toBe(200);
  });

  it("drops a leg the client handles", () => {
    const r = calculateSplit(rental(150, { dropoffBy: "eric", pickupBy: "client" }));
    expect(r.pickup).toBeNull();
    expect(r.deliveryTotal).toBe(50);
    expect(r.clientTotal).toBe(200);
  });

  it("is never part of the minimum", () => {
    const r = calculateSplit(rental(60, { dropoffBy: "eric", pickupBy: "eric" }));
    expect(r.minimumAdjustment).toBe(40);
    expect(r.clientTotal).toBe(200);
  });
});

describe("referrals", () => {
  it("pays no referral fee when Eric or Marko referred the client", () => {
    expect(calculateSplit(rental(1000, { referralName: "Marko" })).referralFee).toBe(0);
    expect(calculateSplit(rental(1000, { referralName: " eric " })).referralFee).toBe(0);
  });
});

describe("gear distribution", () => {
  it("mixed order: our gear Admin 25% / Gear 75%, partner gear 50 / 25 / 25", () => {
    const r = calculateSplit({
      items: [
        { owner: "eric", amount: 600 },
        { owner: "Dario", amount: 400 },
      ],
      adminBy: "marko",
    });
    // remainder $850: our slice $510 → Admin 127.50, Eric 382.50
    //                 Dario's slice $340 → Dario 170, Admin 85, Eric/Marko 42.50 each
    expect(r.payouts.Dario.gear).toBe(170);
    expect(r.payouts.Dario.owners).toBe(0);
    expect(r.payouts.Dario.admin).toBe(0);
    expect(r.payouts.marko.admin).toBe(212.5);
    expect(r.payouts.eric.gear).toBe(425);
    expect(r.payouts.marko.gear).toBe(42.5);
  });

  it("partner gear: partner 50%, Admin 25%, Eric/Marko 25% equally", () => {
    const r = calculateSplit({ items: [{ owner: "Dario", amount: 2400 }], adminBy: "marko" });
    expect(r.ownersFee).toBe(360);
    expect(r.remainder).toBe(2040);
    expect(r.payouts.Dario.gear).toBe(1020);
    expect(r.adminSide).toBe(510);
    expect(r.payouts.eric.gear).toBe(255);
    expect(r.payouts.marko.gear).toBe(255);
    expect(r.payouts.marko.total).toBe(945);
    expect(r.payouts.eric.total).toBe(435);
  });

  it("partner split comes after discount and referral, never delivery", () => {
    const r = calculateSplit({
      items: [{ owner: "Dario", amount: 2400 }],
      discountType: "amount",
      discountValue: 200,
      referralName: "Sam",
      adminBy: "both",
      dropoffBy: "eric",
      pickupBy: "eric",
    });
    // gross 2200 → Owner's 330 → referral 187 → 1683 remainder
    expect(r.referralFee).toBe(187);
    expect(r.payouts.Dario.gear).toBe(841.5);
    expect(r.adminSide).toBe(420.74); // kept even for "both"; spare cent to Gear
    expect(r.deliveryTotal).toBe(100);
    expect(r.payouts.Dario.delivery).toBe(0);
    const paid = Object.values(r.payouts).reduce((s, p) => s + p.total, 0) + r.referralFee;
    expect(paid).toBeCloseTo(r.clientTotal, 10);
  });

  it("partner-only order reconciles to the cent", () => {
    const r = calculateSplit({ items: [{ owner: "Dario", amount: 100.03 }], adminBy: "both" });
    const paid = Object.values(r.payouts).reduce((s, p) => s + p.total, 0);
    expect(paid).toBeCloseTo(r.clientTotal, 10);
  });

  it("splits Gear from custom items between the partners", () => {
    const r = calculateSplit({ items: [{ owner: null, amount: 1000 }], adminBy: "eric" });
    expect(r.payouts.eric.gear).toBe(318.75);
    expect(r.payouts.marko.gear).toBe(318.75);
  });

  it("gives any leftover cent to the biggest gear share", () => {
    const r = calculateSplit({
      items: [
        { owner: "eric", amount: 100 },
        { owner: "marko", amount: 101 },
        { owner: "Dario", amount: 100 },
      ],
      adminBy: "eric",
    });
    const gearTotal = r.payouts.eric.gear + r.payouts.marko.gear + r.payouts.Dario.gear;
    expect(gearTotal).toBeCloseTo(r.gearSide, 10);
    expect(r.payouts.marko.gear).toBeGreaterThan(r.payouts.eric.gear);
  });
});

describe("sub-rentals", () => {
  it("bills the client our cost + 15%", () => {
    expect(subRentalClientPrice(200)).toBe(230);
    expect(subRentalClientPrice(1000)).toBe(1150);
    expect(subRentalClientPrice(123.45)).toBe(141.97);
  });

  it("passes the cost to the provider and splits only the markup", () => {
    const r = calculateSplit({
      items: [{ owner: "eric", amount: 80 }],
      subRentals: [{ provider: "SIR", cost: 200 }],
      adminBy: "eric",
    });
    expect(r.rentalTotal).toBe(310);
    expect(r.minimumAdjustment).toBe(0);
    expect(r.gross).toBe(110);
    expect(r.ownersFee).toBe(16.5);
    expect(r.adminSide).toBe(23.38);
    expect(r.gearSide).toBe(70.12);
    expect(r.payouts.SIR.subRental).toBe(200);
  });

  it("a sub-rental alone: the 15% markup is what gets split", () => {
    const r = calculateSplit({ items: [], subRentals: [{ provider: "SIR", cost: 1000 }], adminBy: "marko" });
    expect(r.rentalTotal).toBe(1150);
    expect(r.gross).toBe(150);
    expect(r.ownersFee).toBe(22.5);
    expect(r.adminSide).toBe(31.88);
    expect(r.gearSide).toBe(95.62);
    expect(r.payouts.SIR.subRental).toBe(1000);
  });
});

describe("rounding", () => {
  it("keeps 'both' admin even and moves the spare cent to Gear", () => {
    const r = calculateSplit(rental(500, { referralName: "Sam", adminBy: "both" }));
    expect(r.adminSide).toBe(95.62);
    expect(r.gearSide).toBe(286.88);
    expect(r.payouts.eric.admin).toBe(47.81);
    expect(r.payouts.marko.admin).toBe(47.81);
  });

  it("keeps the Owner's Fee even", () => {
    const r = calculateSplit(rental(150.06));
    expect(r.ownersFee).toBe(22.5);
    expect(r.payouts.eric.owners).toBe(11.25);
  });

  it("always reconciles payouts to the client total", () => {
    const r = calculateSplit({
      items: [
        { owner: "eric", amount: 333.33 },
        { owner: "Dario", amount: 222.22 },
        { owner: null, amount: 77.77 },
      ],
      subRentals: [{ provider: "SIR", cost: 123.45 }],
      discountType: "percent",
      discountValue: 7,
      referralName: "Sam",
      adminBy: "both",
      dropoffBy: "eric",
      pickupBy: "Jake",
    });
    const paid = Object.values(r.payouts).reduce((s, p) => s + p.total, 0) + r.referralFee;
    expect(paid).toBeCloseTo(r.clientTotal, 10);
  });
});
