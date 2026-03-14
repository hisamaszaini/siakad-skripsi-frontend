"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon, LogOut, GraduationCap, X } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/use-auth";

interface SidebarItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface SidebarProps {
    items: SidebarItem[];
    roleBanner?: string;
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ items, roleBanner, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className={cn(
            "fixed left-0 top-0 h-screen w-72 border-r border-primary/10 bg-gradient-to-b from-slate-50 to-white shadow-2xl z-50 transition-all duration-500 flex flex-col",
            isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
            {/* Sidebar Header: Logo & Close Button */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-xl shadow-lg ring-2 ring-blue-100">
                        <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-800">
                            SIAKAD
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase -mt-1">
                            Skripsi v1.0
                        </span>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose?.();
                    }}
                    className="lg:hidden p-3 -mr-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 active:scale-95 z-[60] relative group"
                    aria-label="Close menu"
                >
                    <div className="relative">
                        <X className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90" />
                        <span className="absolute -inset-2 bg-red-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </div>
                </button>
            </div>

            <nav className="flex-1 p-6 space-y-1.5 overflow-y-auto custom-scrollbar">
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Main Navigation</p>
                {items.map((item) => {
                    const Icon = item.icon;
                    const isRootPath = item.href === '/student' || item.href === '/lecturer' || item.href === '/admin';
                    const isActive = isRootPath
                        ? pathname === item.href
                        : pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link key={item.href} href={item.href} className="block">
                            <span
                                className={cn(
                                    "flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                                        : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {isActive && (
                                    <span className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />
                                )}
                                <Icon className={cn(
                                    "h-[18px] w-[18px] transition-all duration-300",
                                    isActive ? "scale-110" : "group-hover:scale-125 group-hover:text-blue-600"
                                )} />
                                <span className="font-bold text-[13px] tracking-wide">{item.label}</span>

                                {!isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto space-y-4">
                <div className="p-5 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 -m-4 h-24 w-24 bg-blue-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <p className="text-white font-black text-xs mb-1 tracking-wider uppercase">Need Help?</p>
                    <p className="text-slate-400 text-[10px] leading-relaxed mb-4 font-medium">Hubungi administrator jika mengalami kendala sistem.</p>
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-lg transition-colors shadow-lg active:scale-95 duration-200">
                        BANTUAN TEKNIS
                    </button>
                </div>

                <div className="logout-section">
                    <button
                        onClick={() => {
                            if (window.confirm("Apakah anda yakin ingin keluar?")) {
                                logout();
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-[11px] font-black rounded-xl transition-all duration-300 border border-red-100 active:scale-95"
                    >
                        <LogOut className="h-4 w-4" />
                        <span>LOGOUT</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
