import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await request.json();

    if (status !== "accepted" && status !== "declined") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const submission = await prisma.partnerSubmission.findUnique({
      where: { id },
      include: { equipment: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (status === "accepted") {
      const ownerName = submission.name.toLowerCase().replace(/\s+/g, "-");

      for (const item of submission.equipment) {
        await prisma.equipment.create({
          data: {
            manufacturer: item.manufacturer,
            model: item.model,
            name: `${item.manufacturer} ${item.model}`,
            category: "Other",
            owner: ownerName,
            quantity: item.quantity,
            internalValue: item.internalValue,
            serialNumber: item.serialNumber,
            notes: item.notes,
          },
        });
      }
    }

    await prisma.partnerSubmission.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Partner update error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
