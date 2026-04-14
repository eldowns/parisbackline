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
      const ownerName = submission.name.trim();

      // Group submission items by (manufacturer, model) so identical models become one Equipment record
      const groups = new Map<string, typeof submission.equipment>();
      for (const item of submission.equipment) {
        const key = `${item.manufacturer.trim().toLowerCase()}|${item.model.trim().toLowerCase()}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(item);
      }

      for (const items of groups.values()) {
        const first = items[0];
        const incomingSerials = Array.from(
          new Set(items.map((i) => i.serialNumber?.trim()).filter((s): s is string => !!s))
        );
        const summedQty = items.reduce((s, i) => s + i.quantity, 0);
        const incomingQty = incomingSerials.length > 0 ? Math.max(incomingSerials.length, summedQty) : summedQty;

        const existing = await prisma.equipment.findFirst({
          where: {
            manufacturer: { equals: first.manufacturer, mode: "insensitive" },
            model: { equals: first.model, mode: "insensitive" },
            owner: { equals: ownerName, mode: "insensitive" },
            active: true,
          },
        });

        if (existing) {
          const mergedSerials = Array.from(new Set([...existing.serialNumbers, ...incomingSerials]));
          const newQty = mergedSerials.length > 0
            ? Math.max(mergedSerials.length, existing.quantity + incomingQty)
            : existing.quantity + incomingQty;
          await prisma.equipment.update({
            where: { id: existing.id },
            data: {
              serialNumbers: mergedSerials,
              quantity: newQty,
              dayRate: first.rate || existing.dayRate,
              internalValue: first.internalValue || existing.internalValue,
            },
          });
        } else {
          await prisma.equipment.create({
            data: {
              manufacturer: first.manufacturer,
              model: first.model,
              name: `${first.manufacturer} ${first.model}`,
              category: "Other",
              owner: ownerName,
              quantity: incomingQty,
              dayRate: first.rate,
              internalValue: first.internalValue,
              serialNumbers: incomingSerials,
              notes: items.map((i) => i.notes).filter(Boolean).join("; ") || null,
            },
          });
        }
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
