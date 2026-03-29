import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { dateStart: "desc" },
    include: { client: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bookings</h1>
          <p className="text-text-secondary text-sm mt-1">{bookings.length} total</p>
        </div>
        <Link
          href="/bookings/new"
          className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + New Booking
        </Link>
      </div>

      <div className="bg-bg-secondary border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Client</th>
              <th className="text-left px-5 py-3 font-medium">Dates</th>
              <th className="text-left px-5 py-3 font-medium">Description</th>
              <th className="text-right px-5 py-3 font-medium">Rental Fee</th>
              <th className="text-center px-5 py-3 font-medium">Lead</th>
              <th className="text-center px-5 py-3 font-medium">Invoice</th>
              <th className="text-center px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-bg-hover transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/bookings/${b.id}`} className="font-medium text-text-primary hover:text-accent transition-colors">
                    {b.client.name}
                  </Link>
                </td>
                <td className="px-5 py-3 text-text-secondary">
                  {format(new Date(b.dateStart), "MMM d")} – {format(new Date(b.dateEnd), "MMM d")}
                </td>
                <td className="px-5 py-3 text-text-secondary truncate max-w-48">{b.description || "—"}</td>
                <td className="px-5 py-3 text-right font-semibold">${b.rentalFee.toLocaleString()}</td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    b.leadPartner === "eric" ? "bg-eric/10 text-eric" : "bg-marko/10 text-marko"
                  }`}>
                    {b.leadPartner === "eric" ? "Eric" : "Marko"}
                  </span>
                </td>
                <td className="px-5 py-3 text-center">
                  {b.invoicePaid ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">Paid</span>
                  ) : b.invoiceSent ? (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-warning/10 text-warning">Sent</span>
                  ) : (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-danger/10 text-danger">Pending</span>
                  )}
                </td>
                <td className="px-5 py-3 text-center">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    b.status === "confirmed" ? "bg-accent/10 text-accent" :
                    b.status === "completed" ? "bg-success/10 text-success" :
                    "bg-danger/10 text-danger"
                  }`}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-text-muted">
                  No bookings yet. Create your first one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
