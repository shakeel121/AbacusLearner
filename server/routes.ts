import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import { insertUserProgressSchema, insertExerciseAttemptSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public routes - available without authentication
  
  // Levels API
  app.get('/api/levels', async (req, res) => {
    try {
      const levels = await storage.getLevels();
      res.json(levels);
    } catch (error) {
      console.error("Error fetching levels:", error);
      res.status(500).json({ message: "Failed to fetch levels" });
    }
  });

  // Protected routes - require authentication

  // User Progress API
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = { ...req.body, userId };
      
      // Validate the request body
      const validatedData = insertUserProgressSchema.parse(data);
      
      const progress = await storage.createOrUpdateUserProgress(validatedData);
      res.json(progress);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Exercises API
  app.get('/api/exercises', async (req, res) => {
    try {
      const levelId = req.query.levelId ? Number(req.query.levelId) : undefined;
      let exercises;
      
      if (levelId) {
        exercises = await storage.getExercisesByLevelId(levelId);
      } else {
        exercises = await storage.getExercises();
      }
      
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get('/api/exercises/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      const exercise = await storage.getExerciseById(id);
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  // Exercise Attempts API
  app.post('/api/attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = { ...req.body, userId };
      
      // Validate the request body
      const validatedData = insertExerciseAttemptSchema.parse(data);
      
      const attempt = await storage.createExerciseAttempt(validatedData);
      
      // Update user progress for the level containing this exercise
      const exercise = await storage.getExerciseById(validatedData.exerciseId);
      if (exercise) {
        const levelProgress = await storage.getUserProgressByLevel(userId, exercise.levelId);
        const levelExercises = await storage.getExercisesByLevelId(exercise.levelId);
        
        // Get all attempts for exercises in this level
        const attempts = await Promise.all(
          levelExercises.map(ex => storage.getExerciseAttempts(userId, ex.id))
        );
        
        // Calculate completion percentage
        const exercisesWithCorrectAttempts = attempts.filter(
          attemptList => attemptList.some(a => a.isCorrect)
        ).length;
        
        const completionPercentage = (exercisesWithCorrectAttempts / levelExercises.length) * 100;
        const isLevelCompleted = completionPercentage >= 80; // 80% to complete level
        
        // Update the level progress
        await storage.createOrUpdateUserProgress({
          userId,
          levelId: exercise.levelId,
          isCompleted: isLevelCompleted,
          score: Math.floor(completionPercentage),
          timeSpent: (levelProgress?.timeSpent || 0) + validatedData.timeSpent
        });
      }
      
      res.json(attempt);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      console.error("Error creating attempt:", error);
      res.status(500).json({ message: "Failed to create attempt" });
    }
  });

  // Achievements API
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/achievements/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch user achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
