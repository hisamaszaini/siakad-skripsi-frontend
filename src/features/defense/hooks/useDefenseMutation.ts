import { useMutation, useQueryClient } from "@tanstack/react-query";
import { defenseService } from "../services/defense.service";
import { defenseKeys } from "./useDefenseQueries";
import { toast } from "sonner";
import { DefenseScheduleFormData, DefenseEvaluationFormData, ApiResponse } from "@/types";
import { AxiosError } from "axios";

export const useRegisterDefenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) =>
      defenseService.registerDefense(data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: defenseKeys.all });
      toast.success("Pendaftaran Sidang Skripsi berhasil!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal mendaftarkan Sidang Skripsi");
    },
  });
};

export const useScheduleDefenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DefenseScheduleFormData }) =>
      defenseService.scheduleDefense(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: defenseKeys.all });
      toast.success("Jadwal Sidang Skripsi berhasil disimpan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal menyimpan jadwal");
    },
  });
};

export const useEvaluateDefenseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DefenseEvaluationFormData }) =>
      defenseService.evaluateDefense(id, data).then((res) => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: defenseKeys.all });
      toast.success("Penilaian Sidang Skripsi berhasil disimpan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal menyimpan penilaian");
    },
  });
};
