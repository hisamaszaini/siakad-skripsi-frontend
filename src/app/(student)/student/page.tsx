"use client";

import { GraduationCap, FileText, CheckCircle2, Clock, XCircle, AlertTriangle, RefreshCcw, User, LucideIcon, CircleAlert } from "lucide-react";
import { Proposal, Supervisor } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { PageTitle } from "@/components/ui/page-title";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMyThesisQuery } from "@/features/proposal";
import { useActiveSemproQuery } from "@/features/sempro";
import { useActiveDefenseQuery } from "@/features/defense";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useEffect } from "react";

const STATUS_CONFIG: Record<string, { label: string; icon: LucideIcon; badge: string; description: string; color: string }> = {
    SUBMITTED: {
        label: "Menunggu Verifikasi",
        icon: Clock,
        badge: "bg-blue-100 text-blue-700",
        description: "Usulanmu sedang ditinjau oleh calon pembimbing.",
        color: "blue",
    },
    REVISION: {
        label: "Perlu Revisi",
        icon: AlertTriangle,
        badge: "bg-amber-100 text-amber-700",
        description: "Calon pembimbing meminta revisi. Silakan ajukan ulang setelah perbaikan.",
        color: "amber",
    },
    APPROVED: {
        label: "Disetujui Pembimbing",
        icon: CheckCircle2,
        badge: "bg-emerald-100 text-emerald-700",
        description: "Calon pembimbing menyetujui usulanmu. Menunggu penetapan pembimbing oleh Prodi.",
        color: "emerald",
    },
    PLOTTED: {
        label: "Pembimbing Ditetapkan",
        icon: GraduationCap,
        badge: "bg-indigo-100 text-indigo-700",
        description: "Selamat! Pembimbing skripsimu resmi ditetapkan. Mulai proses bimbingan.",
        color: "indigo",
    },
    SEMPRO: {
        label: "Seminar Proposal",
        icon: FileText,
        badge: "bg-violet-100 text-violet-700",
        description: "Kamu sedang dalam tahap Seminar Proposal. Siapkan presentasimu dengan baik.",
        color: "violet",
    },
    SKRIPSI: {
        label: "Pengerjaan Skripsi",
        icon: RefreshCcw,
        badge: "bg-cyan-100 text-cyan-700",
        description: "Fokus pada penelitian dan penulisan skripsi setelah lulus Sempro.",
        color: "cyan",
    },
    SIDANG: {
        label: "Sidang Akhir",
        icon: GraduationCap,
        badge: "bg-rose-100 text-rose-700",
        description: "Tahap akhir! Persiapkan diri untuk mempertahankan skripsimu di hadapan tim penguji.",
        color: "rose",
    },
    FINISHED: {
        label: "Selesai",
        icon: CheckCircle2,
        badge: "bg-green-100 text-green-700",
        description: "Selamat! Kamu telah menyelesaikan seluruh rangkaian skripsi.",
        color: "green",
    },
    REJECTED: {
        label: "Ditolak",
        icon: XCircle,
        badge: "bg-red-100 text-red-700",
        description: "Usulanmu ditolak. Kamu bisa mengajukan proposal baru atau merevisi usulan ini.",
        color: "red",
    },
    NONACTIVE: {
        label: "Nonaktif / Kadaluarsa",
        icon: Clock,
        badge: "bg-slate-200 text-slate-600",
        description: "Masa berlaku usulan Anda (2 semester) telah berakhir. Silakan ajukan usulan baru.",
        color: "slate",
    },
};

const STATUS_PROGRESS: Record<string, string> = {
    SUBMITTED: "10%",
    REVISION: "10%",
    APPROVED: "25%",
    PLOTTED: "40%",
    SEMPRO: "55%",
    SKRIPSI: "75%",
    SIDANG: "90%",
    FINISHED: "100%",
    REJECTED: "0%",
    NONACTIVE: "0%",
};

const EXAM_STATUS_CONFIG: Record<string, { label: string; badge: string; color: string }> = {
    REGISTERED: {
        label: "Baru Mendaftar",
        badge: "bg-blue-100 text-blue-700",
        color: "blue",
    },
    SCHEDULED: {
        label: "Terjadwal",
        badge: "bg-indigo-100 text-indigo-700",
        color: "indigo",
    },
    PASSED: {
        label: "Lulus",
        badge: "bg-emerald-100 text-emerald-700",
        color: "emerald",
    },
    REVISE: {
        label: "Lulus (Revisi)",
        badge: "bg-amber-100 text-amber-700",
        color: "amber",
    },
    FAILED: {
        label: "Tidak Lulus",
        badge: "bg-red-100 text-red-700",
        color: "red",
    },
};

