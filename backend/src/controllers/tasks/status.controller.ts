import { RequestHandler } from "express";
import * as statusService from "../../services/tasks/status.service";
import { contextLogger } from "../../utils/contextLogger";

export const getAllStatuses: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;
    if (!businessId) {
      throw new Error('Business ID not found in request');
    }

    contextLogger.debug(`Getting all statuses`, {
      businessId,
      action: 'GET_ALL_STATUSES'
    });
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

    contextLogger.debug(`Getting status`, {
      statusId: id,
      businessId,
      action: 'GET_STATUS'
    });
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

    contextLogger.info(`Creating status`, {
      statusName: name,
      businessId: business_id,
      action: 'CREATE_STATUS'
    });
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

    contextLogger.info(`Updating status`, {
      statusId: id,
      statusName: name,
      businessId,
      action: 'UPDATE_STATUS'
    });
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

    contextLogger.info(`Deleting status`, {
      statusId: id,
      businessId,
      action: 'DELETE_STATUS'
    });
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
