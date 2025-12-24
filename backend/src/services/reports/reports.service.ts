import {
  getOverviewReport,
  getProjectProgressReport,
  getActivityReport,
  getUserWorkloadReport,
  getStatusDistributionReport,
  getCombinedReport
} from '../../models/reports.model';
import { contextLogger } from '../../utils/contextLogger';

export const getOverviewReportService = async (businessId: number) => {
  try {
    contextLogger.debug(`Getting overview report`, {
      businessId,
      action: 'GET_OVERVIEW_REPORT'
    });
    return await getOverviewReport(businessId);
  } catch (error) {
    contextLogger.error('Error getting overview report', {
      businessId,
      action: 'GET_OVERVIEW_REPORT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getProjectProgressReportService = async (businessId: number) => {
  try {
    contextLogger.debug(`Getting project progress report`, {
      businessId,
      action: 'GET_PROJECT_PROGRESS_REPORT'
    });
    return await getProjectProgressReport(businessId);
  } catch (error) {
    contextLogger.error('Error getting project progress report', {
      businessId,
      action: 'GET_PROJECT_PROGRESS_REPORT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getActivityReportService = async (businessId: number, limit?: number) => {
  try {
    contextLogger.debug(`Getting activity report`, {
      businessId,
      action: 'GET_ACTIVITY_REPORT'
    });
    return await getActivityReport(businessId, limit || 20);
  } catch (error) {
    contextLogger.error('Error getting activity report', {
      businessId,
      action: 'GET_ACTIVITY_REPORT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getUserWorkloadReportService = async (businessId: number) => {
  try {
    contextLogger.debug(`Getting user workload report`, {
      businessId,
      action: 'GET_USER_WORKLOAD_REPORT'
    });
    return await getUserWorkloadReport(businessId);
  } catch (error) {
    contextLogger.error('Error getting user workload report', {
      businessId,
      action: 'GET_USER_WORKLOAD_REPORT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getStatusDistributionReportService = async (businessId: number) => {
  try {
    contextLogger.debug(`Getting status distribution report`, {
      businessId,
      action: 'GET_STATUS_DISTRIBUTION_REPORT'
    });
    return await getStatusDistributionReport(businessId);
  } catch (error) {
    contextLogger.error('Error getting status distribution report', {
      businessId,
      action: 'GET_STATUS_DISTRIBUTION_REPORT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};

export const getCombinedReportService = async (businessId: number) => {
  try {
    contextLogger.debug(`Getting combined report`, {
      businessId,
      action: 'GET_COMBINED_REPORT'
    });
    return await getCombinedReport(businessId);
  } catch (error) {
    contextLogger.error('Error getting combined report', {
      businessId,
      action: 'GET_COMBINED_REPORT_FAILED',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
};
