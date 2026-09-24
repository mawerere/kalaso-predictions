"use client";

import React, { useState, useEffect } from "react";
import PredictionCard from "@/components/PredictionCard";
import ResponsibleBanner from "@/components/ResponsibleBanner";
import { Prediction } from "@/db/schema";
import {
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  RefreshCw,
  Flame,
} from "lucide-react";

export default function TipsFeedPage() {
  const [tips, setTips] = useState<Prediction[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    won: 0,
    lost: 0,
    pending: 0,
    void: 0,
    winRate: 88,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedLeague, setSelectedLeague] = useState("ALL");

  const fetchTips = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/predictions/free");
      if (res.ok) {
        const data = await res.json();
        setTips(data.predictions || []);
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Error loading tips:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  // Filter tips locally for instantaneous responsiveness
  const filteredTips = tips.filter((tip) => {
    // Result filter
    if (resultFilter !== "ALL" && tip.result !== resultFilter) return false;

    // Category filter
    if (categoryFilter !== "ALL" && tip.category !== categoryFilter) return false;

    // League filter
    if (selectedLeague !== "ALL" && tip.league !== selectedLeague) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTeams =
        tip.homeTeam.toLowerCase().includes(q) ||
        tip.awayTeam.toLowerCase().includes(q) ||
        tip.league.toLowerCase().includes(q) ||
        tip.prediction.toLowerCase().includes(q);
      if (!matchTeams) return false;
    }

    return true;
  });

  const uniqueLeagues = Array.from(new Set(tips.map((t) => t.league))).filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <ResponsibleBanner />

        {/* Header & Stats Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                100% FREE FOOTBALL TIPS FEED
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                All Free Predictions & Results
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Every tip published by Kalaso analysts with full transparent result tracking. Filter by status, league, or search upcoming fixtures.
              </p>
            </div>

            {/* Quick Stats Pill Counters */}
            <div className="grid grid-cols-3 gap-3 flex-shrink-0">
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Win Rate</span>
                <span className="text-xl sm:text-2xl font-black text-emerald-400">{stats.winRate}%</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Won Picks</span>
                <span className="text-xl sm:text-2xl font-black text-teal-400">{stats.won}</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending</span>
                <span className="text-xl sm:text-2xl font-black text-amber-400">{stats.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search team, league, or tip (e.g. Arsenal, Over 2.5, Champions League)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchTips}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* Result Filters */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Result:
              </span>
              {[
                { label: "All Tips", value: "ALL" },
                { label: "Pending (Today)", value: "PENDING" },
                { label: "Won (Hits) ✅", value: "WON" },
                { label: "Lost", value: "LOST" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setResultFilter(f.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                    resultFilter === f.value
                      ? "bg-teal-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* League Dropdown Filter */}
            {uniqueLeagues.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">League:</span>
                <select
                  value={selectedLeague}
                  onChange={(e) => setSelectedLeague(e.target.value)}
                  className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="ALL">All Competitions ({uniqueLeagues.length})</option>
                  {uniqueLeagues.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tips Grid */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Loading verified predictions...</p>
          </div>
        ) : filteredTips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <Trophy className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No predictions found</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              No tips match your filter criteria. Try changing the result filter or search query.
            </p>
            <button
              onClick={() => {
                setResultFilter("ALL");
                setSelectedLeague("ALL");
                setSearchQuery("");
              }}
              className="mt-2 text-xs font-bold text-teal-600 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredTips.map((tip) => (
              <PredictionCard key={tip.id} prediction={tip} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
