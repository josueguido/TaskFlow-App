# TaskFlow Frontend

![React](https://img.shields.io/badge/react-%3E%3D19.0.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue?logo=typescript)
![Vite](https://img.shields.io/badge/vite-%3E%3D7.0.0-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%3E%3D4.0.0-blue?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

Frontend application for TaskFlow, a comprehensive project and task management system built with React, TypeScript, and Vite.

## 🎯 Overview

This is the frontend component of the TaskFlow application, providing a modern UI for managing projects, tasks, team members, and business workflows. The application uses React 19 with TypeScript for type safety and Vite for fast development and optimized builds.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (development) or `http://localhost:3001` (Docker)

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoint definitions
│   │   ├── assignments.ts
│   │   ├── auth.ts
│   │   ├── businesses.ts
│   │   ├── businessUsers.ts
│   │   ├── projects.ts
│   │   ├── projectUsers.ts
│   │   ├── reports.ts
│   │   ├── roles.ts
│   │   ├── status.ts
│   │   ├── task.ts
│   │   ├── tasks.ts
│   │   └── users.ts
│   │
│   ├── components/       # React components
│   │   ├── auth/         # Authentication components
│   │   ├── calendar/     # Calendar view components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── kanban/       # Kanban board components
│   │   ├── layout/       # Layout wrapper components
│   │   ├── projects/     # Project management components
│   │   ├── team/         # Team management components
│   │   └── ui/           # Reusable UI components
│   │
│   ├── contexts/         # React Context for global state
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries and helpers
│   ├── services/         # Business logic services
│   │   └── authService.ts
│   │
│   ├── store/            # State management (Zustand)
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── assets/           # Static assets (images, icons, etc.)
│   ├── App.tsx           # Main App component
│   ├── App.css           # Global styles
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Vite environment types
│
├── nginx/                # Nginx configuration for Docker
│   └── nginx.conf
├── public/               # Static files
├── Dockerfile            # Docker configuration
├── components.json       # Component configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tsconfig.app.json     # App-specific TypeScript config
├── tsconfig.node.json    # Node-specific TypeScript config
├── vite.config.ts        # Vite build configuration
└── eslint.config.js      # ESLint rules configuration
```

## 🛠 Tech Stack

### Core Framework
- **React 19.1.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 7.1.2** - Build tool with HMR

### Styling & UI
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Tailwind Merge 3.3.1** - Merge Tailwind classes
- **Radix UI** - Headless UI components
- **Lucide React 0.543.0** - Icon library
- **Class Variance Authority 0.7.1** - CSS class composition

### Form Management
- **React Hook Form 7.62.0** - Form state management
- **Zod 4.0.17** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Drag & Drop
- **@dnd-kit** - Modern drag and drop toolkit
  - `@dnd-kit/core`
  - `@dnd-kit/sortable`
  - `@dnd-kit/utilities`
- **Swapy 1.0.5** - Drag and drop library

### Routing & State
- **React Router 7.8.0** - Client-side routing
- **React Router DOM 7.8.0** - DOM routing bindings
- **Zustand 5.0.7** - Lightweight state management

### Calendar & Utilities
- **React Big Calendar 1.19.4** - Calendar component
- **date-fns 4.1.0** - Date manipulation
- **Axios 1.11.0** - HTTP client
- **clsx 2.1.1** - Utility for constructing className

### Development Tools
- **ESLint 9.33.0** - Code linting
- **TypeScript ESLint** - TypeScript linting rules

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production (type-check + Vite build) |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

## 🏗️ Architecture

### Components Organization
- **Auth Components**: Login, registration, password recovery
- **Dashboard**: Main dashboard with overview and widgets
- **Calendar**: Event and task scheduling
- **Kanban**: Task management with drag-and-drop
- **Projects**: Project CRUD and management
- **Team**: Team member management and roles
- **UI Components**: Reusable buttons, modals, inputs, etc.

### API Layer
The `api/` directory contains axios instances and endpoint definitions for:
- Authentication (login, logout, token refresh)
- Users and team members
- Projects and project users
- Tasks and assignments
- Businesses and roles
- Reports and status management

### State Management
- **Zustand Store**: Global state for app-wide data
- **React Context**: Specific feature contexts
- **React Hook Form**: Form-level state

### Services
Business logic is separated into services for:
- Authentication flow
- API communication
- Data transformation

## 🔌 API Integration

The frontend communicates with the backend API. Ensure the backend is running and accessible. All API calls are configured in the `api/` directory using axios.

### Environment Configuration
Configure API endpoint in environment variables (typically in `.env` or through Vite config):
```
VITE_API_URL=http://localhost:3000/api
```

## 🎨 Styling

The project uses Tailwind CSS v4 with Vite plugin for optimal performance:
- Utility-first CSS approach
- Dark mode support ready
- Responsive design patterns
- Custom color and typography scales in `tailwind.config.ts`

## 📱 Features

- **Task Management**: Create, update, and track tasks
- **Kanban Board**: Visual task organization with drag-and-drop
- **Calendar View**: Schedule and view tasks by date
- **Project Management**: Organize work into projects
- **Team Collaboration**: Manage team members and roles
- **Business Units**: Support for multiple business units
- **Reports**: Generate project and task reports
- **Real-time Updates**: Responsive UI with form validation

## 🔐 Security

- TypeScript for type safety
- Input validation with Zod
- XSS protection through React's built-in escaping
- CSRF token handling (configured in API layer)
- Secure authentication flow with token management

## 🚀 Deployment

### Docker Deployment
The application includes a `Dockerfile` for containerization. With Docker Compose, the frontend runs on port **3001**:

```bash
docker build -t taskflow-frontend .
docker run -p 3001:80 taskflow-frontend
```

The application will be available at `http://localhost:3001`

Nginx serves the built application with optimized caching and compression.

### Production Build
```bash
npm run build
```

This creates an optimized `dist/` directory ready for deployment.

## 🐛 Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port.

### Build Errors
Ensure TypeScript checks pass:
```bash
npm run build
```

### ESLint Issues
Fix linting issues automatically where possible:
```bash
npm run lint -- --fix
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

## 📝 License

This project is part of TaskFlow. See the main repository for license information.

## 👨‍💻 Contributing

When contributing to the frontend:
1. Follow the existing code structure and naming conventions
2. Maintain TypeScript strict mode
3. Ensure all components have proper PropTypes or TypeScript interfaces
4. Run `npm run lint` before committing
5. Keep components focused and reusable
