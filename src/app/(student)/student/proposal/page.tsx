"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ProposalSchema, ProposalFormData } from "@/schemas";
import { useThemesQuery, useMyThesisQuery, useSubmitProposalMutation } from "@/features/proposal";
import { proposalService } from "@/features/proposal/services/proposal.service";
import { Button } from "@/components/ui/button";
import { SingleSelect } from "@/components/ui/single-select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Clock, Loader2, XCircle, GraduationCap, ArrowLeft, Info, LucideIcon } from "lucide-react";
import { Lecturer, Supervisor, Theme, Proposal } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert } from "@/components/ui/alert";
import { toast } from "sonner";
import { PageTitle } from "@/components/ui/page-title";


const STATUS_CONFIG: Record<string, { label: string; icon: LucideIcon; variant: "default" | "destructive" | "outline" | "secondary" | null | undefined }> = {
    SUBMITTED: { label: "Menunggu Verifikasi Pembimbing", icon: Clock, variant: "secondary" },
    APPROVED: { label: "Disetujui Calon Pembimbing", icon: CheckCircle2, variant: "default" },
    PLOTTED: { label: "Pembimbing Ditetapkan", icon: CheckCircle2, variant: "default" },
    REJECTED: { label: "Ditolak", icon: XCircle, variant: "destructive" },
    REVISION: { label: "Perlu Revisi", icon: AlertCircle, variant: "secondary" },
};

