import { RequestHandler } from "express";
import * as assignmentService from "../../services/tasks/assignment.service";
import { BadRequestError } from "../../errors/BadRequestError";

export const getAllAssignments: RequestHandler = async (req, res, next) => {
  try {
    const assignments = await assignmentService.getAllAssignments();
    res.json(assignments);
  } catch (error) {
    next(error);
  }
}

export const getAssignmentsByTaskId: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      throw new BadRequestError("Task ID is required");
    }
    const assignments = await assignmentService.getAssignmentsByTaskIdService(taskId);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
}

export const assignUsersToTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { userIds } = req.body;
    const assignments = await assignmentService.assignUsersToTaskService(taskId, userIds);
    res.status(201).json(assignments);
  } catch (error) {
    next(error)
  }
}

export const removeAssignment: RequestHandler = async (req, res, next) => {
  try {
    const { taskId, userId } = req.params;
    if (!taskId || !userId) {
      throw new BadRequestError("Task ID and User ID are required");
    }
    const assignment = await assignmentService.removeAssignmentService(taskId, userId);
    res.json(assignment);
  } catch (error) {
    next(error);
  }
}

export const removeAllAssignments: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    if (!taskId) {
      throw new BadRequestError("Task ID is required");
    }
    const assignments = await assignmentService.removeAllAssignmentsService(taskId);
    res.json(assignments);
  } catch (error) {
    next(error);
  }
}

export const isUserAssignedToTask: RequestHandler = async (req, res, next) => {
  try {
    const { taskId, userId } = req.params;
    if (!taskId || !userId) {
      throw new BadRequestError("Task ID and User ID are required");
    }
    const isAssigned = await assignmentService.isUserAssignedToTaskService(taskId, userId);
    res.json({ isAssigned });
  } catch (error) {
    next(error);
  }
}
