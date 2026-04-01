"use client";

import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, CheckCircle2, Clock, XCircle, AlertCircle, Loader2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { Proposal } from "@/types";
import { PageTitle } from "@/components/ui/page-title";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { useLecturerProposals } from "@/features/proposal";

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
    const {
        search,
        setSearch,
        filterStatus,
        setFilterStatus,
        page,
        setPage,
        sortField,
        sortOrder,
        handleSort,
        proposalsData,
        limit,
        setLimit,
        isLoading
    } = useLecturerProposals();

    const proposals = proposalsData?.data || [];
    const total = proposalsData?.total || 0;
    const totalPages = Math.ceil(total / 10);

    if (isLoading && page === 1 && !search) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (

        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <PageTitle title="Verifikasi Usulan" />

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
            </div>

            <FilterTabs
                tabs={[
                    { key: "ALL", label: "Semua" },
                    { key: "SUBMITTED", label: "Menunggu" },
                    { key: "REVISION", label: "Revisi" },
                    { key: "APPROVED", label: "Disetujui" },
                    { key: "REJECTED", label: "Ditolak" },
                ]}
                activeKey={filterStatus}
                onChange={setFilterStatus}
            />

            <Card className="border-none shadow-sm overflow-hidden rounded-3xl sm:rounded-[2rem]">
                <div className="bg-white border-b border-slate-50 p-6 sm:p-8 flex items-center justify-between gap-4">
                    <div className="relative w-full md:w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <Input
                            placeholder="Cari NIM, Nama, atau Judul..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-12 h-12 border-slate-200 rounded-2xl focus:border-indigo-400 focus:ring-indigo-100 bg-slate-50/30 font-medium w-full"
                        />
                    </div>
                </div>

                <CardContent className="p-0">
                    <div className="overflow-x-auto scrollbar-hide font-medium">
                        <Table>
                            <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                                <TableRow className="border-none hover:bg-transparent text-slate-400">
                                    <TableHead className="w-[50px] pl-10 h-14 font-black uppercase text-[10px] tracking-widest text-center">No</TableHead>
                                    <TableHead className="w-[140px] h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('nim')}>
                                        <div className="flex items-center gap-1.5">
                                            NIM
                                            {sortField === "nim" ? (
                                                sortOrder === "asc" ? <ArrowUp className="h-3 w-3 inline text-indigo-600 ml-1" /> : <ArrowDown className="h-3 w-3 inline text-indigo-600 ml-1" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 inline text-slate-300 ml-1" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('mahasiswa')}>
                                        <div className="flex items-center gap-1.5">
                                            Mahasiswa
                                            {sortField === "mahasiswa" ? (
                                                sortOrder === "asc" ? <ArrowUp className="h-3 w-3 inline text-indigo-600 ml-1" /> : <ArrowDown className="h-3 w-3 inline text-indigo-600 ml-1" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 inline text-slate-300 ml-1" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('judul')}>
                                        <div className="flex items-center gap-1.5">
                                            Detail Usulan
                                            {sortField === "judul" ? (
                                                sortOrder === "asc" ? <ArrowUp className="h-3 w-3 inline text-indigo-600 ml-1" /> : <ArrowDown className="h-3 w-3 inline text-indigo-600 ml-1" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 inline text-slate-300 ml-1" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => handleSort('status')}>
                                        <div className="flex items-center gap-1.5">
                                            Status
                                            {sortField === "status" ? (
                                                sortOrder === "asc" ? <ArrowUp className="h-3 w-3 inline text-indigo-600 ml-1" /> : <ArrowDown className="h-3 w-3 inline text-indigo-600 ml-1" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 inline text-slate-300 ml-1" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 text-right pr-10 font-black uppercase text-[10px] tracking-widest text-slate-400">Tindakan</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                                                <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Memuat Usulan...</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : proposals.length > 0 ? proposals.map((item: Proposal, index: number) => (
                                    <TableRow key={item.id} className="group hover:bg-indigo-50/50 transition-all border-slate-50 border-b last:border-0 hover:border-indigo-100/50">
                                        <TableCell className="pl-10 py-6 text-center font-bold text-slate-400 text-xs shadow-none">
                                            {(page - 1) * limit + index + 1}
                                        </TableCell>
                                        <TableCell className="py-6">
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
                                        <TableCell colSpan={6} className="h-64 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4">
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

            <DataTablePagination
                page={page}
                totalPages={totalPages}
                totalItems={total}
                onPageChange={setPage}
                limit={limit}
                onLimitChange={setLimit}
                isLoading={isLoading}
            />
        </div>
    );
}
