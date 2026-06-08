"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check").then((r) => {
      if (r.ok) router.replace("/admin/dashboard");
    });
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin/dashboard");
    else setError("Incorrect password. Please try again.");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] px-4">
      {/* Top accent bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#E5332A]" />

      <div className="w-full max-w-sm">
        {/* Logo block */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/images/dtalab-logo.png" alt="DTALab" width={140} height={53}
                   className="h-14 w-auto brightness-0 invert" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Admin Panel</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to manage your website</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
                <Lock className="inline w-3 h-3 mr-1 mb-0.5" />Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-10 bg-white/8 border border-white/15 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/60 text-sm transition-colors"
                  placeholder="••••••••"
                  required
                  autoFocus
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all text-sm flex items-center justify-center gap-2 mt-2">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
                : "Sign In"}
            </button>
          </form>
        </div>

        {/* Unimore logo */}
        <div className="flex justify-center mt-8 opacity-25">
          <Image src="/images/unimore-logo.png" alt="UNIMORE" width={120} height={28}
                 className="h-7 w-auto brightness-0 invert" />
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">
          Set <code className="text-slate-600">ADMIN_PASSWORD</code> in .env.local
        </p>
      </div>
    </div>
  );
}
