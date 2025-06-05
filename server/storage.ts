import { 
  users, games, players,
  type User, type InsertUser, 
  type Game, type InsertGame,
  type Player, type InsertPlayer 
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game methods
  getGame(id: number): Promise<Game | undefined>;
  getGames(): Promise<Game[]>;
  getGamesBySport(sport: string): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  
  // Player methods
  getPlayer(id: number): Promise<Player | undefined>;
  getPlayers(): Promise<Player[]>;
  getPlayersBySport(sport: string): Promise<Player[]>;
  createPlayer(player: InsertPlayer): Promise<Player>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Game methods
  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db
      .select()
      .from(games)
      .where(eq(games.id, id));
    return game;
  }
  
  async getGames(): Promise<Game[]> {
    return db.select().from(games);
  }
  
  async getGamesBySport(sport: string): Promise<Game[]> {
    return db
      .select()
      .from(games)
      .where(eq(games.sport, sport));
  }
  
  async createGame(game: InsertGame): Promise<Game> {
    const [newGame] = await db
      .insert(games)
      .values(game)
      .returning();
    return newGame;
  }
  
  // Player methods
  async getPlayer(id: number): Promise<Player | undefined> {
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.id, id));
    return player;
  }
  
  async getPlayers(): Promise<Player[]> {
    return db.select().from(players);
  }
  
  async getPlayersBySport(sport: string): Promise<Player[]> {
    return db
      .select()
      .from(players)
      .where(eq(players.sport, sport));
  }
  
  async createPlayer(player: InsertPlayer): Promise<Player> {
    const [newPlayer] = await db
      .insert(players)
      .values(player)
      .returning();
    return newPlayer;
  }
}

export const storage = new DatabaseStorage();
