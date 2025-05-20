import {
  users,
  levels,
  exercises,
  userProgress,
  exerciseAttempts,
  achievements,
  userAchievements,
  type User,
  type UpsertUser,
  type Level,
  type InsertLevel,
  type Exercise,
  type InsertExercise,
  type UserProgress,
  type InsertUserProgress,
  type ExerciseAttempt,
  type InsertExerciseAttempt,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Level operations
  getLevels(): Promise<Level[]>;
  getLevelById(id: number): Promise<Level | undefined>;
  createLevel(level: InsertLevel): Promise<Level>;
  
  // Exercise operations
  getExercises(): Promise<Exercise[]>;
  getExercisesByLevelId(levelId: number): Promise<Exercise[]>;
  getExerciseById(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  // User progress operations
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressByLevel(userId: string, levelId: number): Promise<UserProgress | undefined>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Exercise attempt operations
  getExerciseAttempts(userId: string, exerciseId: number): Promise<ExerciseAttempt[]>;
  createExerciseAttempt(attempt: InsertExerciseAttempt): Promise<ExerciseAttempt>;
  
  // Achievement operations
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Level operations
  async getLevels(): Promise<Level[]> {
    return await db.select().from(levels).orderBy(levels.order);
  }
  
  async getLevelById(id: number): Promise<Level | undefined> {
    const [level] = await db.select().from(levels).where(eq(levels.id, id));
    return level;
  }
  
  async createLevel(level: InsertLevel): Promise<Level> {
    const [newLevel] = await db.insert(levels).values(level).returning();
    return newLevel;
  }
  
  // Exercise operations
  async getExercises(): Promise<Exercise[]> {
    return await db.select().from(exercises);
  }
  
  async getExercisesByLevelId(levelId: number): Promise<Exercise[]> {
    return await db.select().from(exercises).where(eq(exercises.levelId, levelId));
  }
  
  async getExerciseById(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }
  
  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [newExercise] = await db.insert(exercises).values(exercise).returning();
    return newExercise;
  }
  
  // User progress operations
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }
  
  async getUserProgressByLevel(userId: string, levelId: number): Promise<UserProgress | undefined> {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.levelId, levelId)));
    return progress;
  }
  
  async createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existingProgress = await this.getUserProgressByLevel(progress.userId, progress.levelId);
    
    if (existingProgress) {
      const [updatedProgress] = await db
        .update(userProgress)
        .set({
          ...progress,
          // Only update completion status if new status is completed
          isCompleted: progress.isCompleted || existingProgress.isCompleted,
          // Take the higher score
          score: Math.max(progress.score || 0, existingProgress.score || 0),
          // Update completedAt if completing for the first time
          completedAt: progress.isCompleted && !existingProgress.isCompleted ? new Date() : existingProgress.completedAt,
        })
        .where(eq(userProgress.id, existingProgress.id))
        .returning();
      return updatedProgress;
    } else {
      const [newProgress] = await db.insert(userProgress).values(progress).returning();
      return newProgress;
    }
  }
  
  // Exercise attempt operations
  async getExerciseAttempts(userId: string, exerciseId: number): Promise<ExerciseAttempt[]> {
    return await db
      .select()
      .from(exerciseAttempts)
      .where(and(eq(exerciseAttempts.userId, userId), eq(exerciseAttempts.exerciseId, exerciseId)))
      .orderBy(desc(exerciseAttempts.createdAt));
  }
  
  async createExerciseAttempt(attempt: InsertExerciseAttempt): Promise<ExerciseAttempt> {
    const [newAttempt] = await db.insert(exerciseAttempts).values(attempt).returning();
    return newAttempt;
  }
  
  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements);
  }
  
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }
  
  async awardAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement> {
    // Check if already awarded
    const [existing] = await db
      .select()
      .from(userAchievements)
      .where(
        and(
          eq(userAchievements.userId, userAchievement.userId),
          eq(userAchievements.achievementId, userAchievement.achievementId)
        )
      );
    
    if (existing) {
      return existing;
    }
    
    const [newAchievement] = await db.insert(userAchievements).values(userAchievement).returning();
    return newAchievement;
  }
}

export const storage = new DatabaseStorage();
