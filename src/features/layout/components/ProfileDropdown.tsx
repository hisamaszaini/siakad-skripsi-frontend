"use client";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";

export function ProfileDropdown() {
    const { user, logout } = useAuth();

    if (!user) return null;

    const initials = user.nama
        ?.split(/\s+/)
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <Avatar className="h-9 w-9 border-2 border-primary/20 shadow-sm">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                        {initials}
                    </AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                    <p className="text-[11px] font-black text-slate-900 leading-none mb-1 uppercase truncate max-w-[120px]">{user.nama}</p>
                    <p className="text-[9px] font-bold text-slate-400 leading-none tracking-wider">
                        {user.nim || user.nik || user.id}
                    </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1 border-primary/10 shadow-xl rounded-xl">
                <div className="px-2 py-3 border-b border-primary/5 mb-1">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-bold leading-none text-foreground">{user.nama}</p>
                        <p className="text-xs leading-none text-muted-foreground italic">
                            {user.role} {user.nim || user.nik ? `- ${user.nim || user.nik}` : ""}
                        </p>
                    </div>
                </div>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer py-2.5">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profil Saya</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary rounded-lg cursor-pointer py-2.5">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Pengaturan</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/5" />
                <DropdownMenuItem 
                    onClick={() => logout()}
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-lg cursor-pointer py-2.5"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
