"use client";

import { useParams, useRouter } from "next/navigation";
import { useProposalByIdQuery, useProposalVerification } from "@/features/proposal";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ChevronLeft, CheckCircle, XCircle, Edit3, Loader2, Clock, AlertCircle, RefreshCcw, User, Hash, GraduationCap } from "lucide-react";
import { Supervisor } from "@/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { PageTitle } from "@/components/ui/page-title";

const statusBadge = (status: string) => {
    const base = "rounded-xl px-4 py-1.5 font-black text-[10px] uppercase tracking-widest shadow-none border-none animate-in fade-in zoom-in duration-300";
    switch (status) {
        case "SUBMITTED":
            return <Badge className={cn(base, "bg-amber-100 text-amber-700")}><Clock className="h-3 w-3 mr-2" />Menunggu</Badge>;
        case "APPROVED":
            return <Badge className={cn(base, "bg-emerald-100 text-emerald-700")}><CheckCircle className="h-3 w-3 mr-2" />Disetujui</Badge>;
        case "REJECTED":
            return <Badge className={cn(base, "bg-red-100 text-red-700")}><XCircle className="h-3 w-3 mr-2" />Ditolak</Badge>;
        case "REVISION":
            return <Badge className={cn(base, "bg-orange-100 text-orange-700")}><AlertCircle className="h-3 w-3 mr-2" />Perlu Revisi</Badge>;
        default:
            return <Badge variant="outline" className="rounded-xl font-bold uppercase text-[9px]">{status}</Badge>;
    }
};

