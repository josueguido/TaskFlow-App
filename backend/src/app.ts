import express from 'express';
import { setupSwagger } from './config/swagger';
import { config } from 'dotenv';
import cors from "cors";
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { SwaggerUiOptions } from 'swagger-ui-express';
import { logger } from './utils/logger';
import { securityConfig } from './config/security';
import { sanitizeInput } from './middlewares/sanitize.middleware';
import { startSecurityCleanup } from './middlewares/security.cleanup';
import { preventSQLInjection } from './middlewares/prevent.SQLInjection';
import userRoutes from './routes/users/user.routes';
import taskRoutes from './routes/tasks/task.routes';
import taskHistoryRoutes from './routes/tasks/taskHistory.routes'
import assignmentRoutes from './routes/tasks/assignment.routes';
import statusRoutes from './routes/tasks/status.routes';
import authRoutes from './routes/users/auth.routes';
import roleRoutes from './routes/users/role.routes';
import projectRoutes from './routes/projects/project.routes';
import projectUsersRoutes from './routes/projects/projectUsers.routes';
import reportsRoutes from './routes/reports/reports.routes';
import { errorHandler } from './middlewares/error.handler';
import promClient from 'prom-client';
import { metricsMiddleware, errorMetricsMiddleware } from './middlewares/metrics.middleware';
import { collectDefaultMetrics } from './utils/metrics';

collectDefaultMetrics();

startSecurityCleanup();
const app = express();

app.use(cors(securityConfig.cors));

app.use(metricsMiddleware);

app.use(helmet({
  crossOriginEmbedderPolicy: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(sanitizeInput(['description', 'comment', 'search']));

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    ...securityConfig.rateLimit.general,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

app.get("/", (req, res) => {
  logger.info("GET / endpoint hit");
  res.json({ message: "TaskFlow API running with PostgreSQL!" });
});

app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task', taskHistoryRoutes)
app.use('/api/assignments', assignmentRoutes);
app.use('/api/status', statusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', projectUsersRoutes);
app.use('/api/reports', reportsRoutes);

app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});


app.use(errorMetricsMiddleware);

setupSwagger(app);

app.use(errorHandler);

const port = process.env.PORT || 3003;

export { app };
