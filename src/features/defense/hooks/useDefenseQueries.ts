import { useQuery } from "@tanstack/react-query";
import { defenseService, DefenseParams } from "../services/defense.service";
import { DefenseRegistration, PaginatedResponse, ApiResponse } from "@/types";
import { AxiosResponse } from "axios";

export const defenseKeys = {
  all: ["defenses"] as const,
  lists: () => [...defenseKeys.all, "list"] as const,
  list: (params?: DefenseParams) => [...defenseKeys.lists(), params] as const,
  details: () => [...defenseKeys.all, "detail"] as const,
  detail: (id: string) => [...defenseKeys.details(), id] as const,
  active: () => [...defenseKeys.all, "active"] as const,
};

export const useAllDefenseQuery = (params?: DefenseParams, role?: "ADMIN" | "LECTURER") => {
  return useQuery<PaginatedResponse<DefenseRegistration>>({
    queryKey: [...defenseKeys.list(params), role],
    queryFn: () => defenseService.listDefense(params, role).then((res: AxiosResponse<ApiResponse<PaginatedResponse<DefenseRegistration>>>) => res.data.data),
  });
};

export const useDefenseByIdQuery = (id: string | null) => {
  return useQuery<DefenseRegistration>({
    queryKey: defenseKeys.detail(id || ""),
    queryFn: () => defenseService.getDefenseById(id!).then((res: AxiosResponse<ApiResponse<DefenseRegistration>>) => res.data.data),
    enabled: !!id,
  });
};

export const useActiveDefenseQuery = () => {
  return useQuery<DefenseRegistration>({
    queryKey: defenseKeys.active(),
    queryFn: () => defenseService.getMyDefense().then((res: AxiosResponse<ApiResponse<DefenseRegistration>>) => res.data.data),
  });
};

export const useMyDefense = useActiveDefenseQuery;
export const useDefenseById = useDefenseByIdQuery;
export const useAllDefense = useAllDefenseQuery;
