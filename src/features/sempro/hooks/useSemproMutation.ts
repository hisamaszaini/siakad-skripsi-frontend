import { useMutation, useQueryClient } from "@tanstack/react-query";
import { semproService } from "../services/sempro.service";
import { semproKeys } from "./useSemproQueries";
import { SemproRegistrationFormData, SemproScheduleFormData, SemproEvaluationFormData } from "@/types";
import { toast } from "sonner";

export const useRegisterSemproMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SemproRegistrationFormData) => semproService.registerSempro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: semproKeys.all });
      toast.success("Pendaftaran Sempro berhasil!");
    },
    onError: () => {
      toast.error("Gagal mendaftar Sempro");
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
    onError: () => {
      toast.error("Gagal menetapkan jadwal Sempro");
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
    onError: () => {
      toast.error("Gagal menyimpan penilaian Sempro");
    },
  });
};
