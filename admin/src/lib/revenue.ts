export interface GearItem {
  owner: string;       // "eric", "marko", or third-party name
  internalValue: number;
}

export interface SubRentalItem {
  provider: string;
  cost: number;
}

export interface BookingInput {
  rentalFee: number;
  deliveryFee: number;
  deliveryBy: string | null;     // "eric", "marko", "both"
  referralFee: number;
  leadPartner: string;           // "eric" or "marko"
  commPartner: string;
  invoicePartner: string;
  accountPartner: string;
  gearItems: GearItem[];
  subRentals: SubRentalItem[];
}

export interface PayoutBreakdown {
  netRevenue: number;
  gearSide: number;
  adminSide: number;
  totalSubRentalCost: number;
  eric: {
    gear: number;
    admin: number;
    delivery: number;
    total: number;
    details: string[];
  };
  marko: {
    gear: number;
    admin: number;
    delivery: number;
    total: number;
    details: string[];
  };
  thirdParties: Record<string, { gear: number; subRentalCost: number; details: string[] }>;
  referral: { name?: string; amount: number };
}

export function calculatePayout(input: BookingInput): PayoutBreakdown {
  const { rentalFee, deliveryFee, referralFee, deliveryBy } = input;

  // Step 1: Deduct referral fee from rental fee
  const netRevenue = rentalFee - referralFee;

  // Step 2: Total sub-rental costs (flat rate paid to third parties)
  const totalSubRentalCost = input.subRentals.reduce((sum, sr) => sum + sr.cost, 0);

  // Step 3: 50/50 split on net revenue
  const gearSide = netRevenue * 0.5;
  const adminSide = netRevenue * 0.5;

  // Step 4: Calculate gear proportions
  const totalGearValue = input.gearItems.reduce((sum, g) => sum + g.internalValue, 0);

  const gearPayouts: Record<string, number> = {};
  if (totalGearValue > 0) {
    for (const item of input.gearItems) {
      const share = (item.internalValue / totalGearValue) * gearSide;
      gearPayouts[item.owner] = (gearPayouts[item.owner] || 0) + share;
    }
  }

  // Step 5: Admin roles (25% each)
  const adminRoleValue = adminSide * 0.25;
  const adminPayouts: Record<string, number> = { eric: 0, marko: 0 };
  const adminDetails: Record<string, string[]> = { eric: [], marko: [] };

  const roles = [
    { role: "Lead", partner: input.leadPartner },
    { role: "Communication", partner: input.commPartner },
    { role: "Invoicing", partner: input.invoicePartner },
    { role: "Accounting", partner: input.accountPartner },
  ];

  for (const { role, partner } of roles) {
    adminPayouts[partner] += adminRoleValue;
    adminDetails[partner].push(`${role}: $${adminRoleValue.toFixed(2)}`);
  }

  // Step 6: Delivery
  const deliveryPayouts: Record<string, number> = { eric: 0, marko: 0 };
  if (deliveryBy === "eric") {
    deliveryPayouts.eric = deliveryFee;
  } else if (deliveryBy === "marko") {
    deliveryPayouts.marko = deliveryFee;
  } else if (deliveryBy === "both") {
    deliveryPayouts.eric = deliveryFee / 2;
    deliveryPayouts.marko = deliveryFee / 2;
  }

  // Step 7: Build details
  const ericGearDetails: string[] = [];
  const markoGearDetails: string[] = [];
  if (gearPayouts["eric"]) ericGearDetails.push(`Gear share: $${gearPayouts["eric"].toFixed(2)}`);
  if (gearPayouts["marko"]) markoGearDetails.push(`Gear share: $${gearPayouts["marko"].toFixed(2)}`);

  // Third parties
  const thirdParties: Record<string, { gear: number; subRentalCost: number; details: string[] }> = {};

  // Third-party gear shares (from the 50% gear side)
  for (const [owner, amount] of Object.entries(gearPayouts)) {
    if (owner !== "eric" && owner !== "marko") {
      if (!thirdParties[owner]) thirdParties[owner] = { gear: 0, subRentalCost: 0, details: [] };
      thirdParties[owner].gear = amount;
      thirdParties[owner].details.push(`Gear share: $${amount.toFixed(2)}`);
    }
  }

  // Sub-rental flat costs
  for (const sr of input.subRentals) {
    if (!thirdParties[sr.provider]) thirdParties[sr.provider] = { gear: 0, subRentalCost: 0, details: [] };
    thirdParties[sr.provider].subRentalCost += sr.cost;
    thirdParties[sr.provider].details.push(`Sub-rental cost: $${sr.cost.toFixed(2)}`);
  }

  return {
    netRevenue,
    gearSide,
    adminSide,
    totalSubRentalCost,
    eric: {
      gear: gearPayouts["eric"] || 0,
      admin: adminPayouts["eric"],
      delivery: deliveryPayouts["eric"],
      total: (gearPayouts["eric"] || 0) + adminPayouts["eric"] + deliveryPayouts["eric"],
      details: [...ericGearDetails, ...adminDetails["eric"], ...(deliveryPayouts["eric"] ? [`Delivery: $${deliveryPayouts["eric"].toFixed(2)}`] : [])],
    },
    marko: {
      gear: gearPayouts["marko"] || 0,
      admin: adminPayouts["marko"],
      delivery: deliveryPayouts["marko"],
      total: (gearPayouts["marko"] || 0) + adminPayouts["marko"] + deliveryPayouts["marko"],
      details: [...markoGearDetails, ...adminDetails["marko"], ...(deliveryPayouts["marko"] ? [`Delivery: $${deliveryPayouts["marko"].toFixed(2)}`] : [])],
    },
    thirdParties,
    referral: { name: undefined, amount: referralFee },
  };
}
