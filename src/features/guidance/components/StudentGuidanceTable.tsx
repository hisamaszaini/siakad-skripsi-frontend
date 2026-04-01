"use client";

import { GuidanceLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock, XCircle, MessageSquare, Edit3, Plus } from "lucide-react";
import { GuidanceNotesDialog } from "./GuidanceNotesDialog";

const STATUS_BADGE = {
    PENDING: { label: "Menunggu Verifikasi", className: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: Clock },
    VERIFIED: { label: "Telah Diverifikasi", className: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
    REJECTED: { label: "Ditolak", className: "bg-red-50 text-red-600 border-red-100", icon: XCircle },
};

interface StudentGuidanceTableProps {
    logs: GuidanceLog[];
    onEdit: (log: GuidanceLog) => void;
    onAddClick?: () => void;
    isAddDisabled?: boolean;
}

export function StudentGuidanceTable({ logs, onEdit, onAddClick, isAddDisabled = false }: StudentGuidanceTableProps) {
    if (logs.length === 0) {
        return (
            <Card className="border-2 border-dashed border-slate-100 shadow-none bg-slate-50/30 rounded-[3rem]">
                {/* Mobile Button even when empty */}
                {onAddClick && (
                    <div className="md:hidden p-8 pb-0">
                        <Button
                            onClick={onAddClick}
                            disabled={isAddDisabled}
                            className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
                        >
                            <Plus className="h-5 w-5" />
                            Tambah Log Baru
                        </Button>
                    </div>
                )}
                <CardContent className="flex flex-col items-center justify-center p-20 text-center">
                    <div className="bg-white h-20 w-20 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                        <MessageSquare className="h-10 w-10 text-slate-200" />
                    </div>
                    <h3 className="font-black text-2xl text-slate-900 mb-2 leading-none">Log Tidak Ditemukan</h3>
                    <p className="text-slate-400 font-medium max-w-xs text-sm">
                        Belum ada riwayat bimbingan untuk filter ini.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Mobile "Tambah Log" Button - Only visible on small screens */}
            {onAddClick && (
                <div className="md:hidden px-2">
                    <Button
                        onClick={onAddClick}
                        disabled={isAddDisabled}
                        className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
                    >
                        <Plus className="h-5 w-5" />
                        Tambah Log Baru
                    </Button>
                </div>
            )}

            {/* Desktop Table View */}
            <div className="hidden md:block">
                <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-16 text-center">No</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Dosen Pembimbing</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Materi</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log, index) => {
                                    const statusBadge = STATUS_BADGE[log.status as keyof typeof STATUS_BADGE] || STATUS_BADGE.PENDING;
                                    const Icon = statusBadge.icon;

                                    return (
                                        <tr key={log.id} className="group border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
                                            <td className="px-8 py-6 font-black text-slate-300 text-sm text-center">{(index + 1).toString().padStart(2, '0')}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 text-sm italic tracking-tight">
                                                        {new Date(log.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        {new Date(log.tanggal).getFullYear()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 text-sm">{log.nama_dosen}</span>
                                                    <span className={cn(
                                                        "text-[9px] font-black uppercase tracking-widest mt-0.5",
                                                        log.role_dosen === 'MAIN' ? "text-indigo-500" : "text-amber-600"
                                                    )}>
                                                        {log.role_dosen === 'MAIN' ? 'Pembimbing Utama' : 'Pembimbing Pendamping'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-md">
                                                    <p className="text-sm font-bold text-slate-700 italic leading-tight mb-1">{log.materi}</p>
                                                    <p className="font-medium text-slate-400 text-[11px] leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
                                                        {log.saran}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <Badge className={cn(
                                                    "rounded-xl px-3 py-1 font-black text-[8px] uppercase tracking-widest shadow-none border whitespace-nowrap",
                                                    statusBadge.className
                                                )}>
                                                    <Icon className="h-2.5 w-2.5 mr-1.5" />
                                                    {statusBadge.label}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <GuidanceNotesDialog
                                                        log={log}
                                                        trigger={
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-10 px-4 font-black text-[9px] uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                                            >
                                                                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                                                Catatan
                                                            </Button>
                                                        }
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => onEdit(log)}
                                                        disabled={isAddDisabled || log.status !== 'REJECTED'}
                                                        className={cn(
                                                            "h-10 px-4 font-black text-[9px] uppercase tracking-widest rounded-xl transition-all",
                                                            (isAddDisabled || log.status !== 'REJECTED')
                                                                ? "text-slate-300 cursor-not-allowed hover:bg-transparent"
                                                                : "text-amber-600 hover:bg-amber-50"
                                                        )}
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5 mr-1.5" />
                                                        Edit
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-4 px-2">
                {logs.map((log) => {
                    const statusBadge = STATUS_BADGE[log.status as keyof typeof STATUS_BADGE] || STATUS_BADGE.PENDING;
                    const StatusIcon = statusBadge.icon;

                    return (
                        <Card key={log.id} className="border-none shadow-lg shadow-slate-100 rounded-[2rem] overflow-hidden bg-white group active:scale-[0.98] transition-all">
                            <CardContent className="p-6 space-y-5">
                                {/* Card Header: Status & Actions */}
                                <div className="flex justify-between items-start">
                                    <Badge className={cn(
                                        "rounded-xl px-3 py-1.5 font-black text-[8px] uppercase tracking-widest shadow-none border",
                                        statusBadge.className
                                    )}>
                                        <StatusIcon className="h-3 w-3 mr-1.5" />
                                        {statusBadge.label}
                                    </Badge>

                                    <div className="flex gap-2">
                                        <GuidanceNotesDialog
                                            log={log}
                                            trigger={
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 flex items-center justify-center bg-indigo-50 rounded-xl text-indigo-600"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onEdit(log)}
                                            disabled={isAddDisabled || log.status !== 'REJECTED'}
                                            className={cn(
                                                "h-9 w-9 rounded-xl transition-all",
                                                (isAddDisabled || log.status !== 'REJECTED') ? "bg-slate-50 text-slate-300 cursor-not-allowed" : "bg-amber-50 text-amber-600"
                                            )}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Card Body: Date & Supervisor */}
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 border border-slate-100 shadow-inner shrink-0">
                                        <span className="text-[10px] font-black uppercase leading-none">{new Date(log.tanggal).toLocaleDateString("id-ID", { month: 'short' })}</span>
                                        <span className="text-lg font-black text-slate-900 leading-none mt-1">{new Date(log.tanggal).getDate()}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-slate-900 truncate text-[15px]">{log.nama_dosen}</h4>
                                        <p className={cn(
                                            "text-[9px] font-black uppercase tracking-widest mt-0.5",
                                            log.role_dosen === 'MAIN' ? "text-indigo-500" : "text-amber-600"
                                        )}>
                                            {log.role_dosen === 'MAIN' ? 'Pembimbing 1' : 'Pembimbing 2'}
                                        </p>
                                    </div>
                                </div>

                                {/* Content: Materi */}
                                <div className="p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-3 bg-indigo-200 rounded-full" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Materi Diskusi</span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-700 italic leading-snug">
                                        {log.materi}
                                    </p>
                                </div>

                                {/* Content: Saran */}
                                <div className="p-2 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-3 bg-indigo-200 rounded-full" />
                                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">Saran Pembimbing</span>
                                    </div>
                                    <p className="text-xs font-medium text-slate-500 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all">
                                        &quot;{log.saran}&quot;
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}


