import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format, startOfMonth, startOfYear } from "date-fns";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export default async function DashboardPage() {
  const now = new Date();
  const mtdStart = startOfMonth(now);
  const ytdStart = startOfYear(now);

  const [
    totalBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    totalClients,
    totalEquipment,
    recentBookings,
    unpaidBookings,
    allTimeRevenue,
    mtdRevenue,
    ytdRevenue,
    mtdBookingCount,
    ytdBookingCount,
    mtdDeliveryRevenue,
    ytdDeliveryRevenue,
    topClients,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "confirmed" } }),
    prisma.booking.count({ where: { status: "completed" } }),
    prisma.booking.count({ where: { status: "cancelled" } }),
    prisma.client.count(),
    prisma.equipment.count({ where: { active: true } }),
    prisma.booking.findMany({
      take: 6,
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
    prisma.booking.aggregate({
      _sum: { rentalFee: true },
      where: { status: { not: "cancelled" }, dateStart: { gte: mtdStart } },
    }),
    prisma.booking.aggregate({
      _sum: { rentalFee: true },
      where: { status: { not: "cancelled" }, dateStart: { gte: ytdStart } },
    }),
    prisma.booking.count({
      where: { status: { not: "cancelled" }, dateStart: { gte: mtdStart } },
    }),
    prisma.booking.count({
      where: { status: { not: "cancelled" }, dateStart: { gte: ytdStart } },
    }),
    prisma.booking.aggregate({
      _sum: { deliveryFee: true },
      where: { status: { not: "cancelled" }, dateStart: { gte: mtdStart } },
    }),
    prisma.booking.aggregate({
      _sum: { deliveryFee: true },
      where: { status: { not: "cancelled" }, dateStart: { gte: ytdStart } },
    }),
    prisma.client.findMany({
      include: {
        bookings: {
          where: { status: { not: "cancelled" } },
          select: { rentalFee: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const allTimeTotal = (allTimeRevenue._sum.rentalFee || 0) + (allTimeRevenue._sum.deliveryFee || 0);
  const mtdTotal = (mtdRevenue._sum.rentalFee || 0) + (mtdDeliveryRevenue._sum.deliveryFee || 0);
  const ytdTotal = (ytdRevenue._sum.rentalFee || 0) + (ytdDeliveryRevenue._sum.deliveryFee || 0);
  const mtdRentalOnly = mtdRevenue._sum.rentalFee || 0;
  const ytdRentalOnly = ytdRevenue._sum.rentalFee || 0;
  const mtdAvg = mtdBookingCount > 0 ? mtdTotal / mtdBookingCount : 0;
  const ytdAvg = ytdBookingCount > 0 ? ytdTotal / ytdBookingCount : 0;

  const unpaidTotal = unpaidBookings.reduce((s, b) => s + b.rentalFee, 0);

  // Top clients by revenue
  const clientRevenue = topClients
    .map((c) => ({
      name: c.name,
      revenue: c.bookings.reduce((s, b) => s + b.rentalFee, 0),
      count: c.bookings.length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
            DASHBOARD
          </h1>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] mt-1">
            {format(now, "MMMM yyyy")}
          </p>
        </div>
        <Link
          href="/bookings/new"
          className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2.5 transition-colors"
          style={{ borderRadius: "1px" }}
        >
          + New Booking
        </Link>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Month to Date</p>
          <p className="text-2xl font-bold text-accent" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            ${mtdTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span>{mtdBookingCount} bookings</span>
            <span>${mtdAvg.toFixed(0)} avg</span>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Year to Date</p>
          <p className="text-2xl font-bold text-success" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            ${ytdTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span>{ytdBookingCount} bookings</span>
            <span>${ytdAvg.toFixed(0)} avg</span>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">All Time</p>
          <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            ${allTimeTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span>{totalBookings} bookings</span>
            <span>{totalClients} clients</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Active</p>
          <p className="text-xl font-bold text-eric" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{activeBookings}</p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Completed</p>
          <p className="text-xl font-bold text-success" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{completedBookings}</p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Cancelled</p>
          <p className="text-xl font-bold text-danger" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{cancelledBookings}</p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Equipment</p>
          <p className="text-xl font-bold text-marko" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{totalEquipment}</p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Unpaid</p>
          <p className="text-xl font-bold text-warning" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{unpaidBookings.length}</p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Outstanding</p>
          <p className="text-xl font-bold text-warning" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>${unpaidTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* MTD vs YTD Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-3">MTD Breakdown</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Rental Revenue</span>
              <span className="font-semibold">${mtdRentalOnly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Delivery Revenue</span>
              <span className="font-semibold">${(mtdDeliveryRevenue._sum.deliveryFee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-text-primary font-medium">Total</span>
              <span className="font-bold text-accent">${mtdTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-3">YTD Breakdown</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">Rental Revenue</span>
              <span className="font-semibold">${ytdRentalOnly.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Delivery Revenue</span>
              <span className="font-semibold">${(ytdDeliveryRevenue._sum.deliveryFee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="text-text-primary font-medium">Total</span>
              <span className="font-bold text-success">${ytdTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Recent Bookings */}
        <div className="bg-bg-secondary border border-border dash-card">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Recent Bookings</p>
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
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{b.client.name}</p>
                  <p className="text-text-muted text-xs">
                    {format(formatDate(new Date(b.dateStart)), "MMM d")} – {format(formatDate(new Date(b.dateEnd)), "MMM d")}
                  </p>
                </div>
                <p className="text-sm font-semibold">${b.rentalFee.toLocaleString()}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Unpaid Invoices */}
        <div className="bg-bg-secondary border border-border dash-card">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Unpaid Invoices</p>
          </div>
          <div className="divide-y divide-border">
            {unpaidBookings.length === 0 && (
              <p className="text-text-muted text-sm p-5">All caught up!</p>
            )}
            {unpaidBookings.map((b) => (
              <Link
                key={b.id}
                href={`/bookings/${b.id}`}
                className="flex items-center justify-between px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{b.client.name}</p>
                  <p className="text-text-muted text-xs">
                    {format(formatDate(new Date(b.dateStart)), "MMM d")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${b.rentalFee.toLocaleString()}</p>
                  <span className={`text-xs ${b.invoiceSent ? "text-warning" : "text-danger"}`}>
                    {b.invoiceSent ? "Sent" : "Not sent"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Clients */}
        <div className="bg-bg-secondary border border-border dash-card">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Top Clients</p>
          </div>
          <div className="divide-y divide-border">
            {clientRevenue.length === 0 && (
              <p className="text-text-muted text-sm p-5">No clients yet</p>
            )}
            {clientRevenue.map((c, i) => (
              <div key={c.name} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-xs font-mono w-4">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-text-muted text-xs">{c.count} booking{c.count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold">${c.revenue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
