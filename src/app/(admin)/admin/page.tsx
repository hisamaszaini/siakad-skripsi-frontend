"use client";

import { FileText, UserCheck, Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAllProposalsQuery } from "@/features/proposal";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { PageTitle } from "@/components/ui/page-title";
import { useProdi } from "@/features/skripsi-tema";
import { SingleSelect } from "@/components/ui/single-select";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMemo } from "react";

export default function AdminDashboard() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const selectedProdi = searchParams.get("prodi") || "all";

    const updateProdi = (val: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (val === "all") {
            params.delete("prodi");
        } else {
            params.set("prodi", val);
        }
        router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
    };

    const { data: prodiList } = useProdi();
    const { data, isLoading } = useAllProposalsQuery({ prodi: selectedProdi === "all" ? undefined : selectedProdi.toUpperCase() });

    const prodiOptions = useMemo(() => {
        const list = (prodiList || []).map((p: { nama_prodi: string; kode_jurusan: string }) => ({
            label: p.nama_prodi,
            value: p.kode_jurusan
        }));
        return [{ label: "Semua Jurusan", value: "all" }, ...list];
    }, [prodiList]);
    const proposals = data?.data || [];


    const readyToAssign = proposals.filter((p) => p.status === "APPROVED");
    const submitted = proposals.filter((p) => p.status === "SUBMITTED");
    const assigned = proposals.filter((p) => p.status === "PLOTTED");

    const stats = [
        { label: "TOTAL USULAN", value: proposals.length, icon: FileText, color: "from-indigo-600 to-blue-700", shadow: "shadow-indigo-500/20" },
        { label: "MENUNGGU DOSEN", value: submitted.length, icon: Clock, color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/20" },
        { label: "SIAP DITETAPKAN", value: readyToAssign.length, icon: AlertCircle, color: "from-rose-500 to-red-600", shadow: "shadow-rose-500/20" },
        { label: "SUDAH DITETAPKAN", value: assigned.length, icon: CheckCircle2, color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/20" },
    ];

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="font-black text-slate-400 animate-pulse text-[10px] uppercase tracking-[0.3em]">Syncing Central Command...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto space-y-12 py-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <PageTitle title="Dashboard Admin" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-10 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">System Administration</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
                        Dashboard <span className="text-indigo-600">Administrator.</span>
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                            <Filter className="h-3 w-3" /> Filter:
                        </div>
                        <SingleSelect
                            value={selectedProdi}
                            onChange={(val) => updateProdi(val || "all")}
                            options={prodiOptions}
                            placeholder="Semua Jurusan"
                            className="w-full md:w-64 h-12 rounded-2xl border-slate-200 bg-slate-50/30 font-bold"
                        />
                    </div>

                    <Link href="/admin/proposals" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-slate-900 hover:bg-black text-white shadow-2xl shadow-slate-200 h-14 sm:h-16 px-8 sm:px-10 rounded-[1.5rem] font-black text-xs uppercase tracking-widest gap-3 active:scale-95 transition-all">
                            <UserCheck className="h-5 w-5" />
                            KELOLA DATA USULAN
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Vibrant Stats Grid - Fluid Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {stats.map((stat, i) => (
                    <Card key={i} className={cn("border-none shadow-2xl rounded-[2.5rem] overflow-hidden relative text-white group", stat.shadow)}>
                        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-100 group-hover:scale-110 transition-transform duration-700", stat.color)} />
                        <CardContent className="p-8 relative z-10 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-1">{stat.label}</p>
                                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                                <stat.icon className="h-7 w-7 text-white" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Ready to Assign list - Sleek Minimalist Premium */}
                <Card className="lg:col-span-8 rounded-[2.5rem] border-none shadow-2xl shadow-slate-100/50 bg-white overflow-hidden flex flex-col group">
                    <div className="p-8 sm:p-10 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-50/30">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                <CardTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Siap Ditetapkan SK</CardTitle>
                            </div>
                            <CardDescription className="text-[11px] font-black uppercase tracking-wider text-slate-400">Menunggu Penetapan Pembimbing Resmi oleh Admin Prodi</CardDescription>
                        </div>
                        <Link href="/admin/proposals?filter=APPROVED" className="w-full sm:w-auto">
                            <Button variant="ghost" className="w-full sm:w-auto text-indigo-600 font-black hover:bg-white hover:shadow-sm rounded-2xl text-[10px] uppercase tracking-[0.2em] px-6 h-12">LIHAT SEMUA</Button>
                        </Link>
                    </div>
                    <CardContent className="p-8 sm:p-10 flex-1">
                        {readyToAssign.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
                                <div className="h-24 w-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center border border-dashed border-slate-200 opacity-60">
                                    <CheckCircle2 className="h-10 w-10 text-slate-300" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900 tracking-tight">Antrean Terpenuhi</p>
                                    <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">Database dalam keadaan stabil & sinkron.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {readyToAssign.slice(0, 5).map((item) => (
                                    <div key={item.id} className="group/item p-6 rounded-[2rem] bg-slate-50/50 border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-50 transition-all duration-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5 flex-1 min-w-0">
                                            <Avatar className="h-14 w-14 border-2 border-white shadow-sm ring-4 ring-slate-100 flex-shrink-0 group-hover/item:ring-indigo-50 transition-all">
                                                <AvatarFallback className="bg-gradient-to-br from-slate-800 to-black text-white font-black text-sm">
                                                    {item.nama_mahasiswa?.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="font-black text-slate-900 truncate text-base leading-none uppercase group-hover/item:text-indigo-600 transition-colors">{item.nama_mahasiswa}</p>
                                                    <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] px-2 py-0.5 rounded-lg uppercase tracking-widest shadow-sm">NEW STATUS</Badge>
                                                </div>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">{item.nim}</p>
                                                <p className="text-xs italic text-slate-500 truncate mt-2 opacity-80 font-medium tracking-tight group-hover/item:opacity-100 transition-opacity">
                                                    &quot;{item.judul}&quot;
                                                </p>
                                            </div>
                                        </div>
                                        <Link href={`/admin/proposals/${item.id}`} className="shrink-0 w-full sm:w-auto">
                                            <Button size="lg" className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-xl text-[10px] px-8 h-12 shadow-xl active:scale-95 transition-all uppercase tracking-widest">
                                                TETAPKAN
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* System Summary Sidebar - Dark Premium */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="rounded-[3rem] border-none shadow-2xl shadow-slate-900/10 bg-slate-900 text-white p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                        <CardHeader className="p-0 mb-10">
                            <div className="h-1 w-10 bg-indigo-500 rounded-full mb-6" />
                            <CardTitle className="text-2xl font-black tracking-tight">Status Real-time</CardTitle>
                            <CardDescription className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-1">Registry Monitor</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 space-y-5">
                            {[
                                { label: "Menunggu Dosen", count: submitted.length, color: "bg-amber-500", glow: "shadow-amber-500/50" },
                                { label: "Siap SK Prodi", count: readyToAssign.length, color: "bg-emerald-500", glow: "shadow-emerald-500/50" },
                                { label: "Bimbingan Aktif", count: assigned.length, color: "bg-indigo-500", glow: "shadow-indigo-500/50" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.3)]", item.color, item.glow)} />
                                        <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <span className="font-black text-3xl tracking-tighter">{item.count}</span>
                                </div>
                            ))}
                            <Link href="/admin/proposals" className="block pt-6">
                                <Button className="w-full bg-white text-slate-900 hover:bg-indigo-50 h-14 rounded-2xl font-black text-[10px] gap-3 uppercase tracking-widest shadow-2xl">
                                    DATABASE MANAGEMENT <FileText className="h-4 w-4" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-100/50 bg-white p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Clock className="h-16 w-16" />
                        </div>
                        <div className="space-y-6 text-center py-4 relative z-10">
                            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-2 border border-indigo-100 shadow-sm">
                                <Clock className="h-7 w-7 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Centralized Sync Time</h4>
                                <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                    {format(new Date(), "EEEE, dd MMMM yyyy", { locale: idLocale })}
                                </p>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 leading-relaxed italic opacity-80 px-4">
                                Infrastruktur data disinkronkan secara otomatis melalui protokol secure websocket server.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
