import {
  getOverviewReport,
  getProjectProgressReport,
  getActivityReport,
  getUserWorkloadReport,
  getStatusDistributionReport,
  getCombinedReport
} from '../../models/reports.model';
import { logger } from '../../utils/logger';

export const getOverviewReportService = async (businessId: number) => {
  try {
    logger.info(`[REPORTS] Getting overview report for business ${businessId}`);
    return await getOverviewReport(businessId);
  } catch (error) {
    logger.error('[REPORTS] Error getting overview report:', error);
    throw error;
  }
};

export const getProjectProgressReportService = async (businessId: number) => {
  try {
    logger.info(`[REPORTS] Getting project progress report for business ${businessId}`);
    return await getProjectProgressReport(businessId);
  } catch (error) {
    logger.error('[REPORTS] Error getting project progress report:', error);
    throw error;
  }
};

export const getActivityReportService = async (businessId: number, limit?: number) => {
  try {
    logger.info(`[REPORTS] Getting activity report for business ${businessId}`);
    return await getActivityReport(businessId, limit || 20);
  } catch (error) {
    logger.error('[REPORTS] Error getting activity report:', error);
    throw error;
  }
};

export const getUserWorkloadReportService = async (businessId: number) => {
  try {
    logger.info(`[REPORTS] Getting user workload report for business ${businessId}`);
    return await getUserWorkloadReport(businessId);
  } catch (error) {
    logger.error('[REPORTS] Error getting user workload report:', error);
    throw error;
  }
};

export const getStatusDistributionReportService = async (businessId: number) => {
  try {
    logger.info(`[REPORTS] Getting status distribution report for business ${businessId}`);
    return await getStatusDistributionReport(businessId);
  } catch (error) {
    logger.error('[REPORTS] Error getting status distribution report:', error);
    throw error;
  }
};

export const getCombinedReportService = async (businessId: number) => {
  try {
    logger.info(`[REPORTS] Getting combined report for business ${businessId}`);
    return await getCombinedReport(businessId);
  } catch (error) {
    logger.error('[REPORTS] Error getting combined report:', error);
    throw error;
  }
};
