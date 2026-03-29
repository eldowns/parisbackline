import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { client: true, equipment: { include: { equipment: true } }, subRentals: true },
  });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(booking);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const { id } = await params;
  const body = await request.json();

  // Delete existing equipment and sub-rentals to replace
  await prisma.bookingEquipment.deleteMany({ where: { bookingId: id } });
  await prisma.subRental.deleteMany({ where: { bookingId: id } });

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      clientId: body.clientId,
      description: body.description,
      dateStart: new Date(body.dateStart),
      dateEnd: new Date(body.dateEnd),
      rentalFee: body.rentalFee,
      deliveryFee: body.deliveryFee || 0,
      deliveryBy: body.deliveryBy,
      referralFee: body.referralFee || 0,
      referralPercent: body.referralPercent || 10,
      referralName: body.referralName,
      leadPartner: body.leadPartner,
      commPartner: body.commPartner,
      invoicePartner: body.invoicePartner,
      accountPartner: body.accountPartner,
      invoiceSent: body.invoiceSent ?? false,
      invoicePaid: body.invoicePaid ?? false,
      notes: body.notes,
      status: body.status,
      equipment: {
        create: (body.equipment || []).map((e: { equipmentId: string; quantity: number; rentalPrice: number }) => ({
          equipmentId: e.equipmentId,
          quantity: e.quantity || 1,
          rentalPrice: e.rentalPrice || 0,
        })),
      },
      subRentals: {
        create: (body.subRentals || []).map((s: { provider: string; description: string; cost: number }) => ({
          provider: s.provider,
          description: s.description,
          cost: s.cost,
        })),
      },
    },
    include: { client: true, equipment: { include: { equipment: true } }, subRentals: true },
  });

  return NextResponse.json(booking);
  } catch (err) {
    console.error("Booking update error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
