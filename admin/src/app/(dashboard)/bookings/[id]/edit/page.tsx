import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "@/components/bookings/BookingForm";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function EditBookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [booking, clients, equipment] = await Promise.all([
    prisma.booking.findUnique({
      where: { id },
      include: { equipment: { include: { equipment: true } }, subRentals: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.equipment.findMany({ where: { active: true }, orderBy: { name: "asc" } }),
  ]);

  if (!booking) notFound();

  const initialData = {
    id: booking.id,
    clientId: booking.clientId,
    description: booking.description || "",
    dateStart: format(new Date(booking.dateStart), "yyyy-MM-dd"),
    dateEnd: format(new Date(booking.dateEnd), "yyyy-MM-dd"),
    rentalFee: booking.rentalFee,
    deliveryFee: booking.deliveryFee,
    deliveryBy: booking.deliveryBy || "",
    referralFee: booking.referralFee,
    referralName: booking.referralName || "",
    leadPartner: booking.leadPartner,
    commPartner: booking.commPartner,
    invoicePartner: booking.invoicePartner,
    accountPartner: booking.accountPartner,
    invoiceSent: booking.invoiceSent,
    invoicePaid: booking.invoicePaid,
    notes: booking.notes || "",
    status: booking.status,
    equipment: booking.equipment.map((be) => ({
      equipmentId: be.equipmentId,
      quantity: be.quantity,
      rentalPrice: be.rentalPrice,
    })),
    subRentals: booking.subRentals.map((sr) => ({
      provider: sr.provider,
      description: sr.description,
      cost: sr.cost,
    })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Booking</h1>
      <BookingForm clients={clients} equipment={equipment} initialData={initialData} />
    </div>
  );
}
