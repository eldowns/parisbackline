import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/lib/invoice-pdf";
import React from "react";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

function formatDateUTC(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, recipientEmail, preview } = await request.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        equipment: { include: { equipment: true } },
        subRentals: true,
      },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const invoiceNumber = `PB-${booking.id.slice(-8).toUpperCase()}`;
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const invoiceData = {
      invoiceNumber,
      date: today,
      client: {
        name: booking.client.name,
        email: booking.client.email,
        phone: booking.client.phone,
        company: booking.client.company,
      },
      dateStart: formatDateUTC(booking.dateStart),
      dateEnd: formatDateUTC(booking.dateEnd),
      equipment: booking.equipment.map((be) => ({
        name: [be.equipment.manufacturer, be.equipment.model].filter(Boolean).join(" ") || be.equipment.name,
        quantity: be.quantity,
        rentalPrice: be.rentalPrice,
      })),
      subRentals: booking.subRentals.map((sr) => ({
        provider: sr.provider,
        description: sr.description,
        cost: sr.cost,
      })),
      deliveryFee: booking.deliveryFee,
      notes: booking.notes,
    };

    const equipmentTotal = invoiceData.equipment.reduce((s, e) => s + e.rentalPrice * e.quantity, 0);
    const subRentalTotal = invoiceData.subRentals.reduce((s, sr) => s + sr.cost, 0);
    const grandTotal = equipmentTotal + subRentalTotal + invoiceData.deliveryFee;

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePDF, { data: invoiceData })
    );

    // Preview mode — return invoice data without sending
    if (preview) {
      return NextResponse.json({
        invoiceData,
        grandTotal,
        invoiceNumber,
        pdfBase64: Buffer.from(pdfBuffer).toString("base64"),
      });
    }

    // Send email
    const emailTo = recipientEmail || booking.client.email;
    if (!emailTo) {
      return NextResponse.json({ error: "No recipient email provided" }, { status: 400 });
    }

    const { error } = await getResend().emails.send({
      from: "Paris Backline <accounting@parisbackline.com>",
      replyTo: "parisbackline@gmail.com",
      to: emailTo,
      subject: `Invoice ${invoiceNumber} — Paris Backline`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #09090f;">Invoice from Paris Backline</h2>
          <p>Hi ${booking.client.name},</p>
          ${booking.client.company ? `<p style="color: #666; font-size: 14px;">Re: ${booking.client.company}</p>` : ""}
          <p>Please find your invoice attached for the rental period ${invoiceData.dateStart} – ${invoiceData.dateEnd}.</p>
          <p style="font-size: 24px; font-weight: bold; color: #c8a44a;">Total Due: $${grandTotal.toFixed(2)}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="font-size: 14px; font-weight: bold;">Payment Information — Bank Transfer (ACH)</p>
          <table style="font-size: 14px; margin-top: 8px;">
            <tr><td style="color: #666; padding-right: 16px;">Account Number</td><td><strong>103035011</strong></td></tr>
            <tr><td style="color: #666; padding-right: 16px;">Routing Number</td><td><strong>211370150</strong></td></tr>
            <tr><td style="color: #666; padding-right: 16px;">Account Type</td><td><strong>Checking</strong></td></tr>
          </table>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Paris Backline · Los Angeles, CA<br/>parisbackline.com</p>
        </div>
      `,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: String(error.message) }, { status: 500 });
    }

    // Mark invoice as sent
    await prisma.booking.update({
      where: { id: bookingId },
      data: { invoiceSent: true, status: "invoice_sent" },
    });

    return NextResponse.json({ success: true, invoiceNumber });
  } catch (err) {
    console.error("Invoice error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
