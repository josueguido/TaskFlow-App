import { Router } from 'express';
import {
  getProjectsByBusinessId,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats
} from '../../controllers/projects/project.controller';
import {
  validate,
  validateProjectId,
  validateBusinessId
} from '../../validators/projects/project.validator';
import { createProjectSchema, updateProjectSchema } from '../../schemas/project.schema';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.get(
  '/business/:businessId',
  authMiddleware,
  validateBusinessId,
  getProjectsByBusinessId
);

router.get(
  '/business/:businessId/stats',
  authMiddleware,
  validateBusinessId,
  getProjectStats
);

router.get(
  '/:id',
  authMiddleware,
  validateProjectId,
  getProjectById
);

router.post(
  '/',
  authMiddleware,
  validate(createProjectSchema),
  createProject
);

router.put(
  '/:id',
  authMiddleware,
  validateProjectId,
  validate(updateProjectSchema),
  updateProject
);

router.delete(
  '/:id',
  authMiddleware,
  validateProjectId,
  deleteProject
);

export default router;
