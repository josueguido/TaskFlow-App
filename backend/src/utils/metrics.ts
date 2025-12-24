import promClient from 'prom-client';

export const collectDefaultMetrics = () => {
  promClient.collectDefaultMetrics();
};

export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const errorTotal = new promClient.Counter({
  name: 'errors_total',
  help: 'Total number of errors',
  labelNames: ['error_type', 'route'],
});

export const dbQueryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['query_type', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
});

export const dbActiveConnections = new promClient.Gauge({
  name: 'db_active_connections',
  help: 'Number of active database connections',
});

export const authenticatedUsers = new promClient.Gauge({
  name: 'authenticated_users_total',
  help: 'Total number of authenticated users',
});

export const tasksCreated = new promClient.Counter({
  name: 'tasks_created_total',
  help: 'Total number of tasks created',
  labelNames: ['project_id'],
});

export const tasksCompleted = new promClient.Counter({
  name: 'tasks_completed_total',
  help: 'Total number of tasks completed',
  labelNames: ['project_id'],
});

export const activeProjects = new promClient.Gauge({
  name: 'active_projects',
  help: 'Number of active projects',
});
