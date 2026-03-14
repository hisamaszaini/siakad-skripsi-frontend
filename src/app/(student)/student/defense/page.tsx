"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar as CalendarIcon, CheckCircle2, Loader2, Award, ArrowLeft, ShieldCheck, Info, Eye, X, FileText, FileCheck, Clock, MapPin, Users, Lock } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PageTitle } from "@/components/ui/page-title";

import { Supervisor } from "@/types";
import { useMyThesisQuery } from "@/features/proposal";
import { useActiveDefenseQuery, useRegisterDefenseMutation } from "@/features/defense";

export default function DefenseRegistrationPage() {
    const router = useRouter();
    const { data: thesisData, isLoading: loadingThesis } = useMyThesisQuery();
    const { data: defense, isLoading: loadingDefense } = useActiveDefenseQuery();
    const thesis = thesisData?.current;
    const { mutateAsync: registerDefense, isPending: loading } = useRegisterDefenseMutation();

    const [draftFile, setDraftFile] = useState<File | null>(null);
    const [draftUrl, setDraftUrl] = useState<string | null>(null);
    const [turnitinFile, setTurnitinFile] = useState<File | null>(null);
    const [turnitinUrl, setTurnitinUrl] = useState<string | null>(null);

    const isAcc = (thesis?.supervisors?.length ?? 0) > 0 && thesis?.supervisors?.every((p: Supervisor) => p.acc_sidang);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'draft' | 'turnitin') => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                toast.error('File harus dalam format PDF');
                return;
            }
            const maxSize = type === 'draft' ? 10 : 5;
            if (selectedFile.size > maxSize * 1024 * 1024) {
                toast.error(`Ukuran file maksimal ${maxSize}MB`);
                return;
            }

            const url = URL.createObjectURL(selectedFile);
            if (type === 'draft') {
                if (draftUrl) URL.revokeObjectURL(draftUrl);
                setDraftFile(selectedFile);
                setDraftUrl(url);
            } else {
                if (turnitinUrl) URL.revokeObjectURL(turnitinUrl);
                setTurnitinFile(selectedFile);
                setTurnitinUrl(url);
            }
        }
    };

    const removeFile = (type: 'draft' | 'turnitin') => {
        if (type === 'draft') {
            if (draftUrl) URL.revokeObjectURL(draftUrl);
            setDraftFile(null);
            setDraftUrl(null);
        } else {
            if (turnitinUrl) URL.revokeObjectURL(turnitinUrl);
            setTurnitinFile(null);
            setTurnitinUrl(null);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!thesis) return;

        try {
            await registerDefense({ skripsi_id: thesis.id });
            router.push("/student");
        } catch (_error) {
            // Error handled by mutation
        }
    };

    if (loadingThesis || loadingDefense) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="font-black text-slate-400 animate-pulse text-[10px] uppercase tracking-widest">Memeriksa Kelayakan Sidang...</p>
                </div>
            </div>
        );
    }

    if (defense) {
        const isScheduled = defense.status === 'SCHEDULED';

        return (
            <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <PageTitle title="Pendaftaran Sidang Skripsi" />
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                        Pendaftaran <span className="text-indigo-600">{isScheduled ? 'Terjadwal' : 'Terkirim'}</span>
                    </h1>
                    <Button variant="ghost" onClick={() => router.push("/student")} className="font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-indigo-600">
                        <ArrowLeft className="h-4 w-4" /> Dashboard
                    </Button>
                </div>

                <div className="grid gap-8">
                    {/* Status Card */}
                    <Card className={cn(
                        "border-none shadow-2xl rounded-[3rem] overflow-hidden transition-all duration-500",
                        isScheduled ? "shadow-indigo-200/50" : "shadow-slate-200/60"
                    )}>
                        <div className="p-10 text-center space-y-8">
                            <div className={cn(
                                "mx-auto h-24 w-24 rounded-[2.5rem] flex items-center justify-center shadow-inner transition-transform duration-700 hover:rotate-12",
                                isScheduled ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                            )}>
                                {isScheduled ? <Award className="h-12 w-12" /> : <CheckCircle2 className="h-12 w-12" />}
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    {isScheduled ? "Sidang Skripsi Terjadwal" : "Pendaftaran Berhasil"}
                                </h2>
                                <p className="text-slate-500 font-medium max-w-lg mx-auto">
                                    {isScheduled
                                        ? "Persiapkan draf final dan presentasi Anda. Waktu dan lokasi pelaksanaan sidang telah ditetapkan sebagai berikut."
                                        : "Data pendaftaran Sidang Skripsi Anda telah diterima dan sedang dalam proses verifikasi berkas."}
                                </p>
                            </div>

                            <div className="flex justify-center gap-3">
                                <Badge className={cn(
                                    "rounded-xl font-black text-[10px] uppercase tracking-[0.2em] px-6 py-2 shadow-sm",
                                    defense.status === 'REGISTERED' ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                                        defense.status === 'SCHEDULED' ? "bg-indigo-600 text-white hover:bg-indigo-600" :
                                            "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                )}>
                                    • {defense.status}
                                </Badge>
                                <Badge variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-[0.2em] px-6 py-2 border-slate-200 text-slate-400">
                                    #SID-{defense.id.split('-')[0].toUpperCase()}
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    {/* Schedule Details */}
                    {(isScheduled || defense.tanggal || defense.ruang) && (
                        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                            <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2rem] p-8 flex flex-col items-center gap-4 text-center group">
                                <div className="h-14 w-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <CalendarIcon className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hari & Tanggal</p>
                                    <p className="font-extrabold text-slate-900">
                                        {defense.tanggal ? new Date(defense.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "-"}
                                    </p>
                                </div>
                            </Card>

                            <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2rem] p-8 flex flex-col items-center gap-4 text-center group">
                                <div className="h-14 w-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Waktu (WIB)</p>
                                    <p className="font-extrabold text-slate-900">{defense.jam || (isScheduled ? "09:00" : "-")}</p>
                                </div>
                            </Card>

                            <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2rem] p-8 flex flex-col items-center gap-4 text-center group">
                                <div className="h-14 w-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lokasi / Ruangan</p>
                                    <p className="font-extrabold text-slate-900 truncate max-w-[180px]">{defense.ruang || "-"}</p>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Examiners List */}
                    {isScheduled && (defense.nama_penguji_ketua || defense.nama_penguji_1 || defense.nama_penguji_2) && (
                        <Card className="border-none shadow-xl shadow-slate-100/50 bg-white rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-top-4 duration-1000 delay-500">
                            <div className="p-8 border-b border-slate-50 flex items-center gap-4">
                                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Dewan Penguji</h3>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tim penguji sidang skripsi</p>
                                </div>
                            </div>
                            <div className="p-8 space-y-4">
                                {defense.nama_penguji_ketua && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">
                                            KETUA
                                        </div>
                                        <p className="font-bold text-slate-700 text-sm">{defense.nama_penguji_ketua}</p>
                                    </div>
                                )}
                                {defense.nama_penguji_1 && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-indigo-400 transition-colors shadow-sm">
                                            ANGGOTA 1
                                        </div>
                                        <p className="font-bold text-slate-700 text-sm">{defense.nama_penguji_1}</p>
                                    </div>
                                )}
                                {defense.nama_penguji_2 && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-indigo-100 hover:bg-indigo-50/30 transition-all">
                                        <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-indigo-400 transition-colors shadow-sm">
                                            ANGGOTA 2
                                        </div>
                                        <p className="font-bold text-slate-700 text-sm">{defense.nama_penguji_2}</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}

                    <div className="flex flex-col items-center gap-6 pt-4">
                        <Button onClick={() => router.push("/student")} className="h-14 px-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1">
                            Kembali ke Dashboard
                        </Button>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center leading-relaxed">
                            Siakad Skripsi • Informatics Engineering<br />
                            Good Luck with your Final Defense!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isAcc) {
        return (
            <div className="w-11/12 mx-auto space-y-10 py-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <PageTitle title="Pendaftaran Sidang Skripsi" />
                <div className="flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <div className="h-1 w-8 bg-indigo-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Final Verification</span>
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                            Sidang <span className="text-indigo-600">Skripsi</span>
                        </h1>
                    </div>
                </div>

                <Card className="min-h-[70vh] flex flex-col items-center justify-center border-none shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3.5rem] overflow-hidden bg-white/80 backdrop-blur-xl border border-white/40 relative">
                    <div className="absolute top-0 right-0 h-96 w-96 bg-rose-500/5 rounded-full -mr-48 -mt-48 blur-[120px]" />
                    <CardContent className="p-10 sm:p-20 text-center space-y-12 relative z-10 w-full flex flex-col items-center">
                        <div className="space-y-8 flex flex-col items-center w-full">
                            <div className="h-28 w-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-[3rem] flex items-center justify-center text-slate-300 shadow-inner group relative">
                                <Lock className="h-12 w-12 relative z-10 transition-transform duration-700 group-hover:rotate-[-12deg] group-hover:scale-110" />
                                <div className="absolute inset-0 bg-rose-500/10 rounded-[3rem] scale-0 group-hover:scale-100 transition-transform duration-500" />
                            </div>
                            <div className="space-y-4 max-w-2xl px-4">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight italic">
                                    Pendaftaran <span className="text-indigo-600">Terkuci.</span>
                                </h2>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    Anda belum mendapatkan persetujuan (ACC) Sidang dari Dosen Pembimbing. Pastikan log bimbingan telah terpenuhi dan Anda telah lulus Seminar Proposal.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                            <Button
                                onClick={() => router.push("/student/guidance")}
                                className="h-16 w-full sm:w-auto sm:px-14 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                <Users className="mr-2 h-4 w-4" /> Cek Progres Bimbingan
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => router.push("/student")}
                                className="h-16 w-full sm:w-auto sm:px-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all border border-slate-100"
                            >
                                Kembali ke Dashboard
                            </Button>
                        </div>
                    </CardContent>
                    <div className="h-2 bg-gradient-to-r from-rose-400 via-indigo-600 to-emerald-400 w-full absolute bottom-0" />
                </Card>
                <div className="flex justify-between items-center px-4">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Academic Verification System • v1.0.4</p>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">Siakad Skripsi</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Pendaftaran Sidang Skripsi" />
            {/* Minimalist Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Final Step: Thesis Defense</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Sidang <span className="text-indigo-600">Skripsi</span>
                    </h1>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl h-12 px-6"
                >
                    <ArrowLeft className="h-4 w-4" /> Kembali
                </Button>
            </div>

            {/* Verification Stat */}
            <div className="max-w-xl mx-auto">
                <Card className="border-none shadow-xl shadow-indigo-100/50 bg-indigo-950 text-white rounded-[2.5rem] p-8 overflow-hidden relative group">
                    <div className="relative z-10 flex items-center gap-6">
                        <div className="h-16 w-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-md">
                            <ShieldCheck className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-1 opacity-80">Eligibility Status</p>
                            <p className="text-2xl font-black tracking-tight uppercase">Mahasiswa Berhak Sidang</p>
                        </div>
                    </div>
                    <Award className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                </Card>
            </div>

            <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[3rem] overflow-hidden">
                <CardHeader className="p-10 pb-6 border-b border-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Final Submission</span>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Berkas Sidang Akhir</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500">Pastikan seluruh dokumen adalah versi final yang telah divalidasi pembimbing.</CardDescription>
                </CardHeader>
                <CardContent className="p-10 space-y-12">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Draft Skripsi */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Draft Skripsi (PDF)</Label>
                            {!draftFile ? (
                                <div className="group relative border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-600/30 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden text-center">
                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                                        <FileCheck className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900">Pilih Draft Skripsi</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Maks 10MB • Final Draft</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'draft')}
                                    />
                                </div>
                            ) : (
                                <div className="relative border border-slate-100 bg-slate-50/50 rounded-[2rem] p-4 flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white shadow border border-slate-50 flex items-center justify-center text-indigo-600">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate max-w-[120px]">{draftFile.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{(draftFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => window.open(draftUrl!, '_blank')}
                                            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-indigo-600"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeFile('draft')}
                                            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Hasil Turnitin */}
                        <div className="space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Laporan Turnitin (PDF)</Label>
                            {!turnitinFile ? (
                                <div className="group relative border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-indigo-600/30 hover:bg-indigo-50/30 transition-all cursor-pointer overflow-hidden text-center">
                                    <div className="h-14 w-14 rounded-2xl bg-white shadow-lg border border-slate-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500">
                                        <FileCheck className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-slate-900">Pilih Hasil Cek Plagiasi</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Max Similarity 25%</p>
                                    </div>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept=".pdf"
                                        onChange={(e) => handleFileChange(e, 'turnitin')}
                                    />
                                </div>
                            ) : (
                                <div className="relative border border-slate-100 bg-slate-50/50 rounded-[2rem] p-4 flex items-center justify-between gap-4 animate-in zoom-in-95 duration-300">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-white shadow border border-slate-50 flex items-center justify-center text-indigo-600">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <p className="text-sm font-black text-slate-900 truncate max-w-[120px]">{turnitinFile.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{(turnitinFile.size / 1024 / 1024).toFixed(1)} MB</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => window.open(turnitinUrl!, '_blank')}
                                            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-indigo-600"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeFile('turnitin')}
                                            className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-amber-50 border border-amber-100 flex gap-6 text-amber-900 relative overflow-hidden group">
                        <Info className="h-8 w-8 shrink-0 text-amber-600" />
                        <div className="space-y-1 relative z-10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 opacity-60">Peringatan Akhir</p>
                            <p className="text-sm font-bold leading-relaxed italic">
                                Pendaftaran ini bersifat final. Pastikan semua persyaratan akademik lainnya (SKS, Nilai E, Nilai D, dll) sudah terpenuhi sesuai aturan program studi.
                            </p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-10 pt-0">
                    <Button
                        onClick={handleRegister}
                        className="w-full h-16 rounded-[1.5rem] bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all gap-3"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GraduationCap className="h-5 w-5" />}
                        Konfirmasi Pendaftaran Sidang
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
