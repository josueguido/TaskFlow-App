# TaskFlow Backend

![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-green)
![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0.0-blue?logo=typescript)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Jest](https://img.shields.io/badge/tested%20with-jest-99424f?logo=jest)
![Made with Express](https://img.shields.io/badge/express.js-%3E%3D4.0.0-black?logo=express)

A robust and scalable backend API for TaskFlow application built with Node.js, TypeScript, Express, and PostgreSQL

## 📌 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup](#1-clone-the-repository)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Docker Support](#docker-support)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Contact](#contact)

## 🚀 Features

- **TypeScript**: Full type safety with modern ES2022 features
- **Express.js**: Fast and lightweight web framework
- **PostgreSQL**: Reliable relational database
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Task Management**: Complete CRUD operations for tasks and projects
- **User Assignment**: Assign users to tasks with role-based permissions
- **Project Organization**: Organize tasks within projects
- **Validation**: Input validation using Zod schemas and express-validator
- **Security**: Comprehensive security with Helmet, CORS, and rate limiting
- **API Documentation**: Swagger/OpenAPI documentation
- **Logging**: Structured logging with Winston
- **Testing**: Jest testing framework with TypeScript support
- **Code Quality**: ESLint and Prettier for code formatting and linting
- **Development**: Hot reload with Nodemon and ts-node

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **TypeScript** - Programming language
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **Winston** - Logging
- **Jest** - Testing framework

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server
- **Swagger** - API documentation

## 📋 Prerequisites

- Node.js (v20 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Git

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/josueguido/TaskFlow-Api
   cd TaskFlow-Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=3000

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskflow
   DB_USER=your_username
   DB_PASSWORD=your_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
   JWT_EXPIRES_IN=7d

   # Other configurations
   BCRYPT_ROUNDS=12
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   # CORS Configuration
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
   ```

## 🗄️ Database Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE taskflow;
   ```

2. **Run Database Migrations**
   ```bash
   # If you have migration scripts
   npm run migrate
   
   # Or manually create tables using SQL scripts
   psql -U your_username -d taskflow -f database/schema.sql
   ```

3. **Seed Database (Optional)**
   ```bash
   npm run seed
   ```

## 🚀 Getting Started

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

Alternative development commands:

```bash
# Direct execution with ts-node
npm run dev:direct

# Watch mode with Node.js --watch flag
npm run dev:watch
```

### Production Mode

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

The API will be available at `http://localhost:3000`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (Admin only)

### Status
- `id` (Primary Key)
- `name` (e.g., "To Do", "In Progress", "Done")
- `description`
- `color` (hex color code)
- `is_active` (boolean)
- `created_at`
- `updated_at`

### Task History
- `id` (Primary Key)
- `task_id` (Foreign Key → Tasks)
- `user_id` (Foreign Key → Users)
- `action` (created, updated, status_changed, assigned, etc.)
- `field_name` (which field was changed)
- `old_value` (previous value)
- `new_value` (new value)
- `description` (human-readable description)
- `created_at`

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/projects/:projectId/tasks` - Get tasks by project

### Task Assignments
- `GET /api/tasks/:taskId/assignments` - Get task assignments
- `POST /api/tasks/:taskId/assign` - Assign users to task
- `DELETE /api/tasks/:taskId/assignments/:userId` - Remove user assignment
- `DELETE /api/tasks/:taskId/assignments` - Remove all assignments
- `GET /api/tasks/:taskId/assignments/:userId` - Check if user is assigned

## 📚 API Documentation

Once the server is running, you can access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

### Example API Usage

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create a task (with auth token)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Complete project","description":"Finish the TaskFlow backend","priority":"high"}'

# Update task status
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"status_id":2}'

# Get task history
curl -X GET http://localhost:3000/api/tasks/1/history \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create new status
curl -X POST http://localhost:3000/api/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"In Review","description":"Task is being reviewed","color":"#FFA500"}'
```

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- assignment.controller.test.ts
```

## 🐳 Docker Support

### Using Docker Compose

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       depends_on:
         - postgres
     
     postgres:
       image: postgres:15
       environment:
         POSTGRES_DB: taskflow
         POSTGRES_USER: taskflow_user
         POSTGRES_PASSWORD: taskflow_password
       volumes:
         - postgres_data:/var/lib/postgresql/data
       ports:
         - "5432:5432"
   
   volumes:
     postgres_data:
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🔧 Development Tools

### Code Formatting and Linting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

## 📁 Project Structure

```
TaskFlow-Backend/
├── src/
│   ├── app.ts                      # Express application setup
│   ├── server.ts                   # Server entry point
│   ├── config/
│   │   ├── swagger.ts              # Swagger configuration
│   │   └── DB/
│   │       └── index.ts            # Database connection
│   ├── controllers/                # Route controllers
│   │   ├── auth/                   # Authentication controllers
│   │   ├── users/                  # User controllers
│   │   ├── projects/               # Project controllers
│   │   └── tasks/                  # Task controllers
│   ├── errors/                     # Custom error classes
│   ├── interfaces/                 # TypeScript interfaces
│   ├── middlewares/                # Express middlewares
│   ├── models/                     # Database models
│   ├── routes/                     # API routes
│   ├── schemas/                    # Zod validation schemas
│   ├── services/                   # Business logic services
│   ├── tests/                      # Test files
│   ├── utils/                      # Utility functions
│   └── validators/                 # Input validators
├── database/                       # Database migrations and seeds
├── config/                         # Configuration files
├── logs/                          # Log files
├── dist/                          # Compiled JavaScript (after build)
├── docker/                        # Docker configuration
├── docs/                          # Additional documentation
├── jest.config.js                 # Jest configuration
├── tsconfig.json                  # TypeScript configuration
├── nodemon.json                   # Nodemon configuration
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose configuration
└── package.json                   # Dependencies and scripts
```

## 🗃️ Database Schema

The application uses PostgreSQL with the following main entities:

### Users
- `id` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `name`
- `role` (user, admin)
- `created_at`
- `updated_at`

### Tasks
- `id` (Primary Key)
- `title`
- `description`
- `status` (pending, in_progress, completed)
- `priority` (low, medium, high)
- `project_id` (Foreign Key → Projects)
- `created_by` (Foreign Key → Users)
- `due_date`
- `created_at`
- `updated_at`

### Task Assignments
- `id` (Primary Key)
- `task_id` (Foreign Key → Tasks)
- `user_id` (Foreign Key → Users)
- `assigned_at`

## 🛡️ Security Features

- **Helmet**: Sets various HTTP headers for security
- **CORS**: Cross-Origin Resource Sharing configuration
- **Rate Limiting**: Prevents abuse with request rate limiting (100 requests per 15 minutes)
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive input validation with Zod schemas
- **SQL Injection Protection**: Parameterized queries
- **XSS Protection**: Input sanitization

## 📝 Environment Variables

| Variable                  | Description                | Required | Default     |
| ------------------------ | -------------------------- | -------- | ----------- |
| NODE_ENV                 | Application environment    | No       | development |
| PORT                     | Server port                | No       | 3000        |
| DB_HOST                  | Database host              | Yes      | -           |
| DB_PORT                  | Database port              | Yes      | -           |
| DB_NAME                  | Database name              | Yes      | -           |
| DB_USER                  | Database username          | Yes      | -           |
| DB_PASSWORD              | Database password          | Yes      | -           |
| JWT_SECRET               | JWT signing secret         | Yes      | -           |
| JWT_EXPIRES_IN           | JWT expiration time        | No       | 7d          |
| BCRYPT_ROUNDS            | bcrypt hashing rounds      | No       | 12          |
| RATE_LIMIT_WINDOW_MS     | Rate limit window (ms)     | No       | 900000      |
| RATE_LIMIT_MAX_REQUESTS  | Max requests per window    | No       | 100         |
| ALLOWED_ORIGINS          | CORS allowed origins       | No       | *           |

## 🚀 Deployment

### Production Checklist

1. ✅ Set `NODE_ENV=production`
2. ✅ Configure production database
3. ✅ Set secure JWT secrets (minimum 32 characters)
4. ✅ Enable SSL/TLS
5. ✅ Configure reverse proxy (nginx/Apache)
6. ✅ Set up monitoring and logging
7. ✅ Configure backup strategy
8. ✅ Set up CI/CD pipeline

### Deployment Platforms

- **Railway**: `railway deploy`
- **Heroku**: `git push heroku main`
- **DigitalOcean**: Use Docker or PM2
- **AWS**: EC2 or Elastic Beanstalk

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check PostgreSQL service status
   sudo systemctl status postgresql
   
   # Restart PostgreSQL
   sudo systemctl restart postgresql
   ```

2. **JWT Token Issues**
   - Ensure JWT_SECRET is at least 32 characters
   - Check token expiration time
   - Verify Authorization header format: `Bearer <token>`

3. **Port Already in Use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

4. **TypeScript Compilation Errors**
   ```bash
   # Clean build and reinstall
   rm -rf dist node_modules
   npm install
   npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📊 Performance

### Monitoring

- Use Winston for logging
- Monitor response times
- Track database query performance
- Set up health checks endpoint

### Optimization Tips

- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Use connection pooling for database
- Enable compression middleware

## 📄 License

This project is licensed under the ISC License.

## 🙋‍♂️ Support

If you have any questions or issues, please:

1. Check the [Troubleshooting](#troubleshooting) section
2. Search existing issues on GitHub
3. Open a new issue with detailed information

## 📞 Contact

For questions or support, feel free to contact:

- **Author**: Josue Guido
- **Email**: josuguido@gmail.com
- **GitHub**: [Josue Guido](https://github.com/josueguido)
- **LinkedIn**: []

---

⭐ If you found this project helpful, please give it a star!
