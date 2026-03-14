"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserCheck, LayoutDashboard, FileSearch, ClipboardCheck, LogOut, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";

const navItems = [
    { href: "/lecturer", label: "Dashboard", icon: LayoutDashboard },
    { href: "/lecturer/proposals", label: "Verifikasi Usulan", icon: FileSearch },
    { href: "/lecturer/guidance", label: "Bimbingan Aktif", icon: ClipboardCheck },
    { href: "/lecturer/sempro", label: "Jadwal Seminar", icon: BookOpen },
    { href: "/lecturer/defense", label: "Jadwal Sidang", icon: GraduationCap },
];

export function LecturerNavbar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Berhasil logout");
        } catch (error) {
            toast.error("Gagal logout");
        }
    };

    return (
        <nav className="fixed left-0 top-0 h-full w-64 border-r bg-indigo-950 text-indigo-100 p-6 shadow-xl z-50">
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="bg-white p-2 rounded-lg">
                    <UserCheck className="h-6 w-6 text-indigo-950" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-white text-lg tracking-tight leading-none italic">DOSEN</span>
                    <span className="text-[10px] text-indigo-300/60 font-medium tracking-widest mt-1">SI-SKRIPSI</span>
                </div>
            </div>

            <div className="space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <span
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-white text-indigo-950 shadow-lg"
                                        : "hover:bg-white/10 text-indigo-200 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                                <span className="font-medium">{item.label}</span>
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="absolute bottom-10 left-6 right-6 pt-6 border-t border-white/10 text-center">
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-indigo-300 hover:bg-white/10 hover:text-white">
                    <LogOut className="h-5 w-5" />
                    <span>Keluar</span>
                </Button>
            </div>
        </nav>
    );
}
