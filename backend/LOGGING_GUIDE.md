# Logging Guide - TaskFlow Backend

## Overview
The backend uses **Winston** as logger with ELK Stack support. Logs are recorded in JSON format for centralized analysis.

---

## Log Structure

### Fields
- **timestamp**: Event time (ISO 8601)
- **level**: `debug`, `info`, `warn`, `error`
- **message**: Event description
- **service**: `taskflow-backend` (automatic)
- **environment**: `development` or `production` (automatic)
- **hostname**: Machine hostname (automatic)
- **requestId**: Unique ID per HTTP request (automatic via `loggingMiddleware`)
- **userId**: Authenticated user ID (automatic, populated by `authMiddleware` after token decode)
- **metadata**: Additional relevant information

### Example Log Output
```json
{
  "timestamp": "2025-12-24 10:30:45.123",
  "level": "info",
  "message": "User added to project successfully",
  "service": "taskflow-backend",
  "environment": "production",
  "hostname": "prod-server-01",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "123",
  "projectId": 45,
  "role": "admin",
  "action": "ADD_USER_TO_PROJECT_SUCCESS"
}
```

---

## Usage

### 1. Business Logs (Recommended)
Use `contextLogger` to automatically propagate `requestId` and `userId`:

```typescript
import { contextLogger } from '../utils/contextLogger';

// Info - successful event
contextLogger.info('User added to project successfully', {
  projectId: 45,
  userId: 123,
  role: 'admin',
  action: 'ADD_USER_TO_PROJECT_SUCCESS'
});

// Error - with context
contextLogger.error('Failed to add user to project', {
  projectId: 45,
  userId: 123,
  reason: 'User already exists',
  action: 'ADD_USER_TO_PROJECT_FAILED'
});

// Warn - recoverable anomaly
contextLogger.warn('Slow database query detected', {
  query: 'getProjectUsers',
  duration: 1250,
  threshold: 1000
});

// Debug - development information
contextLogger.debug('Project loaded from cache', {
  projectId: 45,
  cacheAge: 305
});
```

### 2. Manual Logs (Special Contexts)
When you need to include specific metadata outside the request context:

```typescript
import { logger } from '../utils/logger';

logger.info('Payment processed', {
  requestId: req.id,  // Required if not using contextLogger
  userId: req.user?.userId,
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  transactionId: 'tx_123456',
  action: 'PAYMENT_PROCESSED'
});
```

---

## Log Levels

| Level | When to Use | Example |
|-------|-------------|---------|
| **debug** | Development, troubleshooting | `Cache miss for projectId: 45` |
| **info** | Normal business events | User created, project updated |
| **warn** | Recoverable anomalies | DB timeout, retries, degradation |
| **error** | Failures requiring attention | Unhandled exception, DB down |

---

## Important Rules

### One log per event
Do **not** log the same event twice at different levels. Pick the appropriate level and log once with structured metadata:

```typescript
// BAD - duplicate log
contextLogger.debug('Getting report', { action: 'GET_REPORT' });
contextLogger.info(`[CTRL] Getting report for business ${id}`);

// GOOD - single structured log
contextLogger.debug('Getting report', {
  businessId,
  action: 'GET_REPORT'
});
```

### Always use structured metadata
Never embed values in the message string. Pass them as metadata fields for proper querying in ELK:

```typescript
// BAD - unstructured
contextLogger.info(`User ${id} created project ${projectId}`);

// GOOD - structured
contextLogger.info('Project created', {
  userId: id,
  projectId,
  action: 'CREATE_PROJECT'
});
```

### Log objects directly, never stringify
Pass objects as-is for proper indexing. Only use `JSON.stringify` in human-readable messages (e.g., error responses):

```typescript
// BAD - stringified object in structured log
contextLogger.error('Validation error', {
  errors: JSON.stringify(formatted)
});

// GOOD - object passed directly
contextLogger.error('Validation error', {
  errors: formatted
});
```

---

## Request Context Flow

The `requestId` and `userId` are automatically attached to all `contextLogger` calls:

