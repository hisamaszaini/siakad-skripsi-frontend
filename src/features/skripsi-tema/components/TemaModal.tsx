"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TemaForm } from "./TemaForm";
import { useTemaModal } from "../hooks/useTemaModal";
import { useTheme } from "../hooks/useTemaQueries";
import { useCreateTheme, useUpdateTheme } from "../hooks/useTemaMutation";
import { ThemeFormData } from "../schemas/tema.schema";

export function TemaModal() {
  const { isOpen, onClose, type, selectedId } = useTemaModal();
  const { data: theme, isLoading: isThemeLoading } = useTheme(selectedId);
  const createMutation = useCreateTheme();
  const updateMutation = useUpdateTheme();

  const isCreate = type === "CREATE";
  const isUpdate = type === "UPDATE";

  if (!isCreate && !isUpdate) return null;

  const handleSubmit = async (values: ThemeFormData) => {
    if (isCreate) {
      await createMutation.mutateAsync(values);
    } else if (isUpdate && selectedId) {
      await updateMutation.mutateAsync({ id: selectedId, data: values });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Tambah Tema Baru" : "Edit Tema"}</DialogTitle>
          <DialogDescription>
            {isCreate
              ? "Masukkan detail untuk tema skripsi baru."
              : "Perbarui informasi tema skripsi yang sudah ada."}
          </DialogDescription>
        </DialogHeader>
        {isUpdate && isThemeLoading ? (
          <div className="py-8 text-center text-slate-500">Memuat data tema...</div>
        ) : (
          <TemaForm
            initialData={isUpdate ? theme : null}
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
