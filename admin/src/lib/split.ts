// Payout structure v2 — the single source of truth for rental totals and payouts.
// Pure: no database or React imports, so the booking form, booking pages,
// earnings and invoices all share it. All math runs in integer cents.

export const MINIMUM_ORDER = 100;
export const OWNERS_FEE_RATE = 15; // % of gross
export const REFERRAL_RATE = 10; // % of (gross − Owner's Fee)
export const ADMIN_RATE = 25; // % of remainder on our own gear
export const PARTNER_ADMIN_RATE = 50; // % of remainder on gear partners' gear (50/50 with the partner)
export const DELIVERY_LEG_FEE = 50;
export const SUB_RENTAL_MARKUP = 15; // % added to our cost to get the client price
export const PARTNERS = ["eric", "marko"] as const;

// Gear revenue with no owner (custom items, sub-rental markup) — split between the partners
const HOUSE = "__house__";

export interface SplitLineItem {
  owner: string | null; // gear owner; null for custom items
  amount: number; // client price for the line (rate × qty × billing days)
}

export interface SplitSubRental {
  provider: string;
  cost: number; // what the provider charges us; the client is billed cost + 15%
}

export interface SplitInput {
  items: SplitLineItem[];
  subRentals?: SplitSubRental[];
  discountType?: "amount" | "percent";
  discountValue?: number;
  referralName?: string | null;
  adminBy: string; // "eric" | "marko" | "both"
  dropoffBy?: string | null; // who did the leg; null, "" or "client" = client handles it
  pickupBy?: string | null;
}

export interface PersonPayout {
  owners: number;
  admin: number;
  gear: number;
  delivery: number;
  subRental: number;
  total: number;
}

export interface DeliveryLeg {
  by: string;
  fee: number;
}

export interface SplitResult {
  // Client-facing
  rentalSubtotal: number;
  discountRequested: number;
  discount: number;
  discountCapped: boolean;
  minimumAdjustment: number;
  rentalTotal: number;
  dropoff: DeliveryLeg | null;
  pickup: DeliveryLeg | null;
  deliveryTotal: number;
  clientTotal: number;
  // Internal waterfall
  subRentalCost: number;
  gross: number;
  ownersFee: number;
  referralName: string | null;
  referralFee: number;
  remainder: number;
  adminSide: number;
  gearSide: number;
  payouts: Record<string, PersonPayout>;
}

const cents = (dollars: number) => Math.round((dollars || 0) * 100);
const dollars = (c: number) => c / 100;
const pct = (c: number, rate: number) => Math.round((c * rate) / 100);
const evenDown = (c: number) => c - (c % 2);
const markupCents = (costCents: number) => costCents + pct(costCents, SUB_RENTAL_MARKUP);

// What the client is billed for a sub-rental: our cost + 15%, to the cent
export function subRentalClientPrice(cost: number): number {
  return dollars(markupCents(cents(cost)));
}

export function normalizePerson(name: string | null | undefined): string | null {
  const trimmed = (name || "").trim();
  if (!trimmed) return null;
  const lower = trimmed.toLowerCase();
  if (lower === "client") return null;
  return (PARTNERS as readonly string[]).includes(lower) ? lower : trimmed;
}

export function isOutsideReferrer(name: string | null | undefined): boolean {
  const person = normalizePerson(name);
  return !!person && !(PARTNERS as readonly string[]).includes(person);
}

function emptyPayout(): Record<string, number> {
  return { owners: 0, admin: 0, gear: 0, delivery: 0, subRental: 0 };
}

