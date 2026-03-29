"use client";

import { useState, useEffect, useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addMonths,
  subMonths,
} from "date-fns";
import Link from "next/link";

interface BookingCal {
  id: string;
  dateStart: string;
  dateEnd: string;
  rentalFee: number;
  status: string;
  leadPartner: string;
  client: { name: string; company: string | null };
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bookings, setBookings] = useState<BookingCal[]>([]);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
  }, []);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart);
    const calEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  function toLocalDate(d: string) {
    const date = new Date(d);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  }

  function getBookingsForDay(day: Date) {
    return bookings.filter((b) => {
      const start = toLocalDate(b.dateStart);
      const end = toLocalDate(b.dateEnd);
      return isWithinInterval(day, { start, end }) || isSameDay(day, start) || isSameDay(day, end);
    });
  }

  const today = new Date();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-text-secondary text-sm mt-1">{format(currentMonth, "MMMM yyyy")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary p-2 rounded-none transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary text-xs font-medium px-3 py-2 rounded-none transition-colors cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="bg-bg-tertiary border border-border text-text-secondary hover:text-text-primary p-2 rounded-none transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <Link
            href="/bookings/new"
            className="bg-accent hover:brightness-110 text-bg-primary text-sm font-medium px-4 py-2 rounded-none transition-colors ml-2"
          >
            + New Booking
          </Link>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border rounded-none overflow-hidden">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="px-3 py-2 text-text-muted text-xs font-medium uppercase tracking-wider text-center">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dayBookings = getBookingsForDay(day);
            const isToday = isSameDay(day, today);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={idx}
                className={`min-h-28 border-b border-r border-border p-1.5 ${
                  !isCurrentMonth ? "bg-bg-primary/50" : ""
                }`}
              >
                <div className={`text-xs font-medium mb-1 w-6 h-6 flex items-center justify-center rounded-full ${
                  isToday ? "bg-accent text-white" : isCurrentMonth ? "text-text-secondary" : "text-text-muted/50"
                }`}>
                  {format(day, "d")}
                </div>
                <div className="space-y-0.5">
                  {dayBookings.slice(0, 3).map((b) => (
                    <Link
                      key={b.id}
                      href={`/bookings/${b.id}`}
                      className={`block text-xs px-1.5 py-0.5 rounded truncate transition-colors ${
                        b.status === "cancelled"
                          ? "bg-danger/10 text-danger/70"
                          : b.leadPartner === "eric"
                          ? "bg-eric/10 text-eric hover:bg-eric/20"
                          : "bg-marko/10 text-marko hover:bg-marko/20"
                      }`}
                    >
                      {b.client.company || b.client.name}
                    </Link>
                  ))}
                  {dayBookings.length > 3 && (
                    <p className="text-xs text-text-muted px-1.5">+{dayBookings.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-eric/20" />
          <span>Eric Lead</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-marko/20" />
          <span>Marko Lead</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-danger/20" />
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
}
