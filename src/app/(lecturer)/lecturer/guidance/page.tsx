"use client";

import { useAllGuidanceLogsQuery, useVerifyGuidanceLogMutation, useEditGuidanceLogMutation, useAccSemproMutation, useAccSidangMutation } from "@/features/guidance";
import { GuidanceLog } from "@/types";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowLeft, CheckCircle2, XCircle, FileText, User, Award, GraduationCap, Clock, AlertCircle, Calendar, Edit3, Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PageTitle } from "@/components/ui/page-title";

const STATUS_BADGE = {
    PENDING: { label: "Menunggu", className: "bg-amber-100 text-amber-700", icon: Clock },
    VERIFIED: { label: "Disetujui", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
    REJECTED: { label: "Ditolak", className: "bg-red-100 text-red-700", icon: XCircle },
};

const statusBadge = (status: string) => {
    const config = STATUS_BADGE[status as keyof typeof STATUS_BADGE] || { label: status, className: "bg-slate-100 text-slate-700", icon: AlertCircle };
    const Icon = config.icon;
    return (
        <Badge className={cn("rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest shadow-none border-none animate-in fade-in zoom-in duration-300", config.className)}>
            <Icon className="h-3 w-3 mr-2" />
            {config.label}
        </Badge>
    );
};

export default function LecturerGuidanceDashboard() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sort, setSort] = useState<{ field: string, order: 'asc' | 'desc' }>({ field: 'tanggal', order: 'desc' });

    const { data: logsData, isLoading } = useAllGuidanceLogsQuery({
        q: search,
        status: filterStatus === "ALL" ? "" : filterStatus,
        page,
        limit,
        sortField: sort.field,
        sortOrder: sort.order
    });

    const logs = logsData?.data || [];
    const total = logsData?.total || 0;

    const { mutateAsync: verifyLog } = useVerifyGuidanceLogMutation();
    const { mutateAsync: editLog } = useEditGuidanceLogMutation();
    const { mutateAsync: accSempro } = useAccSemproMutation();
    const { mutateAsync: accSidang } = useAccSidangMutation();

    const totalPages = Math.ceil(total / limit);

    const handleSort = (field: string) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    const [verifyingLogId, setVerifyingLogId] = useState<string | null>(null);
    const [actionStatus, setActionStatus] = useState<'VERIFIED' | 'REJECTED' | 'EDIT' | null>(null);
    const [catatan, setCatatan] = useState("");

    // States for Edit
    const [editTanggal, setEditTanggal] = useState("");
    const [editKegiatan, setEditKegiatan] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleVerify = async (logId: string) => {
        if (actionStatus === 'REJECTED' && catatan.trim().length === 0) {
            toast.error("Catatan dosen wajib diisi jika menolak log bimbingan.");
            return;
        }

        try {
            setIsSubmitting(true);
            await verifyLog({ 
                id: logId, 
                data: { status: actionStatus as 'VERIFIED' | 'REJECTED', catatan: catatan || undefined } 
            });
            setVerifyingLogId(null);
            setCatatan("");
            setActionStatus(null);
        } catch (error) {
            // Handled by hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (logId: string) => {
        const log = logs.find(l => l.id === logId);
        if (!log) return;
        try {
            setIsSubmitting(true);
            await editLog({
                id: logId,
                data: {
                    tanggal: editTanggal,
                    kegiatan: editKegiatan,
                    dosen_id: log.dosen_id
                }
            });
            setVerifyingLogId(null);
            setActionStatus(null);
        } catch (error) {
            // Handled by hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAccSempro = async (skripsiId: string) => {
        if (!confirm("Apakah Anda yakin ingin memberikan ACC Sempro untuk mahasiswa ini?")) return;
        try {
            setIsSubmitting(true);
            await accSempro(skripsiId);
        } catch (error) {
            // Handled by hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAccSidang = async (skripsiId: string) => {
        if (!confirm("Apakah Anda yakin ingin memberikan ACC Sidang untuk mahasiswa ini?")) return;
        try {
            setIsSubmitting(true);
            await accSidang(skripsiId);
        } catch (error) {
            // Handled by hook
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Log Bimbingan Mahasiswa" />
            {/* Minimalist Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Verifikasi Log</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Bimbingan <span className="text-indigo-600">Mahasiswa</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Cari mahasiswa, NIM, atau kegiatan..."
                            className="pl-11 h-12 border-none bg-white shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-600/20 transition-all font-medium"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                    <Link href="/lecturer">
                        <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl h-12 px-6">
                            Dashboard
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 flex-wrap bg-slate-100/50 p-2 rounded-2xl w-fit">
                {[
                    { key: "ALL", label: "Semua" },
                    { key: "PENDING", label: "Menunggu" },
                    { key: "VERIFIED", label: "Disetujui" },
                    { key: "REJECTED", label: "Ditolak" },
                ].map(({ key, label }) => (
                    <button
                        key={key}
                        onClick={() => {
                            setFilterStatus(key);
                            setPage(1);
                        }}
                        className={cn(
                            "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            filterStatus === key
                                ? "bg-white text-indigo-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                <FileText className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Antrean Log Bimbingan</CardTitle>
                                <CardDescription className="text-sm font-medium text-slate-500">Log bimbingan mahasiswa yang membutuhkan verifikasi Anda.</CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mr-2">Baris</span>
                            {[10, 25, 50].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => {
                                        setLimit(v);
                                        setPage(1);
                                    }}
                                    className={cn(
                                        "h-8 w-8 rounded-xl text-[10px] font-black transition-all",
                                        limit === v ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6 border border-slate-50">
                                <FileText className="h-10 w-10" />
                            </div>
                            <p className="text-slate-400 font-bold italic">Belum ada log bimbingan yang masuk.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="pl-10 py-6">
                                        <button onClick={() => handleSort('mahasiswa')} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                                            Mahasiswa <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead className="py-6">
                                        <button onClick={() => handleSort('tanggal')} className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">
                                            Waktu <ArrowUpDown className="h-3 w-3" />
                                        </button>
                                    </TableHead>
                                    <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Topik & Kegiatan</TableHead>
                                    <TableHead className="py-6 font-black uppercase text-[10px] tracking-widest text-slate-400 text-center">Status</TableHead>
                                    <TableHead className="text-right pr-10 py-6 font-black uppercase text-[10px] tracking-widest text-slate-400">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log: GuidanceLog) => (
                                    <TableRow key={log.id} className="group hover:bg-indigo-50/30 transition-all border-b border-slate-50 last:border-none">
                                        <TableCell className="pl-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 group-hover:bg-white transition-colors border border-slate-100 flex items-center justify-center shrink-0">
                                                    <span className="text-slate-400 group-hover:text-indigo-600 font-black text-sm">
                                                        {log.nama_mahasiswa?.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight truncate max-w-[150px]">{log.nama_mahasiswa}</div>
                                                    <div className="font-mono text-[10px] font-bold text-slate-400 mt-0.5">{log.nim}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-8">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                    <Calendar className="h-3 w-3 text-slate-300" />
                                                    {format(new Date(log.tanggal), "dd MMM yyyy", { locale: id })}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                    <Clock className="h-3 w-3" />
                                                    {format(new Date(log.tanggal), "HH:mm")} WIB
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-8 max-w-[300px]">
                                            <div className="space-y-2">
                                                <p className="text-sm font-bold text-slate-700 leading-snug">
                                                    {log.kegiatan}
                                                </p>
                                                {log.catatan && (
                                                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-orange-50/50 border border-orange-100/50">
                                                        <AlertCircle className="h-3 w-3 text-orange-400 shrink-0 mt-0.5" />
                                                        <p className="text-[10px] italic text-orange-700 font-medium leading-relaxed">
                                                            {log.catatan}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-8">
                                            {statusBadge(log.status)}
                                        </TableCell>
                                        <TableCell className="text-right pr-10 py-8">
                                            <div className="flex justify-end gap-3 items-center">
                                                <div className="flex items-center bg-slate-100/50 rounded-2xl p-1 gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-10 w-10 border-none text-amber-500 hover:text-amber-600 hover:bg-white rounded-xl transition-all shadow-none"
                                                        onClick={() => {
                                                            setActionStatus('EDIT');
                                                            setEditTanggal(log.tanggal.substring(0, 16));
                                                            setEditKegiatan(log.kegiatan);
                                                            setVerifyingLogId(log.id);
                                                        }}
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center bg-indigo-50/50 rounded-2xl p-1 gap-1">
                                                    {log.skripsi_status === 'PLOTTED' && (
                                                        log.acc_sempro ? (
                                                            <div className="flex items-center gap-1.5 px-4 h-10 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> ACC SEMPRO
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-10 px-4 font-black text-[9px] uppercase tracking-widest text-indigo-600 hover:bg-white rounded-xl transition-all"
                                                                onClick={() => handleAccSempro(log.skripsi_id)}
                                                            >
                                                                <Award className="w-3.5 h-3.5 mr-2" />
                                                                ACC SEMPRO
                                                            </Button>
                                                        )
                                                    )}
                                                    {log.skripsi_status === 'SKRIPSI' && (
                                                        log.acc_sidang ? (
                                                            <div className="flex items-center gap-1.5 px-4 h-10 bg-emerald-100 text-emerald-700 rounded-xl text-[9px] font-black uppercase tracking-widest">
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> ACC SIDANG
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-10 px-4 font-black text-[9px] uppercase tracking-widest text-emerald-600 hover:bg-white rounded-xl transition-all"
                                                                onClick={() => handleAccSidang(log.skripsi_id)}
                                                            >
                                                                <GraduationCap className="w-3.5 h-3.5 mr-2" />
                                                                ACC SIDANG
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    className="h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-200/50 font-black text-[10px] uppercase tracking-widest px-6"
                                                    onClick={() => {
                                                        setActionStatus('VERIFIED');
                                                        setVerifyingLogId(log.id);
                                                    }}
                                                >
                                                    Tindak Lanjut
                                                </Button>
                                            </div>

                                            <Dialog open={verifyingLogId === log.id} onOpenChange={(open) => {
                                                if (!open) {
                                                    setVerifyingLogId(null);
                                                    setActionStatus(null);
                                                } else {
                                                    setVerifyingLogId(log.id);
                                                }
                                            }}>
                                                <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl">
                                                    <DialogHeader className="p-8 pb-4 bg-slate-50/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifikasi Log</span>
                                                        </div>
                                                        <DialogTitle className="text-xl font-black text-slate-900 leading-tight">
                                                            {actionStatus === 'EDIT' ? 'Ubah Data Log' : 'Tindak Lanjut Bimbingan'}
                                                        </DialogTitle>
                                                        <DialogDescription className="text-sm font-medium text-slate-500 mt-2">
                                                            Mahasiswa: <span className="text-slate-900 font-bold">{log.nama_mahasiswa}</span>
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="p-8 pt-4 space-y-6">
                                                        {actionStatus === 'EDIT' && (
                                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Waktu Bimbingan</label>
                                                                    <input
                                                                        type="datetime-local"
                                                                        className="flex h-12 w-full rounded-2xl border-slate-100 bg-slate-50/50 px-4 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 transition-all"
                                                                        value={editTanggal}
                                                                        onChange={(e) => setEditTanggal(e.target.value)}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topik Kegiatan</label>
                                                                    <Textarea
                                                                        placeholder="Topik kegiatan bimbingan..."
                                                                        value={editKegiatan}
                                                                        onChange={(e) => setEditKegiatan(e.target.value)}
                                                                        className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 p-4 font-medium"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {actionStatus === 'REJECTED' && (
                                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex gap-3 items-start">
                                                                    <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                                                    <p className="text-xs font-medium text-red-800 leading-relaxed">
                                                                        Anda akan menolak log bimbingan ini. Mohon berikan alasan yang jelas kepada mahasiswa.
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alasan Penolakan <span className="text-red-500">*</span></label>
                                                                    <Textarea
                                                                        placeholder="Tuliskan alasan penolakan..."
                                                                        value={catatan}
                                                                        onChange={(e) => setCatatan(e.target.value)}
                                                                        className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-red-600/20 focus-visible:border-red-600 p-4 font-medium"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}

                                                        {actionStatus === 'VERIFIED' && (
                                                            <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                                                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-3 items-start">
                                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                                                    <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                                                                        Data bimbingan sudah sesuai? Berikan catatan tambahan jika diperlukan.
                                                                    </p>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Catatan Tambahan <span className="text-slate-400 font-normal italic">(opsional)</span></label>
                                                                    <Textarea
                                                                        placeholder="Contoh: 'Perbaiki bab 2 bagian metodologi'..."
                                                                        value={catatan}
                                                                        onChange={(e) => setCatatan(e.target.value)}
                                                                        className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-emerald-600/20 focus-visible:border-emerald-600 p-4 font-medium"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col gap-3 p-8 pt-0">
                                                        <Button
                                                            className={cn(
                                                                "h-14 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all",
                                                                actionStatus === 'EDIT' ? "bg-amber-600 hover:bg-amber-700 shadow-amber-200/50" :
                                                                    actionStatus === 'VERIFIED' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200/50" :
                                                                        "bg-red-600 hover:bg-red-700 shadow-red-200/50"
                                                            )}
                                                            onClick={() => actionStatus === 'EDIT' ? handleEdit(log.id) : handleVerify(log.id)}
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                                            {actionStatus === 'EDIT' ? 'Simpan Perubahan' : `Konfirmasi ${actionStatus === 'VERIFIED' ? 'Verifikasi' : 'Penolakan'}`}
                                                        </Button>
                                                        <div className="flex gap-2">
                                                            {actionStatus === 'VERIFIED' && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                                                    onClick={() => setActionStatus('REJECTED')}
                                                                >
                                                                    Tolak Saja
                                                                </Button>
                                                            )}
                                                            {actionStatus === 'REJECTED' && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-emerald-600 border-emerald-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                                                                    onClick={() => setActionStatus('VERIFIED')}
                                                                >
                                                                    Setujui Saja
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                className="flex-1 h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50"
                                                                onClick={() => { setVerifyingLogId(null); setActionStatus(null); }}
                                                            >
                                                                Batal
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
                {totalPages > 1 && (
                    <CardFooter className="p-10 border-t border-slate-50 flex justify-between items-center bg-slate-50/30">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Halaman <span className="text-indigo-600">{page}</span> dari <span className="text-slate-900">{totalPages}</span> — Total <span className="text-slate-900">{total}</span> log bimbingan
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest gap-2 bg-white border-slate-200 text-slate-500 hover:text-indigo-600"
                            >
                                <ChevronLeft className="h-4 w-4" /> Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="h-10 rounded-xl px-4 font-black text-[10px] uppercase tracking-widest gap-2 bg-white border-slate-200 text-slate-500 hover:text-indigo-600"
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
