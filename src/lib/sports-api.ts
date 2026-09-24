export interface MatchSearchResult {
  id: string | number;
  league: string;
  leagueCountry?: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  matchDate: string;
  matchTime: string;
  status: "SCHEDULED" | "LIVE" | "HT" | "FT" | "POSTPONED" | "CANCELLED";
  matchMinute?: string;
  source: "api-football" | "curated-provider";
}

export interface ISportsDataProvider {
  searchMatches(query: string): Promise<MatchSearchResult[]>;
  getLiveMatches(): Promise<MatchSearchResult[]>;
}

/**
 * Standard API-Football V3 implementation
 */
export class ApiFootballProvider implements ISportsDataProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl?: string) {
    this.apiKey = apiKey || process.env.SPORTS_API_KEY || "";
    this.baseUrl = baseUrl || process.env.SPORTS_API_URL || "https://v3.football.api-sports.io";
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.trim().length > 5);
  }

  async searchMatches(query: string): Promise<MatchSearchResult[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      // API-Football endpoint for fixtures with search / teams
      const today = new Date().toISOString().split("T")[0];
      const url = `${this.baseUrl}/fixtures?date=${today}&search=${encodeURIComponent(query)}`;
      
      const res = await fetch(url, {
        headers: {
          "x-apisports-key": this.apiKey,
          "x-rapidapi-key": this.apiKey,
          Accept: "application/json",
        },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.warn(`API-Football request failed: ${res.status}`);
        return [];
      }

      const data = await res.json();
      if (!data.response || !Array.isArray(data.response)) {
        return [];
      }

      return data.response.map((item: any): MatchSearchResult => {
        const fixture = item.fixture || {};
        const teams = item.teams || {};
        const goals = item.goals || {};
        const league = item.league || {};
        const statusShort = fixture.status?.short || "NS";

        let status: MatchSearchResult["status"] = "SCHEDULED";
        if (["1H", "2H", "ET", "P", "LIVE"].includes(statusShort)) status = "LIVE";
        else if (statusShort === "HT") status = "HT";
        else if (["FT", "AET", "PEN"].includes(statusShort)) status = "FT";
        else if (["PST", "POST"].includes(statusShort)) status = "POSTPONED";
        else if (["CANC", "ABD"].includes(statusShort)) status = "CANCELLED";

        const matchDateObj = new Date(fixture.date || Date.now());
        const matchDate = matchDateObj.toISOString().split("T")[0];
        const matchTime = matchDateObj.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

        return {
          id: fixture.id || Math.random().toString(),
          league: `${league.name || "League"} (${league.country || "Int"})`,
          leagueCountry: league.country,
          homeTeam: teams.home?.name || "Home Team",
          awayTeam: teams.away?.name || "Away Team",
          homeScore: goals.home !== null ? goals.home : null,
          awayScore: goals.away !== null ? goals.away : null,
          matchDate,
          matchTime,
          status,
          matchMinute: fixture.status?.elapsed ? `${fixture.status.elapsed}'` : undefined,
          source: "api-football",
        };
      });
    } catch (err) {
      console.error("API-Football search error:", err);
      return [];
    }
  }

  async getLiveMatches(): Promise<MatchSearchResult[]> {
    if (!this.isConfigured()) {
      return [];
    }

    try {
      const url = `${this.baseUrl}/fixtures?live=all`;
      const res = await fetch(url, {
        headers: {
          "x-apisports-key": this.apiKey,
          "x-rapidapi-key": this.apiKey,
        },
        next: { revalidate: 30 },
      });

      if (!res.ok) return [];
      const data = await res.json();
      if (!data.response) return [];

      return data.response.map((item: any): MatchSearchResult => {
        const fixture = item.fixture || {};
        const teams = item.teams || {};
        const goals = item.goals || {};
        const league = item.league || {};

        return {
          id: fixture.id,
          league: `${league.name} - ${league.country}`,
          homeTeam: teams.home?.name,
          awayTeam: teams.away?.name,
          homeScore: goals.home ?? 0,
          awayScore: goals.away ?? 0,
          matchDate: new Date(fixture.date).toISOString().split("T")[0],
          matchTime: new Date(fixture.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
          status: "LIVE",
          matchMinute: fixture.status?.elapsed ? `${fixture.status.elapsed}'` : "LIVE",
          source: "api-football",
        };
      });
    } catch (err) {
      console.error("Live fetch error:", err);
      return [];
    }
  }
}

/**
 * Fallback & Curated Fixtures Provider
 * Contains rich real-world football fixtures (EPL, Champions League, La Liga, Serie A, AFCON, Ugandan Super League, etc.)
 * Ensures the admin prediction-entry screen and autocomplete works seamlessly even without an external API key or when offline.
 */
