import { useMutation, useQueryClient } from "@tanstack/react-query";
import { semproService } from "../services/sempro.service";
import { semproKeys } from "./useSemproQueries";
import { SemproScheduleFormData, SemproEvaluationFormData, ApiResponse } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useRegisterSemproMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => semproService.registerSempro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: semproKeys.all });
      toast.success("Pendaftaran Sempro berhasil!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message = error.response?.data?.message || "Gagal mendaftar Sempro";
      toast.error(message);
    },
  });
};

export const useScheduleSemproMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SemproScheduleFormData }) =>
      semproService.scheduleSempro(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: semproKeys.all });
      toast.success("Jadwal Sempro berhasil ditetapkan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message = error.response?.data?.message || "Gagal menetapkan jadwal Sempro";
      toast.error(message);
    },
  });
};

export const useEvaluateSemproMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: SemproEvaluationFormData }) =>
      semproService.evaluateSempro(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: semproKeys.all });
      toast.success("Penilaian Sempro berhasil disimpan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      const message = error.response?.data?.message || "Gagal menyimpan penilaian Sempro";
      toast.error(message);
    },
  });
};
