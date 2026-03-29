import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format, startOfMonth, startOfYear } from "date-fns";
import CountUp from "@/components/ui/CountUp";
import Greeting from "@/components/ui/Greeting";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export default async function DashboardPage() {
  const now = new Date();
  const mtdStart = startOfMonth(now);
  const ytdStart = startOfYear(now);
  const session = await getSession();

  const active = { status: { notIn: ["cancelled", "draft"] as string[] } };
  const paidFilter = { status: "paid" as const };
  const unpaidFilter = { status: { notIn: ["cancelled", "draft", "paid"] as string[] } };

  const [
    totalBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    totalClients,
    totalEquipment,
    recentBookings,
    unpaidBookings,
    // Paid revenue
    allTimePaid,
    mtdPaid,
    ytdPaid,
    // Pending revenue
    allTimePending,
    mtdPending,
    ytdPending,
    // Counts
    mtdBookingCount,
    ytdBookingCount,
    // Top clients
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
      where: active,
    }),
    prisma.booking.findMany({
      where: unpaidFilter,
      include: { client: true },
      orderBy: { dateStart: "desc" },
      take: 5,
    }),
    // Paid
    prisma.booking.aggregate({
      _sum: { rentalFee: true, deliveryFee: true },
      where: paidFilter,
    }),
    prisma.booking.aggregate({
      _sum: { rentalFee: true, deliveryFee: true },
      where: { ...paidFilter, dateStart: { gte: mtdStart } },
    }),
    prisma.booking.aggregate({
      _sum: { rentalFee: true, deliveryFee: true },
      where: { ...paidFilter, dateStart: { gte: ytdStart } },
    }),
    // Pending
    prisma.booking.aggregate({
      _sum: { rentalFee: true, deliveryFee: true },
      where: unpaidFilter,
    }),
    prisma.booking.aggregate({
      _sum: { rentalFee: true, deliveryFee: true },
      where: { ...unpaidFilter, dateStart: { gte: mtdStart } },
    }),
    prisma.booking.aggregate({
      _sum: { rentalFee: true, deliveryFee: true },
      where: { ...unpaidFilter, dateStart: { gte: ytdStart } },
    }),
    // Counts
    prisma.booking.count({
      where: { ...active, dateStart: { gte: mtdStart } },
    }),
    prisma.booking.count({
      where: { ...active, dateStart: { gte: ytdStart } },
    }),
    // Top clients
    prisma.client.findMany({
      include: {
        bookings: {
          where: active,
          select: { rentalFee: true, deliveryFee: true },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  const sum = (a: { _sum: { rentalFee: number | null; deliveryFee: number | null } }) =>
    (a._sum.rentalFee || 0) + (a._sum.deliveryFee || 0);

  const mtdPaidTotal = sum(mtdPaid);
  const ytdPaidTotal = sum(ytdPaid);
  const allTimePaidTotal = sum(allTimePaid);
  const mtdPendingTotal = sum(mtdPending);
  const ytdPendingTotal = sum(ytdPending);
  const allTimePendingTotal = sum(allTimePending);

  const unpaidTotal = unpaidBookings.reduce((s, b) => s + b.rentalFee + b.deliveryFee, 0);

  const clientRevenue = topClients
    .map((c) => ({
      displayName: c.company || c.name,
      contact: c.company ? c.name : null,
      revenue: c.bookings.reduce((s, b) => s + b.rentalFee + b.deliveryFee, 0),
      count: c.bookings.length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const rawName = session?.name?.split(" ")[0] || "there";
  const firstName = session?.email === "marko" ? "Fat Ass" : rawName;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-2 md:mb-0 md:hidden text-center">
          <Greeting name={firstName} />
        </div>
        <div className="flex items-center justify-between md:contents">
          <div>
            <h1 className="text-3xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
              DASHBOARD
            </h1>
            <p className="text-text-muted text-xs uppercase tracking-[0.2em] mt-1">
              {format(now, "MMMM yyyy")}
            </p>
          </div>
          <div className="hidden md:block">
            <Greeting name={firstName} />
          </div>
          <Link
            href="/bookings/new"
            className="bg-accent hover:brightness-110 text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] px-4 py-2.5 transition-colors"
            style={{ borderRadius: "1px" }}
          >
            + New Booking
          </Link>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Month to Date</p>
          <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            <CountUp value={mtdPaidTotal} prefix="$" decimals={2} />
          </p>
          {mtdPendingTotal > 0 && (
            <p className="text-xs text-warning mt-1"><CountUp value={mtdPendingTotal} prefix="$" /> pending</p>
          )}
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span><CountUp value={mtdBookingCount} /> bookings</span>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">Year to Date</p>
          <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            <CountUp value={ytdPaidTotal} prefix="$" decimals={2} />
          </p>
          {ytdPendingTotal > 0 && (
            <p className="text-xs text-warning mt-1"><CountUp value={ytdPendingTotal} prefix="$" /> pending</p>
          )}
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span><CountUp value={ytdBookingCount} /> bookings</span>
          </div>
        </div>
        <div className="bg-bg-secondary border border-border p-5 dash-card">
          <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em] mb-1">All Time</p>
          <p className="text-2xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.02em" }}>
            <CountUp value={allTimePaidTotal} prefix="$" decimals={2} />
          </p>
          {allTimePendingTotal > 0 && (
            <p className="text-xs text-warning mt-1"><CountUp value={allTimePendingTotal} prefix="$" /> pending</p>
          )}
          <div className="flex gap-4 mt-2 text-xs text-text-muted">
            <span><CountUp value={totalBookings} /> bookings</span>
            <span><CountUp value={totalClients} /> clients</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Active</p>
          <p className={`text-xl font-bold ${activeBookings > 0 ? "text-success" : "text-text-primary"}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}><CountUp value={activeBookings} /></p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Completed</p>
          <p className="text-xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}><CountUp value={completedBookings} /></p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Cancelled</p>
          <p className="text-xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}><CountUp value={cancelledBookings} /></p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Equipment</p>
          <p className="text-xl font-bold text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif" }}><CountUp value={totalEquipment} /></p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Unpaid</p>
          <p className={`text-xl font-bold ${unpaidBookings.length > 0 ? "text-danger" : "text-text-primary"}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}><CountUp value={unpaidBookings.length} /></p>
        </div>
        <div className="bg-bg-secondary border border-border p-4 text-center dash-card">
          <p className="text-text-muted text-[0.6rem] uppercase tracking-wider mb-1">Outstanding</p>
          <p className={`text-xl font-bold ${unpaidTotal > 0 ? "text-danger" : "text-text-primary"}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}><CountUp value={unpaidTotal} prefix="$" /></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <p className="text-sm font-medium">{b.client.company || b.client.name}</p>
                  {b.client.company && <p className="text-text-muted text-xs">{b.client.name}</p>}
                  <p className="text-text-muted text-xs">
                    {format(formatDate(new Date(b.dateStart)), "MMM d")} – {format(formatDate(new Date(b.dateEnd)), "MMM d")}
                  </p>
                </div>
                <p className="text-sm font-semibold">${(b.rentalFee + b.deliveryFee).toLocaleString()}</p>
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
                  <p className="text-sm font-medium">{b.client.company || b.client.name}</p>
                  {b.client.company && <p className="text-text-muted text-xs">{b.client.name}</p>}
                  <p className="text-text-muted text-xs">
                    {format(formatDate(new Date(b.dateStart)), "MMM d")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${(b.rentalFee + b.deliveryFee).toLocaleString()}</p>
                  <span className={`text-xs ${b.status === "invoice_sent" ? "text-warning" : "text-text-muted"}`}>
                    {b.status === "invoice_sent" ? "Invoice Sent" : b.status.charAt(0).toUpperCase() + b.status.slice(1).replace("_", " ")}
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
              <div key={c.displayName} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-text-muted text-xs font-mono w-4">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{c.displayName}</p>
                    <p className="text-text-muted text-xs">{c.contact ? `${c.contact} · ` : ""}{c.count} booking{c.count !== 1 ? "s" : ""}</p>
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
