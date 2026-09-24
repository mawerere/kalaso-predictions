"use client";

import React from "react";
import Link from "next/link";
import {
  Flame,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Zap,
} from "lucide-react";

interface MotionHeroBannerProps {
  stats?: {
    total: number;
    won: number;
    pending: number;
    winRate: number;
  };
}

export default function MotionHeroBanner({ stats }: MotionHeroBannerProps) {
  const winRate = stats?.winRate || 88;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl mb-10 border border-slate-800">
      {/* Background Image with teal/navy gradient overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity transform scale-105 transition-transform duration-1000 hover:scale-100"
        style={{ backgroundImage: `url('/images/hero-banner.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-teal-950/80" />

      {/* Decorative motion glow lights */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 lg:py-16 max-w-5xl">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-5">
          <span className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            100% FREE FOOTBALL TIPS
          </span>
          <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold tracking-wide backdrop-blur-md">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {winRate}% ACCURACY THIS WEEK
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md">
            🔞 25+ STAKE RESPONSIBLY
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-4 text-white">
          Accurate Football Predictions.{" "}
          <span className="bg-gradient-to-r from-teal-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Free For Every Fan.
          </span>
        </h1>

        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed mb-8">
          Kalaso Predictions provides carefully researched match insights, high-confidence banker tips, and live score synchronization. No confusing subscription lockouts on our free feed — register once and access every pick!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            href="/tips"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-lg shadow-teal-500/30 transition-all transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <TrendingUp className="w-4 h-4" />
            View Today's Tips
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="https://whatsapp.com/channel/0029VbBuWfjBqbrHcUdjiE36"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold px-5 py-3.5 rounded-xl transition-all text-sm sm:text-base"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            Join WhatsApp Channel
          </a>

          <Link
            href="/packages"
            className="inline-flex items-center gap-2 text-teal-300 hover:text-teal-200 bg-teal-950/60 hover:bg-teal-900/60 border border-teal-800/80 font-bold px-4 py-3.5 rounded-xl transition-all text-sm"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            Special VIP Packages
          </Link>
        </div>

        {/* Key Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-8 border-t border-slate-800/80">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Free Banker Tips</span>
            <span className="text-xl sm:text-2xl font-black text-teal-400">Daily</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Recent Win Rate</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-400">{winRate}%</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Active Community</span>
            <span className="text-xl sm:text-2xl font-black text-white">10,000+</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium block">Mobile Support</span>
            <span className="text-xl sm:text-2xl font-black text-amber-400">0745090955</span>
          </div>
        </div>
      </div>
    </div>
  );
}
