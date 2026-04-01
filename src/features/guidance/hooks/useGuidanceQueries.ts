import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { guidanceService, GuidanceParams } from "../services/guidance.service";
import { ApiResponse, GuidanceLog, Proposal } from "@/types";

export const guidanceKeys = {
  all: ["guidance"] as const,
  lists: () => [...guidanceKeys.all, "list"] as const,
  list: (params?: GuidanceParams) => [...guidanceKeys.lists(), params] as const,
  myLogs: () => [...guidanceKeys.all, "my-logs"] as const,
  bySkripsi: (skripsiId: string) => [...guidanceKeys.all, "by-skripsi", skripsiId] as const,
};

export const useMyGuidanceLogsQuery = () => {
  return useQuery<{ proposal: Proposal | null; logs: GuidanceLog[] }>({
    queryKey: guidanceKeys.myLogs(),
    queryFn: () => guidanceService.getMyGuidanceLogs().then((res: AxiosResponse<ApiResponse<{ proposal: Proposal | null; logs: GuidanceLog[] }>>) => res.data.data),
  });
};

export const useGuidanceLogsQuery = (skripsiId?: string) => {
  return useQuery<{ proposal: Proposal; logs: GuidanceLog[] }>({
    queryKey: guidanceKeys.bySkripsi(skripsiId || ""),
    queryFn: () => guidanceService.getGuidanceLogs(skripsiId!).then((res: AxiosResponse<ApiResponse<{ proposal: Proposal; logs: GuidanceLog[] }>>) => res.data.data),
    enabled: !!skripsiId,
    placeholderData: keepPreviousData,
  });
};

export const useAllGuidanceLogsQuery = (params?: GuidanceParams) => {
  return useQuery<{ data: GuidanceLog[]; total: number; page: number; limit: number }>({
    queryKey: guidanceKeys.list(params),
    queryFn: () => guidanceService.getAllGuidanceLogsForLecturer(params).then((res: AxiosResponse<ApiResponse<{ data: GuidanceLog[]; total: number; page: number; limit: number }>>) => res.data.data),
    placeholderData: keepPreviousData,
  });
};

// Aliases for compatibility during migration
export const useMyGuidanceLogs = () => {
  const query = useMyGuidanceLogsQuery();
  return {
    thesis: query.data?.proposal,
    logs: query.data?.logs || [],
    isLoading: query.isLoading,
    isError: query.isError,
    mutate: query.refetch,
    data: query.data
  };
};

export const useGuidanceLogs = (skripsiId?: string) => {
  const query = useGuidanceLogsQuery(skripsiId);
  return {
    proposal: query.data?.proposal,
    logs: query.data?.logs || [],
    isLoading: query.isLoading,
    isError: query.isError,
    mutate: query.refetch,
  };
};

export const useAllGuidanceLogsForLecturer = (params?: GuidanceParams) => {
  const query = useAllGuidanceLogsQuery(params);
  return {
    logs: query.data?.data || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 10,
    isLoading: query.isLoading,
    isError: query.isError,
    mutate: query.refetch,
  };
};