1. **`loggingMiddleware`** creates the `requestContext` with a `requestId` (from header or UUID)
2. **`authMiddleware`** patches `requestContext.getStore().userId` after decoding the JWT token
3. Any subsequent `contextLogger.*()` call includes both fields automatically

> **Note:** `userId` is only available after `authMiddleware` runs. Logs before auth (e.g., in public endpoints) will have `userId: undefined`.

---

## Event Patterns

### CRUD Operations
```typescript
// CREATE
contextLogger.info('User created', {
  action: 'CREATE_USER',
  userId: newUser.id,
  email: newUser.email
});

// READ
contextLogger.debug('Project loaded', {
  action: 'READ_PROJECT',
  projectId: 45,
  source: 'database' // or 'cache'
});

// UPDATE
contextLogger.info('Task status updated', {
  action: 'UPDATE_TASK_STATUS',
  taskId: 102,
  oldStatus: 'pending',
  newStatus: 'completed'
});

// DELETE
contextLogger.info('User removed from project', {
  action: 'DELETE_PROJECT_USER',
  projectId: 45,
  userId: 123
});
```

### Critical Operations
```typescript
// Role/permission changes
contextLogger.warn('Admin privileges granted', {
  action: 'GRANT_ADMIN_PRIVILEGES',
  targetUserId: 456,
  grantedBy: req.user?.userId
});

// Security failures
contextLogger.error('Unauthorized access attempt', {
  action: 'UNAUTHORIZED_ACCESS',
  targetResource: '/api/projects/45',
  userRole: 'member',
  requiredRole: 'admin'
});
```

---

## Log Storage

### Development
```
logs/
  combined-2025-12-24.log   # All logs (debug, info, warn, error)
  error-2025-12-24.log      # Errors only
```

Files rotate daily (`winston-daily-rotate-file`):
- Combined logs: max 20MB per file, retained 14 days
- Error logs: max 20MB per file, retained 30 days

### Production (with ELK)
- **Elasticsearch**: Logs indexed by timestamp, searchable
- **Logstash**: Processing, enrichment pipeline
- **Kibana**: Dashboards and visual analysis

---

## Useful Kibana Queries

```json
// All errors for a specific user
{
  "query": {
    "bool": {
      "must": [
        { "match": { "userId": "123" } },
        { "match": { "level": "error" } }
      ]
    }
  }
}

// Slow operations (> 1s)
{
  "query": {
    "range": {
      "duration": { "gte": 1000 }
    }
  }
}

// Role changes in the last day
{
  "query": {
    "bool": {
      "must": [
        { "match": { "action": "UPDATE_USER_ROLE*" } },
        { "range": { "timestamp": { "gte": "now-1d" } } }
      ]
    }
  }
}
```

---

## Code Review Checklist

- [ ] Is the operation start logged (at `debug` level)?
- [ ] Is the successful result logged with relevant metadata?
- [ ] Are errors logged with enough context for troubleshooting?
- [ ] Does the log include an `action` field for auditing?
- [ ] Is `contextLogger` used instead of `logger` (exception: error handler)?
- [ ] Is there **no** sensitive data (passwords, tokens) in the logs?
- [ ] Is there only **one** log entry per event (no duplicates)?
- [ ] Are metadata objects passed directly (not `JSON.stringify`)?

---

## What NOT to Do

```typescript
// AVOID: Sensitive information
logger.info('User logged in', {
  password: user.password,  // NEVER
  token: authToken,         // NEVER
  ssn: '123-45-6789'        // NEVER
});

// AVOID: Generic message without context
logger.error('Error occurred');

// AVOID: Dynamic strings without structure
logger.info(`User ${id} did ${action} on ${resource}`);
// Better:
contextLogger.info('User action performed', {
  userId: id,
  action,
  resource
});

// AVOID: Duplicate logs for the same event
contextLogger.debug('Fetching data', { action: 'FETCH' });
contextLogger.info('[CTRL] Fetching data');  // redundant
```

---

## References

- Winston Docs: https://github.com/winstonjs/winston
- ELK Stack: https://www.elastic.co/what-is/elk-stack
- Structured Logging: https://stackify.com/what-is-structured-logging/
