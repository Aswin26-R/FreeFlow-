# FreeFlow CRM

## Overview

FreeFlow is a client-side freelancer CRM application built with vanilla HTML, CSS, and JavaScript. It provides freelancers with tools to manage clients, track invoices, organize projects using a Kanban board, and set up reminders for overdue payments. The application operates entirely in the browser using localStorage for data persistence, making it a lightweight solution that doesn't require backend infrastructure.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a multi-page architecture with separate HTML files for each major feature:
- **Landing/Authentication Pages**: `index.html`, `login.html`, `signup.html`
- **Core Application Pages**: `dashboard.html`, `clients.html`, `invoices.html`, `projects.html`, `reminders.html`
- **Modular JavaScript**: Each page has its own JavaScript file (`auth.js`, `dashboard.js`, `clients.js`, etc.) with `utils.js` providing shared functionality
- **Unified Styling**: Single `styles.css` file manages all visual styling with a consistent design system

### Data Storage Solution
The application uses browser localStorage as its primary data storage mechanism:
- **User Management**: User accounts and authentication stored in localStorage
- **Data Isolation**: Each user's data (clients, invoices, tasks) is stored separately by user ID
- **Data Types**: Supports clients, invoices, tasks/projects, and user profiles
- **No Backend Required**: Completely client-side operation eliminates server dependencies

### Authentication System
Simple client-side authentication using localStorage:
- **Session Management**: Current user session stored in localStorage
- **Route Protection**: JavaScript-based redirects protect authenticated pages
- **User Registration**: New accounts created and stored locally
- **Login Persistence**: Users remain logged in across browser sessions until logout

### Project Management
Kanban-style project management with drag-and-drop functionality:
- **Three-Column Board**: Todo, In Progress, and Done columns
- **Task Management**: Create, edit, delete, and move tasks between columns
- **Client Association**: Tasks can be linked to specific clients
- **Visual Organization**: Color-coded cards with priority and status indicators

### Invoice and Client Management
Comprehensive business management features:
- **Client Database**: Store client contact information and notes
- **Invoice Tracking**: Create invoices with due dates and status tracking
- **Automated Reminders**: System identifies overdue invoices and upcoming due dates
- **Financial Overview**: Dashboard provides summary of pending invoices and client statistics

### User Interface Design
Clean, professional interface optimized for freelancer workflows:
- **Responsive Design**: Works across desktop and mobile devices
- **Modal-Based Forms**: Consistent form interactions using overlay modals
- **Navigation Bar**: Persistent navigation with active page indicators
- **Dashboard Cards**: Summary cards showing key business metrics

## External Dependencies

### Browser APIs
- **localStorage API**: For all data persistence and user session management
- **Drag and Drop API**: For Kanban board task movement functionality
- **Form Validation API**: For client-side form validation

### Styling Framework
- **Custom CSS**: No external CSS frameworks, using custom styles with CSS Grid and Flexbox
- **Web Fonts**: Uses system fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)

### No External Services
The application is designed to operate completely offline with no external API dependencies, database connections, or third-party services required.