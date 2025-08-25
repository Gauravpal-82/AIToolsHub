import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertToolSchema, insertBlogPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tools endpoints
  app.get("/api/tools", async (req, res) => {
    try {
      const { category, pricing, search, featured, limit, offset } = req.query;
      const tools = await storage.getTools({
        category: category as string,
        pricing: pricing as string,
        search: search as string,
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(tools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tools" });
    }
  });

  app.get("/api/tools/:id", async (req, res) => {
    try {
      const tool = await storage.getTool(req.params.id);
      if (!tool) {
        return res.status(404).json({ message: "Tool not found" });
      }
      res.json(tool);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tool" });
    }
  });

  app.post("/api/tools", async (req, res) => {
    try {
      const validatedData = insertToolSchema.parse(req.body);
      const tool = await storage.createTool(validatedData);
      res.status(201).json(tool);
    } catch (error) {
      res.status(400).json({ message: "Invalid tool data" });
    }
  });

  // Blog posts endpoints
  app.get("/api/blog", async (req, res) => {
    try {
      const { category, featured, limit, offset } = req.query;
      const posts = await storage.getBlogPosts({
        category: category as string,
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // User tools endpoints (mocked for now)
  app.get("/api/user/tools", async (req, res) => {
    // Mock user ID for demo
    const mockUserId = "user-1";
    try {
      const userTools = await storage.getUserTools(mockUserId);
      res.json(userTools);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user tools" });
    }
  });

  app.post("/api/user/tools", async (req, res) => {
    // Mock user ID for demo
    const mockUserId = "user-1";
    try {
      const { toolId, isFavorite, collectionName } = req.body;
      const userTool = await storage.addUserTool({
        userId: mockUserId,
        toolId,
        isFavorite: isFavorite || false,
        collectionName: collectionName || null,
      });
      res.status(201).json(userTool);
    } catch (error) {
      res.status(400).json({ message: "Failed to add tool to user collection" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
