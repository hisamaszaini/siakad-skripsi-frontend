import { api } from "@/lib/api-client";
import { ApiResponse, DefenseRegistration, DefenseScheduleFormData, DefenseEvaluationFormData, PaginatedResponse } from "@/types";

export interface DefenseParams {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

export const defenseService = {
  registerDefense: (data: { skripsi_id: string }) =>
    api.post<ApiResponse<DefenseRegistration>>("/skripsi-sidang/daftar", data),

  getMyDefense: () =>
    api.get<ApiResponse<DefenseRegistration>>("/skripsi-sidang/saya"),

  listDefense: (params?: DefenseParams, role?: "ADMIN" | "LECTURER") => {
    const url = role === "LECTURER" ? "/skripsi-sidang/daftar-peserta/dosen" : "/skripsi-sidang/daftar-peserta";
    return api.get<ApiResponse<PaginatedResponse<DefenseRegistration>>>(url, { params });
  },

  getDefenseById: (id: string) =>
    api.get<ApiResponse<DefenseRegistration>>(`/skripsi-sidang/${id}`),

  scheduleDefense: (id: string, data: DefenseScheduleFormData) =>
    api.put<ApiResponse<DefenseRegistration>>(`/skripsi-sidang/${id}/jadwal`, data),

  evaluateDefense: (id: string, data: DefenseEvaluationFormData) =>
    api.put<ApiResponse<DefenseRegistration>>(`/skripsi-sidang/${id}/penilaian`, data),
};
