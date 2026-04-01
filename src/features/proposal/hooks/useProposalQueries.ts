import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { proposalService, ProposalParams } from "../services/proposal.service";
import { PaginatedResponse, Proposal, Theme, MyThesisResponse, Period, ApiResponse } from "@/types";

export const proposalKeys = {
  all: ["proposals"] as const,
  lists: () => [...proposalKeys.all, "list"] as const,
  list: (params?: ProposalParams) => [...proposalKeys.lists(), params] as const,
  details: () => [...proposalKeys.all, "detail"] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
  themes: (mhsId?: string) => [...proposalKeys.all, "themes", mhsId] as const,
  periods: () => [...proposalKeys.all, "periods"] as const,
};

export const useAllProposalsQuery = (params?: ProposalParams) => {
  return useQuery<PaginatedResponse<Proposal>>({
    queryKey: proposalKeys.list(params),
    queryFn: () => proposalService.getAllProposals(params).then((res: AxiosResponse<ApiResponse<PaginatedResponse<Proposal>>>) => res.data.data),
    placeholderData: keepPreviousData,
  });
};

export const useAllProposals = useAllProposalsQuery;

export const useProposalByIdQuery = (id: string | null) => {
  return useQuery<Proposal>({
    queryKey: proposalKeys.detail(id || ""),
    queryFn: () => proposalService.getProposalById(id!).then((res: AxiosResponse<ApiResponse<Proposal>>) => res.data.data),
    enabled: !!id,
  });
};

export const useThemesQuery = (mhsId?: string) => {
  return useQuery<Theme[]>({
    queryKey: proposalKeys.themes(mhsId),
    queryFn: () => proposalService.getThemes(mhsId).then((res: AxiosResponse<ApiResponse<Theme[]>>) => res.data.data),
  });
};

export const usePeriodsQuery = () => {
  return useQuery<Period[]>({
    queryKey: proposalKeys.periods(),
    queryFn: () => proposalService.getPeriods().then((res: AxiosResponse<ApiResponse<Period[]>>) => res.data.data),
  });
};

export const useMyThesisQuery = () => {
  return useQuery<MyThesisResponse>({
    queryKey: proposalKeys.detail("my-thesis"),
    queryFn: () => proposalService.getMyThesis().then((res: AxiosResponse<ApiResponse<MyThesisResponse>>) => res.data.data),
    staleTime: 1000 * 60 * 5, // 5 menit
  });
};

export const useProposalsForSupervisorQuery = (params?: ProposalParams) => {
  return useQuery<PaginatedResponse<Proposal>>({
    queryKey: proposalKeys.list({ ...params, type: "supervisor" }),
    queryFn: () => proposalService.getProposalsForSupervisor(params).then((res: AxiosResponse<ApiResponse<PaginatedResponse<Proposal>>>) => res.data.data),
    placeholderData: keepPreviousData,
  });
};

export const useMyThesis = useMyThesisQuery;
export const useProposalsForSupervisor = useProposalsForSupervisorQuery;
export const useThemes = useThemesQuery;
export const usePeriods = usePeriodsQuery;
export const useProposalById = useProposalByIdQuery;
