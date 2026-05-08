import { Router } from 'express';
import {
  getProjectsByBusinessId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from '../../controllers/projects/project.controller';
import {
  validate,
  validateProjectId,
  validateBusinessId,
} from '../../validators/projects/project.validator';
import { createProjectSchema, updateProjectSchema } from '../../schemas/project.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { cacheResponse } from '../../middlewares/cache.middleware';

const router = Router();

router.get('/business/:businessId', authMiddleware, validateBusinessId, cacheResponse(60), getProjectsByBusinessId);

router.get('/business/:businessId/stats', authMiddleware, validateBusinessId, cacheResponse(60), getProjectStats);

router.get('/:id', authMiddleware, validateProjectId, cacheResponse(60), getProjectById);

router.post('/', authMiddleware, validate(createProjectSchema), createProject);

router.put('/:id', authMiddleware, validateProjectId, validate(updateProjectSchema), updateProject);

router.delete('/:id', authMiddleware, validateProjectId, deleteProject);

export default router;
