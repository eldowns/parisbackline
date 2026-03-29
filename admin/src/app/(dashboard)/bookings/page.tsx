"use client";

import { useState, useEffect } from "react";
import BookingsList from "@/components/bookings/BookingsList";

export default function BookingsPage() {
  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    fetch("/api/bookings").then((r) => r.json()).then(setBookings);
  }, []);

  return <BookingsList bookings={bookings} />;
}
