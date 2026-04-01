import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMyThesisQuery } from "@/features/proposal";
import { useActiveSemproQuery, useRegisterSemproMutation } from "@/features/sempro";
import { SemproRegistrationSchema, SemproRegistrationFormData } from "@/schemas";
import { Supervisor } from "@/types";

export const useSemproRegistration = () => {
    const router = useRouter();
    const { data: thesis, isLoading: loadingThesis } = useMyThesisQuery();
    const { data: sempro, isLoading: loadingSempro } = useActiveSemproQuery();
    const { mutate: register, isPending: loading } = useRegisterSemproMutation();
    
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const form = useForm<SemproRegistrationFormData>({
        resolver: zodResolver(SemproRegistrationSchema),
        defaultValues: {
            skripsi_id: thesis?.current?.id || "",
        }
    });

    useEffect(() => {
        if (thesis?.current?.id) {
            form.setValue("skripsi_id", thesis.current.id);
        }
    }, [thesis, form]);

    const file = useWatch({
        control: form.control,
        name: "file",
    });

    const isAcc = (thesis?.current?.supervisors?.length ?? 0) > 0 && 
                  thesis?.current?.supervisors?.every((p: Supervisor) => p.acc_sempro);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            form.setValue("file", selectedFile, { shouldValidate: true });
            const url = URL.createObjectURL(selectedFile);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(url);
        }
    };

    const removeFile = () => {
        form.setValue("file", undefined as unknown as File, { shouldValidate: true });
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    const handleRegister = (values: SemproRegistrationFormData) => {
        const formData = new FormData();
        formData.append("skripsi_id", values.skripsi_id);
        formData.append("file", values.file);

        register(formData, {
            onSuccess: () => {
                router.push("/student");
            }
        });
    };

    return {
        thesis,
        sempro,
        loadingThesis,
        loadingSempro,
        loading,
        file,
        previewUrl,
        isAcc,
        form,
        handleFileChange,
        removeFile,
        handleRegister
    };
};
