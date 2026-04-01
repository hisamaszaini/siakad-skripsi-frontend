"use client";

import { DefenseManagement } from "@/features/defense";

export default function AdminDefensePage() {
    return (
        <>
            <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <DefenseManagement role="ADMIN" />
            </div>
        </>
    );
}