export class CuratedSportsProvider implements ISportsDataProvider {
  private curatedFixtures: MatchSearchResult[] = [
    {
      id: "fx-101",
      league: "English Premier League",
      leagueCountry: "England",
      homeTeam: "Arsenal",
      awayTeam: "Chelsea",
      homeScore: 2,
      awayScore: 1,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "19:30",
      status: "LIVE",
      matchMinute: "67'",
      source: "curated-provider",
    },
    {
      id: "fx-102",
      league: "UEFA Champions League",
      leagueCountry: "Europe",
      homeTeam: "Real Madrid",
      awayTeam: "Manchester City",
      homeScore: null,
      awayScore: null,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "21:00",
      status: "SCHEDULED",
      source: "curated-provider",
    },
    {
      id: "fx-103",
      league: "La Liga",
      leagueCountry: "Spain",
      homeTeam: "Barcelona",
      awayTeam: "Atletico Madrid",
      homeScore: 3,
      awayScore: 0,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "20:00",
      status: "LIVE",
      matchMinute: "82'",
      source: "curated-provider",
    },
    {
      id: "fx-104",
      league: "Italian Serie A",
      leagueCountry: "Italy",
      homeTeam: "Inter Milan",
      awayTeam: "Juventus",
      homeScore: 1,
      awayScore: 0,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "18:45",
      status: "HT",
      matchMinute: "HT",
      source: "curated-provider",
    },
    {
      id: "fx-105",
      league: "German Bundesliga",
      leagueCountry: "Germany",
      homeTeam: "Bayern Munich",
      awayTeam: "Borussia Dortmund",
      homeScore: null,
      awayScore: null,
      matchDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      matchTime: "17:30",
      status: "SCHEDULED",
      source: "curated-provider",
    },
    {
      id: "fx-106",
      league: "English Premier League",
      leagueCountry: "England",
      homeTeam: "Liverpool",
      awayTeam: "Tottenham Hotspur",
      homeScore: null,
      awayScore: null,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "20:30",
      status: "SCHEDULED",
      source: "curated-provider",
    },
    {
      id: "fx-107",
      league: "Uganda Premier League",
      leagueCountry: "Uganda",
      homeTeam: "Vipers SC",
      awayTeam: "KCCA FC",
      homeScore: 1,
      awayScore: 1,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "16:00",
      status: "LIVE",
      matchMinute: "54'",
      source: "curated-provider",
    },
    {
      id: "fx-108",
      league: "French Ligue 1",
      leagueCountry: "France",
      homeTeam: "Paris Saint-Germain",
      awayTeam: "Marseille",
      homeScore: 2,
      awayScore: 0,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "21:45",
      status: "SCHEDULED",
      source: "curated-provider",
    },
    {
      id: "fx-109",
      league: "UEFA Champions League",
      leagueCountry: "Europe",
      homeTeam: "Aston Villa",
      awayTeam: "RB Leipzig",
      homeScore: 2,
      awayScore: 1,
      matchDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
      matchTime: "21:00",
      status: "FT",
      matchMinute: "FT",
      source: "curated-provider",
    },
    {
      id: "fx-110",
      league: "CAF Champions League",
      leagueCountry: "Africa",
      homeTeam: "Al Ahly",
      awayTeam: "Mamelodi Sundowns",
      homeScore: 0,
      awayScore: 0,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "19:00",
      status: "LIVE",
      matchMinute: "33'",
      source: "curated-provider",
    },
    {
      id: "fx-111",
      league: "English Premier League",
      leagueCountry: "England",
      homeTeam: "Manchester United",
      awayTeam: "Newcastle United",
      homeScore: null,
      awayScore: null,
      matchDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      matchTime: "16:00",
      status: "SCHEDULED",
      source: "curated-provider",
    },
    {
      id: "fx-112",
      league: "Spanish Copa del Rey",
      leagueCountry: "Spain",
      homeTeam: "Sevilla",
      awayTeam: "Real Betis",
      homeScore: null,
      awayScore: null,
      matchDate: new Date().toISOString().split("T")[0],
      matchTime: "21:15",
      status: "SCHEDULED",
      source: "curated-provider",
    },
  ];

  async searchMatches(query: string): Promise<MatchSearchResult[]> {
    if (!query || query.trim().length === 0) {
      return this.curatedFixtures.slice(0, 8);
    }
    const q = query.toLowerCase().trim();
    return this.curatedFixtures.filter(
      (m) =>
        m.homeTeam.toLowerCase().includes(q) ||
        m.awayTeam.toLowerCase().includes(q) ||
        m.league.toLowerCase().includes(q) ||
        (m.leagueCountry && m.leagueCountry.toLowerCase().includes(q))
    );
  }

  async getLiveMatches(): Promise<MatchSearchResult[]> {
    return this.curatedFixtures.filter((m) => m.status === "LIVE" || m.status === "HT");
  }
}

/**
 * Unified SportsDataService abstraction
 */
export class SportsDataService {
  private apiProvider: ApiFootballProvider;
  private fallbackProvider: CuratedSportsProvider;

  constructor() {
    this.apiProvider = new ApiFootballProvider();
    this.fallbackProvider = new CuratedSportsProvider();
  }

  async searchMatches(query: string): Promise<MatchSearchResult[]> {
    // Attempt API-Football first if configured
    if (this.apiProvider.isConfigured()) {
      try {
        const liveResults = await this.apiProvider.searchMatches(query);
        if (liveResults && liveResults.length > 0) {
          return liveResults;
        }
      } catch (e) {
        console.warn("API provider lookup failed, switching to curated provider:", e);
      }
    }

    // Fail-soft to curated provider
    return this.fallbackProvider.searchMatches(query);
  }

  async getLiveMatches(): Promise<MatchSearchResult[]> {
    if (this.apiProvider.isConfigured()) {
      try {
        const liveResults = await this.apiProvider.getLiveMatches();
        if (liveResults && liveResults.length > 0) {
          return liveResults;
        }
      } catch (e) {
        console.warn("Live API provider failed, fallback to curated:", e);
      }
    }

    return this.fallbackProvider.getLiveMatches();
  }
}

export const sportsDataService = new SportsDataService();
