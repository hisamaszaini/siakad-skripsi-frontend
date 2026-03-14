import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalService } from "../services/proposal.service";
import { proposalKeys } from "./useProposalQueries";
import { AssignSupervisorsFormData, VerifyProposalFormData, ProposalStatus, ApiResponse } from "@/types";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useSubmitProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      judul: string;
      tema: string;
      sks_total: number;
      pembimbing_usulan_id?: string;
    }) => proposalService.submitProposal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      toast.success("Proposal berhasil diajukan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal mengajukan proposal");
    },
  });
};

export const useVerifyProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: VerifyProposalFormData }) =>
      proposalService.verifyProposal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      toast.success("Proposal berhasil diverifikasi!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal verifikasi proposal");
    },
  });
};

export const useDeleteProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => proposalService.deleteProposal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      toast.success("Proposal berhasil dihapus!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal menghapus proposal");
    },
  });
};

export const useManualUpdateStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: ProposalStatus, periode_id?: string, judul?: string, tema?: string, pembimbing_usulan_id?: string } }) =>
      proposalService.manualUpdateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      toast.success("Data berhasil diperbarui!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal memperbarui data");
    },
  });
};

export const useAssignSupervisorsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignSupervisorsFormData }) =>
      proposalService.assignSupervisors(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      toast.success("Pembimbing berhasil ditetapkan!");
    },
    onError: (error: AxiosError<ApiResponse<unknown>>) => {
      toast.error(error.response?.data?.message || "Gagal menetapkan pembimbing");
    },
  });
};

export const useSearchLecturersMutation = () => {
  return useMutation({
    mutationFn: (q: string) => proposalService.searchLecturers(q).then((res) => res.data),
  });
};
