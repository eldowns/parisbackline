"use client";

import { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  dismissing: boolean;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

const typeStyles: Record<ToastType, { border: string; icon: string; color: string }> = {
  success: { border: "rgba(34,197,94,0.4)", icon: "\u2713", color: "#22c55e" },
  error: { border: "rgba(239,68,68,0.4)", icon: "\u2717", color: "#ef4444" },
  info: { border: "rgba(212,175,55,0.4)", icon: "i", color: "#d4af37" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const style = typeStyles[toast.type];

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timerRef.current);
  }, [toast.id, onDismiss]);

  return (
    <div
      style={{
        background: "#111118",
        border: `1px solid ${toast.dismissing ? "transparent" : style.border}`,
        borderLeft: `3px solid ${style.color}`,
        borderRadius: 8,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        minWidth: 280,
        maxWidth: 400,
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        animation: toast.dismissing ? "toast-out 0.3s ease-in forwards" : "toast-in 0.3s ease-out",
        pointerEvents: "auto" as const,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: `${style.color}20`,
          color: style.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {style.icon}
      </span>
      <span style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.4, flex: 1 }}>
        {toast.message}
      </span>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type, dismissing: false }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, dismissing: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 9999,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
