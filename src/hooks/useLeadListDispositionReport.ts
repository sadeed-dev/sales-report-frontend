import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import reportAPI, {
  LeadListReportParams,
  LeadListDispositionResponse,
} from '../lib/api/reports';

export const leadListReportQueryKeys = {
  all: ['lead-list-disposition-report'] as const,
  byParams: (params?: LeadListReportParams) =>
    [...leadListReportQueryKeys.all, params] as const,
};

export const useLeadListDispositionReport = (
  params?: LeadListReportParams,
  options?: Omit<
    UseQueryOptions<LeadListDispositionResponse, Error>,
    'queryKey' | 'queryFn'
  >
) => {
  return useQuery<LeadListDispositionResponse, Error>({
    queryKey: leadListReportQueryKeys.byParams(params),
    queryFn: () => reportAPI.getLeadListDispositionReport(params),
    ...options,
  });
};
