"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogIn, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import ResponsibleBanner from "@/components/ResponsibleBanner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === "SUPER_ADMIN") {
        router.push("/super-admin");
      } else {
        router.push("/profile");
      }
    } else {
      setError(res.error || "Login failed. Please verify credentials.");
    }
  };

  const fillDemoAccount = (role: "user" | "admin") => {
    if (role === "admin") {
      setEmail("admin@kalaso.com");
      setPassword("admin123");
    } else {
      setEmail("teddy@kalaso.com");
      setPassword("user123");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        <ResponsibleBanner />

        {/* Brand header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-teal-500/20">
              K
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Log in to Kalaso Predictions
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Access all free verified tips, custom accumulator tools, and community updates.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-black text-sm py-3 px-4 rounded-xl shadow-md shadow-teal-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Quick Demo Logins Helper */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 text-center">
              Quick Test Credentials
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount("user")}
                className="py-1.5 px-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
              >
                Sample User
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount("admin")}
                className="py-1.5 px-2 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-lg text-xs font-bold border border-slate-200 transition-colors"
              >
                Admin Demo
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Don't have an account yet?{" "}
              <Link href="/register" className="font-bold text-teal-600 hover:underline">
                Register for Free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
