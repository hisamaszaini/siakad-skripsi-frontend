"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale/id";
import { Loader2, CheckCircle2, XCircle, FileText, User, Award, GraduationCap, Clock, AlertCircle, Calendar, Edit3, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PageTitle } from "@/components/ui/page-title";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { useLecturerGuidance, GuidanceLogForm, GuidanceVerifyForm } from "@/features/guidance";

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
        logsData,
        isLoading,
        verifyForm,
        editForm,
        verifyLog,
        isVerifying,
        editLog,
        isEditing,
        accSempro,
        isAccSemproPending,
        accSidang,
        isAccSidangPending,
        limit,
        setLimit,
    } = useLecturerGuidance();

    const logs = logsData?.data || [];
    const total = logsData?.total || 0;
    const totalPages = Math.ceil(total / 10);

    const [verifyingLogId, setVerifyingLogId] = useState<string | null>(null);
    const [actionStatus, setActionStatus] = useState<'VERIFIED' | 'REJECTED' | 'EDIT' | null>(null);
    const [confirmAccSemproSkripsiId, setConfirmAccSemproSkripsiId] = useState<string | null>(null);
    const [confirmAccSidangSkripsiId, setConfirmAccSidangSkripsiId] = useState<string | null>(null);

    if (isLoading && !logsData) {
        return (
            <div className="h-[60vh] flex items-center justify-center font-bold tracking-tight text-slate-400 animate-pulse uppercase text-[10px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    Menyelaraskan Log Bimbingan...
                </div>
            </div>
        );
    }

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <PageTitle title="Log Bimbingan Mahasiswa" />

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
            </div>

            <FilterTabs
                tabs={[
                    { key: "ALL", label: "Semua" },
                    { key: "PENDING", label: "Menunggu" },
                    { key: "VERIFIED", label: "Disetujui" },
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
                            placeholder="Cari Mahasiswa, Materi, atau Saran..."
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
                                    <TableHead className="pl-10 h-14 font-black uppercase text-[10px] tracking-widest">Mahasiswa</TableHead>
                                    <TableHead
                                        className="h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
                                        onClick={() => handleSort('tanggal')}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            Waktu
                                            {sortField === "tanggal" ? (
                                                sortOrder === "asc" ? <ArrowUp className="h-3 w-3 inline text-indigo-600 ml-1" /> : <ArrowDown className="h-3 w-3 inline text-indigo-600 ml-1" />
                                            ) : (
                                                <ArrowUpDown className="h-3 w-3 inline text-slate-300 ml-1" />
                                            )}
                                        </div>
                                    </TableHead>
                                    <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400">Materi Pembahasan</TableHead>
                                    <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400">Saran / Catatan</TableHead>
                                    <TableHead className="h-14 font-black uppercase text-[10px] tracking-widest text-slate-400">Status</TableHead>
                                    <TableHead className="h-14 text-right pr-10 font-black uppercase text-[10px] tracking-widest text-slate-400">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.length > 0 ? logs.map((log) => (
                                    <TableRow key={log.id} className="group hover:bg-indigo-50/50 transition-all border-slate-50 border-b last:border-0 hover:border-indigo-100/50">
                                        <TableCell className="pl-10 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-indigo-100">
                                                    <User className="h-5 w-5" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-slate-900 tracking-tight">{log.nama_mahasiswa}</p>
                                                    <p className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.nim}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-8">
                                            <div className="space-y-1">
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
                                        <TableCell className="py-8">
                                            <p className="text-sm font-bold text-slate-700 leading-snug italic line-clamp-2">{log.materi}</p>
                                        </TableCell>
                                        <TableCell className="py-8">
                                            <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">{log.saran}</p>
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
                                                            setVerifyingLogId(log.id);
                                                            editForm.reset({
                                                                tanggal: log.tanggal.substring(0, 16),
                                                                materi: log.materi,
                                                                saran: log.saran,
                                                                dosen_id: log.dosen_id
                                                            });
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
                                                                onClick={() => setConfirmAccSemproSkripsiId(log.skripsi_id)}
                                                                disabled={isAccSemproPending}
                                                            >
                                                                {isAccSemproPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Award className="w-3.5 h-3.5 mr-2" />}
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
                                                                onClick={() => setConfirmAccSidangSkripsiId(log.skripsi_id)}
                                                                disabled={isAccSidangPending}
                                                            >
                                                                {isAccSidangPending ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <GraduationCap className="w-3.5 h-3.5 mr-2" />}
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
                                                        verifyForm.reset({
                                                            status: 'VERIFIED',
                                                            catatan: ''
                                                        });
                                                    }}
                                                >
                                                    Tindak Lanjut
                                                </Button>
                                            </div>

                                            <Dialog open={verifyingLogId === log.id} onOpenChange={(open: boolean) => {
                                                if (!open) {
                                                    setVerifyingLogId(null);
                                                    setActionStatus(null);
                                                }
                                            }}>
                                                <DialogContent showCloseButton={false} className="sm:max-w-[480px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white">
                                                    <div className="py-0">
                                                        {actionStatus === 'EDIT' ? (
                                                            <FormProvider {...editForm}>
                                                                <GuidanceLogForm
                                                                    onSubmit={(data) => editLog({ id: log.id, data }, { onSuccess: () => { setVerifyingLogId(null); setActionStatus(null); } })}
                                                                    isLoading={isEditing}
                                                                    onCancel={() => { setVerifyingLogId(null); setActionStatus(null); }}
                                                                    submitText="Simpan Perubahan"
                                                                    submitColor="indigo"
                                                                    title="Ubah Data Log"
                                                                    description={`Mahasiswa: ${log.nama_mahasiswa}`}
                                                                    icon={<Edit3 className="h-6 w-6" />}
                                                                />
                                                            </FormProvider>
                                                        ) : (
                                                            <FormProvider {...verifyForm}>
                                                                <GuidanceVerifyForm
                                                                    onSubmit={(data) => verifyLog({ id: log.id, data }, { onSuccess: () => { setVerifyingLogId(null); setActionStatus(null); } })}
                                                                    isLoading={isVerifying}
                                                                    onCancel={() => { setVerifyingLogId(null); setActionStatus(null); }}
                                                                    title="Tindak Lanjut Bimbingan"
                                                                    description={`Mahasiswa: ${log.nama_mahasiswa}`}
                                                                    icon={<Award className="h-6 w-6" />}
                                                                />
                                                            </FormProvider>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-72 text-center border-none">
                                            <div className="flex flex-col items-center gap-4 justify-center">
                                                <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center text-slate-200">
                                                    <FileText className="h-10 w-10" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-lg font-black text-slate-900 tracking-tight">Tidak Ada Data</p>
                                                    <p className="text-sm font-medium text-slate-400">Belum ada log bimbingan yang ditemukan.</p>
                                                </div>
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

            <ConfirmDialog
                open={!!confirmAccSemproSkripsiId}
                onOpenChange={(isOpen: boolean) => !isOpen && setConfirmAccSemproSkripsiId(null)}
                title="Konfirmasi Tinjauan Sempro"
                description="Tindakan ini akan memverifikasi bahwa mahasiswa siap untuk mendaftar Seminar Proposal."
                confirmText="ACC SEMPRO"
                cancelText="Batal"
                variant="success"
                onConfirm={() => {
                    if (confirmAccSemproSkripsiId) {
                        accSempro(confirmAccSemproSkripsiId);
                        setConfirmAccSemproSkripsiId(null);
                    }
                }}
            />

            <ConfirmDialog
                open={!!confirmAccSidangSkripsiId}
                onOpenChange={(isOpen: boolean) => !isOpen && setConfirmAccSidangSkripsiId(null)}
                title="Konfirmasi Kesesuaian Skripsi"
                description="Tindakan ini memverifikasi bahwa log bimbingan mencukupi, dan Anda menyetujui mahasiswa mendaftar Sidang."
                confirmText="ACC SIDANG"
                cancelText="Batal"
                variant="success"
                onConfirm={() => {
                    if (confirmAccSidangSkripsiId) {
                        accSidang(confirmAccSidangSkripsiId);
                        setConfirmAccSidangSkripsiId(null);
                    }
                }}
            />
        </div>
    );
}
