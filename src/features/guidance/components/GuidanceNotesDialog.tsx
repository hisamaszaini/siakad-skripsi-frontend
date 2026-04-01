"use client";

import { GuidanceLog } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, XCircle, X, Clock, User } from "lucide-react";

interface GuidanceNotesDialogProps {
    log: GuidanceLog;
    trigger: React.ReactElement;
}

export function GuidanceNotesDialog({ log, trigger }: GuidanceNotesDialogProps) {
    const isRejected = log.status === 'REJECTED';

    return (
        <Dialog>
            <DialogTrigger render={trigger} />
            <DialogContent showCloseButton={false} className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white">
                <DialogClose render={
                    <Button variant="ghost" className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 text-slate-400 transition-all outline-none focus:ring-2 focus:ring-slate-300">
                        <X className="h-5 w-5" />
                        <span className="sr-only">Tutup</span>
                    </Button>
                } />

                <DialogHeader className="p-8 pb-6 border-b border-slate-100 pr-16 bg-white shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0 border animate-in zoom-in duration-500",
                            isRejected ? "bg-red-50 border-red-100 text-red-600" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                        )}>
                            {isRejected ? <XCircle className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
                        </div>

                        <div className="space-y-1 text-left flex-1 min-w-0">
                            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight leading-none truncate">
                                Catatan Pembimbing
                            </DialogTitle>
                            <div className="flex items-center gap-1.5 text-slate-400 overflow-hidden">
                                <User className="h-3 w-3 shrink-0" />
                                <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate">
                                    {log.nama_dosen}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 pb-10 space-y-6">
                    {/* Log Summary Box */}
                    <div className="p-5 rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Materi</span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 italic leading-snug">
                            {log.materi}
                        </p>
                    </div>

                    {/* Mentor's Feedback Box */}
                    <div className="p-6 rounded-[2rem] bg-indigo-50/30 border border-indigo-100 relative group">
                        <div className="absolute -top-3 left-6 px-3 bg-white border border-indigo-100 rounded-full">
                            <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600">Saran Pembimbing</span>
                        </div>
                        <p className="text-slate-600 font-medium leading-relaxed italic text-justify text-sm px-2">
                            &quot;{log.saran || (isRejected ? 'Mohon diperbaiki detail aktivitas bimbingan ini agar dapat divalidasi pembimbing.' : 'Tidak ada catatan tambahan khusus.')}&quot;
                        </p>
                    </div>
                </div>

                {/* Solid Footer */}
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-row items-center sm:justify-center gap-3 rounded-b-[2.5rem]">
                    <DialogClose render={
                        <Button className="w-full sm:w-auto h-14 min-w-[200px] rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-95 hover:scale-105">
                            Mengerti & Tutup
                        </Button>
                    } />
                </div>
            </DialogContent>
        </Dialog>
    );
}
