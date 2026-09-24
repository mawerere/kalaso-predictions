"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Flame,
  TrendingUp,
  Radio,
  Package,
  Calculator,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  PhoneCall,
  Sparkles,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: Flame },
    { name: "Free Tips", href: "/tips", icon: TrendingUp },
    { name: "Packages", href: "/packages", icon: Package },
    { name: "Live Matches", href: "/live", icon: Radio, badge: "LIVE" },
    { name: "Odds Calculator", href: "/calculator", icon: Calculator },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Dynamic Top Marquee Ticker */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 overflow-hidden border-b border-slate-800">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          <span className="flex items-center gap-1.5 text-teal-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> KALASO PREDICTIONS
          </span>
          <span className="text-slate-300">
            ⚽ 88.4% Recent Win Rate on Banker Tips
          </span>
          <span className="text-emerald-400 font-semibold">
            🟢 Today's Free Football Tips Are Updated
          </span>
          <span className="text-amber-400">
            ⚠️ 25+ Only • Stake Responsibly • Games Can Win Or Lose
          </span>
          <span className="text-slate-300">
            📞 WhatsApp Teddy: +256 745 090955
          </span>
          <span className="text-teal-400 font-medium">
            🏆 Katambula & High Stakers Packages Available
          </span>
          {/* Duplicate set for seamless loop */}
          <span className="flex items-center gap-1.5 text-teal-400 font-medium">
            <Sparkles className="w-3.5 h-3.5" /> KALASO PREDICTIONS
          </span>
          <span className="text-slate-300">
            ⚽ 88.4% Recent Win Rate on Banker Tips
          </span>
          <span className="text-emerald-400 font-semibold">
            🟢 Today's Free Football Tips Are Updated
          </span>
          <span className="text-amber-400">
            ⚠️ 25+ Only • Stake Responsibly • Games Can Win Or Lose
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-black text-xl tracking-tight">K</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 flex items-center gap-1">
                  KALASO <span className="text-teal-600 font-black">PREDICTIONS</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
                  Free Football Tips
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      active
                        ? "bg-teal-50 text-teal-700 border border-teal-200 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? "text-teal-600" : "text-slate-400"}`} />
                    {link.name}
                    {link.badge && (
                      <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full animate-pulse">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User Auth Action & Profile */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isActive("/profile")
                        ? "bg-teal-600 text-white"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>{user.name.split(" ")[0]}</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm shadow-teal-600/30 transition-all transform hover:-translate-y-0.5"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              {user ? (
                <Link
                  href="/profile"
                  className="p-2 text-slate-700 bg-slate-100 rounded-lg"
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1.5 rounded-lg"
                >
                  Log In
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-800" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                    active
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-teal-600" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard / Profile ({user.name})</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 text-sm font-bold text-white bg-teal-600 rounded-lg shadow-sm"
                  >
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile Bottom Navigation for Fast Browsing */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 flex items-center justify-around shadow-lg">
        <Link
          href="/"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            isActive("/") ? "text-teal-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Flame className="w-5 h-5 mb-0.5" />
          <span>Home</span>
        </Link>
        <Link
          href="/tips"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            isActive("/tips") ? "text-teal-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <TrendingUp className="w-5 h-5 mb-0.5" />
          <span>Free Tips</span>
        </Link>
        <Link
          href="/packages"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            isActive("/packages") ? "text-teal-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span>Packages</span>
        </Link>
        <Link
          href="/live"
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors relative ${
            isActive("/live") ? "text-teal-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Radio className="w-5 h-5 mb-0.5 text-rose-500" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          <span>Live</span>
        </Link>
        <Link
          href={user ? "/profile" : "/login"}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold transition-colors ${
            isActive("/profile") || isActive("/login") ? "text-teal-600 font-bold" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>{user ? "Profile" : "Login"}</span>
        </Link>
      </div>
    </>
  );
}
