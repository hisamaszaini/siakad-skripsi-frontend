import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefenseRegistrationSchema, DefenseRegistrationFormData } from "@/schemas";
import { useRegisterDefenseMutation } from "./useDefenseMutation";
import { Proposal } from "@/types";
import { useRouter } from "next/navigation";

export const useDefenseRegistration = (thesis: Proposal | null | undefined) => {
    const router = useRouter();
    const { mutate: registerDefense, isPending: loading } = useRegisterDefenseMutation();
    const [draftUrl, setDraftUrl] = useState<string | null>(null);
    const [turnitinUrl, setTurnitinUrl] = useState<string | null>(null);

    const form = useForm<DefenseRegistrationFormData>({
        resolver: zodResolver(DefenseRegistrationSchema),
        defaultValues: {
            skripsi_id: thesis?.id || "",
        }
    });

    useEffect(() => {
        if (thesis?.id) {
            form.setValue("skripsi_id", thesis.id);
        }
    }, [thesis?.id, form]);

    const draftFile = useWatch({ control: form.control, name: "draft" });
    const turnitinFile = useWatch({ control: form.control, name: "turnitin" });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'draft' | 'turnitin') => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            form.setValue(type, selectedFile, { shouldValidate: true });
            const url = URL.createObjectURL(selectedFile);
            if (type === 'draft') {
                if (draftUrl) URL.revokeObjectURL(draftUrl);
                setDraftUrl(url);
            } else {
                if (turnitinUrl) URL.revokeObjectURL(turnitinUrl);
                setTurnitinUrl(url);
            }
        }
    };

    const removeFile = (type: 'draft' | 'turnitin') => {
        form.setValue(type, undefined as unknown as File, { shouldValidate: true });
        if (type === 'draft') {
            if (draftUrl) URL.revokeObjectURL(draftUrl);
            setDraftUrl(null);
        } else {
            if (turnitinUrl) URL.revokeObjectURL(turnitinUrl);
            setTurnitinUrl(null);
        }
    };

    const handleRegister = (values: DefenseRegistrationFormData) => {
        const formData = new FormData();
        formData.append("skripsi_id", values.skripsi_id);
        formData.append("draft", values.draft);
        formData.append("turnitin", values.turnitin);
        
        registerDefense(formData, {
            onSuccess: () => {
                router.push("/student");
            }
        });
    };

    return {
        draftFile,
        draftUrl,
        turnitinFile,
        turnitinUrl,
        loading,
        form,
        handleFileChange,
        removeFile,
        handleRegister
    };
};
