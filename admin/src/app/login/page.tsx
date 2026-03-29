"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-10 h-px bg-accent mx-auto mb-6" />
          <h1 className="text-5xl tracking-widest text-text-primary" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.06em" }}>
            PARIS <span className="text-accent">BACKLINE</span>
          </h1>
          <p className="text-text-muted mt-3 text-[0.65rem] uppercase tracking-[0.3em]">Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="border border-border p-7 space-y-5" style={{ borderRadius: "1px", background: "rgba(255,255,255,0.02)" }}>
          {error && (
            <div className="border border-danger/30 text-danger text-xs p-3" style={{ borderRadius: "1px", background: "rgba(239,68,68,0.05)" }}>
              {error}
            </div>
          )}

          <div>
            <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">
              Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              placeholder="Username"
              required
            />
          </div>

          <div>
            <label className="block text-text-muted text-[0.65rem] font-semibold mb-2 uppercase tracking-[0.18em]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-bg-primary text-[0.72rem] font-semibold uppercase tracking-[0.14em] py-3.5 transition-all disabled:opacity-50 cursor-pointer hover:brightness-110"
            style={{ borderRadius: "1px" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
