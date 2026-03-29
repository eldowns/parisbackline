import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" },
    include: { bookings: { orderBy: { dateStart: "desc" } } },
  });
  return NextResponse.json(clients);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const client = await prisma.client.create({
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      notes: body.notes,
    },
  });
  return NextResponse.json(client, { status: 201 });
}
