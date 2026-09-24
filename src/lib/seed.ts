import { db, pool } from "@/db";
import { users, predictions, liveMatches, systemSettings } from "@/db/schema";
import { hashPassword } from "./auth";
import { count } from "drizzle-orm";

export async function ensureDatabaseTablesAndSeed() {
  try {
    // Create tables if they do not exist (idempotent SQL)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'USER',
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS predictions (
        id SERIAL PRIMARY KEY,
        league TEXT NOT NULL,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        prediction TEXT NOT NULL,
        odds TEXT NOT NULL,
        match_date TEXT NOT NULL,
        match_time TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'SCHEDULED',
        result TEXT NOT NULL DEFAULT 'PENDING',
        correct_score TEXT,
        confidence INTEGER DEFAULT 85,
        category TEXT DEFAULT 'FREE_TIP',
        notes TEXT,
        is_featured BOOLEAN DEFAULT false NOT NULL,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS live_matches (
        id SERIAL PRIMARY KEY,
        league TEXT NOT NULL,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        home_score INTEGER NOT NULL DEFAULT 0,
        away_score INTEGER NOT NULL DEFAULT 0,
        match_minute TEXT NOT NULL DEFAULT '1''',
        status TEXT NOT NULL DEFAULT 'LIVE',
        match_date TEXT NOT NULL,
        match_time TEXT NOT NULL,
        prediction_id INTEGER REFERENCES predictions(id),
        prediction_text TEXT,
        odds TEXT,
        live_commentary TEXT,
        is_published BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_email TEXT,
        action TEXT NOT NULL,
        details TEXT,
        ip_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `);

    // Check if users exist
    const userCountResult = await db.select({ count: count() }).from(users);
    const userCount = Number(userCountResult[0]?.count || 0);

    let adminUser = null;

    if (userCount === 0) {
      const adminPassHash = await hashPassword("admin123");
      const userPassHash = await hashPassword("user123");

      const insertedUsers = await db
        .insert(users)
        .values([
          {
            name: "Kalaso Super Admin",
            email: "admin@kalaso.com",
            phone: "+256745090955",
            passwordHash: adminPassHash,
            role: "SUPER_ADMIN",
            status: "ACTIVE",
          },
          {
            name: "Teddy Kalaso",
            email: "teddy@kalaso.com",
            phone: "+256745090955",
            passwordHash: userPassHash,
            role: "USER",
            status: "ACTIVE",
          },
          {
            name: "Dennis Mukasa",
            email: "dennis@example.com",
            phone: "+256782534994",
            passwordHash: userPassHash,
            role: "USER",
            status: "ACTIVE",
          },
        ])
        .returning();

      adminUser = insertedUsers[0];
    }

    // Check predictions count
    const predCountResult = await db.select({ count: count() }).from(predictions);
    const predCount = Number(predCountResult[0]?.count || 0);

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    if (predCount === 0) {
      await db.insert(predictions).values([
        {
          league: "English Premier League",
          homeTeam: "Arsenal",
          awayTeam: "Chelsea",
          prediction: "Arsenal Win & Over 1.5 Goals",
          odds: "1.88",
          matchDate: todayStr,
          matchTime: "19:30",
          status: "LIVE",
          result: "PENDING",
          confidence: 92,
          category: "BANKER_OF_THE_DAY",
          notes: "Arsenal have scored 2+ in their last 5 home derbies. Excellent form.",
          isFeatured: true,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "La Liga",
          homeTeam: "Barcelona",
          awayTeam: "Atletico Madrid",
          prediction: "Over 2.5 Goals",
          odds: "1.75",
          matchDate: todayStr,
          matchTime: "20:00",
          status: "LIVE",
          result: "PENDING",
          confidence: 88,
          category: "FREE_TIP",
          notes: "Both sides have aggressive attacking metrics in recent weeks.",
          isFeatured: true,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "UEFA Champions League",
          homeTeam: "Real Madrid",
          awayTeam: "Manchester City",
          prediction: "Both Teams To Score (GG)",
          odds: "1.65",
          matchDate: todayStr,
          matchTime: "21:00",
          status: "SCHEDULED",
          result: "PENDING",
          confidence: 90,
          category: "FREE_TIP",
          notes: "High intensity European clash with elite forwards on both ends.",
          isFeatured: true,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "Uganda Premier League",
          homeTeam: "Vipers SC",
          awayTeam: "KCCA FC",
          prediction: "Home Win or Draw (1X)",
          odds: "1.45",
          matchDate: todayStr,
          matchTime: "16:00",
          status: "FINISHED",
          result: "WON",
          correctScore: "2 - 1",
          confidence: 86,
          category: "FREE_TIP",
          notes: "Vipers unbeaten at St. Mary's stadium in 8 consecutive league outings.",
          isFeatured: false,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "Italian Serie A",
          homeTeam: "Inter Milan",
          awayTeam: "Juventus",
          prediction: "Under 3.5 Goals",
          odds: "1.52",
          matchDate: yesterdayStr,
          matchTime: "20:45",
          status: "FINISHED",
          result: "WON",
          correctScore: "1 - 0",
          confidence: 89,
          category: "FREE_TIP",
          notes: "Tactical Derby d'Italia with tight defensive lines.",
          isFeatured: false,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "German Bundesliga",
          homeTeam: "Bayern Munich",
          awayTeam: "Borussia Dortmund",
          prediction: "Home Win & Over 2.5 Goals",
          odds: "1.92",
          matchDate: tomorrowStr,
          matchTime: "17:30",
          status: "SCHEDULED",
          result: "PENDING",
          confidence: 94,
          category: "SUPER_ODD",
          notes: "Der Klassiker with Bayern in red hot attacking rhythm.",
          isFeatured: true,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "French Ligue 1",
          homeTeam: "Paris Saint-Germain",
          awayTeam: "Marseille",
          prediction: "PSG To Win",
          odds: "1.58",
          matchDate: yesterdayStr,
          matchTime: "21:45",
          status: "FINISHED",
          result: "WON",
          correctScore: "3 - 1",
          confidence: 91,
          category: "FREE_TIP",
          notes: "Dominant PSG performance at Parc des Princes.",
          isFeatured: false,
          createdBy: adminUser ? adminUser.id : 1,
        },
        {
          league: "UEFA Champions League",
          homeTeam: "Aston Villa",
          awayTeam: "RB Leipzig",
          prediction: "Over 2.5 Goals",
          odds: "1.72",
          matchDate: yesterdayStr,
          matchTime: "21:00",
          status: "FINISHED",
          result: "WON",
          correctScore: "2 - 1",
          confidence: 87,
          category: "FREE_TIP",
          notes: "High tempo end to end European encounter.",
          isFeatured: false,
          createdBy: adminUser ? adminUser.id : 1,
        },
      ]);
    }

    // Check live matches count
    const liveCountResult = await db.select({ count: count() }).from(liveMatches);
    const liveCount = Number(liveCountResult[0]?.count || 0);

    if (liveCount === 0) {
      await db.insert(liveMatches).values([
        {
          league: "English Premier League",
          homeTeam: "Arsenal",
          awayTeam: "Chelsea",
          homeScore: 2,
          awayScore: 1,
          matchMinute: "68'",
          status: "LIVE",
          matchDate: todayStr,
          matchTime: "19:30",
          predictionText: "Arsenal Win & Over 1.5 Goals",
          odds: "1.88",
          liveCommentary: "Arsenal dominating possession. Saka tests the keeper from distance.",
          isPublished: true,
        },
        {
          league: "La Liga",
          homeTeam: "Barcelona",
          awayTeam: "Atletico Madrid",
          homeScore: 3,
          awayScore: 0,
          matchMinute: "84'",
          status: "LIVE",
          matchDate: todayStr,
          matchTime: "20:00",
          predictionText: "Over 2.5 Goals",
          odds: "1.75",
          liveCommentary: "GOAL! 3rd goal scored, our Over 2.5 prediction is secured!",
          isPublished: true,
        },
        {
          league: "Uganda Premier League",
          homeTeam: "Vipers SC",
          awayTeam: "KCCA FC",
          homeScore: 2,
          awayScore: 1,
          matchMinute: "FT",
          status: "FT",
          matchDate: todayStr,
          matchTime: "16:00",
          predictionText: "Home Win or Draw (1X)",
          odds: "1.45",
          liveCommentary: "Full Time. Vipers secure victory at St. Mary's Stadium Kitende.",
          isPublished: true,
        },
      ]);
    }

    // Check system settings
    const settingsCountResult = await db.select({ count: count() }).from(systemSettings);
    if (Number(settingsCountResult[0]?.count || 0) === 0) {
      await db.insert(systemSettings).values([
        {
          key: "ticker_announcement",
          value: "🔥 KALASO PREDICTIONS: 88.4% Win Rate this week! Stake responsibly. All free tips are 100% researched by expert tipsters.",
        },
        {
          key: "whatsapp_contact",
          value: "+256745090955",
        },
        {
          key: "whatsapp_manager_name",
          value: "Teddy",
        },
        {
          key: "disclaimer",
          value: "These are researched games but not fixed, we just have a high percentage of winning but the game remains, can win or lose. Stake responsibly. Not for persons below 25yrs. Not for school children.",
        },
      ]);
    }

    return true;
  } catch (error) {
    console.error("Database seeding / ensure error:", error);
    return false;
  }
}
