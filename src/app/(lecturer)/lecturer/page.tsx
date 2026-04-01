"use client";

import { FileSearch, Users, CheckCircle2, Clock, Loader2, FileText, User } from "lucide-react";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProposalsForSupervisorQuery } from "@/features/proposal";
import { Proposal } from "@/types";
import { useEffect } from "react";
import { PageTitle } from "@/components/ui/page-title";

export default function LecturerDashboard() {
    const { data, isLoading } = useProposalsForSupervisorQuery();

    useEffect(() => {
    }, []);
    const proposals = data?.data || [];

    const pending = proposals.filter((p: Proposal) => p.status === "SUBMITTED");
    const approved = proposals.filter((p: Proposal) => p.status === "APPROVED");

    const stats = [
        { label: "USULAN BARU", value: pending.length, icon: FileSearch, color: "from-amber-600 to-orange-700" },
        { label: "TOTAL USULAN", value: proposals.length, icon: Users, color: "from-indigo-700 to-blue-800" },
        { label: "DISPACHED", value: approved.length, icon: CheckCircle2, color: "from-emerald-700 to-teal-800" },
    ];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="font-bold text-slate-400 animate-pulse text-xs uppercase tracking-widest">Sinkronisasi Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Dashboard Dosen" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Lecturer Control Panel</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Dashboard <span className="text-indigo-600">Dosen.</span>
                    </h1>
                </div>
                <Link href="/lecturer/proposals">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg h-12 px-8 rounded-xl font-bold gap-2 active:scale-95 transition-all text-sm">
                        <FileSearch className="h-4 w-4" />
                        TINJAU SEMUA USULAN
                    </Button>
                </Link>
            </div>

            {/* Vibrant Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-lg rounded-2xl overflow-hidden relative text-white group">
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90 group-hover:opacity-100 transition-opacity", stat.color)} />
                        <CardContent className="p-6 relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black">{stat.value}</p>
                            </div>
                            <stat.icon className="h-10 w-10 opacity-20 group-hover:scale-110 transition-transform" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Action & Quick Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Pending Proposals List - Sleek Minimalist */}
                <Card className="lg:col-span-8 rounded-3xl border-none shadow-sm bg-white overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-lg font-black text-slate-900">Perlu Verifikasi</CardTitle>
                            <CardDescription className="text-xs font-medium">Usulan mahasiswa yang menunggu tinjauan Anda.</CardDescription>
                        </div>
                        <Link href="/lecturer/proposals">
                            <Button variant="ghost" className="text-indigo-600 font-bold hover:bg-indigo-50 rounded-xl text-xs">LIHAT SEMUA</Button>
                        </Link>
                    </div>
                    <CardContent className="p-6 flex-1">
                        {pending.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mb-4">
                                    <CheckCircle2 className="h-8 w-8" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">Semua Beres!</p>
                                <p className="text-xs text-slate-400 mt-1">Tidak ada usulan baru saat ini.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {pending.slice(0, 5).map((item: Proposal) => (
                                    <div key={item.id} className="group p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-sm transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                                <User className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 truncate text-sm leading-none mb-1 group-hover:text-indigo-600 transition-colors uppercase">{item.nama_mahasiswa}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{item.nim}</p>
                                            </div>
                                        </div>
                                        <Link href={`/lecturer/proposals/${item.id}`} className="shrink-0">
                                            <Button size="sm" className="bg-white hover:bg-slate-900 text-slate-900 hover:text-white border border-slate-200 font-bold rounded-lg text-[10px] px-4 transition-all">
                                                TINJAU
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Right Column Actions */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="rounded-3xl border-none shadow-sm bg-indigo-600 text-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <div className="relative z-10 space-y-4">
                            <div className="h-12 w-12 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black">Log Bimbingan</h3>
                                <p className="text-xs text-indigo-100 mt-1 font-medium">Validasi aktivitas bimbingan mahasiswa.</p>
                            </div>
                            <Link href="/lecturer/guidance" className="block pt-2">
                                <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 h-12 rounded-xl font-bold text-xs gap-2">
                                    BUKA LOG VERIFIKASI
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card className="rounded-3xl border-none shadow-sm bg-slate-800 text-white p-8 relative overflow-hidden">
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Info Sistem</span>
                            </div>
                            <p className="text-sm font-bold leading-relaxed">
                                Mohon segera berikan <span className="text-indigo-400">Persetujuan</span> atau <span className="text-amber-400">Revisi</span> pada usulan baru agar mahasiswa dapat segera memulai proses penelitian.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Update</p>
                                    <p className="text-[10px] font-bold">Hari ini, 18:30</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}