import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalBookings, activeBookings, totalClients, totalEquipment, recentBookings, unpaidBookings, totalRevenue] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.client.count(),
      prisma.equipment.count({ where: { active: true } }),
      prisma.booking.findMany({
        take: 8,
        orderBy: { dateStart: "desc" },
        include: { client: true },
      }),
      prisma.booking.findMany({
        where: { invoicePaid: false, status: { not: "cancelled" } },
        include: { client: true },
        orderBy: { dateStart: "desc" },
        take: 5,
      }),
      prisma.booking.aggregate({
        _sum: { rentalFee: true, deliveryFee: true },
        where: { status: { not: "cancelled" } },
      }),
    ]);

  const revenue = (totalRevenue._sum.rentalFee || 0) + (totalRevenue._sum.deliveryFee || 0);

  const stats = [
    { label: "Total Revenue", value: `$${revenue.toLocaleString()}`, color: "text-success" },
    { label: "Active Bookings", value: activeBookings, color: "text-accent" },
    { label: "Total Clients", value: totalClients, color: "text-eric" },
    { label: "Equipment Items", value: totalEquipment, color: "text-marko" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-text-secondary text-sm mt-1">Paris Backline overview</p>
        </div>
        <Link
          href="/bookings/new"
          className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2.5 transition-colors"
        >
          + New Booking
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-bg-secondary border border-border rounded-none p-5">
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-bg-secondary border border-border rounded-none">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-sm">Recent Bookings</h2>
            <Link href="/bookings" className="text-accent text-xs hover:text-accent-hover">View all</Link>
          </div>
          <div className="divide-y divide-border">
            {recentBookings.length === 0 && (
              <p className="text-text-muted text-sm p-5">No bookings yet</p>
            )}
            {recentBookings.map((b) => (
              <Link
                key={b.id}
                href={`/bookings/${b.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-bg-hover transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{b.client.name}</p>
                  <p className="text-text-muted text-xs">
                    {format(new Date(b.dateStart), "MMM d")} – {format(new Date(b.dateEnd), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${b.rentalFee.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.status === "confirmed" ? "bg-eric/10 text-eric" :
                    b.status === "completed" ? "bg-success/10 text-success" :
                    "bg-danger/10 text-danger"
                  }`}>
                    {b.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-bg-secondary border border-border rounded-none">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Unpaid Invoices</h2>
          </div>
          <div className="divide-y divide-border">
            {unpaidBookings.length === 0 && (
              <p className="text-text-muted text-sm p-5">All caught up!</p>
            )}
            {unpaidBookings.map((b) => (
              <Link
                key={b.id}
                href={`/bookings/${b.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-bg-hover transition-colors"
              >
                <div>
                  <p className="text-sm font-medium">{b.client.name}</p>
                  <p className="text-text-muted text-xs">{b.description || "No description"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${b.rentalFee.toLocaleString()}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    b.invoiceSent ? "bg-warning/10 text-warning" : "bg-danger/10 text-danger"
                  }`}>
                    {b.invoiceSent ? "Sent" : "Not sent"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
