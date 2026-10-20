export type RiderItem = { id: string; item: string; quantity: number; notes: string };

export type Rider = {
  artist: string;
  contactName: string;
  phone: string;
  email: string;
  notes: string;
  items: RiderItem[];
};

export const emptyRider: Rider = { artist: "", contactName: "", phone: "", email: "", notes: "", items: [] };

export const totalQuantity = (items: RiderItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);

export function missingFields(rider: Rider) {
  const missing: string[] = [];
  if (!rider.artist.trim()) missing.push("artist name");
  if (!rider.contactName.trim()) missing.push("contact name");
  if (!rider.phone.trim() && !rider.email.trim()) missing.push("a phone number or email");
  if (!rider.items.length) missing.push("at least one backline item");
  return missing;
}

export const riderFileName = (rider: Rider) =>
  `${(rider.artist.trim() || "artist").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-backline-rider.pdf`;
