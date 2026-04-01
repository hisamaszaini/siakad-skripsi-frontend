import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VerifyProposalSchema, VerifyProposalFormData } from "@/schemas";
import { useVerifyProposalMutation } from "./useProposalMutation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Proposal } from "@/types";

export const useProposalVerification = (id: string, initialProposal?: Proposal) => {
  const router = useRouter();
  const [editingTitle, setEditingTitle] = useState(false);
  const [activeAction, setActiveAction] = useState<"APPROVE" | "REJECT" | "REVISE" | "EDIT" | null>(null);

  const form = useForm<VerifyProposalFormData>({
    resolver: zodResolver(VerifyProposalSchema),
    defaultValues: {
      catatan: "",
      judul: initialProposal?.judul || "",
    },
  });

  const { mutate: verify } = useVerifyProposalMutation();

  const handleAction = (action: "APPROVE" | "REJECT" | "REVISE" | "EDIT") => {
    const values = form.getValues();
    
    // Manual validation for required fields based on action
    if ((action === "REJECT" || action === "REVISE") && !values.catatan?.trim()) {
      return toast.error("Alasan wajib diisi untuk penolakan atau revisi.");
    }

    if (action === "EDIT" && (!values.judul?.trim() || values.judul === initialProposal?.judul)) {
      if (!values.judul?.trim()) return toast.error("Judul baru tidak boleh kosong.");
      setEditingTitle(false);
      return;
    }

    setActiveAction(action);

    const statusMap: Record<string, "APPROVED" | "REJECTED" | "REVISION" | undefined> = {
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      REVISE: "REVISION",
      EDIT: undefined,
    };

    verify(
      {
        id,
        data: {
          status: statusMap[action],
          catatan: values.catatan || undefined,
          judul: values.judul !== initialProposal?.judul ? values.judul : undefined,
        },
      },
      {
        onSuccess: () => {
          const messages: Record<string, string> = {
            APPROVE: "Usulan berhasil disetujui!",
            REJECT: "Usulan berhasil ditolak.",
            REVISE: "Usulan dikembalikan untuk revisi.",
            EDIT: "Judul berhasil diperbarui.",
          };
          toast.success(messages[action]);

          if (action === "EDIT") {
            setEditingTitle(false);
          } else {
            router.push("/lecturer/proposals");
          }
          setActiveAction(null);
        },
        onError: () => {
          setActiveAction(null);
        }
      }
    );
  };

  const startEditing = () => {
    setEditingTitle(true);
    form.setValue("judul", initialProposal?.judul || "");
  };

  const cancelEditing = () => {
    setEditingTitle(false);
    form.setValue("judul", initialProposal?.judul || "");
  };

  return {
    form,
    editingTitle,
    activeAction,
    handleAction,
    startEditing,
    cancelEditing,
    isPending: activeAction !== null,
  };
};