export default function StudentDashboard() {
    const { user } = useAuth();
    const { data: thesisRes, isLoading: thesisLoading } = useMyThesisQuery();
    const { data: sempro } = useActiveSemproQuery();
    const { data: defense } = useActiveDefenseQuery();

    const thesis = thesisRes?.current;
    const history = thesisRes?.history || [];

    const isLoading = thesisLoading && !thesisRes;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-slate-400 animate-pulse text-[10px] uppercase tracking-[0.3em]">Syncing Dashboard...</p>
                </div>
            </div>
        );
    }

    const currentStatus = thesis ? (STATUS_CONFIG[thesis.status] ?? { label: thesis.status, icon: Clock, badge: "bg-slate-100 text-slate-700", description: "", color: "slate" }) : null;
    const StatusIcon = currentStatus?.icon;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    return (
        <div className="w-11/12 mx-auto space-y-10 sm:space-y-16 mt-16 lg:mt-0 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <PageTitle title="Dashboard Mahasiswa" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 sm:w-10 bg-indigo-600 rounded-full" />
                        <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Student Portal</span>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                        <h1 className="text-3xl sm:text-5xl lg:text-3xl font-black tracking-tighter text-slate-600 leading-[1.1]">
                            Dashboard <span className="text-indigo-600">Mahasiswa.</span>
                        </h1>
                        <p className="text-slate-900 font-bold text-base sm:text-4xl tracking-tight">{getGreeting()}, {user?.nama?.split(' ')[0] || 'Mahasiswa'} 👋</p>
                    </div>
                </div>
                {(!thesis || thesis.status === "REJECTED" || thesis.status === "NONACTIVE") && (
                    <Link href="/student/proposal" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-indigo-950 hover:bg-black text-white shadow-2xl shadow-indigo-100 h-14 sm:h-16 px-8 sm:px-10 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest gap-3 active:scale-95 transition-all">
                            <FileText className="h-5 w-5" />
                            {thesis?.status === "REJECTED" ? "AJUKAN REVISI USULAN" : (thesis?.status === "NONACTIVE" ? "BUAT USULAN BARU" : "MULAI PENGAJUAN PROPOSAL")}
                        </Button>
                    </Link>
                )}
            </div>

            {thesis ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-8 lg:space-y-10">
                        {/* Status Card */}
                        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white/70 backdrop-blur-xl overflow-hidden rounded-[2.5rem] relative group border border-white/40">
                            <div className={cn(
                                "absolute top-0 right-0 h-40 w-40 rounded-full blur-3xl -mr-20 -mt-20 opacity-20 transition-transform duration-700 group-hover:scale-110",
                                currentStatus?.color === "red" ? "bg-red-500" :
                                    currentStatus?.color === "emerald" ? "bg-emerald-500" :
                                        "bg-indigo-500"
                            )} />
                            <CardContent className="p-8 sm:p-10 relative z-10">
                                <div className="flex flex-col md:flex-row gap-8 sm:gap-10 items-start">
                                    <div className={cn(
                                        "h-16 w-16 sm:h-20 sm:w-20 rounded-[1.8rem] sm:rounded-[2rem] flex items-center justify-center shadow-2xl transition-transform duration-500 group-hover:rotate-3",
                                        currentStatus?.color === "red" ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-red-200" :
                                            currentStatus?.color === "emerald" ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-200" :
                                                "bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-indigo-200"
                                    )}>
                                        {StatusIcon && <StatusIcon className="h-8 w-8 sm:h-10 sm:w-10" />}
                                    </div>
                                    <div className="flex-1 space-y-4 sm:space-y-5">
                                        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">{currentStatus?.label}</h2>
                                            {currentStatus && (
                                                <Badge className={cn("rounded-lg px-2.5 py-1 text-[9px] uppercase font-black tracking-widest shadow-sm", currentStatus.badge)}>
                                                    Langkah Aktif
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                                            {currentStatus?.description}
                                        </p>
                                        {(thesis.status === "REJECTED" || thesis.status === "REVISION" || thesis.status === "PLOTTED") && thesis.catatan && (
                                            <div className="mt-6 sm:mt-8 p-6 rounded-[1.5rem] sm:rounded-[2rem] bg-slate-50/50 border border-slate-100/50 text-slate-600 text-sm flex flex-col sm:flex-row gap-4 backdrop-blur-sm">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                                                    <CircleAlert className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="font-black text-slate-900 uppercase text-[9px] sm:text-[10px] tracking-widest block font-primary opacity-40">Respons Pembimbing</p>
                                                    <p className="leading-relaxed font-medium">{thesis.catatan}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Judul & Detail */}
                        <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2.5rem] overflow-hidden group">
                            <CardHeader className="p-8 sm:p-10 pb-0 sm:pb-0 border-none">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="h-4 w-1 bg-indigo-600 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-primary">Academic Thesis Review</span>
                                </div>
                                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
                                    &quot;{thesis.judul}&quot;
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 sm:p-10 pt-6 sm:pt-8 space-y-8 sm:space-y-10">
                                <div className="w-full p-6 sm:p-8 rounded-[2rem] bg-slate-50/50 border border-slate-100/50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <FileText className="h-16 w-16" />
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 sm:mb-3 block font-primary">Tema</span>
                                    <p className="text-slate-700 font-bold text-base sm:text-xl italic leading-relaxed relative z-10">
                                        {thesis.tema}
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-2">
                                    <div className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100">
                                        <div className="p-2 bg-white rounded-xl shadow-sm">
                                            <Clock className="h-4 w-4 text-indigo-500" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tanggal Daftar</p>
                                            <p className="text-xs sm:text-sm font-black text-slate-700">
                                                {new Date(thesis.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Actions */}
                        {["PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED"].includes(thesis.status) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
                                <Link href="/student/guidance" className="group">
                                    <Card className="border-none shadow-lg shadow-slate-100 bg-white p-7 sm:p-8 rounded-[2.5rem] group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-2 transition-all duration-500 border-2 border-transparent group-hover:border-indigo-50 flex items-center gap-6">
                                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1.2rem] bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0 group-hover:rotate-6 transition-transform">
                                            <FileText className="h-7 w-7 sm:h-8 sm:w-8" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight truncate">Log Bimbingan</h4>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">Update Progres Mingguan</p>
                                        </div>
                                    </Card>
                                </Link>
                                <Link href="/student/proposal" className="group">
                                    <Card className="border-none shadow-lg shadow-slate-100 bg-white p-7 sm:p-8 rounded-[2.5rem] group-hover:shadow-2xl group-hover:shadow-indigo-100 group-hover:-translate-y-2 transition-all duration-500 border-2 border-transparent group-hover:border-indigo-50 flex items-center gap-6">
                                        <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-[1.2rem] bg-slate-100 text-slate-900 flex items-center justify-center shrink-0 group-hover:-rotate-6 transition-transform">
                                            <RefreshCcw className="h-7 w-7 sm:h-8 sm:w-8" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-lg sm:text-xl text-slate-900 tracking-tight truncate">Detail Berkas</h4>
                                            <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">Arsip Dokumen Proposal</p>
                                        </div>
                                    </Card>
                                </Link>
                            </div>
                        )}
                        <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2.5rem] overflow-hidden group">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center gap-2">
                                    <div className="h-1 w-8 sm:w-10 bg-indigo-600 rounded-full" />
                                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 font-primary">Academic Journey</span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4">
                                <div className="relative overflow-x-auto pb-6 scrollbar-hide -mx-2">
                                    <div className="min-w-[800px] relative flex justify-between px-6 py-6">
                                        <div className="absolute top-[42px] left-12 right-12 h-[3px] bg-slate-100 rounded-full -z-0" />
                                        <div
                                            className="absolute top-[42px] left-12 h-[3px] bg-indigo-600 rounded-full z-0 transition-all duration-1000 ease-in-out shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                                            style={{ width: `calc(${STATUS_PROGRESS[thesis.status] || "0%"} - 48px)` }}
                                        />

                                        {["SUBMITTED", "APPROVED", "PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED"].map((s, i) => {
                                            const statuses = ["SUBMITTED", "APPROVED", "PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED"];
                                            const currentIndex = statuses.indexOf(thesis.status);
                                            const stageIndex = i;
                                            const isDone = stageIndex < currentIndex || thesis.status === "FINISHED";
                                            const isActive = stageIndex === currentIndex;

                                            return (
                                                <div key={s} className="relative z-10 flex flex-col items-center gap-4 w-24 group/step">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center border-4 border-white transition-all duration-500 relative",
                                                        isDone ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" :
                                                            isActive ? "bg-white border-indigo-600 text-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.2)] scale-110" :
                                                                "bg-slate-50 text-slate-300 border-slate-100"
                                                    )}>
                                                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-[10px] font-black tracking-tight">{stageIndex + 1}</span>}

                                                        {isActive && (
                                                            <span className="absolute -top-1 -right-1 h-3 w-3 bg-indigo-600 rounded-full border-2 border-white animate-ping" />
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 text-center">
                                                        <span className={cn(
                                                            "text-[9px] font-black uppercase tracking-widest block transition-colors duration-300",
                                                            isActive ? "text-indigo-600" : isDone ? "text-slate-900" : "text-slate-400"
                                                        )}>
                                                            {s}
                                                        </span>
                                                        {isActive && (
                                                            <div className="h-1 w-1 bg-indigo-600 rounded-full mx-auto animate-bounce" />
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* History Section */}
                        {history && history.length > 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-[2px] w-8 bg-slate-100" />
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Riwayat Pengajuan</h3>
                                    <div className="h-[2px] flex-1 bg-slate-50" />
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {history.slice(1).map((h: Proposal) => (
                                        <Card key={h.id} className="border-none shadow-sm bg-white/50 hover:bg-white transition-all duration-300 rounded-[1.5rem] overflow-hidden group">
                                            <CardContent className="p-6 flex items-center justify-between gap-6">
                                                <div className="flex items-center gap-4 min-w-0">
                                                    <div className={cn(
                                                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                                                        h.status === "REJECTED" ? "bg-red-50 text-red-400" : "bg-slate-50 text-slate-400"
                                                    )}>
                                                        <Clock className="h-5 w-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-black text-slate-900 truncate tracking-tight">{h.judul}</p>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                            {new Date(h.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })} • {h.status}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge className={cn("rounded-lg px-2 py-0.5 text-[8px] uppercase font-black tracking-widest", (STATUS_CONFIG[h.status] as { badge: string })?.badge || "bg-slate-100 text-slate-500")}>
                                                    {h.status}
                                                </Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-8 lg:space-y-10">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 sm:gap-8">
                            {[
                                { label: "AKUMULASI SKS", value: `${thesis.sks_total} SKS`, icon: GraduationCap, color: "from-indigo-950 to-indigo-900", shadow: "shadow-indigo-900/20" },
                            ].map((stat, i) => (
                                <Card key={i} className={cn("border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative text-white group", stat.shadow)}>
                                    <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100 group-hover:scale-110 transition-transform duration-700", stat.color)} />
                                    <CardContent className="p-8 relative z-10 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">{stat.label}</p>
                                            <p className="text-4xl font-black tracking-tighter group-hover:tracking-normal transition-all duration-500">{stat.value}</p>
                                        </div>
                                        <div className="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner group-hover:rotate-12 transition-transform duration-500">
                                            <stat.icon className="h-7 w-7 text-white" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Supervisors Card */}
                        <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.4em]">Advisory Team</h3>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                {["PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED"].includes(thesis.status) && thesis.supervisors && thesis.supervisors.length > 0 ? (
                                    thesis.supervisors.sort((a: Supervisor, b: Supervisor) => a.role === "MAIN" ? -1 : (b.role === "MAIN" ? 1 : 0)).map((s: Supervisor, idx: number) => (
                                        <div key={idx} className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50/50 hover:bg-indigo-50/50 transition-all duration-300 border border-transparent hover:border-indigo-100 group">
                                            <div className="relative">
                                                <Avatar className="h-14 w-14 border-2 border-white ring-4 ring-indigo-50/50 overflow-hidden shadow-sm">
                                                    <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-sm">
                                                        {s.nama.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                                                    {s.role === "MAIN" ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <User className="h-3 w-3 text-indigo-400" />}
                                                </div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-slate-900 truncate tracking-tight">{s.nama}</p>
                                                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">
                                                    {s.role === "MAIN" ? "Pembimbing Utama" : "Pembimbing Pendamping"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 space-y-4">
                                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-slate-200 opacity-50">
                                            <User className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waiting Assignment</p>
                                            <p className="text-[11px] text-slate-300 font-bold mt-1">Lengkapi administrasi usulan.</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Exam Results */}
                        {(sempro || defense) && (
                            <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2.5rem] overflow-hidden">
                                <CardHeader className="p-8 border-b border-slate-50">
                                    <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.4em] text-center">Examination Records</h3>
                                </CardHeader>
                                <CardContent className="p-8 space-y-8">
                                    {sempro && (
                                        <div className="space-y-4 group">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Seminar Proposal</span>
                                                <Badge className={cn("rounded-lg px-2.5 py-1 text-[8px] uppercase font-black tracking-widest shadow-sm transition-all duration-300", EXAM_STATUS_CONFIG[sempro.status]?.badge)}>
                                                    {EXAM_STATUS_CONFIG[sempro.status]?.label || sempro.status}
                                                </Badge>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-3 transition-all duration-300 group-hover:bg-indigo-50/30 group-hover:border-indigo-100/50">
                                                {sempro.tanggal ? (
                                                    <div className="flex justify-between items-center text-[11px]">
                                                        <span className="text-slate-400 font-bold uppercase tracking-tight">Timeline Schedule</span>
                                                        <span className="text-slate-900 font-black">{new Date(sempro.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}, {sempro.jam || '--:--'}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-md text-slate-500 italic text-center py-2 opacity-60 font-medium tracking-tight">Menunggu jadwal ditetapkan.</p>
                                                )}
                                                {sempro.nilai !== null && sempro.nilai !== undefined && (
                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/50">
                                                        <span className="text-slate-400 font-bold uppercase tracking-tight">Final Grade</span>
                                                        <span className="text-2xl font-black text-indigo-600 tracking-tighter">{sempro.nilai}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {defense && (
                                        <div className="space-y-4 group">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Sidang Akhir</span>
                                                <Badge className={cn("rounded-lg px-2.5 py-1 text-[8px] uppercase font-black tracking-widest shadow-sm transition-all duration-300", EXAM_STATUS_CONFIG[defense.status]?.badge)}>
                                                    {EXAM_STATUS_CONFIG[defense.status]?.label || defense.status}
                                                </Badge>
                                            </div>
                                            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-3 transition-all duration-300 group-hover:bg-rose-50/30 group-hover:border-rose-100/50">
                                                {defense.tanggal ? (
                                                    <div className="flex justify-between items-center text-[11px]">
                                                        <span className="text-slate-400 font-bold uppercase tracking-tight">Timeline Schedule</span>
                                                        <span className="text-slate-900 font-black">{new Date(defense.tanggal).toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}, {defense.jam || '--:--'}</span>
                                                    </div>
                                                ) : (
                                                    <p className="text-[10px] text-slate-400 italic text-center py-2 opacity-60 font-medium tracking-tight">Menunggu jadwal ditetapkan.</p>
                                                )}
                                                {defense.nilai !== null && defense.nilai !== undefined && (
                                                    <div className="flex justify-between items-center pt-3 border-t border-slate-200/50">
                                                        <span className="text-slate-400 font-bold uppercase tracking-tight">Final Grade</span>
                                                        <span className="text-2xl font-black text-rose-600 tracking-tighter">{defense.nilai}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Academy Bulletin */}
                        <Card className="border-none bg-indigo-800 text-white rounded-[2.5rem] p-10 relative overflow-hidden group shadow-2xl shadow-indigo-950/20">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/20 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="absolute bottom-0 left-0 h-32 w-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-2xl opacity-50" />
                            <div className="relative z-10 space-y-8">
                                <div className="h-1 w-10 bg-indigo-500 rounded-full" />
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-300 font-primary">Academy Bulletin</h4>
                                    <p className="text-lg font-bold leading-relaxed tracking-tight text-white italic">
                                        &quot;{["PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED"].includes(thesis.status)
                                            ? "Selesaikan draft Bab 1-3 sebelum jadwal Seminar Proposal dibuka bulan depan untuk hasil optimal."
                                            : "Pastikan berkas usulan Anda telah divalidasi oleh Calon Pembimbing melalui feedback sistem sebelum final submit."}&quot;
                                    </p>
                                </div>
                                <div className="flex items-center gap-4 pt-4">
                                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 overflow-hidden shadow-inner backdrop-blur-sm">
                                        <GraduationCap className="h-6 w-6 text-indigo-300" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-white tracking-[0.05em]">Academic Support</p>
                                        <p className="text-[9px] font-black text-indigo-400/70 uppercase tracking-widest mt-0.5">SIAKAD-Skripsi v1.0</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <div className="h-[65vh] flex flex-col items-center justify-center p-16 text-center bg-white rounded-[4rem] border-2 border-dashed border-slate-100 shadow-2xl shadow-slate-100/50">
                    <div className="h-24 w-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mb-10 shadow-inner">
                        <GraduationCap className="h-12 w-12" />
                    </div>
                    <div className="max-w-md space-y-6 mb-12">
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter">Memulai Skripsi.</h3>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            Ambil langkah berani hari ini. Ajukan topik penelitianmu dan temukan pembimbing yang tepat untuk membimbingmu menuju kelulusan.
                        </p>
                    </div>
                    <Link href="/student/proposal">
                        <Button className="h-20 px-12 bg-indigo-600 hover:bg-black text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest gap-4 shadow-2xl shadow-indigo-200 active:scale-95 transition-all">
                            BUAT PENGAJUAN PROPOSAL <FileText className="h-6 w-6" />
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
