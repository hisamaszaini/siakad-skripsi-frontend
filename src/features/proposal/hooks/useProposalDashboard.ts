import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProposalSchema, ProposalFormData } from "@/schemas";
import { useThemesQuery, useMyThesisQuery } from "./useProposalQueries";
import { useSubmitProposalMutation } from "./useProposalMutation";
import { proposalService } from "../services/proposal.service";
import { Lecturer } from "@/types";
import { toast } from "sonner";

export const useProposalDashboard = () => {
    const router = useRouter();
    const { data: thesis, isLoading: loadingThesis } = useMyThesisQuery();
    const { data: themesData, isLoading: loadingThemes } = useThemesQuery();
    const themes = themesData || [];
    const { mutate: submitProposal, isPending: loading } = useSubmitProposalMutation();

    const form = useForm<ProposalFormData>({
        resolver: zodResolver(ProposalSchema),
        defaultValues: {
            judul: "",
            tema: "",
            customTema: "",
            sks_total: 0,
            pembimbing_usulan_id: "",
        },
    });

    const handleSearchLecturers = useCallback(async (query: string) => {
        if (query.length < 2) return [];
        try {
            const res = await proposalService.searchLecturers(query) as { data?: Lecturer[] };
            return (res.data || []).map((t: Lecturer) => ({
                label: t.nama,
                value: String(t.nik),
                description: t.nidn ? `NIDN: ${t.nidn}` : `NIK: ${t.nik}`
            }));
        } catch (error) {
            console.error("Error searching lecturers:", error);
            return [];
        }
    }, []);

    const onSubmit = (values: ProposalFormData) => {
        const tema = values.tema === "Lainnya" ? values.customTema : values.tema;

        if (!tema) {
            toast.error("Tema/topik penelitian wajib diisi.");
            return;
        }

        submitProposal({
            judul: values.judul,
            tema: tema,
            sks_total: values.sks_total,
            pembimbing_usulan_id: values.pembimbing_usulan_id || undefined,
        }, {
            onSuccess: () => {
                router.push("/student");
            }
        });
    };

    return {
        thesis,
        loadingThesis,
        themes,
        loadingThemes,
        loading,
        form,
        handleSearchLecturers,
        onSubmit
    };
};
