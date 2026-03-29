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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">
            PARIS<span className="text-accent">BACKLINE</span>
          </h1>
          <p className="text-text-secondary mt-2 text-sm">Rental Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-bg-secondary border border-border rounded-xl p-6 space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">
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
            <label className="block text-text-secondary text-xs font-medium mb-1.5 uppercase tracking-wider">
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
            className="w-full bg-accent hover:bg-accent-hover text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
