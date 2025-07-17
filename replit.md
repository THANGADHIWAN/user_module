# Pharma LIMS - Workflow Management System

## Overview
A comprehensive pharmaceutical laboratory information management system (LIMS) featuring user management, workflow automation, digital signatures, and audit compliance. Successfully migrated from Bolt to Replit with production-ready styling and architecture.

## Recent Changes
- **2025-01-17**: Migrated project from Bolt to Replit
- **2025-01-17**: Implemented production-ready styling with modern design system
- **2025-01-17**: Enhanced UI/UX with improved typography, spacing, and visual hierarchy
- **2025-01-17**: Added comprehensive CSS system with design tokens and utility classes
- **2025-01-17**: Redesigned sidebar to icon-only with tooltips on hover
- **2025-01-17**: Added AI chatbot for help and support with floating interface
- **2025-01-17**: Removed Help & Support from main navigation menu

## Project Architecture

### Frontend Structure
- **React 18** with TypeScript for type safety
- **Tailwind CSS** with custom design system and production-ready styling
- **Wouter** for client-side routing
- **TanStack Query** for state management and data fetching
- **React Flow** for workflow builder visualization
- **Lucide React** for consistent iconography

### Backend Structure
- **Express.js** server with TypeScript
- **Drizzle ORM** with PostgreSQL schema definitions
- **In-memory storage** for development (can be switched to PostgreSQL)
- RESTful API architecture with proper error handling

### Key Components
1. **User Management**
   - Complete CRUD operations for users
   - Role-based access control
   - Advanced filtering and search
   - Bulk operations support

2. **Workflow Builder**
   - Visual workflow designer using React Flow
   - Drag-and-drop node creation
   - Multi-step approval processes
   - Workflow templates for common pharmaceutical processes

3. **Digital Signatures**
   - FDA 21 CFR Part 11 compliant signature handling
   - Multi-level approval workflows
   - Audit trail tracking

4. **System Administration**
   - Configuration management
   - User role administration
   - System monitoring and logs

5. **AI Assistant**
   - Floating chatbot interface for help and support
   - Context-aware responses about system features
   - Minimizable and expandable chat window
   - Pulse animation to draw user attention

### Design System
- **Colors**: Professional blue and gray palette with semantic color tokens
- **Typography**: Inter font with custom scale and line heights
- **Spacing**: Consistent 8px grid system
- **Components**: Reusable card, button, form, and table components
- **Animations**: Subtle hover states and transitions for enhanced UX

### Security Features
- Client/server separation for secure architecture
- Input validation with Zod schemas
- Proper error handling and logging
- Session management capabilities

## User Preferences
- Production-ready styling with proper alignment, font sizing, and spacing
- Modern, clean interface with professional appearance
- Consistent design language throughout the application
- Accessibility-focused design with proper focus states
- Icon-only sidebar navigation with tooltips on hover
- AI chatbot integration for help and support instead of dedicated page
- Floating UI elements for better user experience

## File Structure
```
client/
├── src/
│   ├── components/           # React components
│   │   ├── workflow/        # Workflow-specific components
│   │   ├── UserManagement.tsx
│   │   ├── Sidebar.tsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   ├── data/                # Sample data and constants
│   ├── utils/               # Utility functions
│   └── index.css           # Custom styles and design system
server/
├── index.ts                # Express server entry point
├── routes.ts               # API route definitions
├── storage.ts              # Data storage interface
└── vite.ts                 # Vite integration for development
shared/
└── schema.ts               # Shared database schemas and types
```

## Development Workflow
1. Run `npm run dev` to start both frontend and backend
2. Server runs on port 5000 with both API and static file serving
3. Hot module replacement enabled for rapid development
4. TypeScript compilation with strict type checking

## Features Implemented
- ✅ User management with advanced filtering
- ✅ Workflow builder with visual editor
- ✅ Responsive design with mobile support
- ✅ Production-ready styling and typography
- ✅ Proper component architecture
- ✅ Type-safe API integration
- ✅ Modern CSS with design tokens

## Migration Status
The project has been successfully migrated from Bolt to Replit with enhanced production-ready features:
- Modern design system implementation
- Improved component architecture
- Enhanced user experience
- Professional styling and typography
- Responsive layout design
- Accessibility improvements