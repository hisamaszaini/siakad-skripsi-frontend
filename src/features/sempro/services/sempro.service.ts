import { api } from "@/lib/api-client";
import { ApiResponse, SemproRegistration, SemproScheduleFormData, SemproEvaluationFormData, PaginatedResponse } from "@/types";

export interface SemproParams {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  prodi?: string;
  startDate?: string;
  endDate?: string;
}

export const semproService = {
  registerSempro: (data: FormData) =>
    api.post<ApiResponse<SemproRegistration>>("/skripsi-sempro/daftar", data),

  getMySempro: () =>
    api.get<ApiResponse<SemproRegistration>>("/skripsi-sempro/saya"),

  listSempro: (params?: SemproParams, role?: "ADMIN" | "LECTURER") => {
    const url = role === "LECTURER" ? "/skripsi-sempro/daftar-peserta/dosen" : "/skripsi-sempro/daftar-peserta";
    return api.get<ApiResponse<PaginatedResponse<SemproRegistration>>>(url, { params });
  },

  getSemproById: (id: string) =>
    api.get<ApiResponse<SemproRegistration>>(`/skripsi-sempro/${id}`),

  scheduleSempro: (id: string, data: SemproScheduleFormData) =>
    api.put<ApiResponse<SemproRegistration>>(`/skripsi-sempro/${id}/jadwal`, data),

  evaluateSempro: (id: string, data: SemproEvaluationFormData) =>
    api.put<ApiResponse<SemproRegistration>>(`/skripsi-sempro/${id}/penilaian`, data),
};
