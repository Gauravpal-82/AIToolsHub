# AI Tools Hub

## Overview

AI Tools Hub is a modern, responsive web application that serves as a discovery platform for AI tools and resources. The application allows users to explore, compare, and learn about various AI tools across different categories like text generation, image creation, video editing, coding assistance, and more. Built with a futuristic dashboard aesthetic, it provides a comprehensive hub for AI tool discovery with features including tool browsing, detailed comparisons, community submissions, and educational blog content.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing without the complexity of React Router
- **State Management**: TanStack React Query for server state management, caching, and synchronization
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom design system including glass morphism effects and neon color themes
- **Theme System**: Custom dark/light theme provider with persistent storage

### Backend Architecture
- **Server**: Express.js with TypeScript for API endpoints and static file serving
- **Development Setup**: Vite for fast development builds and hot module replacement
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Data Validation**: Zod schemas for runtime type checking and validation
- **API Design**: RESTful endpoints for tools, blog posts, and user collections

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database interactions
- **Schema**: Four main entities - users, tools, user_tools (for collections/favorites), and blog_posts
- **Migration System**: Drizzle Kit for database schema migrations and management

### Component Architecture
- **Design System**: Consistent component library with variants for different use cases
- **Layout System**: Responsive grid and flexbox layouts with mobile-first approach
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Data Display**: Reusable card components for tools, categories, and blog posts

### Key Features
- **Tool Discovery**: Browsing, searching, and filtering AI tools by category and pricing
- **Tool Comparison**: Side-by-side comparison of tools with features and pricing
- **User Collections**: Personal toolkit management with favorites and custom collections
- **Community Features**: Tool submission system with upvoting and contributor leaderboards
- **Content Management**: Blog system for AI-related articles and tutorials
- **Search System**: Intelligent search with AI tool recommendations based on user queries

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe ORM with PostgreSQL support
- **Drizzle Kit**: Database migration and introspection tools

### UI & Styling
- **Radix UI**: Accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe utility for component variants

### Development Tools
- **Vite**: Fast build tool and development server
- **TypeScript**: Static type checking and enhanced development experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Additional Libraries
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Performant form handling with minimal re-renders
- **Wouter**: Minimalist routing library for React
- **Date-fns**: Date manipulation and formatting utilities
- **Embla Carousel**: Touch-friendly carousel component

### Session Management
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Express Sessions**: Server-side session management middleware