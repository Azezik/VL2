import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSchema, insertPlayerSchema, insertUserSchema } from "@shared/schema";
import bcrypt from "bcrypt";
import { ZodError } from "zod";

// This handler sets up API routes and serves the React app
const setupRoutes = (app: Express, server: Server) => {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Authentication routes
  app.post('/api/signup', async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      if (!/^[a-zA-Z0-9]{3,20}$/.test(data.username)) {
        return res.status(400).json({ error: 'Invalid username' });
      }

      const existing = await storage.getUserByUsername(data.username);
      if (existing) {
        return res.status(400).json({ error: 'Username already taken' });
      }

      const hashed = await bcrypt.hash(data.password, 10);
      const user = await storage.createUser({
        username: data.username,
        password: hashed,
      });
      res.status(201).json({ id: user.id, username: user.username });
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ error: err.errors });
      }
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };
    if (!username || !password) {
      return res.status(400).json({ error: 'Missing credentials' });
    }

    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }
      res.json({ id: user.id, username: user.username });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Failed to login' });
    }
  });

  app.get('/api/profile/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ id: user.id, username: user.username });
    } catch (err) {
      console.error('Profile fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
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
