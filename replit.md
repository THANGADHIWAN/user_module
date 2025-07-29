# Pharma LIMS User Management Module

## Overview
This is a comprehensive pharmaceutical Laboratory Information Management System (LIMS) focused on user management. The application is built with React, TypeScript, and Vite, featuring a modular architecture with workflow management, digital signatures, and various administrative components.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Database**: PostgreSQL with environment-based configuration
- **UI Framework**: Tailwind CSS
- **Workflow Engine**: React Flow for visual workflow management
- **Digital Signatures**: DocuSeal React integration
- **Icons**: Lucide React
- **State Management**: React hooks with local component state

### Key Components
- User Management with CRUD operations
- Visual Workflow Builder using React Flow
- Digital Signature management
- Custom Fields configuration
- Notifications system
- System Settings
- Help & Support module

## Recent Changes
- **2025-07-29**: Successfully completed migration from Replit Agent to standard Replit environment
- Updated server configuration to use 0.0.0.0:5000 for Replit compatibility
- Configured proper development workflow and installed missing dependencies
- **2025-07-29**: Implemented comprehensive toast notification system
- Added ToastContext with success, error, warning, and info toast types
- Integrated toast notifications for all CRUD operations (create, update, delete)
- Added toast messages for user creation, updates, deletion, bulk operations, and CSV export
- Changed default page size from 5 to 10 for better user experience
- **2025-07-29**: Fixed pagination and scrolling issues
- Removed vertical scrolling conflicts and fixed table height constraints
- Improved pagination footer with proper navigation controls
- Optimized table container styling for better responsiveness
- Fixed LSP diagnostics and cleaned up unused imports and variables
- **2025-07-18**: Enhanced UI/UX with proper confirmation modals
- Optimized sidebar to icon-only design with hover tooltips and smooth animations
- Replaced all browser alerts/confirms with proper modal components
- Fixed workflow pause/activate/delete functionality with proper state management
- Implemented workflow cloning feature with proper data handling
- Enhanced digital signature functionality with working save and template creation
- Fixed user table with sticky headers, proper scrolling, and fixed pagination
- Improved notification template management with full CRUD operations
- **2025-07-18**: Major UI/UX improvements and database integration
- Integrated PostgreSQL database for data persistence
- Consolidated signature creation into templates section with full CRUD operations
- Enhanced sidebar with complete icon set and improved tooltip system for all modules
- Streamlined sidebar navigation by removing Data Management and Reports & Analytics modules
- Simplified template view modal by removing edit and close buttons

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