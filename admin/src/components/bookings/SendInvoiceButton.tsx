"use client";

import { useState } from "react";
import SendInvoiceModal from "./SendInvoiceModal";

export default function SendInvoiceButton({
  bookingId,
  clientName,
  clientEmail,
}: {
  bookingId: string;
  clientName: string;
  clientEmail: string | null;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModal(true); }}
        className="w-full mt-4 bg-accent text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3 cursor-pointer hover:brightness-110 transition-all"
        style={{ borderRadius: "1px" }}
      >
        Send Invoice
      </button>
      {showModal && (
        <SendInvoiceModal
          bookingId={bookingId}
          clientName={clientName}
          clientEmail={clientEmail}
          onClose={() => setShowModal(false)}
          onSent={() => {}}
        />
      )}
    </>
  );
}
