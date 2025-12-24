import { RequestHandler } from 'express';
import * as reportsService from '../../services/reports/reports.service';
import { BadRequestError } from '../../errors/BadRequestError';
import { contextLogger } from '../../utils/contextLogger';

export const getOverviewReport: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
      throw new BadRequestError('Business ID not found in request');
    }

    contextLogger.debug(`Getting overview report`, {
      businessId,
      action: 'GET_OVERVIEW_REPORT'
    });

    const report = await reportsService.getOverviewReportService(businessId);

    res.json({
      success: true,
      message: 'Overview report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectProgressReport: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
    contextLogger.debug(`Getting project progress report`, {
      businessId,
      action: 'GET_PROJECT_PROGRESS_REPORT'
    }
    }

    logger.info(`[REPORTS_CTRL] Getting project progress report for business ${businessId}`);

    const report = await reportsService.getProjectProgressReportService(businessId);

    res.json({
      success: true,
      message: 'Project progress report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getActivityReport: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;
    const { limit } = req.query;

    if (!businessId) {
    contextLogger.debug(`Getting activity report`, {
      businessId,
      action: 'GET_ACTIVITY_REPORT'
    }
    }

    logger.info(`[REPORTS_CTRL] Getting activity report for business ${businessId}`);

    const report = await reportsService.getActivityReportService(
      businessId,
      limit ? Number(limit) : 20
    );

    res.json({
      success: true,
      message: 'Activity report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWorkloadReport: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
    contextLogger.debug(`Getting user workload report`, {
      businessId,
      action: 'GET_USER_WORKLOAD_REPORT'
    }
    }

    logger.info(`[REPORTS_CTRL] Getting user workload report for business ${businessId}`);

    const report = await reportsService.getUserWorkloadReportService(businessId);

    res.json({
      success: true,
      message: 'User workload report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getStatusDistributionReport: RequestHandler = async (req, res, next) => {
  try {
    const businessId = (req as any).user?.business_id;

    if (!businessId) {
    contextLogger.debug(`Getting status distribution report`, {
      businessId,
      action: 'GET_STATUS_DISTRIBUTION_REPORT'
    }
    }

    logger.info(`[REPORTS_CTRL] Getting status distribution report for business ${businessId}`);

    const report = await reportsService.getStatusDistributionReportService(businessId);

    res.json({
      success: true,
      message: 'Status distribution report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getCombinedReport: RequestHandler = async (req, res, next) => {
  try {
    contextLogger.debug(`Getting combined report`, {
      businessId,
      action: 'GET_COMBINED_REPORT'
    }

    if (!businessId) {
      throw new BadRequestError('Business ID not found in request');
    }

    logger.info(`[REPORTS_CTRL] Getting combined report for business ${businessId}`);

    const report = await reportsService.getCombinedReportService(businessId);

    res.json({
      success: true,
      message: 'Combined report retrieved successfully',
      data: report
    });
  } catch (error) {
    next(error);
  }
};
