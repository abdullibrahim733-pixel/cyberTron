"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass p-8 w-full max-w-sm">
        <h1 className="font-display text-xl font-semibold mb-6">Admin Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-xs text-muted block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-cyan transition-colors"
              required
            />
          </div>

          <div>
            <label className="font-mono text-xs text-muted block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-s2 border border-[rgba(255,255,255,0.07)] rounded-lg px-3.5 py-2.5 text-sm font-mono text-text focus:outline-none focus:border-cyan transition-colors"
              required
            />
          </div>

          {error && <p className="text-xs text-orange font-mono">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan text-bg border-none rounded-lg py-2.5 font-mono text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
