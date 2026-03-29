import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateStart = searchParams.get("dateStart");
  const dateEnd = searchParams.get("dateEnd");
  const excludeBookingId = searchParams.get("excludeBookingId");

  if (!dateStart || !dateEnd) {
    return NextResponse.json({ error: "dateStart and dateEnd required" }, { status: 400 });
  }

  const start = new Date(dateStart + "T00:00:00Z");
  const end = new Date(dateEnd + "T23:59:59Z");

  const where: Record<string, unknown> = {
    booking: {
      status: { not: "cancelled" },
      dateStart: { lte: end },
      dateEnd: { gte: start },
    },
  };

  if (excludeBookingId) {
    (where.booking as Record<string, unknown>).id = { not: excludeBookingId };
  }

  const bookedEquipment = await prisma.bookingEquipment.findMany({
    where,
    select: {
      equipmentId: true,
      quantity: true,
      booking: { select: { id: true, dateStart: true, dateEnd: true, client: { select: { name: true, company: true } } } },
    },
  });

  // Group by equipment ID
  const conflicts: Record<string, { equipmentId: string; totalBooked: number; bookings: { client: string; dateStart: string; dateEnd: string }[] }> = {};

  for (const be of bookedEquipment) {
    if (!conflicts[be.equipmentId]) {
      conflicts[be.equipmentId] = { equipmentId: be.equipmentId, totalBooked: 0, bookings: [] };
    }
    conflicts[be.equipmentId].totalBooked += be.quantity;
    conflicts[be.equipmentId].bookings.push({
      client: be.booking.client.company || be.booking.client.name,
      dateStart: be.booking.dateStart.toISOString(),
      dateEnd: be.booking.dateEnd.toISOString(),
    });
  }

  return NextResponse.json(conflicts);
}
