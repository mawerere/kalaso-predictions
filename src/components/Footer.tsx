import React from "react";
import Link from "next/link";
import { MessageCircle, ShieldAlert, Award, Phone, ExternalLink, Flame, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                K
              </div>
              <span className="font-black text-xl tracking-tight text-white">
                KALASO <span className="text-teal-400">PREDICTIONS</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Fast, motion-modern, mobile-friendly platform for publishing 100% free researched football betting tips. No subscription packages needed for our public feed — every registered fan enjoys the same verified picks.
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-400 font-semibold bg-teal-950/60 border border-teal-800/60 p-2.5 rounded-lg">
              <Award className="w-4 h-4 flex-shrink-0" />
              <span>Expert analytical research & tactical match previews</span>
            </div>
          </div>

          {/* Social Links & Support */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              Official Social Channels
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://wa.me/256745090955"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors border border-slate-700"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    WhatsApp: <span className="font-semibold text-emerald-400">0745090955 (Teddy)</span>
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://whatsapp.com/channel/0029VbBuWfjBqbrHcUdjiE36"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors border border-slate-700"
                >
                  <span>📢 Kalaso WhatsApp Channel</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </li>
              <li>
                <a
                  href="https://vt.tiktok.com/ZS4QWXTWs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-slate-200 transition-colors border border-slate-700"
                >
                  <span>🎵 TikTok: @KalasoPredictions</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </li>
              <li className="text-xs text-slate-400 pt-1">
                Alt WhatsApp: <span className="text-slate-300 font-medium">+256782534994</span>
              </li>
            </ul>
          </div>

          {/* Packages Quick Overview */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Special Packages
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300 bg-slate-800/70 p-3 rounded-lg border border-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-700/50">
                <span>Odd 10</span>
                <span className="text-teal-400 font-semibold">100k / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/50">
                <span>Odd 4</span>
                <span className="text-teal-400 font-semibold">80k / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/50">
                <span>Odd 3</span>
                <span className="text-teal-400 font-semibold">70k / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/50">
                <span>Odd 2</span>
                <span className="text-teal-400 font-semibold">60k / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/50">
                <span>High Stakers</span>
                <span className="text-amber-400 font-semibold">50k / mo</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/50">
                <span>Katambula Group</span>
                <span className="text-emerald-400 font-semibold">150k (2 mos)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-bold text-white">All Groups Pass</span>
                <span className="text-teal-300 font-bold">350k (3 mos)</span>
              </div>
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-teal-400 transition-colors">
                  Home Landing Page
                </Link>
              </li>
              <li>
                <Link href="/tips" className="hover:text-teal-400 transition-colors">
                  Daily Free Tips Feed
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-teal-400 transition-colors">
                  VIP Packages & Rates
                </Link>
              </li>
              <li>
                <Link href="/live" className="hover:text-teal-400 transition-colors">
                  Live Matches & Scores
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-teal-400 transition-colors">
                  Accumulator Odds Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Responsible Gambling Warning Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed mb-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300 mb-1">
                IMPORTANT DISCLAIMER & RESPONSIBLE GAMBLING POLICY:
              </p>
              <p className="mb-2">
                "These are researched games but not fixed, we just have a high percentage of winning but the game remains, can win or lose. Stake responsibly. These matches have only been researched and given maximum attention but can win or lose, stake responsibly."
              </p>
              <div className="flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="bg-amber-950/80 border border-amber-600/50 text-amber-300 px-2 py-0.5 rounded">
                  ⚠️ NOT FOR PERSONS BELOW 25 YEARS
                </span>
                <span className="bg-rose-950/80 border border-rose-600/50 text-rose-300 px-2 py-0.5 rounded">
                  🚫 NOT FOR SCHOOL CHILDREN
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                  ✅ 100% TRANSPARENT HISTORY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} KALASO PREDICTIONS. All rights reserved.</p>
          <p className="text-slate-400">
            Manager: <span className="text-white font-medium">Teddy</span> | WhatsApp: <span className="text-teal-400 font-medium">0745090955</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
