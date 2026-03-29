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
  const equipment = await prisma.equipment.update({
    where: { id },
    data: {
      manufacturer: body.manufacturer,
      model: body.model,
      name: body.name,
      category: body.category,
      owner: body.owner,
      internalValue: body.internalValue,
      serialNumber: body.serialNumber,
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
