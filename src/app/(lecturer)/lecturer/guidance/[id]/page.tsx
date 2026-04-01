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
import { useGuidanceLogs, guidanceService, GuidanceLog } from "@/features/guidance";
import { PageTitle } from "@/components/ui/page-title";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog";

export default function LecturerGuidanceDetailPage() {
    const router = useRouter();
    const params = useParams();
    const thesisId = params.id as string;

    const { proposal, logs, isLoading, mutate } = useGuidanceLogs(thesisId);
    const [loading, setLoading] = useState<string | null>(null);

    const handleVerifySync = async (logId: string, customFeedback?: string) => {
        setLoading(logId);
        try {
            await guidanceService.verifyGuidanceLog(logId, {
                status: 'VERIFIED',
                catatan: customFeedback || undefined
            });
            mutate();
            toast.success("Log bimbingan berhasil diverifikasi.");
        } catch {
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
                            <div className="h-1 w-6 bg-blue-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Arsip Bimbingan</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                            {proposal?.judul || 'Log Aktivitas Mahasiswa'}
                        </h1>
                        <p className="text-slate-500 italic text-sm">Tinjau dan berikan feedback pada progres bimbingan mahasiswa.</p>
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
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <Label className="uppercase text-[8px] tracking-[0.2em] font-black text-blue-500">Materi Pembahasan</Label>
                                            <p className="text-slate-900 leading-tight font-black italic">{log.materi}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="uppercase text-[8px] tracking-[0.2em] font-black text-blue-500">Saran / Progres Mahasiswa</Label>
                                            <p className="text-slate-600 leading-relaxed font-medium text-sm">{log.saran}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400">Feedback & Arahan</Label>
                                        {log.status === 'VERIFIED' ? (
                                            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 italic text-blue-900 font-medium text-sm">
                                                {log.catatan || "Tidak ada catatan tambahan."}
                                            </div>
                                        ) : (
                                            <VerifyFeedbackModal
                                                log={log}
                                                isLoading={loading === log.id}
                                                onVerify={(feedback) => handleVerifySync(log.id, feedback)}
                                            />
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
                    <Card className="border-none shadow-sm bg-white overflow-hidden rounded-[2rem]">
                        <CardHeader className="bg-slate-900 text-white py-8">
                            <CardTitle className="text-lg">Progres Bimbingan</CardTitle>
                            <CardDescription className="text-slate-400">Total bimbingan tervalidasi</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8 text-center space-y-6">
                             <div className="relative inline-flex items-center justify-center">
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle className="text-slate-100" strokeWidth="8" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                                    <circle className="text-blue-600" strokeWidth="8" strokeDasharray={56 * 2 * Math.PI} strokeDashoffset={56 * 2 * Math.PI * (1 - verifiedCount / 12)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="56" cx="64" cy="64" />
                                </svg>
                                <span className="absolute text-3xl font-black text-slate-900">{verifiedCount}<span className="text-slate-300 text-lg">/12</span></span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium px-4">
                                {verifiedCount < 12 ? (
                                    <>Tersisa <span className="text-blue-600 font-bold">{12 - verifiedCount} kali</span> lagi untuk memenuhi syarat pendaftaran Sidang Skripsi.</>
                                ) : (
                                    <span className="text-blue-600 font-bold">Syarat bimbingan minimal sudah terpenuhi!</span>
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

function VerifyFeedbackModal({ log, onVerify, isLoading }: { log: GuidanceLog, onVerify: (feedback: string) => void, isLoading: boolean }) {
    const [feedback, setFeedback] = useState("");
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                <Button className="h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-100 transition-all active:scale-95 px-6">
                    <CheckCircle2 className="h-4 w-4" />
                    Verifikasi Progres
                </Button>
            } />
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white">
                <DialogHeader className="p-8 pb-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-6 bg-blue-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifikasi Log</span>
                    </div>
                    <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Evaluasi Progres</DialogTitle>
                    <DialogDescription className="text-sm font-medium text-slate-500 mt-2">
                        Berikan feedback atau catatan tambahan pada kegiatan bimbingan ini.
                    </DialogDescription>
                </DialogHeader>

                <div className="mx-8 border-b border-slate-100/80" />

                <div className="p-8 space-y-6">
                    <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-blue-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">Ringkasan Log</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-black text-slate-900 leading-tight italic line-clamp-1">{log.materi}</p>
                            <p className="text-[11px] font-medium text-slate-500 line-clamp-2">{log.saran}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Feedback Anda</Label>
                        <Textarea
                            placeholder="Contoh: Lanjutkan ke bab berikutnya, revisi bagian metodologi..."
                            className="min-h-[120px] rounded-2xl border border-slate-200 p-4 font-medium focus:border-blue-500 focus:ring-blue-500/20 transition-all leading-relaxed"
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Button
                            onClick={() => {
                                onVerify(feedback);
                                setOpen(false);
                            }}
                            disabled={isLoading}
                            className="h-16 rounded-2xl bg-blue-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 transition-all active:scale-95"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                            Simpan & Verifikasi
                        </Button>
                        <Button variant="ghost" onClick={() => setOpen(false)} className="h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50">Tutup</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
