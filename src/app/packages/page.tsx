"use client";

import React from "react";
import {
  Package,
  CheckCircle,
  MessageCircle,
  Sparkles,
  Zap,
  Flame,
  ShieldAlert,
  Trophy,
  Star,
  Users,
} from "lucide-react";
import ResponsibleBanner from "@/components/ResponsibleBanner";

export default function PackagesPage() {
  const packages = [
    {
      id: "odd-2",
      name: "Odd 2 Package",
      subtitle: "Daily Safe Banker Accumulator",
      price: "60k",
      duration: "1 Month",
      color: "border-teal-300 hover:border-teal-400",
      badge: "Highest Win Rate",
      badgeColor: "bg-teal-100 text-teal-800",
      description: "Carefully selected 2.0+ total odds banker picks designed for consistent bankroll building.",
      features: [
        "Daily 2.0+ Odds Multi-tips",
        "High percentage win rate research",
        "Banker double chance & straight wins",
        "Direct WhatsApp delivery with Teddy",
      ],
      whatsappMsg: "Hello Teddy, I want to subscribe to the Odd 2 Package (60k/month).",
    },
    {
      id: "odd-3",
      name: "Odd 3 Package",
      subtitle: "Medium Risk Growth Pack",
      price: "70k",
      duration: "1 Month",
      color: "border-cyan-300 hover:border-cyan-400",
      badge: "Popular Pick",
      badgeColor: "bg-cyan-100 text-cyan-800",
      description: "Triple your stake with researched 3.0+ multi-match selections across major European leagues.",
      features: [
        "Daily 3.0+ Odds Multi-picks",
        "Over/Under goals & Goal-Goal strategies",
        "Early morning & evening fixture analysis",
        "Full 30 days active access",
      ],
      whatsappMsg: "Hello Teddy, I want to subscribe to the Odd 3 Package (70k/month).",
    },
    {
      id: "odd-4",
      name: "Odd 4 Package",
      subtitle: "Aggressive Multiplier Pack",
      price: "80k",
      duration: "1 Month",
      color: "border-indigo-300 hover:border-indigo-400",
      badge: "High Multiplier",
      badgeColor: "bg-indigo-100 text-indigo-800",
      description: "4.0+ daily odds combination for punters targeting higher returns on moderate stakes.",
      features: [
        "Daily 4.0+ Odds Combinations",
        "Handicap and multi-goal researched markets",
        "Weekend Super League specials",
        "Dedicated VIP assistance",
      ],
      whatsappMsg: "Hello Teddy, I want to subscribe to the Odd 4 Package (80k/month).",
    },
    {
      id: "odd-10",
      name: "Odd 10 Package",
      subtitle: "Mega Multiplier Accumulator",
      price: "100k",
      duration: "1 Month",
      color: "border-purple-300 hover:border-purple-400",
      badge: "Big Payouts",
      badgeColor: "bg-purple-100 text-purple-800",
      description: "10.0+ Odds accumulator tickets backed by in-depth analytical team form research.",
      features: [
        "Daily 10.0+ Mega Accumulators",
        "Weekend mega jackpot ticket insights",
        "Optimal combination filtering",
        "Direct priority support from Teddy",
      ],
      whatsappMsg: "Hello Teddy, I want to subscribe to the Odd 10 Package (100k/month).",
    },
    {
      id: "high-stakers",
      name: "High Stakers Pack",
      subtitle: "For High Rollers & Low-Odds Stakers",
      price: "50k",
      duration: "1 Month",
      color: "border-amber-300 hover:border-amber-400",
      badge: "Low Risk VIP",
      badgeColor: "bg-amber-100 text-amber-900",
      description: "Low odds ultra-safe bankers tailored specifically for high capital stakers.",
      features: [
        "Ultra-high confidence 1.30 - 1.60 banker picks",
        "Capital protection & stake management guidance",
        "Selected singles and straight win guarantees",
        "1-on-1 WhatsApp consultation with Teddy",
      ],
      whatsappMsg: "Hello Teddy, I want to join the High Stakers Package (50k/month).",
    },
    {
      id: "katambula",
      name: "Katambula Group",
      subtitle: "Special Rolling & Accumulator Community",
      price: "150k",
      duration: "2 Months",
      color: "border-emerald-300 hover:border-emerald-400",
      badge: "Best Value (2 Mos)",
      badgeColor: "bg-emerald-100 text-emerald-900",
      description: "Our renowned Katambula rolling challenge group with structured multi-day progression tickets.",
      features: [
        "Full 60 Days (2 Months) Katambula Access",
        "Rolling challenge progression system",
        "Daily group discussions & exclusive slips",
        "Special mid-week & weekend banker sessions",
      ],
      whatsappMsg: "Hello Teddy, I want to join the Katambula Group (150k - 2 months).",
    },
    {
      id: "all-groups",
      name: "All Groups Pass",
      subtitle: "Complete VIP All-Access Master Pass",
      price: "350k",
      duration: "3 Months",
      color: "border-teal-500 hover:border-teal-600 bg-gradient-to-b from-teal-50/40 to-white",
      badge: "👑 Ultimate All-Access",
      badgeColor: "bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black",
      isFeatured: true,
      description: "Get all packages combined (Odd 2, 3, 4, 10, High Stakers & Katambula) for a full 3 months!",
      features: [
        "Full 90 Days (3 Months) Unrestricted Access",
        "Includes Odd 2, Odd 3, Odd 4, & Odd 10",
        "Includes High Stakers & Katambula Group",
        "VIP direct line to Teddy (0745090955)",
        "Priority match analysis & early release slips",
      ],
      whatsappMsg: "Hello Teddy, I want to activate the All Groups Pass (350k - 3 months)!",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <ResponsibleBanner />

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            KALASO PREDICTIONS PACKAGES
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Choose Your Preferred Prediction Package
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            While our standard daily tips remain 100% free for all registered users, our dedicated WhatsApp VIP groups offer customized odds formats and rolling challenge slips.
          </p>
        </div>

        {/* Manager Contact Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-3xl border border-teal-800/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider">
              <Users className="w-4 h-4" /> Official Subscription Manager
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Teddy — Kalaso Predictions
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Mobile & WhatsApp: <strong className="text-teal-300 font-bold">0745090955</strong> / +256782534994
            </p>
          </div>

          <a
            href="https://wa.me/256745090955?text=Hello%20Teddy,%20I%20would%20like%20to%20inquire%20about%20Kalaso%20Packages."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all text-sm transform hover:-translate-y-0.5 flex-shrink-0"
          >
            <MessageCircle className="w-5 h-5" />
            Chat With Teddy on WhatsApp (0745090955)
          </a>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => {
            const waUrl = `https://wa.me/256745090955?text=${encodeURIComponent(pkg.whatsappMsg)}`;
            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between shadow-xs hover:shadow-lg ${pkg.color} ${
                  pkg.isFeatured ? "ring-2 ring-teal-500/30" : ""
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-lg ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {pkg.duration}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <h3 className="text-xl font-black text-slate-900">{pkg.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-4">{pkg.subtitle}</p>

                  <div className="flex items-baseline gap-1 mb-4 pb-4 border-b border-slate-100">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {pkg.price}
                    </span>
                    <span className="text-xs font-bold text-slate-500">/ {pkg.duration}</span>
                  </div>

                  <p className="text-xs text-slate-600 mb-6 leading-relaxed">{pkg.description}</p>

                  {/* Features List */}
                  <div className="space-y-2.5 mb-6">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Action Button */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm text-center flex items-center justify-center gap-2 transition-all shadow-sm ${
                    pkg.isFeatured
                      ? "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/30"
                      : "bg-slate-900 hover:bg-teal-600 text-white"
                  }`}
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  Join Package on WhatsApp
                </a>
              </div>
            );
          })}
        </div>

        {/* Responsible Gambling Notice Section */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-amber-950 space-y-4">
          <div className="flex items-center gap-2.5 font-black text-base text-amber-900">
            <ShieldAlert className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <span>TERMS & RESPONSIBLE BETTING WARNING</span>
          </div>

          <div className="text-xs sm:text-sm leading-relaxed space-y-2 text-amber-900">
            <p>
              "These are researched games but not fixed, we just have a high percentage of winning but the game remains, can win or lose. Stake responsibly."
            </p>
            <p>
              "These matches have only been researched and given max attention but can win or lose, stake responsibly."
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <span className="bg-rose-100 border border-rose-300 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg">
              🚫 NOT FOR SCHOOL CHILDREN
            </span>
            <span className="bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-lg">
              🔞 NOT FOR PERSONS BELOW 25 YEARS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
