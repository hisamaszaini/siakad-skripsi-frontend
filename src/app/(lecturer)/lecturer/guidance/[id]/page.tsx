"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, CheckCircle2, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import { useGuidanceLogs, guidanceService } from "@/features/guidance";
import { PageTitle } from "@/components/ui/page-title";

export default function LecturerGuidanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const thesisId = params.id as string;

    const { proposal, logs, isLoading, mutate } = useGuidanceLogs(thesisId);
    const [loading, setLoading] = useState<string | null>(null);
    const [feedback, setFeedback] = useState<{ [key: string]: string }>({});

    const handleVerify = async (logId: string) => {
        setLoading(logId);
        try {
            await guidanceService.verifyGuidanceLog(logId, {
                status: 'VERIFIED',
                catatan: feedback[logId] || undefined
            });
            mutate();
            toast.success("Log bimbingan berhasil diverifikasi.");
        } catch (err) {
            toast.error("Gagal memverifikasi log.");
        } finally {
            setLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const verifiedCount = logs.filter(l => l.status === 'VERIFIED').length;

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <PageTitle title="Log Bimbingan Mahasiswa" />
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500 hover:text-slate-900">
                <ChevronLeft className="h-4 w-4" /> Kembali
            </Button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Arsip Bimbingan</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {proposal?.judul || 'Log Aktivitas Mahasiswa'}
                        </h1>
                        <p className="text-slate-500 italic">Tinjau dan berikan feedback pada progres bimbingan mahasiswa.</p>
                    </div>

                    <div className="space-y-6">
                        {logs.length > 0 ? logs.map((log) => (
                            <Card key={log.id} className={cn(
                                "border-none shadow-sm overflow-hidden border-l-4",
                                log.status === 'VERIFIED' ? "border-l-emerald-500" : "border-l-amber-500"
                            )}>
                                <CardHeader className="bg-slate-50/50 pb-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <span className="font-bold text-slate-700 text-sm">{format(new Date(log.tanggal), "dd MMMM yyyy", { locale: idLocale })}</span>
                                        </div>
                                        <Badge variant={log.status === 'VERIFIED' ? 'default' : 'secondary'} className={cn(
                                            "font-black text-[9px] tracking-widest",
                                            log.status === 'VERIFIED' ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                        )}>
                                            {log.status === 'VERIFIED' ? "VERIFIED" : "PENDING REVIEW"}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    <div className="space-y-2">
                                        <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400">Aktivitas Mahasiswa</Label>
                                        <p className="text-slate-700 leading-relaxed font-medium">{log.kegiatan}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400">Feedback & Arahan</Label>
                                        {log.status === 'VERIFIED' ? (
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 italic text-blue-900 font-medium text-sm">
                                                {log.catatan || "Tidak ada catatan tambahan."}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <Textarea
                                                    placeholder="Tuliskan feedback progres di sini..."
                                                    className="min-h-[100px] rounded-xl focus:ring-primary/20 bg-amber-50/20 border-amber-100"
                                                    value={feedback[log.id] || ""}
                                                    onChange={(e) => setFeedback({ ...feedback, [log.id]: e.target.value })}
                                                />
                                                <div className="flex justify-end">
                                                    <Button
                                                        onClick={() => handleVerify(log.id)}
                                                        disabled={loading === log.id}
                                                        className="bg-emerald-600 hover:bg-emerald-700 font-bold gap-2"
                                                    >
                                                        {loading === log.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                        Verifikasi & Simpan Feedback
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )) : (
                            <div className="text-center py-20 text-slate-400 italic bg-slate-50 border-2 border-dashed rounded-3xl">
                                Belum ada log aktivitas dari mahasiswa.
                            </div>
                        )}
                    </div>
                </div>

                <div className="w-full md:w-80 space-y-6 sticky top-24">
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <CardHeader className="bg-indigo-950 text-white py-6">
                            <CardTitle className="text-lg">Progres Bimbingan</CardTitle>
                            <CardDescription className="text-indigo-300">Total bimbingan tervalidasi</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 text-center space-y-6">
                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                                    <circle className="text-indigo-600" strokeWidth="8" strokeDasharray={56 * 2 * Math.PI} strokeDashoffset={56 * 2 * Math.PI * (1 - verifiedCount / 12)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                                </svg>
                                <span className="absolute text-3xl font-black text-slate-900">{verifiedCount}<span className="text-slate-300 text-lg">/12</span></span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium px-4">
                                {verifiedCount < 12 ? (
                                    <>Tersisa <span className="text-indigo-600 font-bold">{12 - verifiedCount} kali</span> lagi untuk memenuhi syarat pendaftaran Sidang Skripsi.</>
                                ) : (
                                    <span className="text-emerald-600 font-bold">Syarat bimbingan minimal sudah terpenuhi!</span>
                                )}
                            </p>
                        </CardContent>
                        <CardFooter className="pb-8">
                            <Button variant="outline" className="w-full border-slate-200 font-bold rounded-xl text-slate-600 uppercase text-[10px] tracking-widest h-12">Detail Akademik</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
