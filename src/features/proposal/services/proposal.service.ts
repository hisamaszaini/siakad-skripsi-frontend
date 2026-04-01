import { api } from "@/lib/api-client";
import { ApiResponse, Proposal, Theme, Lecturer, AssignSupervisorsFormData, VerifyProposalFormData, PaginatedResponse, ProposalStatus, MyThesisResponse, Period } from "@/types";

export interface ProposalParams {
  q?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  type?: string;
  prodi?: string;
}

export const proposalService = {
  submitProposal: (data: {
    judul: string;
    tema: string;
    sks_total: number;
    pembimbing_usulan_id?: string;
  }) =>
    api.post<ApiResponse<Proposal>>("/skripsi/usulan", data),

  getMyThesis: () =>
    api.get<ApiResponse<MyThesisResponse>>("/skripsi/skripsi-saya"),

  getProposalsForSupervisor: (params?: ProposalParams) =>
    api.get<ApiResponse<PaginatedResponse<Proposal>>>("/skripsi/usulan/pembimbing", { params }),

  getAllProposals: (params?: ProposalParams) =>
    api.get<ApiResponse<PaginatedResponse<Proposal>>>("/skripsi/usulan", { params }),

  deleteProposal: (id: string) =>
    api.delete<ApiResponse<null>>(`/skripsi/usulan/${id}`),

  manualUpdateStatus: (id: string, data: { status?: ProposalStatus, periode_id?: string, judul?: string, tema?: string, pembimbing_usulan_id?: string }) =>
    api.put<ApiResponse<Proposal>>(`/skripsi/usulan/${id}/status`, data),

  getProposalById: (id: string) =>
    api.get<ApiResponse<Proposal>>(`/skripsi/usulan/${id}`),

  verifyProposal: (id: string, data: VerifyProposalFormData) =>
    api.post<ApiResponse<Proposal>>(`/skripsi/usulan/${id}/verifikasi`, data),

  assignSupervisors: (id: string, data: AssignSupervisorsFormData) =>
    api.post<ApiResponse<Proposal>>(`/skripsi/usulan/${id}/plotting`, data),

  searchLecturers: async (q: string): Promise<ApiResponse<Lecturer[]>> => {
    const response = await api.client.get<ApiResponse<Lecturer[]>>("/skripsi/dosen", {
      params: { q },
    });
    return response.data;
  },

  getThemes: (mhsId?: string) =>
    api.get<ApiResponse<Theme[]>>("/skripsi-tema", { params: { mhsId } }),

  getPeriods: () =>
    api.get<ApiResponse<Period[]>>("/skripsi/periode"),
};
