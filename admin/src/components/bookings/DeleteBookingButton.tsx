"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteBookingButton({ id }: { id: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    router.push("/bookings");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-bg-tertiary border border-border text-danger hover:bg-danger/10 text-sm font-medium px-4 py-2.5 rounded-none transition-colors cursor-pointer"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md mx-4 border border-border"
            onClick={(e) => e.stopPropagation()}
            style={{ borderRadius: "1px", background: "#111118" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="text-lg tracking-wider" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                DELETE BOOKING
              </h3>
              <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-5">
              <p className="text-text-secondary text-sm">
                Are you sure? This action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 bg-danger text-white text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:brightness-110 transition-all disabled:opacity-50"
                  style={{ borderRadius: "1px" }}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 border border-border text-text-secondary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:text-text-primary transition-colors"
                  style={{ borderRadius: "1px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
