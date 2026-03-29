import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: { bookings: { orderBy: { dateStart: "desc" }, include: { equipment: { include: { equipment: true } } } } },
  });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const client = await prisma.client.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      notes: body.notes,
    },
  });
  return NextResponse.json(client);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
