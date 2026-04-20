import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import reportAPI, { CallLogsParams, CallLogsResponse } from '../lib/api/reports';

// Query Keys
export const callLogsQueryKeys = {
  all: ['call-logs'] as const,
  tata: () => [...callLogsQueryKeys.all, 'tata'] as const,
  vi: () => [...callLogsQueryKeys.all, 'vi'] as const,
  combined: () => [...callLogsQueryKeys.all, 'combined'] as const,
  byParams: (source: string, params?: CallLogsParams) =>
    [...callLogsQueryKeys.all, source, params] as const,
};

/**
 * Hook to fetch TATA call logs
 */
export const useTataCallLogs = (
  params?: CallLogsParams,
  options?: Omit<UseQueryOptions<CallLogsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  console.log('🎣 useTataCallLogs hook called with params:', params);
  
  return useQuery<CallLogsResponse, Error>({
    queryKey: callLogsQueryKeys.byParams('tata', params),
    queryFn: async () => {
      console.log('🚀 Fetching TATA call logs with params:', params);
      const response = await reportAPI.getTataCallLogs(params);
      console.log('✅ TATA call logs fetched:', response);
      return response;
    },
    enabled: true, // Always enabled
    ...options,
  });
};

/**
 * Hook to fetch VI call logs
 */
export const useVICallLogs = (
  params?: CallLogsParams,
  options?: Omit<UseQueryOptions<CallLogsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  console.log('🎣 useVICallLogs hook called with params:', params);
  
  return useQuery<CallLogsResponse, Error>({
    queryKey: callLogsQueryKeys.byParams('vi', params),
    queryFn: async () => {
      console.log('🚀 Fetching VI call logs with params:', params);
      const response = await reportAPI.getVICallLogs(params);
      console.log('✅ VI call logs fetched:', response);
      return response;
    },
    enabled: true, // Always enabled
    ...options,
  });
};

/**
 * Hook to fetch combined call logs
 */
export const useCombinedCallLogs = (
  params?: CallLogsParams,
  options?: Omit<UseQueryOptions<CallLogsResponse, Error>, 'queryKey' | 'queryFn'>
) => {
  console.log('🎣 useCombinedCallLogs hook called with params:', params);
  
  return useQuery<CallLogsResponse, Error>({
    queryKey: callLogsQueryKeys.byParams('combined', params),
    queryFn: async () => {
      console.log('🚀 Fetching Combined call logs with params:', params);
      const response = await reportAPI.getCombinedCallLogs(params);
      console.log('✅ Combined call logs fetched:', response);
      return response;
    },
    enabled: true, // Always enabled
    ...options,
  });
};

/**
 * Generic mutation hook for any source
 */
export const useCallLogsMutation = (
  source: 'tata' | 'vi' | 'combined' | 'airtel',
  options?: Omit<UseMutationOptions<CallLogsResponse, Error, CallLogsParams>, 'mutationFn'>
) => {
  const getFunction = {
    tata: reportAPI.getTataCallLogs,
    vi: reportAPI.getVICallLogs,
    combined: reportAPI.getCombinedCallLogs,
    airtel: reportAPI.getAirtelCallLogs,
  }[source];

  return useMutation<CallLogsResponse, Error, CallLogsParams>({
    mutationFn: (params) => {
      console.log(`🚀 Mutating ${source} call logs with:`, params);
      return getFunction(params);
    },
    ...options,
  });
};
