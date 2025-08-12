# Overview

CNCMate is a smart CNC analytics platform designed for Indian MSMEs (Micro, Small, and Medium Enterprises). The application provides real-time machine monitoring with MQTT/OPC-UA integration, predictive maintenance alerts, and intelligent production insights to reduce downtime and improve operational efficiency for CNC operations. It features live data updates every minute, comprehensive dashboard system with role-based access, quality tracking, job management, and real-time alerts with WebSocket connectivity.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Real-time Updates**: WebSocket integration for live machine status and alerts
- **UI Components**: Radix UI primitives wrapped in custom components following the "new-york" style theme
- **Mobile-First**: Responsive design with dedicated mobile navigation components

## Backend Architecture
- **Framework**: Express.js server with TypeScript
- **API Design**: RESTful endpoints with comprehensive error handling middleware
- **Real-time Communication**: WebSocket server for live updates and notifications
- **MQTT Integration**: MQTT client for real-time machine data ingestion with automatic 1-minute update intervals  
- **Machine Monitoring**: Live tracking of temperature, vibration, usage, RPM, and power consumption
- **File Structure**: Clean separation between client, server, and shared code
- **Development Setup**: Hot reload with Vite integration in development mode
- **Build Process**: ESBuild for server bundling and Vite for client assets

## Database Layer
- **ORM**: Drizzle ORM with PostgreSQL as the primary database
- **Schema Management**: Type-safe schema definitions with Zod validation
- **Database Provider**: Neon serverless PostgreSQL with connection pooling
- **Migration System**: Drizzle Kit for schema migrations and database management
- **Data Models**: 
  - Users (with role-based access control)
  - Machines (with status tracking and temperature monitoring)
  - Jobs (with progress tracking and status management)
  - Defects (with severity levels and resolution tracking)
  - Alerts (with type categorization and dismissal functionality)
  - Shift Reports and Session management

## Authentication & Authorization
- **Provider**: Replit's OpenID Connect (OIDC) authentication system
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Security**: HTTP-only cookies with secure flag, CSRF protection
- **Role System**: Three-tier access control (operator, supervisor, owner)
- **Middleware**: Custom authentication middleware for protected routes

## Key Design Patterns
- **Type Safety**: End-to-end TypeScript with shared schema definitions
- **Error Handling**: Centralized error handling with user-friendly messages
- **Validation**: Zod schemas for both client and server-side validation
- **Component Architecture**: Atomic design with reusable UI components
- **State Management**: Server state separation from client state using React Query
- **Responsive Design**: Mobile-first approach with adaptive layouts

# External Dependencies

## Core Technologies
- **Database**: Neon PostgreSQL serverless database for persistent data storage
- **Authentication**: Replit OIDC for user authentication and session management
- **Real-time**: WebSocket implementation for live updates and notifications

## Development Tools
- **Build System**: Vite for frontend bundling and development server
- **Code Quality**: ESBuild for server bundling and TypeScript compilation
- **Database Tools**: Drizzle Kit for migrations and schema management

## UI Libraries
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Styling**: Tailwind CSS for utility-first styling approach
- **Icons**: Lucide React for consistent iconography
- **Forms**: React Hook Form with Hookform Resolvers for form management

## Utility Libraries
- **Validation**: Zod for schema validation and type inference
- **Date Handling**: date-fns for date manipulation and formatting
- **State Management**: TanStack React Query for server state caching
- **Styling Utilities**: clsx and tailwind-merge for conditional class names
- **Memory Optimization**: Memoizee for function memoization