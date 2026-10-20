export type RiderItem = { id: string; item: string; quantity: number; notes: string };

export type Rider = {
  artist: string;
  contactName: string;
  phone: string;
  email: string;
  show: string;
  date: string;
  venue: string;
  notes: string;
  items: RiderItem[];
};

export const emptyRider: Rider = { artist: "", contactName: "", phone: "", email: "", show: "", date: "", venue: "", notes: "", items: [] };

export const totalQuantity = (items: RiderItem[]) => items.reduce((sum, item) => sum + item.quantity, 0);

export const formatRiderDate = (date: string) =>
  date ? new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }) : "";

export const showLine = (rider: Rider) => [rider.show, formatRiderDate(rider.date), rider.venue].map(part => part.trim()).filter(Boolean).join("  ·  ");

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
