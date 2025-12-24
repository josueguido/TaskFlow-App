# 📊 Guía de Logging - TaskFlow Backend

## Overview
El backend utiliza **Winston** como logger con soporte para ELK Stack. Los logs se registran en formato JSON para análisis centralizado.

---

## 🎯 Estructura de Logs

### Componentes
- **timestamp**: Hora exacta del evento (ISO 8601)
- **level**: `debug`, `info`, `warn`, `error`
- **message**: Descripción del evento
- **service**: `taskflow-backend` (automático)
- **environment**: `development` o `production` (automático)
- **hostname**: Máquina donde corre la aplicación (automático)
- **requestId**: ID único por solicitud HTTP (automático)
- **userId**: ID del usuario autenticado (automático)
- **metadata**: Información adicional relevante

### Ejemplo de Log Registrado
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

## 🔧 Cómo Usarlo

### 1. Logs de Negocio (Recomendado)
Usa `contextLogger` para que se propague automáticamente `requestId` y `userId`:

```typescript
import { contextLogger } from '../utils/contextLogger';

// Info - evento exitoso
contextLogger.info('User added to project successfully', {
  projectId: 45,
  userId: 123,
  role: 'admin',
  action: 'ADD_USER_TO_PROJECT_SUCCESS'
});

// Error - con contexto
contextLogger.error('Failed to add user to project', {
  projectId: 45,
  userId: 123,
  reason: 'User already exists',
  action: 'ADD_USER_TO_PROJECT_FAILED'
});

// Warn - situación anómala recuperable
contextLogger.warn('Slow database query detected', {
  query: 'getProjectUsers',
  duration: 1250,
  threshold: 1000
});

// Debug - información para desarrollo
contextLogger.debug('Project loaded from cache', {
  projectId: 45,
  cacheAge: 305
});
```

### 2. Logs Manuales (Contextos Especiales)
Cuando necesites incluir metadata específica:

```typescript
import { logger } from '../utils/logger';

logger.info('Payment processed', {
  requestId: req.id,  // Obligatorio si no usas contextLogger
  userId: req.user?.userId,
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  transactionId: 'tx_123456',
  action: 'PAYMENT_PROCESSED'
});
```

---

## 📋 Niveles de Log

| Nivel | Cuándo Usar | Ejemplo |
|-------|------------|---------|
| **debug** | Desarrollo, troubleshooting | `Cache miss para projectId: 45` |
| **info** | Eventos de negocio normales | Usuario creado, proyecto actualizado |
| **warn** | Situaciones anómalas recuperables | Timeout en BD, reintentos, degradación |
| **error** | Fallos que requieren atención | Excepción no controlada, BD caída |

---

## 🎬 Patrones de Eventos

### Operaciones CRUD
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
  source: 'database' // o 'cache'
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

### Operaciones Críticas
```typescript
// Cambios de rol/permisos
contextLogger.warn('Admin privileges granted', {
  action: 'GRANT_ADMIN_PRIVILEGES',
  targetUserId: 456,
  grantedBy: req.user?.userId,
  timestamp: new Date().toISOString()
});

// Fallos de seguridad
contextLogger.error('Unauthorized access attempt', {
  action: 'UNAUTHORIZED_ACCESS',
  targetResource: '/api/projects/45',
  userRole: 'member',
  requiredRole: 'admin'
});
```

---

## 📍 Dónde se Guardan

### Desarrollo
```
logs/
  combined-2025-12-24.log   # Todos los logs (info, warn, error)
  error-2025-12-24.log      # Solo errores
```

### Producción (con ELK)
- **Elasticsearch**: Logs indexados por timestamp, searchables
- **Logstash**: Procesamiento, enriquecimiento de logs
- **Kibana**: Dashboards y análisis visual

---

## 🔍 Queries Útiles en Kibana (Futuro)

```json
// Todos los errores de un usuario
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

// Operaciones lentas (> 1s)
{
  "query": {
    "range": {
      "duration": { "gte": 1000 }
    }
  }
}

// Cambios de rol en último día
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

## ✅ Checklist para Code Review

- [ ] ¿Se logueó el inicio de la operación?
- [ ] ¿Se logueó el resultado exitoso con timestamp?
- [ ] ¿Se logueó el error con contexto suficiente?
- [ ] ¿Incluye `action` para auditoria?
- [ ] ¿Se usa `contextLogger` en lugar de `logger` (excepción: error handler)?
- [ ] ¿Hay información sensible (passwords, tokens) en los logs? ❌ NO
- [ ] ¿Los metadatos son suficientes para troubleshooting?

---

## 🚨 Qué NO Hacer

```typescript
// ❌ EVITAR: Información sensible
logger.info('User logged in', {
  password: user.password,  // NUNCA
  token: authToken,         // NUNCA
  ssn: '123-45-6789'        // NUNCA
});

// ❌ EVITAR: Mensaje genérico sin contexto
logger.error('Error occurred');

// ❌ EVITAR: Logs en strings dinámicos sin estructura
logger.info(`User ${id} did ${action} on ${resource}`);
// Mejor:
contextLogger.info('User action performed', {
  userId: id,
  action,
  resource
});
```

---

## 📚 Referencias

- Winston Docs: https://github.com/winstonjs/winston
- ELK Stack: https://www.elastic.co/what-is/elk-stack
- Structured Logging: https://stackify.com/what-is-structured-logging/
