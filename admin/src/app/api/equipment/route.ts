import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const equipment = await prisma.equipment.findMany({
    orderBy: { name: "asc" },
    include: { bookingItems: { include: { booking: true } } },
  });
  return NextResponse.json(equipment);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const equipment = await prisma.equipment.create({
    data: {
      manufacturer: body.manufacturer,
      model: body.model,
      name: body.name,
      category: body.category,
      owner: body.owner,
      internalValue: body.internalValue,
      serialNumber: body.serialNumber,
      notes: body.notes,
      active: body.active ?? true,
    },
  });
  return NextResponse.json(equipment, { status: 201 });
}
