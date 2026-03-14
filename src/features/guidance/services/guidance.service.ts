import { api } from "@/lib/api-client";
import { ApiResponse, GuidanceLog, GuidanceLogFormData, VerifyGuidanceFormData, Proposal } from "@/types";

export interface GuidanceParams {
  q?: string;
  status?: string;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
  skripsi_id?: string;
}

export const guidanceService = {
  submitGuidanceLog: (data: GuidanceLogFormData) =>
    api.post<ApiResponse<GuidanceLog>>("/bimbingan-skripsi/log-saya", data),

  getMyGuidanceLogs: () =>
    api.get<ApiResponse<{ proposal: Proposal | null; logs: GuidanceLog[] }>>("/bimbingan-skripsi/log-saya"),

  getGuidanceLogs: (skripsiId: string) =>
    api.get<ApiResponse<{ proposal: Proposal; logs: GuidanceLog[] }>>(`/bimbingan-skripsi/log-bimbingan/${skripsiId}`),

  getAllGuidanceLogsForLecturer: (params?: GuidanceParams) =>
    api.get<ApiResponse<{ data: GuidanceLog[]; total: number; page: number; limit: number }>>("/bimbingan-skripsi/log-bimbingan", { params }),

  verifyGuidanceLog: (id: string, data: VerifyGuidanceFormData) =>
    api.put<ApiResponse<GuidanceLog>>(`/bimbingan-skripsi/log-bimbingan/${id}/verifikasi`, data),

  editGuidanceLog: (id: string, data: GuidanceLogFormData) =>
    api.put<ApiResponse<GuidanceLog>>(`/bimbingan-skripsi/log-bimbingan/${id}`, data),

  accSempro: (id: string) =>
    api.post<ApiResponse<void>>(`/bimbingan-skripsi/persetujuan-sempro/${id}`),

  accSidang: (id: string) =>
    api.post<ApiResponse<void>>(`/bimbingan-skripsi/persetujuan-sidang/${id}`),
};
