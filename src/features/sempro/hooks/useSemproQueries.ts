import { useQuery } from "@tanstack/react-query";
import { semproService, SemproParams } from "../services/sempro.service";
import { SemproRegistration, PaginatedResponse, ApiResponse } from "@/types";
import { AxiosResponse } from "axios";

export const semproKeys = {
  all: ["sempros"] as const,
  lists: () => [...semproKeys.all, "list"] as const,
  list: (params?: SemproParams) => [...semproKeys.lists(), params] as const,
  details: () => [...semproKeys.all, "detail"] as const,
  detail: (id: string) => [...semproKeys.details(), id] as const,
  active: () => [...semproKeys.all, "active"] as const,
};

export const useAllSemproQuery = (params?: SemproParams, role?: "ADMIN" | "LECTURER") => {
  return useQuery<PaginatedResponse<SemproRegistration>>({
    queryKey: [...semproKeys.list(params), role],
    queryFn: () => semproService.listSempro(params, role).then((res: AxiosResponse<ApiResponse<PaginatedResponse<SemproRegistration>>>) => res.data.data),
  });
};

export const useSemproByIdQuery = (id: string | null) => {
  return useQuery({
    queryKey: semproKeys.detail(id || ""),
    queryFn: () => semproService.getSemproById(id!).then((res: AxiosResponse<ApiResponse<SemproRegistration>>) => res.data.data),
    enabled: !!id,
  });
};

export const useActiveSemproQuery = () => {
  return useQuery({
    queryKey: semproKeys.active(),
    queryFn: () => semproService.getMySempro().then((res: AxiosResponse<ApiResponse<SemproRegistration>>) => res.data.data),
  });
};
