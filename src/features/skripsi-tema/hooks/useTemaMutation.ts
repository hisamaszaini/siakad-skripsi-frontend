import { useMutation, useQueryClient } from "@tanstack/react-query";
import { temaService } from "../services/tema.service";
import { ThemeFormData } from "../schemas/tema.schema";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types";

export const useCreateTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ThemeFormData) => temaService.createTheme(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      toast.success(response.data.message || "Tema berhasil dibuat");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(error.response?.data?.message || "Gagal membuat tema");
    },
  });
};

export const useUpdateTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ThemeFormData }) =>
      temaService.updateTheme(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      queryClient.invalidateQueries({ queryKey: ["theme", response.data.data.id] });
      toast.success(response.data.message || "Tema berhasil diperbarui");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui tema");
    },
  });
};

export const useDeleteTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => temaService.deleteTheme(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["themes"] });
      toast.success(response.data.message || "Tema berhasil dihapus");
    },
    onError: (error: AxiosError<ApiResponse<null>>) => {
      toast.error(error.response?.data?.message || "Gagal menghapus tema");
    },
  });
};
