# 🖥️ TaskFlow Backend

![Node.js](https://img.shields.io/badge/node-24--alpine-green?logo=node.js)
![Express](https://img.shields.io/badge/express-5-black?logo=express)
![TypeScript](https://img.shields.io/badge/typescript-~5.8-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/postgresql-15-blue?logo=postgresql)
![Jest](https://img.shields.io/badge/tested%20with-jest%2030-99424f?logo=jest)
![License](https://img.shields.io/badge/license-ISC-brightgreen)

REST API for TaskFlow built with Express 5, TypeScript, and PostgreSQL. Multi-tenant architecture with JWT auth, structured logging, and Prometheus metrics.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Logging](#-logging)
- [Security](#-security)
- [Docker](#-docker)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚀 Features

- **Express 5** — Latest web framework with async error handling
- **TypeScript** — Full type safety with ES2022 target
- **PostgreSQL** — Reliable relational database with `pg` driver
- **JWT Authentication** — Access + refresh token flow with bcrypt password hashing
- **Multi-tenant** — Business unit isolation
- **Validation** — Zod schemas + express-validator
- **Security** — Helmet, CORS, rate limiting, SQL injection prevention, XSS sanitization
- **Swagger** — Auto-generated API documentation
- **Logging** — Structured Winston logging with `AsyncLocalStorage` context
- **Metrics** — Prometheus metrics via prom-client
- **Testing** — Jest with TypeScript support

---

## 🛠️ Tech Stack

| Package                 | Version     | Purpose       |
| ----------------------- | ----------- | ------------- |
| Node.js                 | 24 (Alpine) | Runtime       |
| Express                 | 5.1         | Web framework |
| TypeScript              | ~5.8        | Language      |
| PostgreSQL              | 15          | Database      |
| jsonwebtoken + bcryptjs | 9 / 3       | Auth          |
| Winston                 | 3           | Logging       |
| Zod                     | 3           | Validation    |
| Prom-client             | 15          | Metrics       |
| Jest + ts-jest          | 30 / 29     | Testing       |
| Swagger UI Express      | 5           | API docs      |

---

## 📋 Prerequisites

- Node.js v20+
- PostgreSQL v15+ (or use Docker)
- npm

---

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/josueguido/TaskFlow-App
cd TaskFlow-App/backend

# Install dependencies
npm install
```

---

## 🔧 Environment Variables

The backend loads env vars from `config/DB/.env.dev` (local) or from Docker env vars:

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

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

| Variable         | Required | Default | Description                         |
| ---------------- | -------- | ------- | ----------------------------------- |
| `PORT`           | No       | 3003    | Server port                         |
| `DB_HOST`        | Yes      | —       | Database host                       |
| `DB_PORT`        | Yes      | —       | Database port                       |
| `DB_NAME`        | Yes      | —       | Database name                       |
| `DB_USERNAME`    | Yes      | —       | Database user                       |
| `DB_PASSWORD`    | Yes      | —       | Database password                   |
| `JWT_SECRET`     | Yes      | —       | JWT signing secret (min 32 chars)   |
| `JWT_EXPIRATION` | No       | 24h     | Token expiration                    |
| `LOG_LEVEL`      | No       | info    | `debug` / `info` / `warn` / `error` |

---

## 🚀 Usage

```bash
# Development (hot reload with nodemon)
npm run dev

# Alternative dev modes
npm run dev:direct       # Direct with tsx
npm run dev:watch        # tsx watch mode

# Production build
npm run build            # Compile TS → dist/
npm run start            # Run with tsx

# Code quality
npm run lint             # ESLint
npm run lint:fix         # ESLint auto-fix
npm run format           # Prettier
```

API available at `http://localhost:3003`

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint             | Description   |
| ------ | -------------------- | ------------- |
| POST   | `/api/auth/register` | Register user |
| POST   | `/api/auth/login`    | Login         |
| POST   | `/api/auth/refresh`  | Refresh token |
| POST   | `/api/auth/logout`   | Logout        |

### Users

| Method | Endpoint         | Description |
| ------ | ---------------- | ----------- |
| GET    | `/api/users`     | List users  |
| GET    | `/api/users/:id` | Get user    |
| PUT    | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Projects

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| GET    | `/api/projects`     | List projects  |
| POST   | `/api/projects`     | Create project |
| GET    | `/api/projects/:id` | Get project    |
| PUT    | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |

### Tasks

| Method | Endpoint                | Description   |
| ------ | ----------------------- | ------------- |
| GET    | `/api/tasks`            | List tasks    |
| POST   | `/api/tasks`            | Create task   |
| GET    | `/api/tasks/:id`        | Get task      |
| PUT    | `/api/tasks/:id`        | Update task   |
| DELETE | `/api/tasks/:id`        | Delete task   |
| PATCH  | `/api/tasks/:id/status` | Change status |

### Assignments

| Method | Endpoint                                 | Description          |
| ------ | ---------------------------------------- | -------------------- |
| GET    | `/api/tasks/:taskId/assignments`         | Get task assignments |
| POST   | `/api/tasks/:taskId/assign`              | Assign users         |
| DELETE | `/api/tasks/:taskId/assignments/:userId` | Remove assignment    |
| DELETE | `/api/tasks/:taskId/assignments`         | Remove all           |

### Reports

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/api/reports` | Generate reports |

---

## 📚 API Documentation

Interactive Swagger documentation at:

```
http://localhost:3003/api-docs
```

See also [swagger-endpoints.md](./swagger-endpoints.md) for endpoint details.

---

## 🧪 Testing

```bash
npm test                            # Run all tests
npm test -- --coverage              # With coverage
npm test -- --watch                 # Watch mode
npm test -- assignment.controller   # Specific file
```

---

## 📝 Logging

Structured JSON logging with **Winston** + **contextLogger** (`AsyncLocalStorage`):

- Automatic `requestId` and `userId` injection in every log
- Daily file rotation: `logs/combined-*.log` + `logs/error-*.log`
- Console output in development
- ELK Stack ready

```typescript
import { contextLogger } from '../utils/contextLogger';

contextLogger.info('Task created', {
  action: 'TASK_CREATED',
  taskId: task.id,
  projectId: project.id,
});
```

See [LOGGING_GUIDE.md](./LOGGING_GUIDE.md) for detailed patterns and best practices.

---

## 🛡️ Security

| Feature          | Implementation                  |
| ---------------- | ------------------------------- |
| Helmet           | HTTP security headers           |
| CORS             | Configurable origin whitelist   |
| Rate Limiting    | 100 req / 15 min (configurable) |
| JWT              | Access + refresh token rotation |
| Password Hashing | bcrypt with configurable rounds |
| Input Validation | Zod schemas + express-validator |
| SQL Injection    | Parameterized queries           |
| XSS              | Input sanitization middleware   |

---

## 🐳 Docker

### Production Dockerfile (multi-stage)

```
Stage 1 (builder): npm ci → tsc → dist/
Stage 2 (runner):  npm ci --omit=dev → copy dist/ → node dist/server.js
```

```bash
# Build
docker build -t taskflow-backend .

# Run
docker run -p 3003:3003 --env-file .env taskflow-backend
```

Or use Docker Compose from the root of the project:

```bash
docker-compose up -d backend
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                  # Express app setup
│   ├── server.ts               # Entry point
│   ├── config/
│   │   ├── swagger.ts          # Swagger config
│   │   ├── security.ts         # Security config
│   │   └── DB/index.ts         # PostgreSQL pool
│   ├── controllers/            # Route handlers
│   │   ├── business/
│   │   ├── projects/
│   │   ├── reports/
│   │   ├── tasks/
│   │   └── users/
│   ├── services/               # Business logic
│   ├── models/                 # Database queries
│   ├── routes/                 # API route definitions
│   ├── schemas/                # Zod validation schemas
│   ├── middlewares/            # Auth, security, logging, validation
│   ├── interfaces/             # TypeScript interfaces
│   ├── errors/                 # Custom error classes
│   ├── utils/                  # Logger, context logger, helpers
│   ├── types/                  # Express type augmentation
│   ├── validators/             # Input validators
│   └── tests/                  # Jest test files
├── config/DB/                  # Environment files (.env.dev, .env.production)
├── logs/                       # Winston log output
├── Dockerfile                  # Production multi-stage
├── Dockerfile.dev              # Development with nodemon
├── jest.config.js              # Jest configuration
├── tsconfig.json               # TypeScript config
├── nodemon.json                # Nodemon config
└── package.json
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`)
4. Run `npm test && npm run lint` before submitting
5. Open a Pull Request

---

## 📝 License

Part of [TaskFlow App](https://github.com/josueguido/TaskFlow-App). Licensed under the ISC License.

---

**Author**: [Josue Guido](https://github.com/josueguido)
