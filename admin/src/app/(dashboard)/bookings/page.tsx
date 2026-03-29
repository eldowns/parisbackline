import { prisma } from "@/lib/prisma";
import BookingsList from "@/components/bookings/BookingsList";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { dateStart: "desc" },
    include: {
      client: true,
      equipment: { include: { equipment: true } },
      subRentals: true,
    },
  });

  return <BookingsList bookings={JSON.parse(JSON.stringify(bookings))} />;
}
