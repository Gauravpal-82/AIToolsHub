import { type User, type InsertUser, type Tool, type InsertTool, type UserTool, type InsertUserTool, type BlogPost, type InsertBlogPost } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Tools
  getTools(filters?: {
    category?: string;
    pricing?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Tool[]>;
  getTool(id: string): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  getToolsByIds(ids: string[]): Promise<Tool[]>;

  // User Tools
  getUserTools(userId: string): Promise<(UserTool & { tool: Tool })[]>;
  addUserTool(userTool: InsertUserTool): Promise<UserTool>;
  removeUserTool(userId: string, toolId: string): Promise<void>;
  updateUserTool(userId: string, toolId: string, updates: Partial<UserTool>): Promise<UserTool | undefined>;

  // Blog Posts
  getBlogPosts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tools: Map<string, Tool>;
  private userTools: Map<string, UserTool>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.tools = new Map();
    this.userTools = new Map();
    this.blogPosts = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample data that matches the design
    const sampleTools: Tool[] = [
      {
        id: "1",
        name: "ChatGPT",
        description: "Advanced conversational AI for writing, coding, and problem-solving. OpenAI's flagship language model that can assist with a wide variety of tasks.",
        shortDescription: "Advanced conversational AI for writing, coding, and problem-solving.",
        category: "Text & Writing",
        pricing: "freemium",
        price: "Free / $20/month for Plus",
        website: "https://chat.openai.com",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.8,
        featured: true,
        submittedBy: null,
        createdAt: new Date(),
      },
      {
        id: "2",
        name: "Midjourney",
        description: "Create stunning AI-generated artwork and images from text prompts. One of the most advanced AI art generators available.",
        shortDescription: "Create stunning AI-generated artwork and images from text prompts.",
        category: "Image Generation",
        pricing: "paid",
        price: "$10-60/month",
        website: "https://midjourney.com",
        imageUrl: "https://pixabay.com/get/g665f4631f8ab28d5f7e84f0a9d1f5eb51e655cdb18474ac8619330d48d21fbbd26e2058498f79c58b61b819475f8c2c5f7b488af168e144564e11f3638e660ae_1280.jpg",
        rating: 4.6,
        featured: true,
        submittedBy: null,
        createdAt: new Date(),
      },
      {
        id: "3",
        name: "GitHub Copilot",
        description: "AI-powered code completion and programming assistance. Helps developers write code faster and with fewer errors.",
        shortDescription: "AI-powered code completion and programming assistance.",
        category: "Code Generation",
        pricing: "paid",
        price: "$10/month",
        website: "https://github.com/features/copilot",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.7,
        featured: true,
        submittedBy: null,
        createdAt: new Date(),
      },
      {
        id: "4",
        name: "Jasper AI",
        description: "AI writing assistant for marketing copy, blogs, and creative content. Specialized in business and marketing content creation.",
        shortDescription: "AI writing assistant for marketing copy, blogs, and creative content.",
        category: "Text & Writing",
        pricing: "paid",
        price: "$39/month",
        website: "https://jasper.ai",
        imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.5,
        featured: false,
        submittedBy: null,
        createdAt: new Date(),
      },
      {
        id: "5",
        name: "Stable Diffusion",
        description: "Open-source AI model for generating images from text descriptions. Free and customizable image generation.",
        shortDescription: "Open-source AI model for generating images from text descriptions.",
        category: "Image Generation",
        pricing: "free",
        price: "Free",
        website: "https://stability.ai",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.9,
        featured: false,
        submittedBy: null,
        createdAt: new Date(),
      },
      {
        id: "6",
        name: "AIVA",
        description: "AI composer that creates original music for your projects. Specialized in creating soundtracks and background music.",
        shortDescription: "AI composer that creates original music for your projects.",
        category: "Music & Audio",
        pricing: "freemium",
        price: "Free / $15/month",
        website: "https://aiva.ai",
        imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        rating: 4.3,
        featured: false,
        submittedBy: null,
        createdAt: new Date(),
      }
    ];

    const sampleBlogPosts: BlogPost[] = [
      {
        id: "1",
        title: "The Future of AI: 10 Breakthrough Technologies to Watch",
        content: "Discover the cutting-edge AI technologies that are reshaping industries...",
        excerpt: "Discover the cutting-edge AI technologies that are reshaping industries and transforming how we work, create, and innovate in 2024 and beyond.",
        author: "Dr. Emily Zhang",
        authorRole: "AI Research Lead",
        category: "Featured",
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
        readTime: 12,
        views: 23500,
        featured: true,
        createdAt: new Date("2024-03-15"),
      },
      {
        id: "2",
        title: "Getting Started with ChatGPT API",
        content: "Learn how to integrate OpenAI's powerful language model into your applications...",
        excerpt: "Learn how to integrate OpenAI's powerful language model into your applications.",
        author: "Alex Chen",
        authorRole: "Developer Advocate",
        category: "Tutorial",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        readTime: 5,
        views: 15200,
        featured: false,
        createdAt: new Date("2024-03-10"),
      }
    ];

    // Initialize maps
    sampleTools.forEach(tool => this.tools.set(tool.id, tool));
    sampleBlogPosts.forEach(post => this.blogPosts.set(post.id, post));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTools(filters?: {
    category?: string;
    pricing?: string;
    search?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<Tool[]> {
    let tools = Array.from(this.tools.values());

    if (filters?.category) {
      tools = tools.filter(tool => tool.category === filters.category);
    }

    if (filters?.pricing) {
      tools = tools.filter(tool => tool.pricing === filters.pricing);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.shortDescription.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.featured !== undefined) {
      tools = tools.filter(tool => tool.featured === filters.featured);
    }

    // Sort by featured first, then by rating
    tools.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit || tools.length;
    
    return tools.slice(offset, offset + limit);
  }

  async getTool(id: string): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = randomUUID();
    const tool: Tool = {
      ...insertTool,
      id,
      rating: 0,
      featured: false,
      createdAt: new Date(),
    };
    this.tools.set(id, tool);
    return tool;
  }

  async getToolsByIds(ids: string[]): Promise<Tool[]> {
    return ids.map(id => this.tools.get(id)).filter(Boolean) as Tool[];
  }

  async getUserTools(userId: string): Promise<(UserTool & { tool: Tool })[]> {
    const userTools = Array.from(this.userTools.values()).filter(
      userTool => userTool.userId === userId
    );

    return userTools.map(userTool => {
      const tool = this.tools.get(userTool.toolId);
      return {
        ...userTool,
        tool: tool!
      };
    }).filter(item => item.tool);
  }

  async addUserTool(insertUserTool: InsertUserTool): Promise<UserTool> {
    const id = randomUUID();
    const userTool: UserTool = {
      ...insertUserTool,
      id,
      addedAt: new Date(),
    };
    this.userTools.set(id, userTool);
    return userTool;
  }

  async removeUserTool(userId: string, toolId: string): Promise<void> {
    const userTool = Array.from(this.userTools.values()).find(
      ut => ut.userId === userId && ut.toolId === toolId
    );
    if (userTool) {
      this.userTools.delete(userTool.id);
    }
  }

  async updateUserTool(userId: string, toolId: string, updates: Partial<UserTool>): Promise<UserTool | undefined> {
    const userTool = Array.from(this.userTools.values()).find(
      ut => ut.userId === userId && ut.toolId === toolId
    );
    if (userTool) {
      const updated = { ...userTool, ...updates };
      this.userTools.set(userTool.id, updated);
      return updated;
    }
    return undefined;
  }

  async getBlogPosts(filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<BlogPost[]> {
    let posts = Array.from(this.blogPosts.values());

    if (filters?.category) {
      posts = posts.filter(post => post.category === filters.category);
    }

    if (filters?.featured !== undefined) {
      posts = posts.filter(post => post.featured === filters.featured);
    }

    // Sort by featured first, then by creation date
    posts.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
    });

    const offset = filters?.offset || 0;
    const limit = filters?.limit || posts.length;
    
    return posts.slice(offset, offset + limit);
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      views: 0,
      featured: false,
      createdAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
