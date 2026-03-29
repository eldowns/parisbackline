import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/bookings/BookingForm";

export const dynamic = "force-dynamic";

export default async function NewBookingPage() {
  const [clients, equipment] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.equipment.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">New Booking</h1>
      <BookingForm clients={clients} equipment={equipment} />
    </div>
  );
}
