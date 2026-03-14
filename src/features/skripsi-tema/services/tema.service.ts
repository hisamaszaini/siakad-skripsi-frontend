import { api } from "@/lib/api-client";
import { ApiResponse, Theme, Prodi } from "@/types";

export const temaService = {
  getAllThemes: (kode_jurusan?: string) =>
    api.get<ApiResponse<Theme[]>>("/skripsi-tema", { params: { kode_jurusan } }),

  getThemeById: (id: string) =>
    api.get<ApiResponse<Theme>>(`/skripsi-tema/${id}`),

  createTheme: (data: { kode_jurusan: string; name: string }) =>
    api.post<ApiResponse<Theme>>("/skripsi-tema", data),

  updateTheme: (id: string, data: { kode_jurusan?: string; name?: string }) =>
    api.put<ApiResponse<Theme>>(`/skripsi-tema/${id}`, data),

  deleteTheme: (id: string) =>
    api.delete<ApiResponse<null>>(`/skripsi-tema/${id}`),

  getProdi: () =>
    api.get<ApiResponse<Prodi[]>>("/prodi"),
};
