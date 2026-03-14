"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Eye, CheckCircle2, Clock, XCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { useProposalsForSupervisorQuery } from "@/features/proposal";
import { Proposal } from "@/types";
import { useDebounce } from "@/hooks/use-debounce";
import { PageTitle } from "@/components/ui/page-title";

const statusBadge = (status: string) => {
    const base = "rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest shadow-none border-none animate-in fade-in zoom-in duration-300";
    switch (status) {
        case "SUBMITTED":
            return <Badge className={cn(base, "bg-amber-100 text-amber-700")}><Clock className="h-3 w-3 mr-2" />Menunggu</Badge>;
        case "APPROVED":
            return <Badge className={cn(base, "bg-emerald-100 text-emerald-700")}><CheckCircle2 className="h-3 w-3 mr-2" />Disetujui</Badge>;
        case "REJECTED":
            return <Badge className={cn(base, "bg-red-100 text-red-700")}><XCircle className="h-3 w-3 mr-2" />Ditolak</Badge>;
        case "REVISION":
            return <Badge className={cn(base, "bg-orange-100 text-orange-700")}><AlertCircle className="h-3 w-3 mr-2" />Revisi</Badge>;
        default:
            return <Badge variant="outline" className="rounded-xl font-bold uppercase text-[9px]">{status}</Badge>;
    }
};

export default function LecturerProposalsPage() {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState<{ field: string, order: 'asc' | 'desc' }>({ field: 'created_at', order: 'desc' });

    const { data, isLoading } = useProposalsForSupervisorQuery({
        q: debouncedSearch,
        status: filterStatus === "ALL" ? undefined : filterStatus,
        page,
        limit: 10,
        sortField: sort.field,
        sortOrder: sort.order
    });

    const proposals = data?.data || [];
    const total = data?.total || 0;

    const totalPages = Math.ceil(total / 10);

    const handleSort = (field: string) => {
        setSort(prev => ({
            field,
            order: prev.field === field && prev.order === 'desc' ? 'asc' : 'desc'
        }));
    };

    if (isLoading && page === 1 && !debouncedSearch) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <PageTitle title="Verifikasi Usulan" />
            {/* Minimalist Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Lecturer Action</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Verifikasi <span className="text-indigo-600">Usulan</span>
                    </h1>
                </div>

                <div className="relative w-full max-w-md group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <Input
                        placeholder="Cari mahasiswa, NIM, atau judul..."
                        className="pl-11 h-12 border-none bg-white shadow-sm rounded-2xl focus-visible:ring-2 focus-visible:ring-indigo-600/20 transition-all font-medium"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 flex-wrap bg-slate-100/50 p-2 rounded-2xl w-fit">
                {[
                    { key: "ALL", label: "Semua" },
                    { key: "SUBMITTED", label: "Menunggu" },
                    { key: "REVISION", label: "Revisi" },
                    { key: "APPROVED", label: "Disetujui" },
                    { key: "REJECTED", label: "Ditolak" },
                ].map(({ key, label }) => (
                    <Button
                        key={key}
                        variant={filterStatus === key ? "default" : "ghost"}
                        size="sm"
                        onClick={() => { setFilterStatus(key); setPage(1); }}
                        className={`rounded-xl font-bold text-xs transition-all ${filterStatus === key ? "shadow-md bg-indigo-600" : "text-slate-600 hover:bg-white"}`}
                    >
                        {label}
                    </Button>
                ))}
            </div>

            <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                                <TableRow className="hover:bg-transparent border-none">
                                    <TableHead className="w-[140px] font-black uppercase text-[10px] tracking-widest pl-10 py-6 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nim')}>
                                        <div className="flex items-center gap-1.5">Identitas <ArrowUpDown className="h-3 w-3" /></div>
                                    </TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('mahasiswa')}>
                                        <div className="flex items-center gap-1.5">Mahasiswa <ArrowUpDown className="h-3 w-3" /></div>
                                    </TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('judul')}>
                                        <div className="flex items-center gap-1.5">Detail Usulan <ArrowUpDown className="h-3 w-3" /></div>
                                    </TableHead>
                                    <TableHead className="font-black uppercase text-[10px] tracking-widest py-6 text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('status')}>
                                        <div className="flex items-center gap-1.5">Status <ArrowUpDown className="h-3 w-3" /></div>
                                    </TableHead>
                                    <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-10 py-6 text-slate-400">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                                <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Memuat Usulan...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : proposals.length > 0 ? proposals.map((item: Proposal) => (
                                    <TableRow key={item.id} className="group hover:bg-indigo-50/30 transition-all border-b border-slate-50 last:border-none">
                                        <TableCell className="pl-10 py-6">
                                            <div className="font-mono text-[11px] font-bold text-slate-400 mb-1">{item.nim}</div>
                                            <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">
                                                {format(new Date(item.created_at), "dd MMM yyyy", { locale: id })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.nama_mahasiswa}</div>
                                        </TableCell>
                                        <TableCell className="py-6">
                                            <p className="max-w-xs text-sm font-medium text-slate-500 italic line-clamp-2 leading-relaxed">
                                                {item.judul}
                                            </p>
                                        </TableCell>
                                        <TableCell className="py-6">{statusBadge(item.status)}</TableCell>
                                        <TableCell className="text-right pr-10 py-6">
                                            <Link href={`/lecturer/proposals/${item.id}`}>
                                                <Button size="sm" className="font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white transition-all shadow-none">
                                                    {item.status === "SUBMITTED" ? "Tinjau" : "Detail"}
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-200">
                                                    <Eye className="h-8 w-8" />
                                                </div>
                                                <p className="text-slate-400 font-bold italic">
                                                    {search ? "Hasil tidak ditemukan." : "Belum ada usulan masuk."}
                                                </p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-6 px-10 rounded-[2rem] shadow-xl shadow-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Halaman <span className="text-indigo-600">{page}</span> dari {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 rounded-xl font-bold gap-2 text-slate-600 border-slate-100 hover:bg-slate-50"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" /> Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-10 rounded-xl font-bold gap-2 text-slate-600 border-slate-100 hover:bg-slate-50"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                        >
                            Next <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
