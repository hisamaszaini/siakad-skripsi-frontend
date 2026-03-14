"use client";

import { useState } from "react";
import { useMyGuidanceLogsQuery, useSubmitGuidanceLogMutation, useEditGuidanceLogMutation } from "@/features/guidance";
import { GuidanceLog, Supervisor } from "@/types";
import { GuidanceLogFormData } from "@/schemas";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Loader2, ArrowLeft, Plus, CheckCircle2, Clock, XCircle, FileText, User, Calendar, MessageSquare, Info } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { SingleSelect } from "@/components/ui/single-select";
import { PageTitle } from "@/components/ui/page-title";

const STATUS_BADGE = {
    PENDING: { label: "Menunggu Verifikasi", className: "bg-indigo-50 text-indigo-600 border-indigo-100", icon: Clock },
    VERIFIED: { label: "Telah Diverifikasi", className: "bg-emerald-50 text-emerald-600 border-emerald-100", icon: CheckCircle2 },
    REJECTED: { label: "Ditolak", className: "bg-red-50 text-red-600 border-red-100", icon: XCircle },
};

export default function StudentGuidancePage() {
    const { data, isLoading: logsLoading, refetch: mutate } = useMyGuidanceLogsQuery();
    const thesis = data?.proposal;
    const logs = data?.logs || [];
    
    const { mutateAsync: submitLog, isPending: isSubmitting } = useSubmitGuidanceLogMutation();
    const { mutateAsync: editLog, isPending: isEditing } = useEditGuidanceLogMutation();

    const [openAddLog, setOpenAddLog] = useState(false);
    const [openEditLog, setOpenEditLog] = useState<string | null>(null);
    const [editTanggal, setEditTanggal] = useState("");
    const [editActivities, setEditActivities] = useState("");
    const [editDosenId, setEditDosenId] = useState("");

    const [formDosenId, setFormDosenId] = useState("");
    const [formActivities, setFormActivities] = useState("");
    const [formTanggal, setFormTanggal] = useState("");

    const [roleFilter, setRoleFilter] = useState<'ALL' | 'MAIN' | 'CO'>('ALL');

    const filteredLogs = logs.filter((log: GuidanceLog) => {
        if (roleFilter === 'ALL') return true;
        return log.role_dosen === roleFilter;
    });

    if (logsLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="font-black text-slate-400 animate-pulse text-[10px] uppercase tracking-widest">Memuat Log Bimbingan...</p>
                </div>
            </div>
        );
    }

    if (!thesis || thesis.status === "SUBMITTED" || thesis.status === "REJECTED") {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 max-w-md mx-auto">
                <div className="h-24 w-24 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-200">
                    <FileText className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Akses Ditolak</h2>
                    <p className="text-slate-500 font-medium">
                        Kamu belum bisa mengakses log bimbingan. Pembimbing skripsimu belum ditetapkan atau sedang dalam proses validasi.
                    </p>
                </div>
                <Link href="/student">
                    <Button variant="ghost" className="rounded-xl font-black text-xs uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 gap-2">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
                    </Button>
                </Link>
            </div>
        );
    }

    const supervisorOptions = (thesis.supervisors || [])
        .sort((a: Supervisor, _b: Supervisor) => (a.role === 'MAIN' ? -1 : 1))
        .map((sup: Supervisor) => ({
            label: sup.nama,
            value: sup.dosen_id,
            description: sup.role === 'MAIN' ? 'Pembimbing Utama' : 'Pembimbing Pendamping'
        }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formDosenId) {
            toast.error("Pilih dosen pembimbing terlebih dahulu");
            return;
        }
        if (!formActivities || formActivities.length < 10) {
            toast.error("Isi kegiatan minimal 10 karakter");
            return;
        }
        if (!formTanggal) {
            toast.error("Pilih tanggal bimbingan");
            return;
        }

        try {
            await submitLog({
                skripsi_id: thesis?.id,
                dosen_id: formDosenId,
                kegiatan: formActivities,
                tanggal: new Date(formTanggal).toISOString(),
            });
            setOpenAddLog(false);
            setFormDosenId("");
            setFormActivities("");
            setFormTanggal("");
        } catch (error) {
            // Handled by mutation hook's onError
        }
    };

    const handleEditLog = async (logId: string) => {
        try {
            await editLog({
                id: logId,
                data: {
                    tanggal: new Date(editTanggal).toISOString(),
                    kegiatan: editActivities,
                    skripsi_id: thesis!.id,
                    dosen_id: editDosenId,
                } as GuidanceLogFormData
            });
            setOpenEditLog(null);
        } catch (error) {
            // Handled by hook
        }
    };

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Log Bimbingan Saya" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Activity Track</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Log <span className="text-indigo-600">Bimbingan</span>
                    </h1>
                </div>

                <Dialog open={openAddLog} onOpenChange={setOpenAddLog}>
                    <DialogTrigger>
                        <button className="bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-200 h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] gap-3 active:scale-95 transition-all inline-flex items-center justify-center">
                            <Plus className="h-4 w-4" /> Tambah Catatan
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
                        <DialogHeader className="p-8 pb-4 bg-slate-50/50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">New Entry</span>
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Record Guidance</DialogTitle>
                            <DialogDescription className="text-sm font-medium text-slate-500 mt-2">
                                Catat aktivitas bimbingan terbaru untuk divalidasi pembimbing.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Dosen Pembimbing <span className="text-red-500">*</span>
                                </Label>
                                <SingleSelect
                                    value={formDosenId}
                                    onChange={setFormDosenId}
                                    options={supervisorOptions}
                                    placeholder="Pilih dosen pembimbing..."
                                    className="w-full h-14 rounded-2xl border-slate-200"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Activities <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    value={formActivities}
                                    onChange={(e) => setFormActivities(e.target.value)}
                                    placeholder="Apa saja yang dibahas hari ini? (min. 10 karakter)..."
                                    className="min-h-[140px] rounded-2xl border border-slate-200 bg-white p-4 font-medium focus:border-indigo-500 focus:ring-indigo-500/20 transition-all leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                    Waktu Bimbingan <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="datetime-local"
                                    value={formTanggal}
                                    onChange={(e) => setFormTanggal(e.target.value)}
                                    className="h-14 rounded-2xl border border-slate-200 bg-white px-4 font-bold focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all">
                                    {isSubmitting ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Mengirim...</>
                                    ) : (
                                        'Submit Log Catatan'
                                    )}
                                </Button>
                                <Button type="button" variant="ghost" className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50" onClick={() => setOpenAddLog(false)}>Batal</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <Card className="md:col-span-4 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden relative text-white group bg-gradient-to-br from-indigo-600 to-indigo-900 p-8">
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="h-10 w-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-1">TOTAL BIMBINGAN</p>
                            <p className="text-5xl font-black tracking-tighter">{logs.length} <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest ml-1">LOGS</span></p>
                        </div>
                    </div>
                    <FileText className="absolute -bottom-8 -right-8 h-40 w-40 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                </Card>

                <div className="md:col-span-8 bg-white shadow-xl shadow-slate-100/50 border border-slate-50 rounded-[2.5rem] p-10 flex items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Info className="h-24 w-24 -rotate-12" />
                    </div>
                    <div className="relative z-10 flex gap-6 items-start">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <MessageSquare className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Konsistensi adalah Kunci.</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed italic">
                                &quot;Jangan lupa mencatat setiap diskusi penting bersama pembimbingmu. Data log ini akan menjadi prasyarat untuk pendaftaran Seminar Proposal.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline Aktivitas</h3>
                    </div>

                    <div className="flex gap-2">
                        {['ALL', 'MAIN', 'CO'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setRoleFilter(filter as 'ALL' | 'MAIN' | 'CO')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                    roleFilter === filter
                                        ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                                        : "bg-white text-slate-400 border-slate-100 hover:border-indigo-200"
                                )}
                            >
                                {filter === 'ALL' ? 'Semua' : filter === 'MAIN' ? 'Pembimbing 1' : 'Pembimbing 2'}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredLogs.length === 0 ? (
                    <Card className="border-2 border-dashed border-slate-100 shadow-none bg-slate-50/30 rounded-[3rem]">
                        <CardContent className="flex flex-col items-center justify-center p-20 text-center">
                            <div className="bg-white h-20 w-20 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-center mb-6">
                                <FileText className="h-10 w-10 text-slate-200" />
                            </div>
                            <h3 className="font-black text-2xl text-slate-900 mb-2 leading-none">Log Tidak Ditemukan</h3>
                            <p className="text-slate-400 font-medium max-w-xs text-sm">
                                {roleFilter === 'ALL'
                                    ? 'Kamu belum memiliki riwayat bimbingan.'
                                    : `Tidak ada log bimbingan untuk ${roleFilter === 'MAIN' ? 'Pembimbing Utama' : 'Pembimbing Pendamping'}.`}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100">
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 w-16">No</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Dosen Pembimbing</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Aktivitas Bimbingan</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map((log: GuidanceLog, index: number) => {
                                        const statusBadge = STATUS_BADGE[log.status as keyof typeof STATUS_BADGE] || STATUS_BADGE.PENDING;
                                        const Icon = statusBadge.icon;

                                        return (
                                            <tr key={log.id} className="group border-b border-slate-50 last:border-none hover:bg-slate-50/30 transition-colors">
                                                <td className="px-8 py-6 font-black text-slate-300 text-sm">{(index + 1).toString().padStart(2, '0')}</td>
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
                                                        <p className="font-medium text-slate-600 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                                                            {log.kegiatan}
                                                        </p>
                                                        {log.catatan && (
                                                            <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-indigo-400 italic">
                                                                <MessageSquare className="h-3 w-3" />
                                                                Ada feedback pembimbing
                                                            </div>
                                                        )}
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
                                                        {/* Feedback Dialog if exists */}
                                                        {(log.catatan || log.status === 'REJECTED') && (
                                                            <Dialog>
                                                                <DialogTrigger>
                                                                    <button className="h-9 w-9 rounded-xl border border-slate-100 bg-white text-slate-400 hover:text-indigo-600 hover:border-indigo-100 flex items-center justify-center transition-all shadow-sm">
                                                                        <MessageSquare className="h-4 w-4" />
                                                                    </button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
                                                                    <div className="p-8 bg-slate-50/50 border-b border-slate-100 text-center">
                                                                        <div className={cn(
                                                                            "h-16 w-16 rounded-3xl mx-auto flex items-center justify-center mb-4 shadow-inner border",
                                                                            log.status === 'REJECTED' ? "bg-red-50 border-red-100 text-red-600" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                                                                        )}>
                                                                            {log.status === 'REJECTED' ? <XCircle className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
                                                                        </div>
                                                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Feedback Pembimbing</h3>
                                                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{log.nama_dosen}</p>
                                                                    </div>
                                                                    <div className="p-10">
                                                                        <p className="text-slate-600 font-medium leading-relaxed italic text-center">
                                                                            &quot;{log.catatan || (log.status === 'REJECTED' ? 'Mohon diperbaiki detail aktivitas bimbingan ini agar dapat divalidasi pembimbing.' : 'Tidak ada catatan tambahan khusus.')}&quot;
                                                                        </p>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}

                                                        {/* Edit/Revisi Button for Rejected Logs */}
                                                        {log.status === 'REJECTED' && (
                                                            <Dialog open={openEditLog === log.id} onOpenChange={(open) => {
                                                                if (!open) {
                                                                    setOpenEditLog(null);
                                                                    setEditDosenId("");
                                                                } else {
                                                                    setOpenEditLog(log.id);
                                                                    setEditTanggal(log.tanggal.substring(0, 16));
                                                                    setEditActivities(log.kegiatan);
                                                                    setEditDosenId(log.dosen_id || "");
                                                                }
                                                            }}>
                                                                <DialogTrigger>
                                                                    <button className="h-9 px-4 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white font-black text-[9px] uppercase tracking-widest transition-all border border-amber-100 shadow-sm flex items-center gap-2">
                                                                        Revisi
                                                                    </button>
                                                                </DialogTrigger>
                                                                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
                                                                    <DialogHeader className="p-8 pb-4 bg-amber-50/50">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <div className="h-1 w-6 bg-amber-600 rounded-full" />
                                                                            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600">Edit Log</span>
                                                                        </div>
                                                                        <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Perbaiki Log Bimbingan</DialogTitle>
                                                                    </DialogHeader>

                                                                    <div className="p-8 pt-4 space-y-6">
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Dosen Pembimbing</Label>
                                                                            <div className="h-14 px-6 rounded-2xl border border-slate-100 bg-slate-50 flex items-center gap-3">
                                                                                <User className="h-4 w-4 text-slate-400" />
                                                                                <span className="font-bold text-slate-700">{log.nama_dosen}</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Waktu Bimbingan</Label>
                                                                            <Input
                                                                                type="datetime-local"
                                                                                className="h-14 rounded-2xl border border-slate-200 bg-white px-6 font-bold"
                                                                                value={editTanggal}
                                                                                onChange={(e) => setEditTanggal(e.target.value)}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detail Aktivitas</Label>
                                                                            <Textarea
                                                                                value={editActivities}
                                                                                onChange={(e) => setEditActivities(e.target.value)}
                                                                                className="min-h-[160px] rounded-2xl border border-slate-200 p-6 font-medium"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="px-8 pb-8 flex flex-col gap-3">
                                                                        <Button onClick={() => handleEditLog(log.id)} disabled={isEditing} className="h-14 rounded-2xl bg-amber-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-amber-100 transition-all active:scale-95 disabled:opacity-50">
                                                                            {isEditing ? <><Loader2 className="animate-spin h-4 w-4 mr-2" /> Memproses...</> : 'Simpan Perubahan & Ajukan Ulang'}
                                                                        </Button>
                                                                        <Button type="button" variant="ghost" onClick={() => setOpenEditLog(null)} className="font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all h-10">Batal</Button>
                                                                    </div>
                                                                </DialogContent>
                                                            </Dialog>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
