import { RequestHandler } from "express";
import { BadRequestError } from "../../errors/BadRequestError";
import * as taskHistoryService from "../../services/tasks/taskHistory.service";
import { ICreateTaskHistory } from "@/interfaces/taskHistory.interface";


export const getTaskHistory: RequestHandler = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new BadRequestError("User ID is required");
    }

    if (!taskId) {
      throw new BadRequestError("Task ID is required");
    }

    const history = await taskHistoryService.getTaskHistoryService(taskId);
    res.json(history);
  } catch (error) {
    next(error);
  }
}

export const createTaskHistory: RequestHandler = async (req, res, next) => {
  try {
    const data: ICreateTaskHistory = req.body;
    const history = await taskHistoryService.createTaskHistoryService(data);
    res.status(201).json(history);
  } catch (error) {
    next(error);
  }
}
