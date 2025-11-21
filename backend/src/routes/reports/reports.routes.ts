import { Router } from 'express';
import * as reportsController from '../../controllers/reports/reports.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /api/reports/overview - Resumen general (totales y % completados)
router.get('/overview', reportsController.getOverviewReport);

// GET /api/reports/projects - Progreso por proyecto
router.get('/projects', reportsController.getProjectProgressReport);

// GET /api/reports/activity - Últimos cambios en tareas
router.get('/activity', reportsController.getActivityReport);

// GET /api/reports/users - Carga de trabajo por usuario
router.get('/users', reportsController.getUserWorkloadReport);

// GET /api/reports/statuses - Distribución de tareas por estado
router.get('/statuses', reportsController.getStatusDistributionReport);

// GET /api/reports/combined - Reporte completo (todos los datos)
router.get('/combined', reportsController.getCombinedReport);

export default router;
