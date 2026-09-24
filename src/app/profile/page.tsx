"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import PredictionCard from "@/components/PredictionCard";
import ResponsibleBanner from "@/components/ResponsibleBanner";
import { Prediction } from "@/db/schema";
import {
  User as UserIcon,
  Mail,
  Phone,
  Shield,
  LogOut,
  Calendar,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Flame,
  Radio,
  Trophy,
} from "lucide-react";
import Link from "next/link";

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [recentTips, setRecentTips] = useState<Prediction[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const loadTips = async () => {
      try {
        const res = await fetch("/api/predictions/free?limit=8");
        if (res.ok) {
          const data = await res.json();
          setRecentTips(data.predictions || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTips(false);
      }
    };
    loadTips();
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ResponsibleBanner />

        {/* Welcome Hero Banner */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-black px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                MEMBER DASHBOARD
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Welcome, {user.name}! 👋
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                You have unrestricted access to all Kalaso researched football predictions. Stake responsibly and track results in real-time.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/tips"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <TrendingUp className="w-4 h-4" /> All Free Tips
              </Link>
              <Link
                href="/live"
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
              >
                <Radio className="w-4 h-4 text-rose-500" /> Live Scores
              </Link>
              <button
                onClick={() => logout()}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Profile Card & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile details */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 font-black text-xl flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{user.name}</h3>
                <span className="text-xs text-slate-500">Verified Kalaso Member</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" /> Email
                </span>
                <span className="font-bold text-slate-800 truncate max-w-[180px]">{user.email}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Phone className="w-4 h-4 text-slate-400" /> Phone
                </span>
                <span className="font-bold text-slate-800">{user.phone}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500 flex items-center gap-1.5 font-medium">
                  <Shield className="w-4 h-4 text-slate-400" /> Account Status
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Active
                </span>
              </div>
            </div>

            {/* VIP Inquiries */}
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-2">
              <span className="text-xs font-black text-teal-900 block">Need Personalized VIP Slips?</span>
              <p className="text-xs text-teal-800 leading-relaxed">
                Reach out to Teddy on WhatsApp for Odd 2, Odd 4, Odd 10, High Stakers & Katambula packages.
              </p>
              <a
                href="https://wa.me/256745090955"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-extrabold text-teal-700 hover:text-teal-900 underline"
              >
                Chat on WhatsApp (+256745090955) →
              </a>
            </div>
          </div>

          {/* Quick tips feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Latest Free Tips Feed
                </h2>
                <p className="text-xs text-slate-500">
                  Today's banker predictions and recent verified results.
                </p>
              </div>
              <Link
                href="/tips"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                <span>View Full Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loadingTips ? (
              <div className="py-12 text-center text-slate-400 text-xs">Loading tips...</div>
            ) : recentTips.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-xs text-slate-500">
                No tips currently published. Check back shortly.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recentTips.map((tip) => (
                  <PredictionCard key={tip.id} prediction={tip} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
