import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const clientId = searchParams.get("clientId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (clientId) where.clientId = clientId;

  const bookings = await prisma.booking.findMany({
    where,
    include: { client: true, equipment: { include: { equipment: true } }, subRentals: true },
    orderBy: { dateStart: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const booking = await prisma.booking.create({
    data: {
      clientId: body.clientId,
      description: body.description,
      dateStart: new Date(body.dateStart),
      dateEnd: new Date(body.dateEnd),
      rentalFee: body.rentalFee,
      deliveryFee: body.deliveryFee || 0,
      deliveryBy: body.deliveryBy,
      referralFee: body.referralFee || 0,
      referralName: body.referralName,
      leadPartner: body.leadPartner,
      commPartner: body.commPartner,
      invoicePartner: body.invoicePartner,
      accountPartner: body.accountPartner,
      invoiceSent: body.invoiceSent || false,
      invoicePaid: body.invoicePaid || false,
      notes: body.notes,
      status: body.status || "confirmed",
      equipment: {
        create: (body.equipment || []).map((e: { equipmentId: string; quantity: number }) => ({
          equipmentId: e.equipmentId,
          quantity: e.quantity || 1,
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

  return NextResponse.json(booking, { status: 201 });
}
