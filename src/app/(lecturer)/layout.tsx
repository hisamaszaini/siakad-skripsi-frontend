"use client";

import { DashboardLayout } from "@/features/layout/components/DashboardLayout";
import { LayoutDashboard, FileSearch, ClipboardCheck, BookOpen, GraduationCap } from "lucide-react";

const navItems = [
    { href: "/lecturer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lecturer/proposals", label: "Verifikasi Usulan", icon: FileSearch },
    { href: "/lecturer/guidance", label: "Bimbingan Aktif", icon: ClipboardCheck },
    { href: "/lecturer/sempro", label: "Jadwal Seminar", icon: BookOpen },
    { href: "/lecturer/defense", label: "Jadwal Sidang", icon: GraduationCap },
];

export default function LecturerLayout({
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
