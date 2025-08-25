import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
});

export const tools = pgTable("tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  category: text("category").notNull(),
  pricing: text("pricing").notNull(), // "free", "freemium", "paid", "one-time"
  price: text("price"), // actual price text like "$20/month"
  website: text("website").notNull(),
  imageUrl: text("image_url"),
  rating: real("rating").default(0),
  featured: boolean("featured").default(false),
  submittedBy: text("submitted_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userTools = pgTable("user_tools", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  toolId: varchar("tool_id").notNull().references(() => tools.id),
  isFavorite: boolean("is_favorite").default(false),
  collectionName: text("collection_name"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  author: text("author").notNull(),
  authorRole: text("author_role"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  readTime: integer("read_time"), // in minutes
  views: integer("views").default(0),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertToolSchema = createInsertSchema(tools).omit({
  id: true,
  createdAt: true,
  rating: true,
  featured: true,
});

export const insertUserToolSchema = createInsertSchema(userTools).omit({
  id: true,
  addedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  views: true,
  featured: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Tool = typeof tools.$inferSelect;
export type InsertTool = z.infer<typeof insertToolSchema>;
export type UserTool = typeof userTools.$inferSelect;
export type InsertUserTool = z.infer<typeof insertUserToolSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
