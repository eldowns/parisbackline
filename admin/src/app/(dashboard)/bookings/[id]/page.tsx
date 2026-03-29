import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import { calculatePayout } from "@/lib/revenue";
import PayoutBreakdown from "@/components/bookings/PayoutBreakdown";
import DeleteBookingButton from "@/components/bookings/DeleteBookingButton";
import SendInvoiceButton from "@/components/bookings/SendInvoiceButton";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { client: true, equipment: { include: { equipment: true } }, subRentals: true },
  });

  if (!booking) notFound();

  const payout = calculatePayout({
    rentalFee: booking.rentalFee,
    deliveryFee: booking.deliveryFee,
    deliveryBy: booking.deliveryBy,
    referralFee: booking.referralFee,
    leadPartner: booking.leadPartner,
    commPartner: booking.commPartner,
    invoicePartner: booking.invoicePartner,
    accountPartner: booking.accountPartner,
    gearItems: booking.equipment.map((be) => ({
      owner: be.equipment.owner,
      internalValue: be.equipment.internalValue * be.quantity,
    })),
    subRentals: booking.subRentals.map((sr) => ({
      provider: sr.provider,
      cost: sr.cost,
    })),
  });

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/bookings" className="text-text-muted text-xs hover:text-accent transition-colors">
            &larr; Back to Bookings
          </Link>
          <h1 className="text-2xl font-bold mt-1">{booking.client.company || booking.client.name}</h1>
          {booking.client.company && <p className="text-text-secondary text-sm">{booking.client.name}</p>}
          <p className="text-text-muted text-sm">
            {format(new Date(booking.dateStart), "MMMM d")} – {format(new Date(booking.dateEnd), "MMMM d, yyyy")}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/bookings/${booking.id}/edit`}
            className="bg-accent hover:brightness-110 text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-4 py-2.5 rounded-none transition-colors"
          >
            Edit Booking
          </Link>
          <DeleteBookingButton id={booking.id} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Details */}
          <div className="bg-bg-secondary border border-border rounded-none p-5">
            <h3 className="text-sm font-semibold mb-4">Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Status</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  booking.status === "draft" ? "bg-text-muted/10 text-text-muted" :
                  booking.status === "confirmed" ? "bg-eric/10 text-eric" :
                  booking.status === "in_progress" ? "bg-accent/10 text-accent" :
                  booking.status === "completed" ? "bg-success/10 text-success" :
                  booking.status === "invoice_sent" ? "bg-warning/10 text-warning" :
                  booking.status === "paid" ? "bg-success/10 text-success" :
                  "bg-danger/10 text-danger"
                }`}>
                  {booking.status === "in_progress" ? "In Progress" :
                   booking.status === "invoice_sent" ? "Invoice Sent" :
                   booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Rental Fee</p>
                <p className="font-semibold">${booking.rentalFee.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Delivery Fee</p>
                <p className="font-semibold">
                  ${booking.deliveryFee.toLocaleString()}
                  {booking.deliveryBy && ` (${capitalize(booking.deliveryBy)})`}
                </p>
              </div>
              {booking.referralFee > 0 && (
                <div>
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Referral</p>
                  <p className="font-semibold">
                    ${booking.referralFee.toLocaleString()}
                    {booking.referralName && ` → ${booking.referralName}`}
                  </p>
                </div>
              )}
              {booking.description && (
                <div className="col-span-2">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">Description</p>
                  <p className="text-text-secondary">{booking.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Roles */}
          <div className="bg-bg-secondary border border-border rounded-none p-5">
            <h3 className="text-sm font-semibold mb-4">Admin Roles</h3>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Lead", value: booking.leadPartner },
                { label: "Communication", value: booking.commPartner },
                { label: "Invoicing", value: booking.invoicePartner },
                { label: "Accounting", value: booking.accountPartner },
              ].map((r) => (
                <div key={r.label} className="bg-bg-tertiary rounded-none p-3 text-center">
                  <p className="text-text-muted text-xs uppercase tracking-wider mb-1">{r.label}</p>
                  <p className={`text-sm font-semibold ${r.value === "eric" ? "text-eric" : "text-marko"}`}>
                    {capitalize(r.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          {booking.equipment.length > 0 && (
            <div className="bg-bg-secondary border border-border rounded-none p-5">
              <h3 className="text-sm font-semibold mb-4">Equipment</h3>
              <div className="divide-y divide-border">
                {booking.equipment.map((be) => (
                  <div key={be.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium">{be.equipment.name}</p>
                      <p className="text-xs text-text-muted">
                        {be.equipment.category} &middot;{" "}
                        <span className={be.equipment.owner === "eric" ? "text-eric" : be.equipment.owner === "marko" ? "text-marko" : ""}>
                          {capitalize(be.equipment.owner)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">x{be.quantity}</p>
                      <p className="text-xs text-text-muted">${be.equipment.internalValue}/unit</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-Rentals */}
          {booking.subRentals.length > 0 && (
            <div className="bg-bg-secondary border border-border rounded-none p-5">
              <h3 className="text-sm font-semibold mb-4">Sub-Rentals</h3>
              <div className="divide-y divide-border">
                {booking.subRentals.map((sr) => (
                  <div key={sr.id} className="flex items-center justify-between py-2.5">
                    <div>
                      <p className="text-sm font-medium">{sr.description}</p>
                      <p className="text-xs text-text-muted">from {sr.provider}</p>
                    </div>
                    <p className="text-sm font-semibold text-warning">${sr.cost.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {booking.notes && (
            <div className="bg-bg-secondary border border-border rounded-none p-5">
              <h3 className="text-sm font-semibold mb-2">Notes</h3>
              <p className="text-sm text-text-secondary whitespace-pre-wrap">{booking.notes}</p>
            </div>
          )}
        </div>

        <div className="col-span-1">
          <div className="sticky top-8">
            <PayoutBreakdown payout={payout} rentalFee={booking.rentalFee} deliveryFee={booking.deliveryFee} />
            <SendInvoiceButton
              bookingId={booking.id}
              clientName={booking.client.name}
              clientEmail={booking.client.email}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
