"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShieldCheck, LayoutDashboard, FileText, Users, LogOut, Calendar, GraduationCap, GitPullRequest } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";

const navItems = [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/proposals", label: "Daftar Usulan", icon: FileText },
    { href: "/admin/sempro", label: "Jadwal Sempro", icon: Calendar },
    { href: "/admin/defense", label: "Jadwal Sidang", icon: GraduationCap },
    { href: "/admin/change-requests", label: "Permohonan Perubahan", icon: GitPullRequest },
    { href: "/admin/lecturers", label: "Data Dosen", icon: Users },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Berhasil logout");
        } catch (error) {
            console.error(error);
            toast.error("Gagal logout");
        }
    };

    return (
        <nav className="fixed left-0 top-0 h-full w-72 border-r bg-slate-900 text-slate-300 p-8 shadow-2xl z-50">
            <div className="flex items-center gap-3 mb-12 px-2">
                <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                    <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex flex-col">
                    <span className="font-extrabold text-white text-xl tracking-tight leading-none italic">ADMIN</span>
                    <span className="text-[10px] text-slate-500 font-medium tracking-[0.2em] mt-1 uppercase">SIAKAD SKRIPSI</span>
                </div>
            </div>

            <div className="space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <span
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20"
                                        : "hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                                <span className="font-semibold text-sm">{item.label}</span>
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="absolute bottom-10 left-8 right-8 pt-8 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700" />
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-bold text-white truncate">Administrator</span>
                        <span className="text-xs text-slate-500 truncate italic">admin@siakad.ac.id</span>
                    </div>
                </div>
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20">
                    <LogOut className="h-5 w-5" />
                    <span className="font-bold">Logout System</span>
                </Button>
            </div>
        </nav>
    );
}
