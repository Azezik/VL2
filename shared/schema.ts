import { pgTable, text, serial, timestamp, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tee Time Bookings table (renamed from games)
export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  skillLevel: varchar("skill_level", { length: 50 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  gameTypes: text("game_types").notNull(), // Stored as JSON string
  date: varchar("date", { length: 50 }),
  teeTime: varchar("tee_time", { length: 50 }),
  numberOfPlayers: integer("number_of_players").default(1),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow(),
  organizerId: integer("organizer_id").references(() => users.id),
});

// Golfers table (renamed from players)
export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  skillLevel: varchar("skill_level", { length: 50 }).notNull(),
  handicap: varchar("handicap", { length: 10 }),
  preferredCourse: varchar("preferred_course", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  organizedGames: many(games),
}));

export const gamesRelations = relations(games, ({ one }) => ({
  organizer: one(users, {
    fields: [games.organizerId],
    references: [users.id],
  }),
}));

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGameSchema = createInsertSchema(games).omit({
  id: true,
  createdAt: true,
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;

export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof players.$inferSelect;
