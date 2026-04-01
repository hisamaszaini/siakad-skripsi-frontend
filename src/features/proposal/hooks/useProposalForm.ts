import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ProposalSchema, ProposalFormData } from "@/schemas";
import { useMyThesisQuery, useThemesQuery } from "./useProposalQueries";
import { useSubmitProposalMutation } from "./useProposalMutation";
import { Theme } from "@/types";
import { useAuth } from "@/features/auth/hooks/use-auth";

export const useProposalForm = () => {
    const router = useRouter();
    const { user } = useAuth();
    const { mutate: submitProposal } = useSubmitProposalMutation();
    const { data: themesData, isLoading: loadingThemes } = useThemesQuery(user?.nim || "");
    const { data: thesisResult, isLoading: loadingThesis } = useMyThesisQuery();

    const themes = useMemo(() => themesData || [], [themesData]);
    const thesis = thesisResult?.current;
    const isRevision = useMemo(() => thesis?.status === "REJECTED", [thesis?.status]);

    const initialValues = useMemo(() => {
        if (!thesis || thesis.status !== "REJECTED" || !themes.length) return undefined;
        return {
            judul: thesis.judul,
            tema: (thesis.tema && themes.some((t: Theme) => t.name === thesis.tema)) ? thesis.tema : "Lainnya",
            customTema: themes.some((t: Theme) => t.name === thesis.tema) ? "" : (thesis.tema || ""),
            sks_total: thesis.sks_total,
            pembimbing_usulan_id: thesis.pembimbing_usulan_id || "",
        };
    }, [thesis, themes]);

    const form = useForm<ProposalFormData>({
        resolver: zodResolver(ProposalSchema),
        values: initialValues,
        defaultValues: {
            judul: "",
            tema: "",
            customTema: "",
            sks_total: 0,
            pembimbing_usulan_id: "",
        },
    });

    const onSubmit = (values: ProposalFormData) => {
        const tema = (values.tema === "Lainnya" ? values.customTema : values.tema) || "";
        const pembimbingId = values.pembimbing_usulan_id;
        
        submitProposal({
            judul: values.judul,
            tema,
            sks_total: values.sks_total,
            pembimbing_usulan_id: pembimbingId || undefined,
        }, {
            onSuccess: () => {
                router.push("/student");
            }
        });
    };

    return {
        form,
        isRevision,
        loadingThemes,
        loadingThesis,
        themes,
        thesis,
        onSubmit
    };
};
