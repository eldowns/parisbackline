import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const equipment = await prisma.equipment.findUnique({ where: { id } });
  if (!equipment) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(equipment);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const name = [body.manufacturer, body.model].filter(Boolean).join(" ") || "Unnamed";
  const serials: string[] = Array.isArray(body.serialNumbers)
    ? body.serialNumbers.map((s: string) => String(s).trim()).filter(Boolean)
    : [];
  const finalQty = serials.length > 0 ? Math.max(serials.length, body.quantity || 1) : (body.quantity || 1);
  const equipment = await prisma.equipment.update({
    where: { id },
    data: {
      manufacturer: body.manufacturer || null,
      model: body.model || null,
      name,
      category: body.category,
      owner: body.owner,
      quantity: finalQty,
      dayRate: body.dayRate || 0,
      internalValue: body.internalValue,
      serialNumbers: serials,
      notes: body.notes,
      active: body.active,
    },
  });
  return NextResponse.json(equipment);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.equipment.update({ where: { id }, data: { active: false } });
  return NextResponse.json({ ok: true });
}
