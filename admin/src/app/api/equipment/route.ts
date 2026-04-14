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
    const incomingSerials: string[] = Array.isArray(body.serialNumbers)
      ? body.serialNumbers.map((s: string) => s.trim()).filter(Boolean)
      : [];

    // Try to merge into an existing record with same (manufacturer, model, owner)
    if (body.manufacturer && body.model && body.owner) {
      const existing = await prisma.equipment.findFirst({
        where: {
          manufacturer: { equals: body.manufacturer, mode: "insensitive" },
          model: { equals: body.model, mode: "insensitive" },
          owner: { equals: body.owner, mode: "insensitive" },
          active: true,
        },
      });
      if (existing) {
        const mergedSerials = Array.from(new Set([...existing.serialNumbers, ...incomingSerials]));
        const newQty = mergedSerials.length > 0
          ? Math.max(mergedSerials.length, existing.quantity + (body.quantity || 0))
          : existing.quantity + (body.quantity || 1);
        const updated = await prisma.equipment.update({
          where: { id: existing.id },
          data: {
            serialNumbers: mergedSerials,
            quantity: newQty,
            dayRate: body.dayRate ?? existing.dayRate,
            internalValue: body.internalValue ?? existing.internalValue,
            notes: body.notes ?? existing.notes,
          },
        });
        return NextResponse.json(updated, { status: 200 });
      }
    }

    const equipment = await prisma.equipment.create({
      data: {
        manufacturer: body.manufacturer || null,
        model: body.model || null,
        name,
        category: body.category,
        owner: body.owner,
        quantity: incomingSerials.length > 0 ? Math.max(incomingSerials.length, body.quantity || 1) : (body.quantity || 1),
        dayRate: body.dayRate || 0,
        internalValue: body.internalValue,
        serialNumbers: incomingSerials,
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