export function calculateSplit(input: SplitInput): SplitResult {
  const subRentals = input.subRentals || [];

  // 1. Rental subtotal: own gear + custom items + sub-rentals at client price (cost + 15%)
  const itemCents = input.items.map((i) => ({ owner: i.owner, amount: cents(i.amount) }));
  const subCents = subRentals.map((s) => ({ provider: s.provider, cost: cents(s.cost), clientPrice: markupCents(cents(s.cost)) }));
  const subtotal =
    itemCents.reduce((s, i) => s + i.amount, 0) + subCents.reduce((s, sr) => s + sr.clientPrice, 0);

  // 2. Discount, capped so it never takes the rental below the minimum
  const minimum = cents(MINIMUM_ORDER);
  const value = Math.max(0, input.discountValue || 0);
  const requested = input.discountType === "percent" ? pct(subtotal, value) : cents(value);
  const discount = Math.min(requested, Math.max(0, subtotal - minimum));
  const afterDiscount = subtotal - discount;

  // 3. Minimum order adjustment
  const minimumAdjustment = subtotal > 0 ? Math.max(0, minimum - afterDiscount) : 0;
  const rentalTotal = afterDiscount + minimumAdjustment;

  // 4. Gross: sub-rental costs go straight to the provider; only the markup is split
  const subRentalCost = subCents.reduce((s, sr) => s + sr.cost, 0);
  const gross = Math.max(0, rentalTotal - subRentalCost);

  // 5. Waterfall. Owner's Fee (and "both" admin) kept even so halves are whole cents;
  //    the spare cent lands in Gear, which is always the leftover.
  const ownersFee = evenDown(pct(gross, OWNERS_FEE_RATE));
  const referralName = isOutsideReferrer(input.referralName) ? normalizePerson(input.referralName) : null;
  const referralFee = referralName ? pct(gross - ownersFee, REFERRAL_RATE) : 0;
  const remainder = gross - ownersFee - referralFee;

  // 6. Each owner's slice of the remainder, by what their gear earned.
  //    Custom items and sub-rental markup have no owner (HOUSE → Eric/Marko 50/50).
  const weights = new Map<string, number>();
  const addWeight = (key: string, w: number) => weights.set(key, (weights.get(key) || 0) + Math.max(0, w));
  for (const i of itemCents) addWeight(normalizePerson(i.owner) || HOUSE, i.amount);
  for (const sr of subCents) addWeight(HOUSE, sr.clientPrice - sr.cost);
  const isGearPartner = (key: string) => key !== HOUSE && !(PARTNERS as readonly string[]).includes(key);
  const totalWeight = [...weights.values()].reduce((s, w) => s + w, 0);
  const partnerWeight = [...weights].reduce((s, [key, w]) => s + (isGearPartner(key) ? w : 0), 0);

  // Gear partners (e.g. Dario) split their slice 50/50 with Admin; our own gear gives Admin 25%
  const partnerRemainder = totalWeight ? Math.round((remainder * partnerWeight) / totalWeight) : 0;
  const ownRemainder = remainder - partnerRemainder;
  const partnerAdmin = pct(partnerRemainder, PARTNER_ADMIN_RATE);
  const partnerGear = partnerRemainder - partnerAdmin;
  const adminBy = (input.adminBy || "both").toLowerCase();
  const adminRaw = pct(ownRemainder, ADMIN_RATE) + partnerAdmin;
  const adminSide = adminBy === "both" ? evenDown(adminRaw) : adminRaw;
  const gearSide = remainder - adminSide;
  const ownGear = gearSide - partnerGear;

  const payouts: Record<string, Record<string, number>> = { eric: emptyPayout(), marko: emptyPayout() };
  const person = (key: string) => (payouts[key] ||= emptyPayout());

  for (const p of PARTNERS) person(p).owners += ownersFee / 2;

  if (adminBy === "both") {
    person("eric").admin += adminSide / 2;
    person("marko").admin += adminSide / 2;
  } else {
    person(normalizePerson(adminBy) || "eric").admin += adminSide;
  }

  // Share a pool by weight; any leftover cent goes to the biggest share
  const sharePool = (pool: number, keys: string[]): Map<string, number> => {
    const shares = new Map<string, number>();
    const poolWeight = keys.reduce((s, k) => s + weights.get(k)!, 0);
    if (poolWeight === 0) {
      if (pool) shares.set(HOUSE, pool);
      return shares;
    }
    let allocated = 0;
    let largest = "";
    for (const key of keys) {
      const share = Math.floor((pool * weights.get(key)!) / poolWeight);
      shares.set(key, share);
      allocated += share;
      if (!largest || weights.get(key)! > weights.get(largest)!) largest = key;
    }
    shares.set(largest, shares.get(largest)! + (pool - allocated));
    return shares;
  };

  const keys = [...weights.keys()];
  const partnerKeys = keys.filter(isGearPartner);
  const ownKeys = keys.filter((k) => !isGearPartner(k) && weights.get(k)! > 0);
  // All-partner order: a spare cent from evening out admin goes to the partner, not to us
  const partnerPool = ownKeys.length === 0 && partnerKeys.length > 0 ? partnerGear + ownGear : partnerGear;
  const ownPool = gearSide - partnerPool;
  const gearShares = [...sharePool(partnerPool, partnerKeys), ...sharePool(ownPool, ownKeys)];

  for (const [key, share] of gearShares) {
    if (key === HOUSE) {
      const half = Math.floor(share / 2);
      person("eric").gear += share - half; // odd cent to Eric
      person("marko").gear += half;
    } else {
      person(key).gear += share;
    }
  }

  // 7. Delivery — outside the waterfall, each leg paid to whoever did it
  const leg = (by: string | null | undefined): DeliveryLeg | null => {
    const who = normalizePerson(by);
    if (!who) return null;
    person(who).delivery += cents(DELIVERY_LEG_FEE);
    return { by: who, fee: DELIVERY_LEG_FEE };
  };
  const dropoff = leg(input.dropoffBy);
  const pickup = leg(input.pickupBy);
  const deliveryTotal = cents((dropoff?.fee || 0) + (pickup?.fee || 0));

  // 8. Sub-rental providers get their cost
  for (const sr of subCents) person(normalizePerson(sr.provider) || sr.provider).subRental += sr.cost;

  const result: Record<string, PersonPayout> = {};
  for (const [key, p] of Object.entries(payouts)) {
    const total = p.owners + p.admin + p.gear + p.delivery + p.subRental;
    result[key] = {
      owners: dollars(p.owners),
      admin: dollars(p.admin),
      gear: dollars(p.gear),
      delivery: dollars(p.delivery),
      subRental: dollars(p.subRental),
      total: dollars(total),
    };
  }

  return {
    rentalSubtotal: dollars(subtotal),
    discountRequested: dollars(requested),
    discount: dollars(discount),
    discountCapped: discount < requested,
    minimumAdjustment: dollars(minimumAdjustment),
    rentalTotal: dollars(rentalTotal),
    dropoff,
    pickup,
    deliveryTotal: dollars(deliveryTotal),
    clientTotal: dollars(rentalTotal + deliveryTotal),
    subRentalCost: dollars(subRentalCost),
    gross: dollars(gross),
    ownersFee: dollars(ownersFee),
    referralName,
    referralFee: dollars(referralFee),
    remainder: dollars(remainder),
    adminSide: dollars(adminSide),
    gearSide: dollars(gearSide),
    payouts: result,
  };
}
