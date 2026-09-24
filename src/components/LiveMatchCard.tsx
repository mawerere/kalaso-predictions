"use client";

import React from "react";
import { Radio, Flame, Sparkles, Activity } from "lucide-react";
import { LiveMatch } from "@/db/schema";

interface LiveMatchCardProps {
  match: LiveMatch;
}

export default function LiveMatchCard({ match }: LiveMatchCardProps) {
  const isOngoing = match.status === "LIVE" || match.status === "HT";

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-4 sm:p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide truncate">
          {match.league}
        </span>
        <div className="flex items-center gap-1.5">
          {isOngoing ? (
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-live-dot"></span>
              {match.matchMinute || "LIVE"}
            </span>
          ) : (
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-md">
              {match.status}
            </span>
          )}
        </div>
      </div>

      {/* Match Score Display */}
      <div className="flex items-center justify-between gap-4 py-2">
        {/* Home Team */}
        <div className="flex-1 text-left">
          <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
            {match.homeTeam}
          </h4>
        </div>

        {/* Big Score Board */}
        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-xl tracking-wider shadow-inner">
          <span className="text-teal-400">{match.homeScore}</span>
          <span className="text-slate-500">-</span>
          <span className="text-teal-400">{match.awayScore}</span>
        </div>

        {/* Away Team */}
        <div className="flex-1 text-right">
          <h4 className="font-extrabold text-slate-900 text-base sm:text-lg">
            {match.awayTeam}
          </h4>
        </div>
      </div>

      {/* Linked Free Tip & Commentary */}
      {(match.predictionText || match.liveCommentary) && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          {match.predictionText && (
            <div className="bg-teal-50/70 border border-teal-100 p-2.5 rounded-lg flex items-center justify-between text-xs">
              <span className="text-teal-800 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                Kalaso Tip: <strong className="text-slate-900">{match.predictionText}</strong>
              </span>
              {match.odds && (
                <span className="font-black text-slate-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                  {match.odds}
                </span>
              )}
            </div>
          )}

          {match.liveCommentary && (
            <div className="flex items-start gap-1.5 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg">
              <Activity className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
              <span>{match.liveCommentary}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
