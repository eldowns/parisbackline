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
  try {
    const body = await request.json();
    const name = [body.manufacturer, body.model].filter(Boolean).join(" ") || "Unnamed";
    const equipment = await prisma.equipment.create({
      data: {
        manufacturer: body.manufacturer || null,
        model: body.model || null,
        name,
        category: body.category,
        owner: body.owner,
        quantity: body.quantity || 1,
        internalValue: body.internalValue,
        serialNumber: body.serialNumber || null,
        notes: body.notes || null,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(equipment, { status: 201 });
  } catch (err) {
    console.error("Equipment create error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
