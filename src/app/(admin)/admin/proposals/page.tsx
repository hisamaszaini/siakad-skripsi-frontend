"use client";

import { ProposalManagement } from "@/features/proposal";
import { PageTitle } from "@/components/ui/page-title";

export default function AdminProposalsPage() {
    return (
        <>
            <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageTitle title="Kelola Usulan Skripsi" />
                <ProposalManagement />
            </div>
        </>
    );
}
