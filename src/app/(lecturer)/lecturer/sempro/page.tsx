"use client";

import { SemproManagement } from "@/features/sempro";

export default function LecturerSemproPage() {
    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <SemproManagement role="LECTURER" />
        </div>
    );
}
