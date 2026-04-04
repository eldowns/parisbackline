import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export async function GET() {
  try {
    const submissions = await prisma.partnerSubmission.findMany({
      where: { status: "pending" },
      include: { equipment: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (err) {
    console.error("Partner list error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { contact, equipment } = await request.json();

    if (!contact?.name || !contact?.email || !contact?.phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await prisma.partnerSubmission.create({
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        address: contact.address || "",
        bankAccount: contact.bankAccount || "",
        bankRouting: contact.bankRouting || "",
        equipment: {
          create: equipment.map((e: { manufacturer: string; model: string; quantity: number; rate: number; internalValue: number; serialNumber?: string; notes?: string }) => ({
            manufacturer: e.manufacturer,
            model: e.model,
            quantity: e.quantity || 1,
            rate: e.rate || 0,
            internalValue: e.internalValue || 0,
            serialNumber: e.serialNumber || null,
            notes: e.notes || null,
          })),
        },
      },
    });

    const equipmentRows = equipment
      .map(
        (e: { manufacturer: string; model: string; quantity: number; rate: number; internalValue: number; serialNumber?: string; notes?: string }, i: number) =>
          `<tr style="border-bottom:1px solid #2a2a3a">
            <td style="padding:8px;color:#a0a0b0">${i + 1}</td>
            <td style="padding:8px;color:#e0e0e8">${e.manufacturer}</td>
            <td style="padding:8px;color:#e0e0e8">${e.model}</td>
            <td style="padding:8px;color:#a0a0b0;text-align:center">${e.quantity}</td>
            <td style="padding:8px;color:#c8a44a;text-align:right">$${Number(e.rate).toFixed(2)}/day</td>
            <td style="padding:8px;color:#a0a0b0;text-align:right">$${Number(e.internalValue).toLocaleString()}</td>
            <td style="padding:8px;color:#6a6a7a">${e.serialNumber || "—"}</td>
            <td style="padding:8px;color:#6a6a7a">${e.notes || "—"}</td>
          </tr>`
      )
      .join("");

    const html = `
      <div style="font-family:Arial,sans-serif;background:#09090f;color:#e0e0e8;padding:32px;max-width:800px">
        <h1 style="color:#c8a44a;font-size:24px;margin-bottom:4px">New Partner Application</h1>
        <p style="color:#6a6a7a;font-size:13px;margin-bottom:24px">Submitted via the Equipment Partner Program form</p>

        <h2 style="color:#c8a44a;font-size:16px;border-bottom:1px solid #2a2a3a;padding-bottom:8px">Contact Information</h2>
        <table style="width:100%;margin-bottom:24px;font-size:14px">
          <tr><td style="padding:4px 0;color:#6a6a7a;width:120px">Name</td><td style="color:#e0e0e8">${contact.name}</td></tr>
          <tr><td style="padding:4px 0;color:#6a6a7a">Phone</td><td style="color:#e0e0e8">${contact.phone}</td></tr>
          <tr><td style="padding:4px 0;color:#6a6a7a">Email</td><td style="color:#e0e0e8">${contact.email}</td></tr>
          <tr><td style="padding:4px 0;color:#6a6a7a">Address</td><td style="color:#e0e0e8">${contact.address}</td></tr>
          <tr><td style="padding:4px 0;color:#6a6a7a">Account #</td><td style="color:#e0e0e8">${contact.bankAccount}</td></tr>
          <tr><td style="padding:4px 0;color:#6a6a7a">Routing #</td><td style="color:#e0e0e8">${contact.bankRouting}</td></tr>
        </table>

        <h2 style="color:#c8a44a;font-size:16px;border-bottom:1px solid #2a2a3a;padding-bottom:8px">Equipment (${equipment.length} item${equipment.length !== 1 ? "s" : ""})</h2>
        <table style="width:100%;font-size:13px;border-collapse:collapse">
          <thead>
            <tr style="border-bottom:1px solid #2a2a3a">
              <th style="padding:8px;text-align:left;color:#6a6a7a">#</th>
              <th style="padding:8px;text-align:left;color:#6a6a7a">Manufacturer</th>
              <th style="padding:8px;text-align:left;color:#6a6a7a">Model</th>
              <th style="padding:8px;text-align:center;color:#6a6a7a">Qty</th>
              <th style="padding:8px;text-align:right;color:#6a6a7a">Rate</th>
              <th style="padding:8px;text-align:right;color:#6a6a7a">Value</th>
              <th style="padding:8px;text-align:left;color:#6a6a7a">Serial</th>
              <th style="padding:8px;text-align:left;color:#6a6a7a">Notes</th>
            </tr>
          </thead>
          <tbody>${equipmentRows}</tbody>
        </table>
      </div>
    `;

    const resend = getResend();
    await resend.emails.send({
      from: "Paris Backline <accounting@parisbackline.com>",
      replyTo: "parisbackline@gmail.com",
      to: ["parisbackline@gmail.com"],
      subject: `Partner Application: ${contact.name}`,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Partner form error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
