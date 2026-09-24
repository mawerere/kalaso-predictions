import { pgTable, serial, text, timestamp, boolean, integer, numeric } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("USER"), // 'USER' | 'SUPER_ADMIN'
  status: text("status").notNull().default("ACTIVE"), // 'ACTIVE' | 'SUSPENDED'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  league: text("league").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  prediction: text("prediction").notNull(),
  odds: text("odds").notNull(), // text or numeric formatted, e.g. "1.85", "2.10"
  matchDate: text("match_date").notNull(), // "YYYY-MM-DD"
  matchTime: text("match_time").notNull(), // "19:30" or "20:00 EAT"
  status: text("status").notNull().default("SCHEDULED"), // 'SCHEDULED' | 'LIVE' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
  result: text("result").notNull().default("PENDING"), // 'PENDING' | 'WON' | 'LOST' | 'VOID'
  correctScore: text("correct_score"), // e.g. "2 - 1"
  confidence: integer("confidence").default(85), // e.g. 88
  category: text("category").default("FREE_TIP"), // 'FREE_TIP' | 'BANKER_OF_THE_DAY' | 'OVER_UNDER' | 'BTTS_GG' | 'DOUBLE_CHANCE'
  notes: text("notes"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const liveMatches = pgTable("live_matches", {
  id: serial("id").primaryKey(),
  league: text("league").notNull(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  matchMinute: text("match_minute").notNull().default("1'"), // "35'", "HT", "78'", "90+2'", "FT"
  status: text("status").notNull().default("LIVE"), // 'LIVE' | 'HT' | 'FT' | 'SCHEDULED' | 'POSTPONED'
  matchDate: text("match_date").notNull(),
  matchTime: text("match_time").notNull(),
  predictionId: integer("prediction_id").references(() => predictions.id),
  predictionText: text("prediction_text"),
  odds: text("odds"),
  liveCommentary: text("live_commentary"),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  userEmail: text("user_email"),
  action: text("action").notNull(), // 'PREDICTION_CREATED' | 'RESULT_UPDATED' | 'USER_SUSPENDED' | etc.
  details: text("details"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const systemSettings = pgTable("system_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  predictions: many(predictions),
  auditLogs: many(auditLogs),
}));

export const predictionsRelations = relations(predictions, ({ one, many }) => ({
  creator: one(users, {
    fields: [predictions.createdBy],
    references: [users.id],
  }),
  liveMatches: many(liveMatches),
}));

export const liveMatchesRelations = relations(liveMatches, ({ one }) => ({
  prediction: one(predictions, {
    fields: [liveMatches.predictionId],
    references: [predictions.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Prediction = typeof predictions.$inferSelect;
export type NewPrediction = typeof predictions.$inferInsert;
export type LiveMatch = typeof liveMatches.$inferSelect;
export type NewLiveMatch = typeof liveMatches.$inferInsert;
export type AuditLog = typeof auditLogs.$inferSelect;
