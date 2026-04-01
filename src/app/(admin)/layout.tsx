"use client";

import { DashboardLayout } from "@/features/layout/components/DashboardLayout";
import { LayoutDashboard, FileText, Calendar, GraduationCap, GitPullRequest, Users } from "lucide-react";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/proposals", label: "Daftar Usulan", icon: FileText },
    { href: "/admin/themes", label: "Tema Skripsi", icon: GraduationCap },
    { href: "/admin/sempro", label: "Jadwal Sempro", icon: Calendar },
    { href: "/admin/defense", label: "Jadwal Sidang", icon: GraduationCap },
    { href: "/admin/change-requests", label: "Permohonan Perubahan (Coming Soon)", icon: GitPullRequest },
    { href: "#coming-soon", label: "Data Dosen (Coming Soon)", icon: Users },
];

export default function AdminLayout({
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
