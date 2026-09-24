"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldAlert,
  Users,
  TrendingUp,
  Radio,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Edit,
  Save,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  UserCheck,
  UserX,
  History,
  Settings,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  RefreshCw,
  Award,
} from "lucide-react";
import { MatchSearchResult } from "@/lib/sports-api";
import { Prediction, LiveMatch } from "@/db/schema";

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"overview" | "predictions" | "live" | "users" | "audit" | "settings">("overview");

  // Dashboard Stats
  const [stats, setStats] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  // Predictions
  const [predictionsList, setPredictionsList] = useState<Prediction[]>([]);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [editingPred, setEditingPred] = useState<Prediction | null>(null);

  // Prediction Form State
  const [formLeague, setFormLeague] = useState("");
  const [formHomeTeam, setFormHomeTeam] = useState("");
  const [formAwayTeam, setFormAwayTeam] = useState("");
  const [formPrediction, setFormPrediction] = useState("");
  const [formOdds, setFormOdds] = useState("1.85");
  const [formMatchDate, setFormMatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [formMatchTime, setFormMatchTime] = useState("20:00");
  const [formStatus, setFormStatus] = useState("SCHEDULED");
  const [formResult, setFormResult] = useState("PENDING");
  const [formCorrectScore, setFormCorrectScore] = useState("");
  const [formConfidence, setFormConfidence] = useState(88);
  const [formCategory, setFormCategory] = useState("FREE_TIP");
  const [formNotes, setFormNotes] = useState("");
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Sports API Autocomplete Search State
  const [searchApiQuery, setSearchApiQuery] = useState("");
  const [apiSearchResults, setApiSearchResults] = useState<MatchSearchResult[]>([]);
  const [searchingApi, setSearchingApi] = useState(false);

  // Users State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [searchUserQuery, setSearchUserQuery] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Live Matches State
  const [liveList, setLiveList] = useState<LiveMatch[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);
  const [liveFormLeague, setLiveFormLeague] = useState("");
  const [liveFormHome, setLiveFormHome] = useState("");
  const [liveFormAway, setLiveFormAway] = useState("");
  const [liveFormHomeScore, setLiveFormHomeScore] = useState(0);
  const [liveFormAwayScore, setLiveFormAwayScore] = useState(0);
  const [liveFormMinute, setLiveFormMinute] = useState("1'");
  const [liveFormStatus, setLiveFormStatus] = useState("LIVE");
  const [liveFormTip, setLiveFormTip] = useState("");
  const [liveFormOdds, setLiveFormOdds] = useState("1.85");
  const [liveFormCommentary, setLiveFormCommentary] = useState("");

  // Audit Logs & Settings
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [settingsMap, setSettingsMap] = useState<Record<string, string>>({});
  const [tickerText, setTickerText] = useState("");
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showNotification = (msg: string, type: "success" | "error" = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const getAuthHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("kalaso_token") : token;
    if (storedToken) {
      headers["Authorization"] = `Bearer ${storedToken}`;
    }
    return headers;
  };

  // Auth Guard: Only SUPER_ADMIN allowed
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "SUPER_ADMIN") {
        router.push("/profile");
      }
    }
  }, [user, isLoading, router]);

  // Load Dashboard Overview Data
  const fetchDashboardData = async () => {
    try {
      setLoadingDashboard(true);
      const res = await fetch("/api/admin/dashboard", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        if (data.recentPredictions) setPredictionsList(data.recentPredictions);
        if (data.recentUsers) setUsersList(data.recentUsers);
        if (data.recentLogs) setAuditLogs(data.recentLogs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDashboard(false);
    }
  };

  // Load All Predictions
  const fetchPredictions = async () => {
    try {
      setLoadingPredictions(true);
      const res = await fetch("/api/admin/predictions", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPredictionsList(data.predictions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPredictions(false);
    }
  };

  // Load Users
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const url = searchUserQuery ? `/api/admin/users?search=${encodeURIComponent(searchUserQuery)}` : "/api/admin/users";
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsersList(data.users || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Load Live Matches
  const fetchLiveMatches = async () => {
    try {
      setLoadingLive(true);
      const res = await fetch("/api/admin/live-matches", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setLiveList(data.matches || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLive(false);
    }
  };

  // Load Audit Logs
  const fetchAuditLogs = async () => {
    try {
      const res = await fetch("/api/admin/audit-logs", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Load Settings
  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings", { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSettingsMap(data.settings || {});
        if (data.settings?.ticker_announcement) {
          setTickerText(data.settings.ticker_announcement);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user && user.role === "SUPER_ADMIN") {
      fetchDashboardData();
      fetchPredictions();
      fetchUsers();
      fetchLiveMatches();
      fetchAuditLogs();
      fetchSettings();
    }
  }, [user]);

  // Autocomplete search via API-Football
  const searchApiFootball = async (query: string) => {
    setSearchApiQuery(query);
    if (!query || query.trim().length < 2) {
      setApiSearchResults([]);
      return;
    }

    try {
      setSearchingApi(true);
      const res = await fetch(`/api/admin/matches/search?query=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setApiSearchResults(data.results || []);
      }
    } catch (e) {
      console.error("API search error:", e);
    } finally {
      setSearchingApi(false);
    }
  };

  const handleSelectApiMatch = (match: MatchSearchResult) => {
    setFormLeague(match.league);
    setFormHomeTeam(match.homeTeam);
    setFormAwayTeam(match.awayTeam);
    setFormMatchDate(match.matchDate);
    setFormMatchTime(match.matchTime);
    setFormStatus(match.status);
    if (match.homeScore !== null && match.awayScore !== null) {
      setFormCorrectScore(`${match.homeScore} - ${match.awayScore}`);
    }
    setApiSearchResults([]);
    setSearchApiQuery("");
    showNotification(`Auto-filled: ${match.homeTeam} vs ${match.awayTeam} (${match.league})!`);
  };

  // Create / Update Prediction
  const handleSavePrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        league: formLeague,
        homeTeam: formHomeTeam,
        awayTeam: formAwayTeam,
        prediction: formPrediction,
        odds: formOdds,
        matchDate: formMatchDate,
        matchTime: formMatchTime,
        status: formStatus,
        result: formResult,
        correctScore: formCorrectScore || null,
        confidence: formConfidence,
        category: formCategory,
        notes: formNotes || null,
        isFeatured: formIsFeatured,
      };

      let res;
      if (editingPred) {
        res = await fetch(`/api/admin/predictions/${editingPred.id}`, {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/predictions", {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        showNotification(data.error || "Failed to save prediction", "error");
        return;
      }

      showNotification(editingPred ? "Prediction updated!" : "Prediction published!");
      resetPredictionForm();
      fetchPredictions();
      fetchDashboardData();
    } catch (err: any) {
      showNotification(err.message || "An error occurred", "error");
    }
  };

  const resetPredictionForm = () => {
    setEditingPred(null);
    setFormLeague("");
    setFormHomeTeam("");
    setFormAwayTeam("");
    setFormPrediction("");
    setFormOdds("1.85");
    setFormMatchDate(new Date().toISOString().split("T")[0]);
    setFormMatchTime("20:00");
    setFormStatus("SCHEDULED");
    setFormResult("PENDING");
    setFormCorrectScore("");
    setFormConfidence(88);
    setFormCategory("FREE_TIP");
    setFormNotes("");
    setFormIsFeatured(false);
  };

  const handleEditClick = (pred: Prediction) => {
    setEditingPred(pred);
    setFormLeague(pred.league);
    setFormHomeTeam(pred.homeTeam);
    setFormAwayTeam(pred.awayTeam);
    setFormPrediction(pred.prediction);
    setFormOdds(pred.odds);
    setFormMatchDate(pred.matchDate);
    setFormMatchTime(pred.matchTime);
    setFormStatus(pred.status);
    setFormResult(pred.result);
    setFormCorrectScore(pred.correctScore || "");
    setFormConfidence(pred.confidence || 85);
    setFormCategory(pred.category || "FREE_TIP");
    setFormNotes(pred.notes || "");
    setFormIsFeatured(pred.isFeatured);
    setActiveTab("predictions");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeletePrediction = async (id: number) => {
    if (!confirm("Are you sure you want to delete this prediction?")) return;
    try {
      const res = await fetch(`/api/admin/predictions/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showNotification("Prediction deleted!");
        fetchPredictions();
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick Result Marking (Won / Lost / Void / Pending)
  const handleMarkResult = async (id: number, result: "WON" | "LOST" | "VOID" | "PENDING") => {
    let score = prompt(`Enter final score for this match (e.g. 2 - 1) or leave empty:`, "");
    try {
      const res = await fetch(`/api/admin/predictions/${id}/result`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ result, correctScore: score }),
      });
      if (res.ok) {
        showNotification(`Prediction #${id} marked as ${result}!`);
        fetchPredictions();
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // User suspend / activate
  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    const action = currentStatus === "ACTIVE" ? "suspend" : "activate";
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/${action}`, {
        method: "PUT",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showNotification(`User has been ${action}d!`);
        fetchUsers();
        fetchDashboardData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Create Live Match
  const handleCreateLiveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/live-matches", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          league: liveFormLeague,
          homeTeam: liveFormHome,
          awayTeam: liveFormAway,
          homeScore: liveFormHomeScore,
          awayScore: liveFormAwayScore,
          matchMinute: liveFormMinute,
          status: liveFormStatus,
          matchDate: new Date().toISOString().split("T")[0],
          matchTime: "LIVE",
          predictionText: liveFormTip || null,
          odds: liveFormOdds || null,
          liveCommentary: liveFormCommentary || null,
          isPublished: true,
        }),
      });

      if (res.ok) {
        showNotification("Live match published!");
        setLiveFormLeague("");
        setLiveFormHome("");
        setLiveFormAway("");
        setLiveFormHomeScore(0);
        setLiveFormAwayScore(0);
        setLiveFormMinute("1'");
        setLiveFormTip("");
        setLiveFormCommentary("");
        fetchLiveMatches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLiveScore = async (matchId: number, home: number, away: number, minute: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/live-matches/${matchId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          homeScore: home,
          awayScore: away,
          matchMinute: minute,
          status,
        }),
      });
      if (res.ok) {
        showNotification("Score updated!");
        fetchLiveMatches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLiveMatch = async (matchId: number) => {
    if (!confirm("Delete live match?")) return;
    try {
      const res = await fetch(`/api/admin/live-matches/${matchId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        showNotification("Live match deleted!");
        fetchLiveMatches();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ticker_announcement: tickerText,
        }),
      });
      if (res.ok) {
        showNotification("Settings updated successfully!");
        fetchSettings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading || !user || user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-400">Verifying Super Admin Authorization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      {/* Super Admin Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center font-black text-white text-lg shadow-md">
              👑
            </div>
            <div>
              <h1 className="font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
                KALASO <span className="text-teal-400">SUPER ADMIN</span>
              </h1>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Full System Administration Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 hidden sm:inline">
              Admin: <strong className="text-teal-400">{user.email}</strong>
            </span>
            <button
              onClick={() => {
                fetchDashboardData();
                fetchPredictions();
                fetchLiveMatches();
                fetchUsers();
                showNotification("Refreshed all data!");
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-teal-400 rounded-lg border border-slate-700 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2 border-t border-slate-800/80">
          {[
            { id: "overview", label: "Dashboard Overview", icon: Award },
            { id: "predictions", label: `Predictions (${predictionsList.length})`, icon: TrendingUp },
            { id: "live", label: `Live Matches (${liveList.length})`, icon: Radio },
            { id: "users", label: `Users (${usersList.length})`, icon: Users },
            { id: "audit", label: "Audit Logs", icon: History },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce ${
            notification.type === "success"
              ? "bg-emerald-600 text-white border border-emerald-400"
              : "bg-rose-600 text-white border border-rose-400"
          }`}
        >
          {notification.type === "success" ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">Total Users</span>
                <span className="text-2xl font-black text-white">{stats?.totalUsers ?? usersList.length}</span>
                <span className="text-[10px] text-teal-400 block mt-1">Active: {stats?.activeUsers ?? 0}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">Predictions</span>
                <span className="text-2xl font-black text-teal-400">{stats?.totalPredictions ?? predictionsList.length}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Win Rate: {stats?.winRate ?? 88}%</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">Won Picks</span>
                <span className="text-2xl font-black text-emerald-400">{stats?.wonPredictions ?? 0}</span>
                <span className="text-[10px] text-emerald-400/80 block mt-1">Verified hits</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">Pending</span>
                <span className="text-2xl font-black text-amber-400">{stats?.pendingPredictions ?? 0}</span>
                <span className="text-[10px] text-amber-400/80 block mt-1">Awaiting results</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">Lost Picks</span>
                <span className="text-2xl font-black text-slate-400">{stats?.lostPredictions ?? 0}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Transparent log</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-xs font-semibold text-slate-400 block">Live Matches</span>
                <span className="text-2xl font-black text-rose-400">{stats?.totalLiveMatches ?? liveList.length}</span>
                <span className="text-[10px] text-rose-400/80 block mt-1">Real-time tracker</span>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Prediction Creator Shortcut */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                    Quick Publish Tips
                  </h3>
                  <button
                    onClick={() => setActiveTab("predictions")}
                    className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1"
                  >
                    <span>Full Editor</span> <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Use our live API-Football match finder to search matches and auto-fill league, home team, away team, time, and score in seconds.
                </p>
                <button
                  onClick={() => {
                    resetPredictionForm();
                    setActiveTab("predictions");
                  }}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create New Prediction
                </button>
              </div>

              {/* Manager & WhatsApp Contact info */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-3">
                <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  Kalaso Live System Status
                </h3>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between p-2 rounded bg-slate-800/80">
                    <span className="text-slate-400">Database:</span>
                    <span className="text-emerald-400 font-bold">PostgreSQL / Supabase Ready</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/80">
                    <span className="text-slate-400">Sports API Provider:</span>
                    <span className="text-teal-400 font-bold">API-Football (Fail-soft fallback enabled)</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-slate-800/80">
                    <span className="text-slate-400">Official WhatsApp:</span>
                    <span className="text-amber-400 font-bold">0745090955 (Teddy)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Predictions Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-base">Recent Predictions ({predictionsList.slice(0, 5).length})</h3>
                <button
                  onClick={() => setActiveTab("predictions")}
                  className="text-xs font-bold text-teal-400 hover:underline"
                >
                  View All ({predictionsList.length})
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3">Match</th>
                      <th className="pb-3">League</th>
                      <th className="pb-3">Prediction</th>
                      <th className="pb-3">Odds</th>
                      <th className="pb-3">Result</th>
                      <th className="pb-3 text-right">Quick Mark</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {predictionsList.slice(0, 5).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 font-bold text-white">
                          {p.homeTeam} vs {p.awayTeam}
                        </td>
                        <td className="py-3 text-slate-400">{p.league}</td>
                        <td className="py-3 font-semibold text-teal-300">{p.prediction}</td>
                        <td className="py-3 font-black text-white">{p.odds}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              p.result === "WON"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : p.result === "LOST"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            }`}
                          >
                            {p.result}
                          </span>
                        </td>
                        <td className="py-3 text-right space-x-1">
                          <button
                            onClick={() => handleMarkResult(p.id, "WON")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Won
                          </button>
                          <button
                            onClick={() => handleMarkResult(p.id, "LOST")}
                            className="bg-slate-700 hover:bg-rose-600 text-white px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Lost
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: PREDICTIONS CREATOR & MANAGER ================= */}
        {activeTab === "predictions" && (
          <div className="space-y-6">
            {/* Prediction Editor / Form Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                    {editingPred ? <Edit className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base sm:text-lg">
                      {editingPred ? `Edit Prediction #${editingPred.id}` : "Publish New Free Football Prediction"}
                    </h3>
                    <span className="text-xs text-slate-400">
                      Auto-fill via API-Football search or type manually.
                    </span>
                  </div>
                </div>

                {editingPred && (
                  <button
                    onClick={resetPredictionForm}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {/* Live Match Search / Auto-Fill Box (API-Football) */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    API-Football Live Match Search & Auto-Fill
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Type a team (e.g. Arsenal, Real Madrid, Chelsea, Vipers)
                  </span>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search fixture by team name to auto-populate match info..."
                    value={searchApiQuery}
                    onChange={(e) => searchApiFootball(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm pl-4 pr-10 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {searchingApi && (
                    <RefreshCw className="w-4 h-4 text-teal-400 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Search Results Dropdown */}
                {apiSearchResults.length > 0 && (
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-2 space-y-1.5 max-h-60 overflow-y-auto">
                    <span className="text-[10px] font-bold text-slate-400 px-2 block">
                      Found {apiSearchResults.length} Fixtures (Click to Auto-Fill):
                    </span>
                    {apiSearchResults.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => handleSelectApiMatch(m)}
                        className="w-full text-left p-2 rounded-lg bg-slate-800/80 hover:bg-teal-950 hover:border-teal-600 border border-slate-700 flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <div>
                          <strong className="text-white">
                            {m.homeTeam} vs {m.awayTeam}
                          </strong>
                          <span className="text-slate-400 block text-[10px]">
                            {m.league} • {m.matchDate} at {m.matchTime}
                          </span>
                        </div>
                        <span className="bg-teal-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">
                          {m.status}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Prediction Entry Form */}
              <form onSubmit={handleSavePrediction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      League / Competition *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. English Premier League"
                      value={formLeague}
                      onChange={(e) => setFormLeague(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Home Team *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arsenal"
                      value={formHomeTeam}
                      onChange={(e) => setFormHomeTeam(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Away Team *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chelsea"
                      value={formAwayTeam}
                      onChange={(e) => setFormAwayTeam(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Recommended Prediction *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arsenal Win & Over 1.5 Goals"
                      value={formPrediction}
                      onChange={(e) => setFormPrediction(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl focus:ring-2 focus:ring-teal-500 font-semibold text-teal-300"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Odds *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1.85"
                      value={formOdds}
                      onChange={(e) => setFormOdds(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl focus:ring-2 focus:ring-teal-500 font-black text-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Confidence (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={formConfidence}
                      onChange={(e) => setFormConfidence(parseInt(e.target.value, 10) || 85)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Match Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formMatchDate}
                      onChange={(e) => setFormMatchDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Match Time *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 20:00"
                      value={formMatchTime}
                      onChange={(e) => setFormMatchTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Status
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl"
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="LIVE">LIVE</option>
                      <option value="FINISHED">FINISHED</option>
                      <option value="POSTPONED">POSTPONED</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Result
                    </label>
                    <select
                      value={formResult}
                      onChange={(e) => setFormResult(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl font-bold"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="WON">WON ✅</option>
                      <option value="LOST">LOST ❌</option>
                      <option value="VOID">VOID ⚪</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl"
                    >
                      <option value="FREE_TIP">Standard Free Tip</option>
                      <option value="BANKER_OF_THE_DAY">🔥 Banker of the Day</option>
                      <option value="SUPER_ODD">⚡ Super Odd</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Correct Score (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2 - 1"
                      value={formCorrectScore}
                      onChange={(e) => setFormCorrectScore(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <label className="flex items-center gap-2 text-xs text-slate-300 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formIsFeatured}
                        onChange={(e) => setFormIsFeatured(e.target.checked)}
                        className="rounded text-teal-500 focus:ring-teal-500"
                      />
                      <span>Featured on Landing Hero</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Tipster Analysis & Insights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short analytical justification (e.g. Arsenal have won 5 home derbies, Chelsea missing key center-back)..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-2.5 rounded-xl"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md shadow-teal-600/30 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {editingPred ? "Save Changes" : "Publish Prediction"}
                  </button>
                </div>
              </form>
            </div>

            {/* All Predictions Management Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-extrabold text-white text-base">
                  Published Free Predictions ({predictionsList.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="pb-3">ID</th>
                      <th className="pb-3">Match</th>
                      <th className="pb-3">League</th>
                      <th className="pb-3">Prediction</th>
                      <th className="pb-3">Odds</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Result</th>
                      <th className="pb-3 text-center">1-Click Result Update</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {predictionsList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 text-slate-500 font-mono">#{p.id}</td>
                        <td className="py-3 font-bold text-white">
                          {p.homeTeam} vs {p.awayTeam}
                        </td>
                        <td className="py-3 text-slate-400 truncate max-w-[140px]">{p.league}</td>
                        <td className="py-3 font-semibold text-teal-300">{p.prediction}</td>
                        <td className="py-3 font-black text-amber-400">{p.odds}</td>
                        <td className="py-3 text-slate-400">{p.matchDate}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              p.result === "WON"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                : p.result === "LOST"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                                : p.result === "VOID"
                                ? "bg-slate-700 text-slate-300"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            }`}
                          >
                            {p.result}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                            <button
                              onClick={() => handleMarkResult(p.id, "WON")}
                              className="px-2 py-0.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-[10px] font-bold"
                              title="Mark WON"
                            >
                              WON
                            </button>
                            <button
                              onClick={() => handleMarkResult(p.id, "LOST")}
                              className="px-2 py-0.5 bg-rose-700 hover:bg-rose-600 text-white rounded text-[10px] font-bold"
                              title="Mark LOST"
                            >
                              LOST
                            </button>
                            <button
                              onClick={() => handleMarkResult(p.id, "VOID")}
                              className="px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-[10px] font-bold"
                              title="Mark VOID"
                            >
                              VOID
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-right space-x-1">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="p-1.5 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePrediction(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: LIVE MATCHES MANAGER ================= */}
        {activeTab === "live" && (
          <div className="space-y-6">
            {/* Create Live Match */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-500" />
                Publish Live Match & Scores
              </h3>
              <form onSubmit={handleCreateLiveMatch} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="League (e.g. Premier League)"
                  value={liveFormLeague}
                  onChange={(e) => setLiveFormLeague(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="Home Team"
                  value={liveFormHome}
                  onChange={(e) => setLiveFormHome(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="Away Team"
                  value={liveFormAway}
                  onChange={(e) => setLiveFormAway(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Home"
                    value={liveFormHomeScore}
                    onChange={(e) => setLiveFormHomeScore(parseInt(e.target.value, 10) || 0)}
                    className="w-16 bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl font-bold"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Away"
                    value={liveFormAwayScore}
                    onChange={(e) => setLiveFormAwayScore(parseInt(e.target.value, 10) || 0)}
                    className="w-16 bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl font-bold"
                  />
                  <input
                    type="text"
                    placeholder="Minute (e.g. 65')"
                    value={liveFormMinute}
                    onChange={(e) => setLiveFormMinute(e.target.value)}
                    className="w-20 bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Linked Kalaso Tip (e.g. Over 2.5 Goals)"
                  value={liveFormTip}
                  onChange={(e) => setLiveFormTip(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl sm:col-span-2"
                />
                <input
                  type="text"
                  placeholder="Live commentary / goal alert"
                  value={liveFormCommentary}
                  onChange={(e) => setLiveFormCommentary(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs p-2.5 rounded-xl"
                />
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs p-2.5 rounded-xl"
                >
                  Publish Live Match
                </button>
              </form>
            </div>

            {/* Live Matches List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <h3 className="font-extrabold text-white text-base">Active Live Matches ({liveList.length})</h3>
              <div className="space-y-3">
                {liveList.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block">{m.league}</span>
                      <h4 className="font-extrabold text-white text-sm sm:text-base">
                        {m.homeTeam} <span className="text-teal-400 font-black">{m.homeScore} - {m.awayScore}</span> {m.awayTeam}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span className="text-rose-400 font-bold">{m.matchMinute}</span>
                        <span>•</span>
                        <span>Status: {m.status}</span>
                        {m.predictionText && (
                          <>
                            <span>•</span>
                            <span className="text-teal-300">Tip: {m.predictionText}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick score buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateLiveScore(m.id, m.homeScore + 1, m.awayScore, m.matchMinute, m.status)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-teal-700 text-white rounded text-xs font-bold"
                      >
                        +1 Home
                      </button>
                      <button
                        onClick={() => handleUpdateLiveScore(m.id, m.homeScore, m.awayScore + 1, m.matchMinute, m.status)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-teal-700 text-white rounded text-xs font-bold"
                      >
                        +1 Away
                      </button>
                      <button
                        onClick={() => {
                          const min = prompt("Enter new minute:", m.matchMinute);
                          if (min) handleUpdateLiveScore(m.id, m.homeScore, m.awayScore, min, m.status);
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-bold"
                      >
                        Set Min
                      </button>
                      <button
                        onClick={() => handleUpdateLiveScore(m.id, m.homeScore, m.awayScore, "FT", "FT")}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-amber-600 text-white rounded text-xs font-bold"
                      >
                        FT
                      </button>
                      <button
                        onClick={() => handleDeleteLiveMatch(m.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: USERS MANAGEMENT ================= */}
        {activeTab === "users" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-extrabold text-white text-base">Registered Users ({usersList.length})</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search user by name, email, phone..."
                  value={searchUserQuery}
                  onChange={(e) => setSearchUserQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs px-3 py-1.5 rounded-lg w-64"
                />
                <button
                  onClick={fetchUsers}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-3">ID</th>
                    <th className="pb-3">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Phone</th>
                    <th className="pb-3">Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 text-slate-500 font-mono">#{u.id}</td>
                      <td className="py-3 font-bold text-white">{u.name}</td>
                      <td className="py-3 text-slate-300">{u.email}</td>
                      <td className="py-3 text-teal-400 font-medium">{u.phone}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            u.role === "SUPER_ADMIN" ? "bg-amber-500/20 text-amber-300" : "bg-slate-800 text-slate-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {u.role !== "SUPER_ADMIN" && (
                          <button
                            onClick={() => handleToggleUserStatus(u.id, u.status)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors ${
                              u.status === "ACTIVE"
                                ? "bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800"
                                : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800"
                            }`}
                          >
                            {u.status === "ACTIVE" ? "Suspend" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 5: AUDIT LOGS ================= */}
        {activeTab === "audit" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-white text-base">Security & Administrative Activity Logs</h3>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between gap-4">
                  <div>
                    <span className="font-bold text-teal-400">{log.action}</span>
                    <p className="text-slate-300 mt-0.5">{log.details}</p>
                    <span className="text-[10px] text-slate-500 block">User: {log.userEmail || "System"}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SETTINGS ================= */}
        {activeTab === "settings" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <h3 className="font-extrabold text-white text-base">System Announcements & Configuration</h3>
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Marquee Ticker Announcement Text
                </label>
                <input
                  type="text"
                  value={tickerText}
                  onChange={(e) => setTickerText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm p-3 rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
