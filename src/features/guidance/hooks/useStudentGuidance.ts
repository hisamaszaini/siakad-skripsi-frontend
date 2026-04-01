import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMyGuidanceLogsQuery } from "../hooks/useGuidanceQueries";
import { useSubmitGuidanceLogMutation, useEditGuidanceLogMutation } from "../hooks/useGuidanceMutation";
import { GuidanceLog, Supervisor } from "@/types";
import { GuidanceLogSchema, GuidanceLogFormData } from "@/schemas";

export const useStudentGuidance = () => {
    const { data, isLoading: logsLoading } = useMyGuidanceLogsQuery();
    const thesis = data?.proposal;
    const logs = data?.logs || [];

    const { mutate: submitLog, isPending: isSubmitting } = useSubmitGuidanceLogMutation();
    const { mutate: editLog, isPending: isEditing } = useEditGuidanceLogMutation();

    const [openAddLog, setOpenAddLog] = useState(false);
    const [openEditLog, setOpenEditLog] = useState<string | null>(null);
    const [roleFilter, setRoleFilter] = useState<'ALL' | 'MAIN' | 'CO'>('ALL');

    const addForm = useForm<GuidanceLogFormData>({
        resolver: zodResolver(GuidanceLogSchema),
        defaultValues: {
            dosen_id: "",
            materi: "",
            saran: "",
            tanggal: new Date().toISOString().substring(0, 16),
        }
    });

    const editForm = useForm<GuidanceLogFormData>({
        resolver: zodResolver(GuidanceLogSchema),
        defaultValues: {
            dosen_id: "",
            materi: "",
            saran: "",
            tanggal: "",
        }
    });

    const supervisorOptions = useMemo(() => (thesis?.supervisors || [])
        .sort((a: Supervisor, b: Supervisor) => (a.role === 'MAIN' ? -1 : (b.role === 'MAIN' ? 1 : 0)))
        .map((sup: Supervisor) => ({
            label: sup.nama,
            value: sup.dosen_id,
            description: sup.role === 'MAIN' ? 'Pembimbing Utama' : 'Pembimbing Pendamping'
        })), [thesis?.supervisors]);

    const filteredLogs = logs.filter((log: GuidanceLog) => {
        if (roleFilter === 'ALL') return true;
        return log.role_dosen === roleFilter;
    });

    const onSubmitAdd = (values: GuidanceLogFormData) => {
        submitLog({
            ...values,
            skripsi_id: thesis?.id,
            tanggal: new Date(values.tanggal).toISOString(),
        }, {
            onSuccess: () => {
                setOpenAddLog(false);
                addForm.reset();
            }
        });
    };

    const onSubmitEdit = (values: GuidanceLogFormData) => {
        if (!openEditLog) return;
        editLog({
            id: openEditLog,
            data: {
                ...values,
                skripsi_id: thesis!.id,
                tanggal: new Date(values.tanggal).toISOString(),
            } as GuidanceLogFormData
        }, {
            onSuccess: () => {
                setOpenEditLog(null);
                editForm.reset();
            }
        });
    };

    const openEditDialog = (log: GuidanceLog) => {
        setOpenEditLog(log.id);
        editForm.reset({
            dosen_id: log.dosen_id || "",
            materi: log.materi,
            saran: log.saran,
            tanggal: log.tanggal.substring(0, 16),
        });
    };

    const closeEditDialog = () => {
        setOpenEditLog(null);
        editForm.reset();
    };

    return {
        thesis,
        logs,
        filteredLogs,
        logsLoading,
        isSubmitting,
        isEditing,
        openAddLog,
        setOpenAddLog,
        openEditLog,
        setOpenEditLog,
        roleFilter,
        setRoleFilter,
        supervisorOptions,
        addForm,
        editForm,
        onSubmitAdd,
        onSubmitEdit,
        openEditDialog,
        closeEditDialog
    };
};
