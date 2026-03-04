# 🚀 TaskFlow App

![Status](https://img.shields.io/badge/status-in%20progress-yellow)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green?logo=node.js)
![React](https://img.shields.io/badge/react-19-blue?logo=react)
![Express](https://img.shields.io/badge/express-5-black?logo=express)
![TypeScript](https://img.shields.io/badge/typescript-5.8-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/postgresql-15-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=github-actions)
![License](https://img.shields.io/badge/license-ISC-brightgreen)

A full-stack project and task management system built with React 19, Express 5, TypeScript, and PostgreSQL. Features a Kanban board, calendar view, team management, and a complete observability stack.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Environment Configuration](#-environment-configuration)
- [Development](#-development)
- [Docker Deployment](#-docker-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Monitoring & Logging](#-monitoring--logging)
- [Database](#-database)
- [API Documentation](#-api-documentation)
- [Makefile Reference](#-makefile-reference)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🔍 Overview

TaskFlow is a multi-tenant application designed to streamline project and task management:

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Frontend** | React 19 + Vite 7 | SPA with Kanban, calendar, dashboard |
| **Backend** | Express 5 + Node 24 | REST API with JWT auth |
| **Database** | PostgreSQL 15 | Relational data persistence |
| **Infra** | Docker Compose | Dev, prod, monitoring & logging stacks |
| **CI/CD** | GitHub Actions | Semantic versioning + Docker Hub push |

---

## ✨ Features

### Core
- 📋 **Kanban Board** — Drag-and-drop task management with `@dnd-kit`
- 📅 **Calendar View** — Visualize tasks and deadlines
- 📊 **Dashboard** — Project stats and overview
- 👥 **Team Management** — Role-based assignments
- 🏢 **Multi-tenant** — Business unit isolation
- 📈 **Reports** — Task progress and team analytics
- 📜 **Task History** — Full audit trail of changes

### Technical
- 🔒 **Authentication** — JWT + refresh tokens + bcrypt
- 🛡️ **Security** — Helmet, CORS, rate limiting, SQL injection prevention, XSS sanitization
- ✅ **Validation** — Zod schemas + express-validator
- 📖 **API Docs** — Swagger/OpenAPI
- 📝 **Logging** — Winston with structured JSON + ELK Stack ready
- 📡 **Monitoring** — Prometheus metrics + Grafana dashboards
- 🧪 **Testing** — Jest (backend) + Vitest (frontend)
- 🔄 **CI/CD** — GitHub Actions with semantic versioning and Docker Hub publishing

---

## 🛠️ Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI library |
| TypeScript | ~5.8 | Type safety |
| Vite | 7 | Build tool + HMR |
| Tailwind CSS | 4 | Utility-first styling |
| Zustand | 5 | State management |
| React Router | 7 | Client-side routing |
| React Hook Form + Zod | 7 / 4 | Form management + validation |
| Vitest | 4 | Unit testing |
| Axios | 1.11 | HTTP client |
| @dnd-kit | 6 | Drag and drop |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 24 (Alpine) | Runtime |
| Express | 5 | Web framework |
| TypeScript | ~5.8 | Type safety |
| PostgreSQL | 15 | Database |
| JWT + bcrypt | — | Authentication |
| Winston | 3 | Structured logging |
| Zod | 3 | Schema validation |
| Prom-client | 15 | Prometheus metrics |
| Jest | 30 | Testing |

### Infrastructure
| Tool | Purpose |
|------|---------|
| Docker + Docker Compose | Containerization & orchestration |
| Nginx | Frontend reverse proxy (production) |
| Prometheus + Grafana | Metrics collection & dashboards |
| ELK Stack | Centralized logging |
| GitHub Actions | CI/CD pipeline |
| PgAdmin | Database management GUI |

---

## 📋 Prerequisites

- **Node.js** v20+ (Dockerfiles use v24)
- **PostgreSQL** v15+ (or use Docker)
- **npm**
- **Git**
- **Docker & Docker Compose** (for containerized setup)
- **Make** (optional, for Makefile shortcuts)

---

## ⚡ Quick Start

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/josueguido/TaskFlow-App
cd TaskFlow-App

# Create environment file from example
cp .env.example .env
# Edit .env with your values

# Start everything
make build_app
# Or without Make:
docker-compose up -d
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3003 |
| API Docs (Swagger) | http://localhost:3003/api-docs |
| PgAdmin | http://localhost:8080 |

### Option 2: Local Development

```bash
# Backend
cd backend
npm install
# Configure backend/config/DB/.env.dev with your DB credentials
npm run dev                 # → http://localhost:3003

# Frontend (in another terminal)
cd frontend
npm install
npm run dev                 # → http://localhost:5173
```

---

## 📁 Project Structure

```
TaskFlow-App/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── api/                # Axios API clients
│   │   ├── components/         # React components
│   │   │   ├── auth/           #   Auth (login, signup)
│   │   │   ├── calendar/       #   Calendar view
│   │   │   ├── dashboard/      #   Dashboard
│   │   │   ├── kanban/         #   Kanban board
│   │   │   ├── layout/         #   Layout (Header, Sidebar)
│   │   │   ├── projects/       #   Project management
│   │   │   ├── team/           #   Team management
│   │   │   └── ui/             #   Reusable UI primitives
│   │   ├── contexts/           # React Context
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # Business logic
│   │   ├── store/              # Zustand stores
│   │   ├── test/               # Vitest setup & tests
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utilities
│   │   └── version.ts          # App version from CI
│   ├── nginx/                  # Nginx config (Docker prod)
│   ├── Dockerfile              # Production multi-stage build
│   ├── Dockerfile.dev          # Development with HMR
│   └── vitest.config.ts        # Vitest configuration
│
├── backend/                     # Express 5 API
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── services/           # Business logic
│   │   ├── models/             # Database models (pg)
│   │   ├── routes/             # API routes
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── middlewares/        # Auth, security, logging
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── errors/             # Custom error classes
│   │   ├── config/             # DB & Swagger config
│   │   ├── utils/              # Logger, helpers
│   │   └── types/              # Express type augmentation
│   ├── logs/                   # Winston log files
│   ├── Dockerfile              # Production multi-stage build
│   ├── Dockerfile.dev          # Development with nodemon
│   └── jest.config.js          # Jest configuration
│
├── db/                          # Database scripts
│   ├── 01-init.sql             # Schema creation
│   └── 02-seed.sql             # Sample data
│
├── infra/                       # Infrastructure
│   ├── monitoring/             # Prometheus + Grafana
│   └── logging/                # ELK Stack
│
├── .github/workflows/          # CI/CD
│   └── docker-build-push.yml   # Build, test, release, push
│
├── docker-compose.yml           # Development stack
├── docker-compose.prod.yml      # Production stack
├── Makefile                     # Shortcuts for all stacks
└── README.md
```

---

## 🔧 Environment Configuration

### How It Works

| Scenario | Config source |
|----------|--------------|
| **Local dev** (no Docker) | `backend/config/DB/.env.dev` |
| **Docker dev** | Root `.env` + `docker-compose.yml` env vars |
| **Docker prod** | Root `.env` + `docker-compose.prod.yml` |
| **CI/CD** | GitHub Secrets → build-args → Docker image |

### Backend Environment Variables

```env
# Server
NODE_ENV=development
PORT=3003

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your_jwt_secret_minimum_32_characters
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:3003
VITE_API_BASE_PATH=/api
```

---

## 💻 Development

### Backend

```bash
cd backend
npm install
npm run dev              # Dev server with hot reload (nodemon)
npm run dev:direct       # Direct execution with tsx
npm run build            # Compile TypeScript → dist/
npm run start            # Start with tsx
npm test                 # Run Jest tests
npm run lint             # ESLint check
npm run format           # Prettier format
```

### Frontend

```bash
cd frontend
npm install
npm run dev              # Vite dev server with HMR
npm run build            # Type-check + Vite production build
npm run preview          # Preview production build
npm test                 # Run Vitest tests
npm run lint             # ESLint check
```

---

## 🐳 Docker Deployment

### Development

```bash
docker-compose up -d                    # Start all services
docker-compose logs -f                  # Follow logs
docker-compose down                     # Stop & remove
docker-compose down -v                  # Stop & remove + delete volumes
```

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d
docker-compose -f docker-compose.prod.yml logs -f
docker-compose -f docker-compose.prod.yml down
```

| Environment | Frontend | Backend |
|------------|----------|---------|
| Development | http://localhost:5173 | http://localhost:3003 |
| Production | http://localhost:80 | Internal (`:3003` between containers) |

---

## 🔄 CI/CD Pipeline

The project uses **GitHub Actions** (`.github/workflows/docker-build-push.yml`):

```
Push/PR to main
     │
     ▼
┌─────────────┐    ┌──────────────────┐    ┌───────────────┐
│  Build+Test  │───▶│ Semantic Version │───▶│  Docker Build  │
│  (npm ci +   │    │  + Git Tag +     │    │  + Push to     │
│   npm test)  │    │  GitHub Release  │    │  Docker Hub    │
└─────────────┘    └──────────────────┘    └───────────────┘
```

- **Tests**: Backend (Jest) + Frontend (Vitest) run on every push/PR
- **Versioning**: Automatic semantic versioning based on commit prefixes (`feat:`, `major:`)
- **Release**: GitHub Release with auto-generated release notes
- **Docker**: Multi-stage builds pushed to Docker Hub with version + `latest` tags
- **Cache**: GitHub Actions cache (`type=gha`) for fast rebuilds

---

## 📡 Monitoring & Logging

### Start Full Observability Stack

```bash
make start_all           # App + Monitoring + Logging
```

### Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Grafana | http://localhost:3000 | Metrics dashboards |
| Prometheus | http://localhost:9090 | Metrics database |
| Kibana | http://localhost:5601 | Log visualization |
| Elasticsearch | http://localhost:9200 | Log storage |

### Logging Architecture

- **Winston** with structured JSON format + daily file rotation
- **contextLogger** using `AsyncLocalStorage` for automatic `requestId`/`userId` injection
- Log files: `backend/logs/combined-*.log` and `backend/logs/error-*.log`
- ELK Stack ready for centralized log aggregation

See [backend/LOGGING_GUIDE.md](./backend/LOGGING_GUIDE.md) for detailed patterns.

---

## 🗄️ Database

### Schema Entities

`users` · `roles` · `businesses` · `projects` · `project_users` · `tasks` · `task_history` · `assignments` · `status` · `refresh_tokens`

### Initialization

The database auto-initializes via Docker entrypoint scripts:

1. **`db/01-init.sql`** — Creates tables and schema
2. **`db/02-seed.sql`** — Populates sample data

### Manual Setup (without Docker)

```bash
psql -U postgres -c "CREATE DATABASE taskflow;"
psql -U postgres -d taskflow -f db/01-init.sql
psql -U postgres -d taskflow -f db/02-seed.sql   # optional
```

### PgAdmin

Available at http://localhost:8080 when running with Docker Compose.

```bash
# Backup
docker-compose exec db pg_dump -U postgres taskflow > backup.sql

# Restore
docker-compose exec -T db psql -U postgres taskflow < backup.sql
```

---

## 📖 API Documentation

### Swagger UI

```
http://localhost:3003/api-docs
```

### Main Endpoints

| Group | Method | Endpoint | Description |
|-------|--------|----------|-------------|
| **Auth** | POST | `/api/auth/register` | Register user |
| | POST | `/api/auth/login` | Login |
| | POST | `/api/auth/refresh` | Refresh token |
| | POST | `/api/auth/logout` | Logout |
| **Users** | GET | `/api/users` | List users |
| | GET / PUT / DELETE | `/api/users/:id` | CRUD by ID |
| **Projects** | GET / POST | `/api/projects` | List / Create |
| | GET / PUT / DELETE | `/api/projects/:id` | CRUD by ID |
| **Tasks** | GET / POST | `/api/tasks` | List / Create |
| | GET / PUT / DELETE | `/api/tasks/:id` | CRUD by ID |
| | PATCH | `/api/tasks/:id/status` | Change status |
| **Assignments** | GET / POST / DELETE | `/api/assignments` | Manage assignments |
| **Reports** | GET | `/api/reports` | Generate reports |

For full documentation see [backend/swagger-endpoints.md](./backend/swagger-endpoints.md).

---

## 📎 Makefile Reference

```bash
make help                # Show all available commands
```

| Command | Description |
|---------|-------------|
| `make build_app` | Build and start app stack (DB + Backend + Frontend + PgAdmin) |
| `make start_app` | Start app (no rebuild) |
| `make stop_app` | Stop app services |
| `make build_monitoring` | Start Prometheus + Grafana |
| `make build_logging` | Start ELK Stack |
| `make start_all` | Start everything |
| `make stop_all` | Stop everything |
| `make delete_all` | Remove all containers |
| `make clean` | Remove containers + volumes ⚠️ |
| `make prune` | Clean unused Docker resources |

---

## 🗺️ Roadmap

### Phase 1: Core Features ✅
- ✅ Project and task management
- ✅ JWT authentication and authorization
- ✅ Kanban board with drag-and-drop
- ✅ Calendar view
- ✅ Dashboard with statistics
- ✅ Team management
- ✅ Reporting and analytics

### Phase 2: DevOps & Infrastructure 🔧
- ✅ CI/CD Pipeline (GitHub Actions + Docker Hub)
- ✅ Docker multi-stage builds (frontend + backend)
- ✅ Observability (Prometheus, Grafana, ELK Stack)
- ✅ Makefile workflows
- ⬜ Terraform — Infrastructure as Code
- ⬜ AWS Deployment (EC2, RDS, S3)
- ⬜ Kubernetes orchestration

### Phase 3: Advanced Features 🔮
- ⬜ Real-time notifications (WebSocket / SNS+SQS)
- ⬜ Advanced filtering and search
- ⬜ Custom workflows and automation
- ⬜ File attachments
- ⬜ Mobile app support
- ⬜ Third-party integrations

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
4. Run tests and lint: `npm test && npm run lint`
5. Push and open a Pull Request

---

## 📝 License

This project is licensed under the ISC License — see the [LICENSE](LICENSE) file for details.

---

## 👤 Contact

**Josue Guido** — [GitHub](https://github.com/josueguido) · [Repository](https://github.com/josueguido/TaskFlow-App)

For questions or suggestions, please [open an issue](https://github.com/josueguido/TaskFlow-App/issues).

---

*Last updated: March 2026*
