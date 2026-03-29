import { prisma } from "@/lib/prisma";
import { format, startOfMonth, startOfYear } from "date-fns";
import { calculatePayout } from "@/lib/revenue";
import CountUp from "@/components/ui/CountUp";

export const dynamic = "force-dynamic";

export default async function EarningsPage() {
  const now = new Date();
  const mtdStart = startOfMonth(now);
  const ytdStart = startOfYear(now);

  const allBookings = await prisma.booking.findMany({
    where: { status: "paid" },
    include: {
      client: true,
      equipment: { include: { equipment: true } },
      subRentals: true,
    },
    orderBy: { dateStart: "desc" },
  });

  function computeEarnings(bookings: typeof allBookings) {
    let eric = { gear: 0, admin: 0, delivery: 0, total: 0 };
    let marko = { gear: 0, admin: 0, delivery: 0, total: 0 };

    for (const b of bookings) {
      const payout = calculatePayout({
        rentalFee: b.rentalFee,
        deliveryFee: b.deliveryFee,
        deliveryBy: b.deliveryBy,
        referralFee: b.referralFee,
        leadPartner: b.leadPartner,
        commPartner: b.commPartner,
        invoicePartner: b.invoicePartner,
        accountPartner: b.accountPartner,
        gearItems: b.equipment.map((be) => ({
          owner: be.equipment.owner,
          internalValue: be.equipment.internalValue * be.quantity,
        })),
        subRentals: b.subRentals.map((sr) => ({ provider: sr.provider, cost: sr.cost })),
      });

      eric.gear += payout.eric.gear;
      eric.admin += payout.eric.admin;
      eric.delivery += payout.eric.delivery;
      eric.total += payout.eric.total;
      marko.gear += payout.marko.gear;
      marko.admin += payout.marko.admin;
      marko.delivery += payout.marko.delivery;
      marko.total += payout.marko.total;
    }

    return { eric, marko };
  }

  const mtdBookings = allBookings.filter((b) => new Date(b.dateStart) >= mtdStart);
  const ytdBookings = allBookings.filter((b) => new Date(b.dateStart) >= ytdStart);

  const allTime = computeEarnings(allBookings);
  const mtd = computeEarnings(mtdBookings);
  const ytd = computeEarnings(ytdBookings);

  const bebas = { fontFamily: "'Bebas Neue', sans-serif" };

  // Recent booking payouts (paid only)
  const recentPayouts = allBookings.slice(0, 8).map((b) => {
    const payout = calculatePayout({
      rentalFee: b.rentalFee,
      deliveryFee: b.deliveryFee,
      deliveryBy: b.deliveryBy,
      referralFee: b.referralFee,
      leadPartner: b.leadPartner,
      commPartner: b.commPartner,
      invoicePartner: b.invoicePartner,
      accountPartner: b.accountPartner,
      gearItems: b.equipment.map((be) => ({
        owner: be.equipment.owner,
        internalValue: be.equipment.internalValue * be.quantity,
      })),
      subRentals: b.subRentals.map((sr) => ({ provider: sr.provider, cost: sr.cost })),
    });
    return {
      client: b.client.company || b.client.name,
      date: b.dateStart,
      eric: payout.eric.total,
      marko: payout.marko.total,
      total: b.rentalFee + b.deliveryFee,
    };
  });

  function formatDateUTC(d: Date) {
    const date = new Date(d);
    return format(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), "MMM d");
  }

  function PartnerCard({ name, color, dotColor, allTime: at, ytd: yt, mtd: mt }: {
    name: string;
    color: string;
    dotColor: string;
    allTime: { gear: number; admin: number; delivery: number; total: number };
    ytd: { gear: number; admin: number; delivery: number; total: number };
    mtd: { gear: number; admin: number; delivery: number; total: number };
  }) {
    return (
      <div className="bg-bg-secondary border border-border p-5 dash-card">
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${dotColor}`} />
          <span className={`${color} font-semibold text-sm`}>{name}</span>
        </div>

        {/* All Time - large */}
        <p className="text-text-muted text-[0.6rem] uppercase tracking-[0.18em] mb-1">All Time</p>
        <p className="text-3xl font-bold text-text-primary" style={bebas}>
          <CountUp value={at.total} prefix="$" decimals={2} />
        </p>
        <div className="space-y-1 mt-2 text-xs text-text-muted">
          <div className="flex justify-between">
            <span>Gear</span>
            <span className="text-text-secondary">${at.gear.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Admin</span>
            <span className="text-text-secondary">${at.admin.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span className="text-text-secondary">${at.delivery.toFixed(2)}</span>
          </div>
        </div>

        {/* YTD + MTD - smaller, side by side */}
        <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-border">
          <div>
            <p className="text-text-muted text-[0.55rem] uppercase tracking-[0.18em] mb-1">Year to Date</p>
            <p className="text-lg font-bold text-text-primary" style={bebas}>
              <CountUp value={yt.total} prefix="$" decimals={2} />
            </p>
          </div>
          <div>
            <p className="text-text-muted text-[0.55rem] uppercase tracking-[0.18em] mb-1">Month to Date</p>
            <p className="text-lg font-bold text-text-primary" style={bebas}>
              <CountUp value={mt.total} prefix="$" decimals={2} />
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl" style={bebas}>PARTNER EARNINGS</h1>
        <p className="text-text-muted text-xs uppercase tracking-[0.2em] mt-1">
          Revenue split per partnership agreement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <PartnerCard
          name="Eric"
          color="text-eric"
          dotColor="bg-eric"
          allTime={allTime.eric}
          ytd={ytd.eric}
          mtd={mtd.eric}
        />
        <PartnerCard
          name="Marko"
          color="text-marko"
          dotColor="bg-marko"
          allTime={allTime.marko}
          ytd={ytd.marko}
          mtd={mtd.marko}
        />
      </div>

      {/* Recent booking payouts */}
      {recentPayouts.length > 0 && (
        <div className="bg-bg-secondary border border-border dash-card">
          <div className="px-5 py-4 border-b border-border">
            <p className="text-text-muted text-[0.65rem] font-semibold uppercase tracking-[0.18em]">Recent Booking Payouts</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">Client</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-right px-5 py-3 font-medium">Total</th>
                <th className="text-right px-5 py-3 font-medium text-eric">Eric</th>
                <th className="text-right px-5 py-3 font-medium text-marko">Marko</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentPayouts.map((p, i) => (
                <tr key={i} className="hover:bg-bg-hover transition-colors">
                  <td className="px-5 py-3 font-medium">{p.client}</td>
                  <td className="px-5 py-3 text-text-secondary hidden md:table-cell">{formatDateUTC(p.date)}</td>
                  <td className="px-5 py-3 text-right">${p.total.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right text-eric font-semibold">${p.eric.toFixed(2)}</td>
                  <td className="px-5 py-3 text-right text-marko font-semibold">${p.marko.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
