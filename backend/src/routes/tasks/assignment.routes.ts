import { Router } from "express";
import * as assignmentController from "../../controllers/tasks/assignment.controller";
import { validateRequest } from '../../middlewares/validateRequest.middleware';
import { assignUsersSchema, assignmentParamsSchema, taskIdSchema } from '../../schemas/assignment.schema';

const router = Router();

router.get('/', assignmentController.getAllAssignments);

router.get('/:taskId',
  validateRequest(taskIdSchema),
  assignmentController.getAssignmentsByTaskId
);

router.post('/:taskId',
  validateRequest(taskIdSchema),
  validateRequest(assignUsersSchema),
  assignmentController.assignUsersToTask
);

router.delete('/:taskId',
  validateRequest(taskIdSchema),
  assignmentController.removeAllAssignments
);

router.delete('/:taskId/:userId',
  validateRequest(assignmentParamsSchema),
  assignmentController.removeAssignment
);

router.get('/:taskId/:userId/check',
  validateRequest(assignmentParamsSchema),
  assignmentController.isUserAssignedToTask
);

export default router;
