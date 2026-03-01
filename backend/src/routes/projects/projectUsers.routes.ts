import { Router } from 'express';
import * as projectUsersCtrl from '../../controllers/projects/projectUsers.controller';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import {
  addUserToProjectSchema,
  updateUserRoleSchema,
  projectUserIdSchema
} from '../../schemas/projectUsers.schema';

const router = Router();

router.use(authMiddleware);

router.get('/:projectId/users', projectUsersCtrl.getProjectUsers);

router.get('/:projectId/users/me/role', projectUsersCtrl.getUserRole);

router.post(
  '/:projectId/users',
  validateRequest(addUserToProjectSchema),
  projectUsersCtrl.addUserToProject
);

router.put(
  '/:projectId/users/:userId',
  validateRequest(updateUserRoleSchema),
  projectUsersCtrl.updateUserRole
);

router.delete(
  '/:projectId/users/:userId',
  validateRequest(projectUserIdSchema),
  projectUsersCtrl.removeUserFromProject
);

// router.get('/me/all', projectUsersCtrl.getUserProjects);

export default router;
