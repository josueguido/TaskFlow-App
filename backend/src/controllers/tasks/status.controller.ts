import { RequestHandler } from "express";
import * as statusService from "../../services/tasks/status.service";
import { logger } from "../../utils/logger";

export const getAllStatuses: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;
    if (!businessId) {
      throw new Error('Business ID not found in request');
    }

    logger.info(`[STATUS] Getting all statuses for business ${businessId}`);
    const statuses = await statusService.getStatuses(businessId);

    res.json({
      success: true,
      message: 'Statuses retrieved successfully',
      data: statuses
    });
  } catch (error) {
    next(error);
  }
}

export const getStatusById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
      throw new Error('Business ID not found in request');
    }

    logger.info(`[STATUS] Getting status ${id} for business ${businessId}`);
    const status = await statusService.getStatusByIdService(id, businessId);

    res.json({
      success: true,
      message: 'Status retrieved successfully',
      data: status
    });
  } catch (error) {
    next(error);
  }
}

export const createStatus: RequestHandler = async (req, res, next) => {
  try {
    const { name, order, business_id } = req.body;

    logger.info(`[STATUS] Creating status: ${name} for business ${business_id}`);
    const status = await statusService.createStatusService({ name, order, business_id });

    res.status(201).json({
      success: true,
      message: 'Status created successfully',
      data: status
    });
  } catch (error) {
    next(error);
  }
}

export const updateStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, order } = req.body;
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
      throw new Error('Business ID not found in request');
    }

    logger.info(`[STATUS] Updating status ${id} for business ${businessId}`);
    const status = await statusService.updateStatusService(Number(id), businessId, { name, order });

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: status
    });
  } catch (error) {
    next(error);
  }
}

export const deleteStatus: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
      throw new Error('Business ID not found in request');
    }

    logger.info(`[STATUS] Deleting status ${id} for business ${businessId}`);
    const status = await statusService.deleteStatusService(Number(id), businessId);

    res.json({
      success: true,
      message: 'Status deleted successfully',
      data: status
    });
  } catch (error) {
    next(error);
  }
}
