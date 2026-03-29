import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/bookings/BookingForm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const [clients, equipment] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.equipment.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <Link href="/bookings" className="text-text-muted text-xs hover:text-accent transition-colors">&larr; Back to Bookings</Link>
      <h1 className="text-2xl font-bold mb-6">New Booking</h1>
      <BookingForm clients={clients} equipment={equipment} />
    </div>
  );
}
