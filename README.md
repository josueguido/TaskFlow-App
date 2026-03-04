# TaskFlow App

![Status](https://img.shields.io/badge/status-in%20progress-yellow)
![Node.js](https://img.shields.io/badge/node-%3E%3D20.0.0-green)
![React](https://img.shields.io/badge/react-%3E%3D19.0.0-blue?logo=react)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12-blue?logo=postgresql)
![Docker](https://img.shields.io/badge/docker-ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/license-ISC-brightgreen)

A comprehensive full-stack project and task management system built with modern web technologies. TaskFlow provides an intuitive interface for managing projects, tasks, team members, and business workflows.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Development](#development)
- [Monitoring & Logs](#monitoring--logs)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Overview

TaskFlow is a full-stack application designed to streamline project and task management. It consists of:

- **Frontend**: A modern React application with TypeScript and Vite
- **Backend**: A robust Node.js API with Express.js and PostgreSQL
- **Database**: PostgreSQL for reliable data persistence
- **Infrastructure**: Docker Compose for easy deployment with monitoring and logging

## Features

### Core Functionality
- Project Management: Create, organize, and manage multiple projects
- Task Management: Full CRUD operations for tasks with detailed tracking
- User Assignment: Assign team members to tasks with role-based permissions
- Task History: Track changes and history of tasks over time
- Business Management: Organize tasks within business units
- Reports: Generate reports on task progress and team performance
- Calendar View: Visualize tasks and deadlines in a calendar interface
- Kanban Board: Drag-and-drop interface for task management

### Technical Features
- Type Safety: Full TypeScript implementation across frontend and backend
- Authentication: JWT-based authentication with secure password hashing
- Security: Helmet, CORS, rate limiting, SQL injection prevention
- Validation: Zod schema validation and express-validator
- API Documentation: Swagger/OpenAPI documentation
- Logging: Structured logging with Winston and ELK Stack
- Monitoring: Prometheus metrics and Grafana dashboards
- Testing: Jest testing framework
- Code Quality: ESLint and Prettier integration

## Tech Stack

### Frontend
- React 19 - UI library
- TypeScript - Type-safe development
- Vite - Next generation build tool
- Tailwind CSS - Utility-first CSS framework
- Zustand - State management
- React Router - Client-side routing
- React Hook Form - Form management
- Axios - HTTP client
- Zod - Schema validation

### Backend
- Node.js - Runtime environment
- Express.js - Web framework
- TypeScript - Type-safe development
- PostgreSQL - Relational database
- JWT - Authentication tokens
- Bcrypt - Password hashing
- Winston - Logging
- Prom-client - Metrics export

### Infrastructure
- Docker - Containerization
- Docker Compose - Multi-container orchestration
- Prometheus - Metrics collection
- Grafana - Metrics visualization
- Elasticsearch - Log storage
- Logstash - Log processing
- Kibana - Log visualization
- PostgreSQL 15 - Database

## Prerequisites

- Node.js v20 or higher
- PostgreSQL v15 or higher (or Docker)
- npm or yarn
- Git
- Docker & Docker Compose (for containerized deployment)

## Quick Start

### Option 1: Development with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/josueguido/TaskFlow-App
cd TaskFlow-App

# Create environment file
cp .env.example .env

# Start the application
docker-compose up -d

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:3003
# Backend API Docs: http://localhost:3003/api-docs
```

### Option 2: Local Development

#### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=taskflow

# Run database migrations
psql -U postgres -d taskflow -f ../db/init.sql

# Start development server
npm run dev

# Server runs on http://localhost:3003
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

## Project Structure

```
TaskFlow-App/
├── backend/                     # Express.js API server
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── middlewares/        # Custom middlewares
│   │   ├── interfaces/         # TypeScript interfaces
│   │   ├── config/             # Configuration files
│   │   ├── utils/              # Utility functions
│   │   └── app.ts              # Express app setup
│   ├── tests/                  # Test files
│   ├── Dockerfile              # Production Docker image
│   ├── jest.config.js          # Jest configuration
│   └── package.json            # Dependencies
│
├── frontend/                    # React application
│   ├── src/
│   │   ├── api/                # API client methods
│   │   ├── components/         # React components
│   │   ├── contexts/           # React Context API
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # Business logic services
│   │   ├── store/              # Zustand store
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   └── assets/             # Static assets
│   └── package.json            # Dependencies
│
├── infra/                       # Infrastructure & Monitoring
│   ├── monitoring/             # Prometheus + Grafana
│   ├── logging/                # ELK Stack (Elasticsearch, Logstash, Kibana)
│   └── README.md               # Infrastructure documentation
│
├── db/                          # Database scripts
│   ├── init.sql                # Database initialization
│   └── seed.sql                # Sample data
│
└── docker-compose.yml          # Main orchestration
```

## Development

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed development setup and guidelines.

### Common Commands

Backend:
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Run linter
```

Frontend:
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run linter
```

## Monitoring & Logs

### Overview
TaskFlow includes a complete observability stack with metrics collection, dashboards, and centralized logging.

### Quick Start
```bash
make start_all       # Start all services (app + monitoring + logging)
make help            # View all available commands
```

### Access Points
- Grafana (Metrics): http://localhost:3000
- Prometheus (Metrics DB): http://localhost:9090
- Kibana (Logs): http://localhost:5601
- Elasticsearch (Log Storage): http://localhost:9200

### Documentation
See [infra/README.md](./infra/README.md) for complete infrastructure documentation including:
- Setup instructions
- Available metrics and queries
- Alert configuration
- Makefile targets reference

## Database

### Setup
```bash
# Run initialization script
psql -U postgres -d taskflow -f db/init.sql

# Load sample data (optional)
psql -U postgres -d taskflow -f db/seed.sql
```

### Migrations
Database migrations are handled through SQL scripts in the `/db` directory.

### Access with PgAdmin
```bash
# PgAdmin is available at http://localhost:5050
# Default credentials in docker-compose.yml
```

## API Documentation

### Swagger Documentation
Once the backend is running, visit:
```
http://localhost:3003/api-docs
```

### Available Endpoints
- Users: `/api/users`
- Projects: `/api/projects`
- Tasks: `/api/tasks`
- Assignments: `/api/assignments`
- Reports: `/api/reports`

For detailed API documentation, see [backend/swagger-endpoints.md](./backend/swagger-endpoints.md)

## Roadmap

- [ ] Advanced filtering and search
- [ ] Real-time notifications
- [ ] Team collaboration features
- [ ] File attachment support
- [ ] Mobile application
- [ ] Analytics dashboard
- [ ] Integration with external tools
- [ ] Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   ├── nginx/                  # Nginx config for Docker
│   ├── public/                 # Static files
│   ├── Dockerfile              # Production Docker image
│   ├── Dockerfile.dev          # Development Docker image
│   ├── vite.config.ts          # Vite configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── package.json            # Dependencies
│
├── db/                         # Database files
│   ├── init.sql               # Database initialization
│   └── seed.sql               # Sample data
│
├── infra/                      # Infrastructure configuration
│   └── pgadmin/               # PgAdmin configuration
│
├── docker-compose.yml          # Development docker-compose
├── docker-compose.prod.yml     # Production docker-compose
└── README.md                   # This file
```

## 🔧 Environment Configuration

### About .env Files

The backend uses environment variables in two scenarios:

- **Local Development** (without Docker): Environment variables are loaded from `backend/config/DB/.env.dev`
- **Docker Environment**: Environment variables are passed through `docker-compose.yml` and the root `.env` file (no need to use config/DB/.env files)

The backend automatically detects the environment and loads the appropriate configuration:
```typescript
// In backend/src/config/DB/index.ts
dotenv.config({
  path: process.env.NODE_ENV === 'production'
    ? './config/DB/.env.production'
    : './config/DB/.env.dev',
});
```

### Backend Environment Variables (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=3003

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=debug
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:3003
VITE_API_BASE_PATH=/api
```

## 💻 Development

### Backend Development

```bash
cd backend

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run tests
npm run test

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🐳 Docker Deployment

### Development Environment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Environment

```bash
# Build and start with production configuration
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

### Service Management

```bash
# View running containers
docker-compose ps

# Access backend logs
docker-compose logs backend

# Access frontend logs
docker-compose logs frontend

# Access database logs
docker-compose logs db

# Execute command in backend container
docker-compose exec backend npm run lint

# Connect to database
docker-compose exec db psql -U postgres -d taskflow
```

## 🗄️ Database

### Database Schema

The application uses PostgreSQL with the following main entities:

- **users** - User accounts and authentication
- **roles** - User roles and permissions
- **businesses** - Business units
- **projects** - Project management
- **tasks** - Task tracking
- **task_history** - Task change history
- **assignments** - User-task assignments
- **status** - Task status definitions
- **refresh_tokens** - JWT token management

### Database Initialization

The database is automatically initialized using SQL scripts:

1. **01-init.sql** - Creates tables and schema
2. **02-seed.sql** - Populates sample data

### Database Management

Access PgAdmin at `http://localhost:8080` (if running with Docker Compose)

```bash
# Backup database
docker-compose exec db pg_dump -U postgres taskflow > backup.sql

# Restore database
docker-compose exec -T db psql -U postgres taskflow < backup.sql

# Connect directly
psql -h localhost -U postgres -d taskflow
```

## 📚 API Documentation

### Swagger/OpenAPI Documentation

Once the backend is running, access the interactive API documentation:

```
http://localhost:3003/api-docs
```

### Main API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

#### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment
- `DELETE /api/assignments/:id` - Delete assignment

#### Reports
- `GET /api/reports` - Generate reports

For complete API documentation, see the [Backend README](./backend/README.md) and the Swagger documentation.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Workflow

1. Create a new branch from `develop`
2. Make your changes
3. Run tests and linting: `npm run test && npm run lint`
4. Commit with meaningful messages usinf conventional commits
5. Submit a Pull Request

### Code Quality

- Follow the existing code style
- Use TypeScript for type safety
- Write tests for new features
- Keep commits atomic and meaningful

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🗺️ Roadmap

TaskFlow is actively under development with the following planned features and improvements:

### Phase 1: Core Features (In Progress)
-  Project and task management
-  User authentication and authorization
-  Kanban board interface
-  Calendar view
-  Reporting and analytics
-  Team management
-  Enhanced error handling and validation

### Phase 2: DevOps & Infrastructure (Upcoming)
-  **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
-  **Terraform**: Infrastructure as Code for AWS resource management
-  **AWS Deployment**: Production deployment on AWS (EC2, RDS, S3)
-  **Kubernetes**: Container orchestration for scalable deployments
-  **Observability**: Monitoring, logging, and tracing (Prometheus, ELK Stack, Jaeger, cAdvisor)
-  **Makefiles**: Simplified development and deployment workflows

### Phase 3: Advanced Features (Future)
-  Real-time notifications and WebSocket support (Using SNS, SQS and EventBridge)
-  Advanced filtering and search capabilities
-  Custom workflows and automation
-  Integration with third-party services
-  Mobile app support
-  Audit logging and compliance features

## 👥 Contact

**Project Owner**: Josue Guido
**Repository**: [https://github.com/josueguido/TaskFlow-App](https://github.com/josueguido/TaskFlow-App)

For questions or suggestions, please open an issue on GitHub.

---

**Last Updated**: March 2025