export default function ProposalPage() {
    const router = useRouter();
    const { data: thesis, isLoading: loadingThesis } = useMyThesisQuery();
    const { data: themesData, isLoading: loadingThemes } = useThemesQuery();
    const themes = themesData || [];
    const { mutateAsync: submitProposal, isPending: loading } = useSubmitProposalMutation();

    const form = useForm<ProposalFormData>({
        resolver: zodResolver(ProposalSchema),
        defaultValues: {
            judul: "",
            tema: "",
            customTema: "",
            sks_total: 0,
            pembimbing_usulan_id: "",
        },
    });

    async function onSubmit(values: ProposalFormData) {
        try {
            const tema = values.tema === "Lainnya" ? values.customTema : values.tema;

            if (!tema) {
                toast.error("Tema/topik penelitian wajib diisi.");
                return;
            }

            await submitProposal({
                judul: values.judul,
                tema: tema,
                sks_total: values.sks_total,
                pembimbing_usulan_id: values.pembimbing_usulan_id || undefined,
            });
            router.push("/student");
        } catch (error) {
            // Error is handled by mutation toast
        }
    }

    if (loadingThesis) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // If student already has an active proposal, show it instead of the form
    if (thesis?.current) {
        const currentThesis = thesis.current;
        const statusInfo = STATUS_CONFIG[currentThesis.status] || { label: currentThesis.status, icon: Clock, variant: "secondary" };
        const StatusIcon = statusInfo.icon;
        const statusColor = currentThesis.status === "REJECTED" ? "red" : currentThesis.status === "APPROVED" || currentThesis.status === "PLOTTED" ? "emerald" : "indigo";

        return (
            <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageTitle title="Pengajuan Usulan Skripsi" />
                {/* Minimalist Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Proposal Tracking</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                            Status <span className="text-indigo-600">Usulan</span>
                        </h1>
                    </div>
                </div>

                <div className={cn(
                    "p-6 rounded-3xl border-l-[6px] flex gap-5 items-center bg-white shadow-sm transition-all",
                    statusColor === "red" ? "border-l-red-600" : statusColor === "emerald" ? "border-l-emerald-600" : "border-l-indigo-600"
                )}>
                    <div className={cn(
                        "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
                        statusColor === "red" ? "bg-red-50 text-red-600" : statusColor === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
                    )}>
                        <StatusIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Saat Ini</p>
                        <h3 className="text-lg font-black text-slate-900">{statusInfo.label}</h3>
                    </div>
                </div>

                <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 pb-0">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Judul Skripsi</span>
                        <CardTitle className="text-2xl font-black text-slate-900 leading-tight">
                            &quot;{currentThesis.judul}&quot;
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Tema / Topik</span>
                                <p className="text-slate-900 font-bold">{currentThesis.tema || "-"}</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Total SKS</span>
                                <p className="text-slate-900 font-bold">{currentThesis.sks_total} SKS</p>
                            </div>
                        </div>

                        {currentThesis.status === "PLOTTED" && currentThesis.supervisors && currentThesis.supervisors.length > 0 ? (
                            <div className="space-y-4 pt-4 border-t border-slate-50">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 block">Dosen Pembimbing</span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[...(currentThesis.supervisors || [])].sort((a, b) => a.role === "MAIN" ? -1 : 1).map((s: Supervisor, idx: number) => (
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
                        ) : currentThesis.nama_calon_pembimbing?.trim() ? (
                            <div className="pt-4 border-t border-slate-50">
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4 block">Usulan Calon Pembimbing</span>
                                <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
                                    <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 text-amber-600 font-black text-lg">
                                        {currentThesis.nama_calon_pembimbing.trim().charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-slate-900 leading-none mb-1">{currentThesis.nama_calon_pembimbing.trim()}</p>
                                        <p className="text-xs text-slate-400 font-bold tracking-wider">
                                            NIK: {currentThesis.nik_calon_pembimbing} {currentThesis.nidn_calon_pembimbing && ` • NIDN: ${currentThesis.nidn_calon_pembimbing}`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {currentThesis.catatan && (
                            <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="h-4 w-4 text-orange-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Catatan Proses</span>
                                </div>
                                <p className="text-sm font-medium text-orange-950/80 leading-relaxed whitespace-pre-wrap italic">
                                    &quot;{currentThesis.catatan}&quot;
                                </p>
                            </div>
                        )}

                        <div className="pt-6 flex justify-end">
                            <Button
                                onClick={() => router.push("/student")}
                                variant="ghost"
                                className="font-bold text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                Kembali ke Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-4">
                    <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-bold text-amber-800 text-sm">Tidak bisa mengajukan ulang?</p>
                        <p className="text-amber-700 text-sm mt-1">
                            Selama proposal masih dalam proses (status bukan DITOLAK), kamu tidak bisa mengajukan proposal baru.
                            Hubungi admin program studi jika ada kebutuhan mendesak.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Pengajuan Usulan Skripsi" />
            {/* Minimalist Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Step 01: Initiation</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Pengajuan <span className="text-indigo-600">Proposal</span>
                    </h1>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl h-12 px-6"
                >
                    <ArrowLeft className="h-4 w-4" /> Batal
                </Button>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thesis Initiation Form</span>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Data Usulan Skripsi</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500">Pastikan judul dan tema sudah sesuai dengan rencana penelitian Anda.</CardDescription>
                </CardHeader>
                <CardContent className="p-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                            <FormField
                                control={form.control}
                                name="judul"
                                render={({ field }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Judul Skripsi <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tuliskan judul lengkap skripsi Anda di sini..."
                                                {...field}
                                                className="min-h-[120px] rounded-[1.5rem] border-slate-100 bg-slate-50/50 p-6 font-bold text-slate-900 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 transition-all leading-relaxed"
                                            />
                                        </FormControl>
                                        <FormDescription className="text-[10px] font-bold text-slate-400 ml-1">Gunakan Bahasa Indonesia yang formal dan baku.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-6">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pilihan Tema / Topik <span className="text-red-500">*</span></Label>
                                {loadingThemes ? (
                                    <div className="flex items-center gap-3 p-8 border border-slate-50 rounded-[2rem] bg-slate-50/30 animate-pulse">
                                        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                                        <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Sinkronisasi Tema...</span>
                                    </div>
                                ) : (
                                    <FormField
                                        control={form.control}
                                        name="tema"
                                        render={({ field }) => (
                                            <FormItem className="space-y-4">
                                                <FormControl>
                                                    <RadioGroup
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                                    >
                                                        {themes.map((theme: Theme) => (
                                                            <FormItem key={theme.id} className="relative">
                                                                <FormControl>
                                                                    <RadioGroupItem value={theme.name} className="peer sr-only" />
                                                                </FormControl>
                                                                <FormLabel className="flex items-center p-5 rounded-2xl bg-white border border-slate-100 font-bold text-sm cursor-pointer peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-900 transition-all hover:border-indigo-200">
                                                                    {theme.name}
                                                                </FormLabel>
                                                            </FormItem>
                                                        ))}
                                                        <FormItem className="relative">
                                                            <FormControl>
                                                                <RadioGroupItem value="Lainnya" className="peer sr-only" />
                                                            </FormControl>
                                                            <FormLabel className="flex items-center p-5 rounded-2xl bg-white border border-slate-100 font-bold text-sm cursor-pointer peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-900 transition-all hover:border-indigo-200">
                                                                Tema Lainnya
                                                            </FormLabel>
                                                        </FormItem>
                                                    </RadioGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}

                                {form.watch("tema") === "Lainnya" && (
                                    <FormField
                                        control={form.control}
                                        name="customTema"
                                        render={({ field }) => (
                                            <FormItem className="animate-in slide-in-from-top-4 duration-500">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Sebutkan tema spesifik penelitian Anda..."
                                                        maxLength={30}
                                                        {...field}
                                                        className="h-14 rounded-2xl border-indigo-100 bg-indigo-50/10 px-6 font-bold text-indigo-900 focus-visible:ring-indigo-600/20"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <FormField
                                    control={form.control}
                                    name="sks_total"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Total SKS Tempuh <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        {...field}
                                                        className="h-14 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-6 font-black text-slate-900 focus-visible:ring-indigo-600/20"
                                                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                                    />
                                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">SKS</div>
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-[9px] font-bold text-slate-400 ml-1">Minimal 120 SKS untuk mengajukan skripsi.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="pembimbing_usulan_id"
                                    render={({ field }) => (
                                        <FormItem className="space-y-4">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Calon Pembimbing (Opsional)</FormLabel>
                                            <FormControl>
                                                <SingleSelect
                                                    value={String(field.value ?? "")}
                                                    onChange={field.onChange}
                                                    onSearch={async (query) => {
                                                        if (query.length < 2) return [];
                                                        const res = await proposalService.searchLecturers(query);
                                                        return (res.data || []).map((t: Lecturer) => ({
                                                            label: t.nama,
                                                            value: String(t.nik),
                                                            description: t.nidn ? `NIDN: ${t.nidn}` : `NIK: ${t.nik}`
                                                        }));
                                                    }}
                                                    placeholder="Cari Dosen..."
                                                    searchPlaceholder="Ketik Nama atau NIK..."
                                                    className="h-14 rounded-[1.5rem] border-slate-100 bg-slate-50/50"
                                                />
                                            </FormControl>
                                            <FormDescription className="text-[9px] font-bold text-slate-400 ml-1">Dosen yang telah Anda hubungi / sepakati.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex gap-6 text-indigo-900 relative overflow-hidden group">
                                <Info className="h-8 w-8 shrink-0 text-indigo-600" />
                                <div className="space-y-1 relative z-10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-60">Pernyataan Kejujuran</p>
                                    <p className="text-xs font-bold leading-relaxed italic">
                                        Dengan mengklik submit, saya menyatakan bahwa data yang saya masukkan adalah benar and judul yang diajukan bukan merupakan hasil plagiasi.
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-16 rounded-[1.5rem] bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all gap-3"
                                disabled={loading}
                            >
                                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                                <GraduationCap className="h-5 w-5" />
                                Submit Proposal Skripsi
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
