"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { GraduationCap, LayoutDashboard, FileText, ClipboardList, LogOut, BookOpen, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/hooks/use-auth";

const navItems = [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/proposal", label: "Pengajuan", icon: FileText },
    { href: "/student/guidance", label: "Bimbingan", icon: ClipboardList },
    { href: "/student/sempro", label: "Seminar Proposal", icon: BookOpen },
    { href: "/student/defense", label: "Sidang Skripsi", icon: GraduationCap },
    { href: "/student/change-request", label: "Layanan Perubahan", icon: RefreshCcw },
];

export function Navbar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Berhasil logout");
        } catch {
            toast.error("Gagal logout");
        }
    };

    return (
        <nav className="fixed left-0 top-0 h-full w-64 border-r bg-card p-6 shadow-sm z-50">
            <div className="flex items-center gap-2 mb-10 px-2">
                <div className="bg-primary p-2 rounded-lg">
                    <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight italic">SI-SKRIPSI</span>
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
                                        ? "bg-primary text-primary-foreground shadow-md"
                                        : "hover:bg-accent text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive ? "" : "group-hover:scale-110 transition-transform")} />
                                <span className="font-medium">{item.label}</span>
                                {isActive && (
                                    <span className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                                )}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="absolute bottom-10 left-6 right-6">
                <Button onClick={handleLogout} variant="ghost" className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </Button>
            </div>
        </nav>
    );
}
