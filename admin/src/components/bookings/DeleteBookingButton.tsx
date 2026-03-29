"use client";

import { useRouter } from "next/navigation";

export default function DeleteBookingButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.push("/bookings");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-bg-tertiary border border-border text-danger hover:bg-danger/10 text-sm font-medium px-4 py-2.5 rounded-none transition-colors cursor-pointer"
    >
      Delete
    </button>
  );
}
