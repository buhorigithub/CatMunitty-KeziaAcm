import { users, posts, comments, events, statistics } from "@shared/schema";
import type { 
  User, InsertUser, Post, InsertPost, 
  Comment, InsertComment, Event, InsertEvent,
  Statistics, InsertStatistics
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, sql, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post operations
  createPost(post: InsertPost): Promise<Post>;
  getPosts(limit?: number, offset?: number): Promise<Post[]>;
  getPostById(id: number): Promise<Post | undefined>;
  getUserPosts(userId: number): Promise<Post[]>;
  
  // Comment operations
  createComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number): Promise<Comment[]>;
  
  // Event operations
  createEvent(event: InsertEvent): Promise<Event>;
  getEvents(limit?: number): Promise<Event[]>;
  
  // Statistics operations
  getStatistics(): Promise<Statistics | undefined>;
  updateStatistics(stats: InsertStatistics): Promise<Statistics>;
  
  // Session store
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Post operations
  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }
  
  async getPosts(limit = 10, offset = 0): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getPostById(id: number): Promise<Post | undefined> {
    const [post] = await db
      .select()
      .from(posts)
      .where(eq(posts.id, id));
    return post;
  }
  
  async getUserPosts(userId: number): Promise<Post[]> {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  }
  
  // Comment operations
  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    
    // Update comment count on post
    await db
      .update(posts)
      .set({ 
        comments: sql`${posts.comments} + 1` 
      })
      .where(eq(posts.id, insertComment.postId));
      
    return comment;
  }
  
  async getPostComments(postId: number): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }
  
  // Event operations
  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const [event] = await db
      .insert(events)
      .values(insertEvent)
      .returning();
    return event;
  }
  
  async getEvents(limit = 5): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .orderBy(events.eventDate)
      .limit(limit);
  }
  
  // Statistics operations
  async getStatistics(): Promise<Statistics | undefined> {
    const [stats] = await db
      .select()
      .from(statistics)
      .orderBy(desc(statistics.lastUpdated))
      .limit(1);
    return stats;
  }
  
  async updateStatistics(insertStats: InsertStatistics): Promise<Statistics> {
    const [stats] = await db
      .insert(statistics)
      .values({
        ...insertStats,
        lastUpdated: new Date()
      })
      .returning();
    return stats;
  }
}

export const storage = new DatabaseStorage();
