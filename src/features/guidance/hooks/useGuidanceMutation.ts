import { useMutation, useQueryClient } from "@tanstack/react-query";
import { guidanceService } from "../services/guidance.service";
import { guidanceKeys } from "./useGuidanceQueries";
import { GuidanceLogFormData, VerifyGuidanceFormData, ApiResponse } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useSubmitGuidanceLogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GuidanceLogFormData) => guidanceService.submitGuidanceLog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidanceKeys.all });
      toast.success("Log bimbingan berhasil disimpan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal menyimpan log bimbingan");
    },
  });
};

export const useVerifyGuidanceLogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyGuidanceFormData }) =>
      guidanceService.verifyGuidanceLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidanceKeys.all });
      toast.success("Log bimbingan berhasil diverifikasi!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal verifikasi log bimbingan");
    },
  });
};

export const useEditGuidanceLogMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: GuidanceLogFormData }) =>
      guidanceService.editGuidanceLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidanceKeys.all });
      toast.success("Log bimbingan berhasil diperbarui!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui log bimbingan");
    },
  });
};

export const useAccSemproMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guidanceService.accSempro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidanceKeys.all });
      toast.success("Mahasiswa lulus sempro!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal memproses ACC Sempro");
    },
  });
};

export const useAccSidangMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => guidanceService.accSidang(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guidanceKeys.all });
      toast.success("Mahasiswa lulus sidang!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal memproses ACC Sidang");
    },
  });
};

// Aliases for compatibility
export const useSubmitGuidanceLog = () => {
  const mutation = useSubmitGuidanceLogMutation();
  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useVerifyGuidanceLog = () => {
  const mutation = useVerifyGuidanceLogMutation();
  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useEditGuidanceLog = () => {
  const mutation = useEditGuidanceLogMutation();
  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useAccSempro = () => {
  const mutation = useAccSemproMutation();
  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useAccSidang = () => {
  const mutation = useAccSidangMutation();
  return {
    execute: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
