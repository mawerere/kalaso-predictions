"use client";

import React, { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
  Shield,
  Activity,
} from "lucide-react";
import { Prediction } from "@/db/schema";

interface PredictionCardProps {
  prediction: Prediction;
  showDetailsDefault?: boolean;
}

export default function PredictionCard({ prediction, showDetailsDefault = false }: PredictionCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(showDetailsDefault);

  const getResultBadge = () => {
    switch (prediction.result) {
      case "WON":
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm shadow-emerald-500/30 animate-pulse">
            <CheckCircle className="w-3.5 h-3.5" /> WON
          </span>
        );
      case "LOST":
        return (
          <span className="inline-flex items-center gap-1 bg-slate-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            <XCircle className="w-3.5 h-3.5" /> LOST
          </span>
        );
      case "VOID":
        return (
          <span className="inline-flex items-center gap-1 bg-amber-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            VOID / REFUND
          </span>
        );
      default:
        if (prediction.status === "LIVE") {
          return (
            <span className="inline-flex items-center gap-1.5 bg-rose-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full animate-ping"></span> LIVE NOW
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3.5 h-3.5 text-teal-600" /> PENDING
          </span>
        );
    }
  };

  const getCategoryBadge = () => {
    switch (prediction.category) {
      case "BANKER_OF_THE_DAY":
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
            🔥 Banker of the Day
          </span>
        );
      case "SUPER_ODD":
        return (
          <span className="bg-purple-100 text-purple-800 border border-purple-300 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
            ⚡ Super Odd
          </span>
        );
      default:
        return (
          <span className="bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
            ⚽ Free Pick
          </span>
        );
    }
  };

  const copyToClipboard = () => {
    const text = `🔥 KALASO PREDICTIONS Free Tip:\n⚽ ${prediction.homeTeam} vs ${prediction.awayTeam}\n🏆 ${prediction.league}\n🎯 Tip: ${prediction.prediction}\n📊 Odds: ${prediction.odds}\n⏰ Match Time: ${prediction.matchTime} (${prediction.matchDate})\n👉 Join free on WhatsApp: +256745090955`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-2xl transition-all duration-200 border ${
        prediction.result === "WON"
          ? "bg-white border-emerald-300 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-400/30"
          : prediction.isFeatured
          ? "bg-white border-teal-300 shadow-md shadow-teal-500/10"
          : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md"
      }`}
    >
      {/* Header: League & Status */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {getCategoryBadge()}
          <span className="text-xs font-semibold text-slate-600 truncate max-w-[200px] sm:max-w-xs">
            {prediction.league}
          </span>
        </div>
        <div>{getResultBadge()}</div>
      </div>

      {/* Main Body: Teams & Match Info */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                {prediction.homeTeam}
              </span>
              <span className="text-xs font-bold text-slate-400">VS</span>
              <span className="font-extrabold text-slate-900 text-base sm:text-lg">
                {prediction.awayTeam}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{prediction.matchDate}</span>
              <span>•</span>
              <span className="font-medium text-slate-700">{prediction.matchTime}</span>
              {prediction.correctScore && (
                <>
                  <span>•</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Score: {prediction.correctScore}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Odds Pill */}
          <div className="flex items-center self-start sm:self-center gap-2">
            <div className="bg-slate-900 text-teal-400 px-3.5 py-1.5 rounded-xl font-black text-base sm:text-lg flex items-center gap-1.5 shadow-xs">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Odds</span>
              <span>{prediction.odds}</span>
            </div>
          </div>
        </div>

        {/* Prediction Box */}
        <div className="bg-teal-50/70 border border-teal-100 rounded-xl p-3.5 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold text-teal-800 tracking-wider block">
              Recommended Prediction
            </span>
            <span className="font-extrabold text-slate-900 text-sm sm:text-base">
              {prediction.prediction}
            </span>
          </div>

          <button
            onClick={copyToClipboard}
            className="p-2 text-teal-700 hover:text-teal-900 hover:bg-teal-100/60 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Share or Copy Tip"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>

        {/* Confidence & Analysis */}
        {prediction.confidence && (
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-teal-600" /> Win Confidence
              </span>
              <span className="font-bold text-teal-700">{prediction.confidence}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${prediction.confidence}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Optional Tipster Analysis Notes */}
        {prediction.notes && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{expanded ? "Hide Analysis" : "Show Tipster Insights"}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            {expanded && (
              <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                "{prediction.notes}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
