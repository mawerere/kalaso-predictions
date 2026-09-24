"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Plus, Trash2, ArrowRight, Sparkles, DollarSign, RefreshCw, Trophy, ShieldAlert } from "lucide-react";
import ResponsibleBanner from "@/components/ResponsibleBanner";

interface TipItem {
  id: string;
  match: string;
  pick: string;
  odds: number;
}

export default function CalculatorPage() {
  const [stake, setStake] = useState<number>(20000);
  const [items, setItems] = useState<TipItem[]>([
    { id: "1", match: "Arsenal vs Chelsea", pick: "Home Win & Over 1.5", odds: 1.88 },
    { id: "2", match: "Barcelona vs Atletico Madrid", pick: "Over 2.5 Goals", odds: 1.75 },
    { id: "3", match: "Real Madrid vs Manchester City", pick: "Both Teams To Score (GG)", odds: 1.65 },
  ]);

  const [customMatch, setCustomMatch] = useState("");
  const [customPick, setCustomPick] = useState("");
  const [customOdds, setCustomOdds] = useState("1.80");

  const totalOdds = items.reduce((acc, curr) => acc * (curr.odds || 1), 1);
  const potentialReturn = Math.round(stake * totalOdds);
  const netProfit = Math.max(0, potentialReturn - stake);
  const impliedProbability = totalOdds > 0 ? (100 / totalOdds).toFixed(1) : "0";

  const addCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedOdds = parseFloat(customOdds);
    if (isNaN(parsedOdds) || parsedOdds < 1.01) return;

    setItems([
      ...items,
      {
        id: Date.now().toString(),
        match: customMatch || "Custom Match Selection",
        pick: customPick || "Selected Pick",
        odds: parsedOdds,
      },
    ]);
    setCustomMatch("");
    setCustomPick("");
    setCustomOdds("1.80");
  };

  const removeItem = (id: string) => {
    if (items.length <= 1) return;
    setItems(items.filter((i) => i.id !== id));
  };

  const loadPreset = (preset: "banker" | "odd4" | "odd10") => {
    if (preset === "banker") {
      setItems([
        { id: "b1", match: "Arsenal vs Chelsea", pick: "Arsenal Win", odds: 1.55 },
        { id: "b2", match: "Vipers SC vs KCCA FC", pick: "Vipers 1X", odds: 1.35 },
      ]);
    } else if (preset === "odd4") {
      setItems([
        { id: "o1", match: "Arsenal vs Chelsea", pick: "Arsenal Win & Over 1.5", odds: 1.88 },
        { id: "o2", match: "Barcelona vs Atletico", pick: "Over 2.5 Goals", odds: 1.75 },
        { id: "o3", match: "Inter Milan vs Juventus", pick: "Under 3.5 Goals", odds: 1.30 },
      ]);
    } else if (preset === "odd10") {
      setItems([
        { id: "t1", match: "Arsenal vs Chelsea", pick: "Arsenal & Over 1.5", odds: 1.88 },
        { id: "t2", match: "Barcelona vs Atletico", pick: "Over 2.5", odds: 1.75 },
        { id: "t3", match: "Real Madrid vs Man City", pick: "Both Teams Score", odds: 1.65 },
        { id: "t4", match: "Bayern vs Dortmund", pick: "Bayern Win & Over 2.5", odds: 1.92 },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <ResponsibleBanner />

        {/* Page Title */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full mb-2 border border-teal-200">
                <Calculator className="w-3.5 h-3.5" /> Bet Accumulator Tool
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Odds & Potential Payout Calculator
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Combine Kalaso tips or your custom picks to calculate multibet odds, returns, and net profits instantly.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400">Presets:</span>
              <button
                onClick={() => loadPreset("banker")}
                className="text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                Odd 2.0 (Banker)
              </button>
              <button
                onClick={() => loadPreset("odd4")}
                className="text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                Odd 4.0 (Medium)
              </button>
              <button
                onClick={() => loadPreset("odd10")}
                className="text-xs font-bold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
              >
                Odd 10.0 (Super Acca)
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Selections List & Form */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center justify-between">
                <span>Acca Match Selections ({items.length})</span>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">
                  Combined Odds: {totalOdds.toFixed(2)}
                </span>
              </h3>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-200 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900">{item.match}</h4>
                        <span className="text-xs text-slate-500 font-medium">Pick: {item.pick}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-teal-700 bg-teal-100/60 px-2.5 py-1 rounded-lg border border-teal-200">
                        {item.odds.toFixed(2)}
                      </span>
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded transition-colors"
                          title="Remove selection"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Match Form */}
              <form onSubmit={addCustomItem} className="mt-5 pt-4 border-t border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Add Match Or Custom Odds
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Liverpool vs Tottenham"
                    value={customMatch}
                    onChange={(e) => setCustomMatch(e.target.value)}
                    className="sm:col-span-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="e.g. Over 2.5 Goals"
                    value={customPick}
                    onChange={(e) => setCustomPick(e.target.value)}
                    className="sm:col-span-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.01"
                      min="1.01"
                      placeholder="Odds"
                      value={customOdds}
                      onChange={(e) => setCustomOdds(e.target.value)}
                      className="w-20 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                    />
                    <button
                      type="submit"
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Calculation Summary */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Slip Payout Summary
                </h3>
              </div>

              {/* Stake Amount Selector */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Enter Your Stake (UGX / USD)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    UGX
                  </span>
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    value={stake}
                    onChange={(e) => setStake(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full bg-slate-800 text-white font-black text-lg pl-14 pr-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {[5000, 10000, 20000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setStake(amt)}
                      className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                        stake === amt ? "bg-teal-500 text-slate-900 font-black" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Odds */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center">
                <span className="text-xs font-semibold text-slate-400">Total Acca Odds:</span>
                <span className="font-black text-2xl text-teal-400">{totalOdds.toFixed(2)}</span>
              </div>

              {/* Potential Return */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-teal-950 to-slate-900 border border-teal-500/40 space-y-1">
                <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                  Potential Total Payout
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 block tracking-tight">
                  {potentialReturn.toLocaleString()} UGX
                </span>
                <div className="flex justify-between items-center text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span>Net Estimated Profit:</span>
                  <span className="font-bold text-emerald-300">+{netProfit.toLocaleString()} UGX</span>
                </div>
              </div>

              {/* Probabilities & Warning */}
              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/40 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span>Mathematical Implied Probability:</span>
                  <span className="text-teal-400 font-bold">{impliedProbability}%</span>
                </div>
                <p className="text-amber-400/90 pt-1">
                  * Note: Real matches have unpredictability. Kalaso tips provide expert edge, but always stake responsibly.
                </p>
              </div>

              <a
                href="https://wa.me/256745090955?text=Hello%20Teddy,%20I%20have%20calculated%20my%20tips%20accumulator%20and%20want%20to%20join%20the%20VIP%20package!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 px-4 rounded-xl text-center block text-sm transition-all shadow-md shadow-emerald-500/20"
              >
                Inquire High Odds with Teddy (0745090955)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
