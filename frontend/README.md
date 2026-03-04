# 🎨 TaskFlow Frontend

![React](https://img.shields.io/badge/react-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-~5.8-blue?logo=typescript)
![Vite](https://img.shields.io/badge/vite-7-purple?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-4-blue?logo=tailwind-css)
![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest)
![License](https://img.shields.io/badge/license-ISC-brightgreen)

Frontend SPA for TaskFlow — a project and task management system built with React 19, TypeScript, Vite 7, and Tailwind CSS 4.

---

## 📑 Table of Contents

- [Quick Start](#-quick-start)
- [Tech Stack](#-tech-stack)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Styling](#-styling)
- [Environment Variables](#-environment-variables)
- [Testing](#-testing)
- [Docker Deployment](#-docker-deployment)
- [Contributing](#-contributing)

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173

---

## 🛠️ Tech Stack

### Core
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI library |
| TypeScript | ~5.8 | Type safety |
| Vite | 7 | Build tool + HMR |
| Tailwind CSS | 4 | Utility-first styling (Vite plugin) |

### State & Routing
| Package | Version | Purpose |
|---------|---------|---------|
| Zustand | 5 | Global state management |
| React Router | 7 | Client-side routing |
| React Hook Form | 7 | Form state management |
| Zod | 4 | Schema validation |

### UI & Components
| Package | Version | Purpose |
|---------|---------|---------|
| Radix UI | — | Headless UI primitives |
| Lucide React | 0.543 | Icon library |
| @dnd-kit | 6 | Drag and drop (Kanban) |
| React Big Calendar | 1.19 | Calendar component |
| CVA + clsx + tailwind-merge | — | Class composition |

### Dev Tools
| Package | Version | Purpose |
|---------|---------|---------|
| Vitest | 4 | Unit testing |
| @testing-library/react | — | Component testing |
| ESLint + TS-ESLint | 9 / 8 | Linting |

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run Vitest tests |

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/                    # Axios API clients
│   │   ├── auth.ts
│   │   ├── projects.ts
│   │   ├── tasks.ts
│   │   ├── assignments.ts
│   │   ├── users.ts
│   │   ├── businesses.ts
│   │   ├── roles.ts
│   │   ├── status.ts
│   │   └── reports.ts
│   │
│   ├── components/             # React components
│   │   ├── auth/               #   Login, Signup, Business signup
│   │   ├── calendar/           #   Calendar view
│   │   ├── dashboard/          #   Dashboard with stats
│   │   ├── kanban/             #   Kanban board (drag-and-drop)
│   │   ├── layout/             #   Header, Sidebar, Layout
│   │   ├── projects/           #   Project CRUD, users
│   │   ├── team/               #   Team management
│   │   └── ui/                 #   Reusable primitives (buttons, modals, etc.)
│   │
│   ├── contexts/               # React Context providers
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utility libraries
│   ├── services/               # Business logic (authService)
│   ├── store/                  # Zustand stores
│   ├── test/                   # Vitest setup & test files
│   │   ├── setup.ts            #   Test setup (@testing-library/jest-dom)
│   │   └── App.test.ts         #   Placeholder tests
│   ├── types/                  # TypeScript type definitions
│   ├── utils/                  # Utility functions
│   ├── version.ts              # App version injected from CI
│   ├── App.tsx                 # Main App component
│   ├── App.css                 # Global styles
│   ├── main.tsx                # Entry point
│   └── vite-env.d.ts           # Vite environment types
│
├── nginx/                      # Nginx config for Docker prod
│   └── nginx.conf
├── public/                     # Static files
├── Dockerfile                  # Production (multi-stage → nginx)
├── Dockerfile.dev              # Development (Vite HMR)
├── vitest.config.ts            # Vitest configuration
├── vite.config.ts              # Vite build configuration
├── tsconfig.json               # TS config (project references)
├── tsconfig.app.json           # App TS config (React)
├── tsconfig.node.json          # Node TS config (Vite)
├── eslint.config.js            # ESLint flat config
├── components.json             # shadcn/ui component config
└── package.json
```

---

## 🏗️ Architecture

### Components
- **Auth** — Login, registration, business signup, protected routes
- **Dashboard** — Overview with project stats and widgets
- **Kanban** — Task board with `@dnd-kit` drag-and-drop
- **Calendar** — Event and task scheduling with `react-big-calendar`
- **Projects** — Project CRUD and user management
- **Team** — Team member management and role assignment

### Data Flow
```
Components → Zustand Store → API Layer (Axios) → Backend REST API
                 ↕
          React Context (auth, tenant)
```

### API Layer
All API calls are in `src/api/` using Axios. Each module maps to a backend resource (auth, projects, tasks, etc.).

### State Management
- **Zustand** — Global app state (auth, projects)
- **React Context** — Feature-specific contexts
- **React Hook Form** — Form-level state

---

## 🎨 Styling

- **Tailwind CSS v4** with `@tailwindcss/vite` plugin (no config file needed)
- **CVA** (Class Variance Authority) for component variants
- **tailwind-merge** + **clsx** for conditional class composition
- Path alias: `@/` → `./src/`

---

## 🔌 Environment Variables

```env
VITE_API_URL=http://localhost:3003
VITE_API_BASE_PATH=/api
```

In production (Docker/CI), version info is injected via build-args:

```env
VITE_APP_VERSION=0.1.0    # Set by CI/CD
VITE_GIT_SHA=abc1234      # Set by CI/CD
```

These are consumed in `src/version.ts` and displayed in the Sidebar.

---

## 🧪 Testing

```bash
npm test                    # Run all tests (Vitest)
```

- **Framework**: Vitest 4 with jsdom environment
- **Setup**: `@testing-library/react` + `@testing-library/jest-dom`
- **Config**: `vitest.config.ts` (separate from `vite.config.ts`)
- **Location**: `src/test/` for setup, `src/**/*.test.{ts,tsx}` for tests

---

## 🐳 Docker Deployment

### Production Dockerfile (multi-stage)

```
Stage 1 (deps):    npm ci
Stage 2 (builder): COPY . + npm run build
Stage 3 (prod):    nginx:alpine → serves dist/
```

```bash
# Standalone
docker build -t taskflow-frontend .
docker run -p 80:80 taskflow-frontend

# Or with Docker Compose (from project root)
docker-compose up -d frontend          # Dev  → :5173
docker-compose -f docker-compose.prod.yml up -d frontend  # Prod → :80
```

Nginx serves the SPA with `try_files $uri $uri/ /index.html` for client-side routing.

---

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Maintain TypeScript strict mode
3. Write tests for new features
4. Run `npm run lint && npm test` before committing
5. Use [Conventional Commits](https://www.conventionalcommits.org/)

---

## 📝 License

Part of [TaskFlow App](https://github.com/josueguido/TaskFlow-App). Licensed under the ISC License.

---

**Author**: [Josue Guido](https://github.com/josueguido)
