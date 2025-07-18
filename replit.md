# Pharma LIMS User Management Module

## Overview
This is a comprehensive pharmaceutical Laboratory Information Management System (LIMS) focused on user management. The application is built with React, TypeScript, and Vite, featuring a modular architecture with workflow management, digital signatures, and various administrative components.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS
- **Workflow Engine**: React Flow for visual workflow management
- **Digital Signatures**: DocuSeal React integration
- **Icons**: Lucide React

### Key Components
- User Management with CRUD operations
- Visual Workflow Builder using React Flow
- Digital Signature management
- Custom Fields configuration
- Notifications system
- System Settings
- Help & Support module

## Recent Changes
- **2025-07-18**: Successfully migrated from Replit Agent to standard Replit environment
- Updated server configuration to use 0.0.0.0:5000 for Replit compatibility
- Configured proper development workflow
- **2025-07-18**: Enhanced UI/UX with proper confirmation modals
- Optimized sidebar to icon-only design with hover tooltips
- Replaced all browser alerts/confirms with proper modal components
- Fixed workflow pause/activate/delete functionality with confirmations
- Enhanced digital signature sign button functionality
- Improved notification template management

## User Preferences
- None specified yet

## Development
- Main entry point: `src/main.tsx`
- Primary application: `src/App.tsx`
- Components organized in `src/components/`
- Workflow components in `src/components/workflow/`

## Security Considerations
- Client-side only application (no backend dependencies)
- Uses React strict mode for development safety
- TypeScript for type safety
- ESLint for code quality