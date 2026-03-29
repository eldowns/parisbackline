"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "DASHBOARD", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/bookings", label: "BOOKINGS", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { href: "/calendar", label: "CALENDAR", icon: "M6 2v2m12-2v2M3 8h18M3 8v12a2 2 0 002 2h14a2 2 0 002-2V8M9 14h1m4 0h1m-9 4h1m4 0h1" },
  { href: "/equipment", label: "EQUIPMENT", icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" },
  { href: "/clients", label: "CLIENTS", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { href: "/earnings", label: "EARNINGS", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  function handleNav() {
    onClose?.();
  }

  return (
    <aside className="w-60 border-r border-border min-h-screen flex flex-col sidebar-bg">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div>
          <h1 className="text-xl tracking-widest" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.14em" }}>
            PARIS <span className="text-accent">BACKLINE</span>
          </h1>
          <p className="text-text-muted text-[0.6rem] uppercase tracking-[0.28em] mt-1">Management System</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden text-text-muted hover:text-text-primary cursor-pointer">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-0.5">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNav}
              className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.18em] transition-colors ${
                active
                  ? "text-accent border-l-2 border-accent"
                  : "text-text-secondary hover:text-text-primary border-l-2 border-transparent"
              }`}
              style={{ borderRadius: "1px" }}
            >
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
                <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
              </svg>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-xs tracking-[0.18em] text-text-muted hover:text-text-secondary transition-colors w-full cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}
