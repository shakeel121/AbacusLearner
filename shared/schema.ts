import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Levels table for different difficulty levels
export const levels = pgTable("levels", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  difficulty: varchar("difficulty").notNull(), // beginner, intermediate, advanced, expert
  order: integer("order").notNull(),
  isLocked: boolean("is_locked").default(false),
});

// Exercises table for different practice exercises
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  levelId: integer("level_id").notNull(),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  problemType: varchar("problem_type").notNull(), // addition, subtraction, multiplication, division
  difficulty: integer("difficulty").notNull(), // 1-10 scale
  targetNumber: integer("target_number"), // for representation exercises
  timeLimit: integer("time_limit"), // in seconds
});

// User progress for tracking completed levels and exercises
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  levelId: integer("level_id").notNull().references(() => levels.id),
  isCompleted: boolean("is_completed").default(false),
  score: integer("score").default(0),
  timeSpent: integer("time_spent").default(0), // in seconds
  completedAt: timestamp("completed_at"),
});

// Exercise attempts to track user performance
export const exerciseAttempts = pgTable("exercise_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  score: integer("score").default(0),
  isCorrect: boolean("is_correct").default(false),
  timeSpent: integer("time_spent").default(0), // in seconds
  createdAt: timestamp("created_at").defaultNow(),
});

// Achievements for gamification
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  imageUrl: varchar("image_url"),
  requirementType: varchar("requirement_type").notNull(), // exercises_completed, levels_completed, perfect_score, etc.
  requirementValue: integer("requirement_value").notNull(),
});

// User achievements for tracking earned achievements
export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type Level = typeof levels.$inferSelect;
export type InsertLevel = typeof levels.$inferInsert;
export const insertLevelSchema = createInsertSchema(levels).omit({ id: true });

export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = typeof exercises.$inferInsert;
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = typeof userProgress.$inferInsert;
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });

export type ExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type InsertExerciseAttempt = typeof exerciseAttempts.$inferInsert;
export const insertExerciseAttemptSchema = createInsertSchema(exerciseAttempts).omit({ id: true });

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = typeof achievements.$inferInsert;
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true });

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = typeof userAchievements.$inferInsert;
export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({ id: true });
