"use client";

import React, { useState, useEffect } from "react";
import LiveMatchCard from "@/components/LiveMatchCard";
import ResponsibleBanner from "@/components/ResponsibleBanner";
import { LiveMatch } from "@/db/schema";
import { Radio, RefreshCw, Trophy, Clock, Flame, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LiveMatchesPage() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchLiveMatches = async () => {
    try {
      const res = await fetch("/api/live-matches");
      if (res.ok) {
        const data = await res.json();
        setMatches(data.matches || []);
        setLastUpdated(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    } catch (err) {
      console.error("Live matches load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMatches();
    // Auto polling every 20 seconds
    const interval = setInterval(fetchLiveMatches, 20000);
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (filter === "LIVE") return m.status === "LIVE" || m.status === "HT";
    if (filter === "FT") return m.status === "FT" || m.status === "FINISHED";
    if (filter === "SCHEDULED") return m.status === "SCHEDULED";
    return true;
  });

  const liveCount = matches.filter((m) => m.status === "LIVE" || m.status === "HT").length;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <ResponsibleBanner />

        {/* Top Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-black px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
              REAL-TIME MATCH TRACKER
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Scores & Predictions Monitor
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Live updates of matches linked to Kalaso tips. Automatically refreshed every 20s.
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
            <div className="text-right text-xs text-slate-400">
              <span>Auto-refresh active</span>
              {lastUpdated && <span className="block text-[10px] text-teal-400">Updated: {lastUpdated}</span>}
            </div>
            <button
              onClick={fetchLiveMatches}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-xl border border-slate-700 transition-colors"
              title="Refresh now"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2">
            {[
              { label: `All Matches (${matches.length})`, value: "ALL" },
              { label: `🔥 Live Now (${liveCount})`, value: "LIVE" },
              { label: "Full Time (FT)", value: "FT" },
              { label: "Upcoming", value: "SCHEDULED" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                  filter === f.value
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Matches Grid */}
        {loading && matches.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Checking live matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
            <Radio className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No live matches in this category</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              Our tipsters update live scores as games kick off. You can browse today's scheduled tips below!
            </p>
            <Link
              href="/tips"
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Flame className="w-4 h-4" /> Browse Today's Free Tips
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {filteredMatches.map((m) => (
              <LiveMatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
