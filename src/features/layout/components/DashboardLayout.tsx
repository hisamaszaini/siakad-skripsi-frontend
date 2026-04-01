"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { LucideIcon } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface SidebarItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface DashboardLayoutProps {
    children: React.ReactNode;
    navItems: SidebarItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [prevPath, setPrevPath] = useState(pathname);
    if (pathname !== prevPath) {
        setPrevPath(pathname);
        setIsSidebarOpen(false);
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold text-sm tracking-widest uppercase animate-pulse">Memuat Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Header
                role={user?.role}
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />
            <Sidebar
                items={navItems}
                roleBanner={user?.role}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <main className={cn(
                "pt-24 pb-12 transition-all duration-500 px-4 sm:px-6 lg:pl-80 lg:pr-10 print:p-0 print:m-0 print:pl-0 print:pr-0",
            )}>
                <div>
                    {children}
                </div>
            </main>
        </div>
    );
}
