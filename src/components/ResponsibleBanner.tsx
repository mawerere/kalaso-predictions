import React from "react";
import { ShieldAlert, AlertTriangle } from "lucide-react";

export default function ResponsibleBanner() {
  return (
    <div className="bg-amber-500/10 border-y border-amber-500/20 py-2.5 px-4 text-xs sm:text-sm text-amber-900">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-semibold text-amber-800">
            ⚠️ Responsible Gambling Notice:
          </span>
          <span className="text-amber-700 hidden sm:inline">
            Matches are researched with high win percentage, but outcomes can win or lose. Stake responsibly.
          </span>
        </div>
        <div className="flex items-center gap-3 font-medium text-xs">
          <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
            🔞 25+ Only
          </span>
          <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-300">
            🚫 Not for School Children
          </span>
        </div>
      </div>
    </div>
  );
}
