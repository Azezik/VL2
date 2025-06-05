import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertPlayerSchema } from "@shared/schema";
import { ZodError } from "zod";

// This handler sets up API routes and serves the React app
const setupRoutes = (app: Express, server: Server) => {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Game routes
  app.get('/api/games', async (req, res) => {
    try {
      const sport = req.query.sport as string | undefined;
      const games = sport 
        ? await storage.getGamesBySport(sport)
        : await storage.getGames();
      res.json(games);
    } catch (error) {
      console.error('Error fetching games:', error);
      res.status(500).json({ error: 'Failed to fetch games' });
    }
  });

  app.get('/api/games/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const game = await storage.getGame(id);
      
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      
      res.json(game);
    } catch (error) {
      console.error('Error fetching game:', error);
      res.status(500).json({ error: 'Failed to fetch game' });
    }
  });

  app.post('/api/games', async (req, res) => {
    try {
      const gameData = insertGameSchema.parse(req.body);
      const newGame = await storage.createGame(gameData);
      res.status(201).json(newGame);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating game:', error);
      res.status(500).json({ error: 'Failed to create game' });
    }
  });

  // Player routes
  app.get('/api/players', async (req, res) => {
    try {
      const sport = req.query.sport as string | undefined;
      const players = sport
        ? await storage.getPlayersBySport(sport)
        : await storage.getPlayers();
      res.json(players);
    } catch (error) {
      console.error('Error fetching players:', error);
      res.status(500).json({ error: 'Failed to fetch players' });
    }
  });

  app.get('/api/players/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const player = await storage.getPlayer(id);
      
      if (!player) {
        return res.status(404).json({ error: 'Player not found' });
      }
      
      res.json(player);
    } catch (error) {
      console.error('Error fetching player:', error);
      res.status(500).json({ error: 'Failed to fetch player' });
    }
  });

  app.post('/api/players', async (req, res) => {
    try {
      const playerData = insertPlayerSchema.parse(req.body);
      const newPlayer = await storage.createPlayer(playerData);
      res.status(201).json(newPlayer);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error('Error creating player:', error);
      res.status(500).json({ error: 'Failed to create player' });
    }
  });

  return server;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Setup routes
  return setupRoutes(app, httpServer);
}
