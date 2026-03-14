"use client";

import { DashboardLayout } from "@/features/layout/components/DashboardLayout";
import { LayoutDashboard, FileText, ClipboardList, BookOpen, GraduationCap, RefreshCcw } from "lucide-react";

const navItems = [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/proposal", label: "Pengajuan", icon: FileText },
    { href: "/student/guidance", label: "Bimbingan", icon: ClipboardList },
    { href: "/student/sempro", label: "Seminar Proposal", icon: BookOpen },
    { href: "/student/defense", label: "Sidang Skripsi", icon: GraduationCap },
    { href: "/student/change-request", label: "Layanan Perubahan", icon: RefreshCcw },
];

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout navItems={navItems}>
            {children}
        </DashboardLayout>
    );
}
