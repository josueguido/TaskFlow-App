import { Router } from 'express';
import * as taskHistoryController from '../../controllers/tasks/taskHistory.controller';
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { createTaskHistorySchema } from '../../schemas/taskHistory.schema';
import { taskIdSchema } from '../../schemas/assignment.schema';
const router = Router();

router.get(
  '/:taskId/history',
  validateRequest(taskIdSchema),
  taskHistoryController.getTaskHistory
);

router.post(
  '/history',
  validateRequest(createTaskHistorySchema),
  taskHistoryController.createTaskHistory
);

export default router;
