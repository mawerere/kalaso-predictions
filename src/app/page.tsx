"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import MotionHeroBanner from "@/components/MotionHeroBanner";
import PredictionCard from "@/components/PredictionCard";
import LiveMatchCard from "@/components/LiveMatchCard";
import ResponsibleBanner from "@/components/ResponsibleBanner";
import { Prediction, LiveMatch } from "@/db/schema";
import {
  TrendingUp,
  Radio,
  Package,
  Calculator,
  ShieldCheck,
  CheckCircle,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Users,
  Clock,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

export default function HomePage() {
  const [tips, setTips] = useState<Prediction[]>([]);
  const [liveMatches, setLiveMatches] = useState<LiveMatch[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    won: 0,
    lost: 0,
    pending: 0,
    winRate: 88,
  });
  const [loadingTips, setLoadingTips] = useState(true);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    // Fetch preview free tips (latest 4)
    const fetchTips = async () => {
      try {
        const res = await fetch("/api/predictions/free?limit=4");
        if (res.ok) {
          const data = await res.json();
          setTips(data.predictions || []);
          if (data.stats) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTips(false);
      }
    };

    // Fetch live matches
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/live-matches");
        if (res.ok) {
          const data = await res.json();
          setLiveMatches(data.matches || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingLive(false);
      }
    };

    fetchTips();
    fetchLive();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <ResponsibleBanner />

        {/* Dynamic Motion Hero Banner */}
        <MotionHeroBanner stats={stats} />

        {/* ================= SECTION 1: TODAY'S FREE TIPS PREVIEW ================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full mb-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                VERIFIED MATCH PREVIEWS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Today's Free Football Tips
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                100% free researched predictions for all registered sports fans. No package locked tips in our free feed.
              </p>
            </div>

            <Link
              href="/tips"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline self-start sm:self-center"
            >
              <span>View Full Free Feed ({stats.total} tips)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingTips ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Loading latest free picks...
            </div>
          ) : tips.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl text-center border border-slate-200 text-xs text-slate-500">
              No free predictions currently scheduled. Check back shortly!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {tips.map((tip) => (
                <PredictionCard key={tip.id} prediction={tip} />
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              href="/tips"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-teal-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-sm"
            >
              <TrendingUp className="w-4 h-4" />
              Explore All {stats.total} Tips & Complete Win History
            </Link>
          </div>
        </section>

        {/* ================= SECTION 2: LIVE MATCHES PREVIEW ================= */}
        {liveMatches.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold px-3 py-1 rounded-full mb-1">
                  <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                  MATCH CENTER
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Live Match Tracker
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Real-time synchronization for matches currently linked to our free betting tips.
                </p>
              </div>

              <Link
                href="/live"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline self-start sm:self-center"
              >
                <span>Full Live Match Feed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {liveMatches.slice(0, 2).map((match) => (
                <LiveMatchCard key={match.id} match={match} />
              ))}
            </div>
          </section>
        )}

        {/* ================= SECTION 3: KALASO PACKAGES SHOWCASE ================= */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest block">
              VIP WHATSAPP SUBSCRIPTION RATES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Kalaso Predictions Special Packages
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Personalized multi-odds formats & rolling progression slips sent directly to your WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Odd 10 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-400 bg-purple-950 px-2 py-0.5 rounded">
                  Mega Multiplier
                </span>
                <h3 className="font-extrabold text-lg text-white mt-2">Odd 10 Package</h3>
                <div className="text-2xl font-black text-teal-400">100k <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <p className="text-xs text-slate-400">10.0+ Odds accumulator tickets with deep statistical form backing.</p>
              </div>
              <a
                href="https://wa.me/256745090955?text=Hello%20Teddy,%20I%20want%20to%20subscribe%20to%20the%20Odd%2010%20Package%20(100k/month)."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-teal-600 text-white text-xs font-bold py-2.5 rounded-xl text-center block transition-colors"
              >
                Join Odd 10 on WhatsApp
              </a>
            </div>

            {/* Odd 4 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded">
                  Aggressive Growth
                </span>
                <h3 className="font-extrabold text-lg text-white mt-2">Odd 4 Package</h3>
                <div className="text-2xl font-black text-teal-400">80k <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <p className="text-xs text-slate-400">Daily 4.0+ Odds combination for punters targeting higher returns.</p>
              </div>
              <a
                href="https://wa.me/256745090955?text=Hello%20Teddy,%20I%20want%20to%20subscribe%20to%20the%20Odd%204%20Package%20(80k/month)."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-teal-600 text-white text-xs font-bold py-2.5 rounded-xl text-center block transition-colors"
              >
                Join Odd 4 on WhatsApp
              </a>
            </div>

            {/* Odd 3 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded">
                  Balanced
                </span>
                <h3 className="font-extrabold text-lg text-white mt-2">Odd 3 Package</h3>
                <div className="text-2xl font-black text-teal-400">70k <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <p className="text-xs text-slate-400">3.0+ multi-match selections across major European leagues.</p>
              </div>
              <a
                href="https://wa.me/256745090955?text=Hello%20Teddy,%20I%20want%20to%20subscribe%20to%20the%20Odd%203%20Package%20(70k/month)."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-teal-600 text-white text-xs font-bold py-2.5 rounded-xl text-center block transition-colors"
              >
                Join Odd 3 on WhatsApp
              </a>
            </div>

            {/* Odd 2 */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-teal-400 bg-teal-950 px-2 py-0.5 rounded">
                  Safe Banker
                </span>
                <h3 className="font-extrabold text-lg text-white mt-2">Odd 2 Package</h3>
                <div className="text-2xl font-black text-teal-400">60k <span className="text-xs text-slate-400 font-normal">/ month</span></div>
                <p className="text-xs text-slate-400">Safe 2.0+ banker accumulator for consistent daily bankroll growth.</p>
              </div>
              <a
                href="https://wa.me/256745090955?text=Hello%20Teddy,%20I%20want%20to%20subscribe%20to%20the%20Odd%202%20Package%20(60k/month)."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-teal-600 text-white text-xs font-bold py-2.5 rounded-xl text-center block transition-colors"
              >
                Join Odd 2 on WhatsApp
              </a>
            </div>
          </div>

          {/* Special Rolling Groups (Katambula & All Groups) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded">
                Low Risk VIP
              </span>
              <h4 className="font-bold text-base text-white">High Stakers Pack</h4>
              <span className="text-xl font-black text-amber-400 block">50k / month</span>
              <p className="text-xs text-slate-400">Ultra-safe singles and double chance picks for heavy stakes.</p>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                Rolling Challenge (2 Mos)
              </span>
              <h4 className="font-bold text-base text-white">Katambula Group</h4>
              <span className="text-xl font-black text-emerald-400 block">150k - 2 months</span>
              <p className="text-xs text-slate-400">Our signature 60-day rolling challenge community.</p>
            </div>

            <div className="bg-gradient-to-br from-teal-950 to-slate-950 p-5 rounded-2xl border border-teal-500/50 space-y-2">
              <span className="text-[10px] font-black uppercase text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded">
                👑 All-Access Pass (3 Mos)
              </span>
              <h4 className="font-bold text-base text-white">All Groups Master Pass</h4>
              <span className="text-xl font-black text-teal-300 block">350k - 3 months</span>
              <p className="text-xs text-slate-300">Access every VIP group (Odd 2, 3, 4, 10, High Stakers & Katambula).</p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/packages"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-400 hover:text-teal-300 underline"
            >
              <span>View All Package Details & WhatsApp Instructions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* ================= SECTION 4: ODDS ACCUMULATOR CALCULATOR TEASER ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full">
              <Calculator className="w-3.5 h-3.5 text-teal-600" />
              INTERACTIVE TOOL
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Calculate Your Multibet Returns Instantly
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              Combine multiple Kalaso free tips or test your custom odds to calculate cumulative accumulator multipliers, potential returns, and net profit.
            </p>
          </div>

          <Link
            href="/calculator"
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-md shadow-teal-600/20 transition-all flex-shrink-0"
          >
            <Calculator className="w-4 h-4" />
            Open Odds Calculator
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

        {/* ================= SECTION 5: WHY KALASO PREDICTIONS ================= */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-teal-600 uppercase tracking-widest block">
              OUR COMMITMENT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Why Bettors Trust Kalaso Predictions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-black">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">100% Free Public Tips</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every registered member gets full access to our primary researched tips without hidden fees or subscription lockouts on the main feed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Honest & Researched Edge</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We analyze tactical form, team news, expected goals (xG), and head-to-head records. No fake "fixed match" illusions — pure analytical strategy.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-base text-slate-900">Responsible Gambling First</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strict 25+ age restriction and bankroll protection guidance. Matches can win or lose, so we always emphasize disciplined staking.
              </p>
            </div>
          </div>
        </section>

        {/* ================= SECTION 6: FAQ & RESPONSIBLE GAMBLING ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-teal-700 text-xs font-bold mb-1">
              <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Are your daily free tips really 100% free?
              </h4>
              <p className="leading-relaxed">
                Yes! Every registered user on Kalaso Predictions sees the exact same feed of verified daily tips. There are no payment gates to view our daily free picks.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                How do I join the WhatsApp Katambula or Odd 10 groups?
              </h4>
              <p className="leading-relaxed">
                Contact our official manager <strong>Teddy</strong> directly on WhatsApp at <strong>0745090955</strong> (+256745090955) or visit our Packages page.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                What does "These matches can win or lose" mean?
              </h4>
              <p className="leading-relaxed">
                Football remains an open competitive sport where surprises happen. While our analysts maintain an 85%+ win rate on banker picks, no prediction is 100% guaranteed. Stake only what you can afford.
              </p>
            </div>

            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Who can use Kalaso Predictions?
              </h4>
              <p className="leading-relaxed">
                Our platform is strictly for adults <strong>25 years and older</strong>. It is not for school children or underage persons.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
