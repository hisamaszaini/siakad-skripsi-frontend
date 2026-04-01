"use client";

import { ProfileDropdown } from "./ProfileDropdown";
import { Bell, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
    role?: string;
}

export function Header({ onMenuClick, role }: HeaderProps) {
    const formattedRole = role ? role.replace("_", " ").charAt(0).toUpperCase() + role.replace("_", " ").slice(1).toLowerCase() : "";

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-primary/10 z-40 transition-all duration-300 lg:pl-72 print:hidden">
            <div className="h-full px-6 flex items-center justify-between mx-auto">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center gap-2 lg:ml-12">
                        <h1 className="font-black text-slate-800 text-sm sm:text-base tracking-tight italic">
                            Dashboard <span className="text-blue-600 font-black">{formattedRole || "User"}</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {/* <div className="hidden md:flex items-center relative group">
                        <Search className="absolute left-3 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Cari sesuatu..."
                            className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 w-64 transition-all duration-300 text-slate-600 outline-none"
                        />
                    </div> */}

                    <button className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-300">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    </button>

                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />

                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
}
