"use client";

import { TemaManagement } from "@/features/skripsi-tema";
import { PageTitle } from "@/components/ui/page-title";


export default function AdminThemesPage() {
  return (
    <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <PageTitle title="Kelola Tema Skripsi" />
      <TemaManagement />
    </div>
  );
}
