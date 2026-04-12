import { prisma } from "@/lib/prisma";
import BookingForm from "@/components/bookings/BookingForm";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function NewBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ duplicate?: string }>;
}) {
  const { duplicate } = await searchParams;

  const [clients, equipment, sourceBooking] = await Promise.all([
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.equipment.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
    duplicate
      ? prisma.booking.findUnique({
          where: { id: duplicate },
          include: { equipment: { include: { equipment: true } }, subRentals: true },
        })
      : null,
  ]);

  const initialData = sourceBooking
    ? {
        // No id — this creates a new booking
        clientId: sourceBooking.clientId,
        description: sourceBooking.description || "",
        dateStart: format(new Date(sourceBooking.dateStart), "yyyy-MM-dd"),
        dateEnd: format(new Date(sourceBooking.dateEnd), "yyyy-MM-dd"),
        rentalFee: sourceBooking.rentalFee,
        deliveryFee: sourceBooking.deliveryFee,
        deliveryBy: sourceBooking.deliveryBy || "",
        referralFee: sourceBooking.referralFee,
        referralPercent: sourceBooking.referralPercent,
        referralName: sourceBooking.referralName || "",
        discountType: (sourceBooking.discountType as "amount" | "percent") || "amount",
        discountValue: sourceBooking.discountValue || 0,
        leadPartner: sourceBooking.leadPartner,
        commPartner: sourceBooking.commPartner,
        invoicePartner: sourceBooking.invoicePartner,
        accountPartner: sourceBooking.accountPartner,
        notes: sourceBooking.notes || "",
        status: "confirmed",
        equipment: sourceBooking.equipment.map((be) => ({
          equipmentId: be.equipmentId,
          quantity: be.quantity,
          rentalPrice: be.rentalPrice,
        })),
        subRentals: sourceBooking.subRentals.map((sr) => ({
          provider: sr.provider,
          description: sr.description,
          cost: sr.cost,
        })),
      }
    : undefined;

  return (
    <div>
      <Link href="/bookings" className="text-text-muted text-xs hover:text-accent transition-colors">&larr; Back to Bookings</Link>
      <h1 className="text-2xl font-bold mb-6">{sourceBooking ? "Duplicate Booking" : "New Booking"}</h1>
      <BookingForm clients={clients} equipment={equipment} initialData={initialData} />
    </div>
  );
}
