"use client";

import { DefenseManagement } from "@/features/defense";
import { PageTitle } from "@/components/ui/page-title";

export default function LecturerDefensePage() {
    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Pendaftar Sidang Skripsi" />
            <DefenseManagement role="LECTURER" />
        </div>
    );
}