export default function VerificationDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const { data: proposal, isLoading, error } = useProposalByIdQuery(id);
    const {
        form,
        editingTitle,
        activeAction,
        handleAction,
        startEditing,
        cancelEditing,
        isPending
    } = useProposalVerification(id, proposal);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error || !proposal) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <p className="text-lg font-bold">Usulan tidak ditemukan.</p>
                <Button variant="ghost" onClick={() => router.back()}>Kembali</Button>
            </div>
        );
    }

    const canAct = proposal?.status === "SUBMITTED";

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <PageTitle title="Tinjauan Usulan Skripsi" />
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="h-10 w-10 rounded-xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all shrink-0"
                >
                    <ChevronLeft className="h-4 w-4 text-slate-600" />
                </Button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifikasi Detail</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none">
                        Tinjauan <span className="text-indigo-600">Usulan Skripsi</span>
                    </h1>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main proposal card */}
                <div className="flex-1 space-y-8 w-full">
                    <Form {...form}>
                        <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                            <CardHeader className="p-8 pb-0">
                                <div className="flex justify-between items-start gap-6">
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Judul Skripsi</span>
                                        {editingTitle ? (
                                            <div className="flex gap-2 items-center">
                                                <FormField
                                                    control={form.control}
                                                    name="judul"
                                                    render={({ field }) => (
                                                        <FormItem className="flex-1">
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="text-lg font-black h-auto p-3 border-amber-300 bg-amber-50/30 focus:ring-amber-400/30 w-full rounded-xl"
                                                                    autoFocus
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <Button size="icon" variant="ghost" onClick={cancelEditing} className="shrink-0 text-slate-400 rounded-xl h-12 w-12 hover:bg-slate-100">
                                                    <XCircle className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-start gap-2 group relative">
                                                <CardTitle className="text-xl font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors cursor-pointer pr-8" onClick={() => { if (canAct) startEditing(); }}>
                                                    &quot;{proposal?.judul}&quot;
                                                </CardTitle>
                                                {canAct && (
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={startEditing}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-amber-500 absolute -right-2 top-0"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3 mt-4 text-slate-400">
                                            <div className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-wider">
                                                <Clock className="h-3 w-3" />
                                                Diajukan {proposal ? format(new Date(proposal.created_at), "dd MMMM yyyy", { locale: idLocale }) : "-"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="shrink-0">{statusBadge(proposal?.status || "")}</div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Tema Penelitian</span>
                                        <p className="text-slate-900 font-bold leading-relaxed">{proposal?.tema || "—"}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Total SKS</span>
                                        <p className="text-slate-900 font-bold leading-relaxed">{proposal?.sks_total} SKS</p>
                                    </div>
                                </div>

                                {proposal?.status === "PLOTTED" && proposal.supervisors && proposal.supervisors.length > 0 && (
                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 block">Dosen Pembimbing</span>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {proposal.supervisors.map((s: Supervisor, idx: number) => (
                                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
                                                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                                                        <span className="text-indigo-600 font-black text-xs">
                                                            {s.nama.trim().charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-wide mb-0.5">
                                                            {s.role === "MAIN" ? "Pembimbing 1" : "Pembimbing 2"}
                                                        </p>
                                                        <p className="text-sm font-bold text-slate-900 truncate">{s.nama.trim()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {proposal?.catatan && (
                                    <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <AlertCircle className="h-4 w-4 text-orange-600" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Catatan Proses</span>
                                        </div>
                                        <p className="text-sm font-medium text-orange-950/80 leading-relaxed whitespace-pre-wrap italic">
                                            &quot;{proposal.catatan}&quot;
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Panel */}
                        {canAct && (
                            <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="h-1 w-6 bg-slate-900 rounded-full" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verification Panel</span>
                                    </div>
                                    <CardTitle className="text-xl font-black text-slate-900">Proses Verifikasi</CardTitle>
                                    <CardDescription className="text-sm font-medium text-slate-500">Pilih tindakan untuk memproses usulan mahasiswa ini.</CardDescription>
                                </CardHeader>
                                <CardContent className="p-8 pt-0 space-y-6">
                                    {editingTitle ? (
                                        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100 flex gap-4 items-start border-dashed">
                                            <div className="h-10 w-10 rounded-xl bg-white shadow-sm border border-amber-200 flex items-center justify-center shrink-0">
                                                <Edit3 className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Status Edit Judul</p>
                                                <p className="text-sm font-medium text-amber-800 leading-relaxed">
                                                    Judul sedang diedit. Perubahan akan tersimpan saat Anda melakukan aksi atau klik Simpan Judul.
                                                </p>
                                                <div className="flex gap-3 mt-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        type="button"
                                                        onClick={() => handleAction('EDIT')}
                                                        disabled={isPending || form.watch("judul") === proposal?.judul}
                                                        className="border-amber-200 text-amber-700 bg-white hover:bg-amber-50 font-black text-[10px] uppercase tracking-widest h-9 px-4 rounded-xl shadow-none transition-all"
                                                    >
                                                        {isPending && activeAction === 'EDIT' ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : null}
                                                        Simpan Judul Saja
                                                    </Button>
                                                    <Button variant="ghost" type="button" size="sm" onClick={cancelEditing}
                                                        className="font-black text-[10px] uppercase tracking-widest text-slate-400 h-9 px-4 rounded-xl hover:bg-slate-100 shadow-none transition-all">
                                                        Reset
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Catatan / Alasan <span className="text-red-400 font-normal opacity-50 ml-1">(wajib untuk revisi/tolak)</span></label>
                                        <FormField
                                            control={form.control}
                                            name="catatan"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            {...field}
                                                            placeholder="Tuliskan masukan penting atau alasan jika memerlukan perubahan..."
                                                            className="min-h-[120px] rounded-2xl border-slate-100 bg-slate-50/50 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 p-5 font-medium text-slate-700 transition-all"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </CardContent>

                                {!editingTitle && (
                                    <CardFooter className="flex flex-wrap gap-4 p-8 pt-0">
                                        <Button
                                            type="button"
                                            onClick={() => handleAction('APPROVE')}
                                            disabled={isPending}
                                            className="h-14 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_30px_-10px_rgba(16,185,129,0.4)] transition-all flex-1 min-w-[200px]"
                                        >
                                            {isPending && activeAction === 'APPROVE' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                                            Setujui Usulan
                                        </Button>
                                        <div className="flex gap-3 w-full sm:w-auto flex-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleAction('REVISE')}
                                                disabled={isPending}
                                                className="h-14 px-6 rounded-2xl border-amber-200 text-amber-600 hover:bg-amber-50 font-black text-xs uppercase tracking-widest flex-1 transition-all"
                                            >
                                                {isPending && activeAction === 'REVISE' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
                                                Revisi
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => handleAction('REJECT')}
                                                disabled={isPending}
                                                className="h-14 px-6 rounded-2xl border-red-100 text-red-600 hover:bg-red-50 font-black text-xs uppercase tracking-widest flex-1 transition-all"
                                            >
                                                {isPending && activeAction === 'REJECT' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                                                Tolak
                                            </Button>
                                        </div>
                                    </CardFooter>
                                )}
                            </Card>
                        )}
                    </Form>

                    {!canAct && proposal && (
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-6 w-6 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1">Status Verifikasi</p>
                            <p className="text-slate-600 font-bold italic">Usulan ini sudah diproses dan tidak memerlukan tindakan lanjut.</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-80 space-y-6 shrink-0">
                    <Card className="border-none shadow-xl shadow-indigo-100/50 bg-indigo-600 rounded-[2.5rem] overflow-hidden text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <User className="h-24 w-24" />
                        </div>
                        <CardHeader className="p-8 pb-4 relative z-10">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-200/60 block mb-2">Mahasiswa Pengusul</span>
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                                    <span className="text-xl font-black">{(proposal?.nama_mahasiswa || "M").charAt(0)}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="font-black text-lg leading-tight truncate">{proposal?.nama_mahasiswa || "Mahasiswa"}</p>
                                    <p className="text-xs font-mono text-indigo-200/80 mt-1 uppercase tracking-tighter">{proposal?.nim}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-0 relative z-10">
                            <div className="space-y-4 pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between group cursor-help">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200/60">
                                        <Hash className="h-3 w-3" /> Kontrak SKS
                                    </div>
                                    <span className="text-sm font-black">{proposal?.sks_total} SKS</span>
                                </div>
                                <div className="flex items-center justify-between group cursor-help">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-200/60">
                                        <Clock className="h-3 w-3" /> Tanggal Masuk
                                    </div>
                                    <span className="text-sm font-black text-right">
                                        {proposal ? format(new Date(proposal.created_at), "dd MMM yy", { locale: idLocale }) : "-"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {proposal?.nama_calon_pembimbing && (
                        <Card className="border-none shadow-sm bg-white rounded-3xl p-8 border border-slate-50">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Calon Pembimbing</span>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                                    <GraduationCap className="h-5 w-5 text-slate-400" />
                                </div>
                                <p className="font-black text-slate-700 text-sm leading-tight uppercase tracking-tight">{proposal.nama_calon_pembimbing}</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

