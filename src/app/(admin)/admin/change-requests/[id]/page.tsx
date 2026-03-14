"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, CheckCircle2, XCircle, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/ui/page-title";

export default function AdminChangeRequestDetail({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState("");

    // Mock data
    const request = {
        id: params.id,
        nama: "Sidqi Arifin",
        nim: "20210555",
        type: "TOPIC",
        current: "Implementasi Machine Learning pada Sistem Prediksi...",
        proposed: "Optimasi Algoritma CNN untuk Deteksi Hama Padi",
        reason: "Ketersediaan dataset untuk topik sebelumnya sangat terbatas dan sulit diakses, sehingga saya beralih ke topik deteksi hama yang datanya lebih tersedia di lapangan.",
        date: "2026-03-10"
    };

    const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success(`Permohonan ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}.`);
            router.push("/admin/change-requests");
        } catch (err) {
            toast.error("Gagal memproses permohonan.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <PageTitle title="Detail Perubahan Pembimbing" />
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500 hover:text-slate-900">
                <ChevronLeft className="h-4 w-4" /> Kembali
            </Button>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-1 space-y-6 w-full">
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 flex flex-row justify-between items-center">
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-black text-slate-900">{request.nama}</CardTitle>
                                <CardDescription className="font-mono text-xs">{request.nim} • Diajukan {request.date}</CardDescription>
                            </div>
                            <Badge variant="secondary" className={cn(
                                "font-black text-[10px] tracking-widest px-4 py-1.5",
                                request.type === 'TOPIC' ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                            )}>
                                {request.type === 'TOPIC' ? "PERUBAHAN TOPIK" : "PERUBAHAN PEMBIMBING"}
                            </Badge>
                        </CardHeader>
                        <CardContent className="pt-8 space-y-10">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Judul / Kondisi Saat Ini</Label>
                                    <p className="text-slate-500 line-through italic text-sm leading-relaxed">{request.current}</p>
                                </div>
                                <div className="space-y-4">
                                    <Label className="font-black text-[10px] uppercase tracking-widest text-indigo-400">Usulan Perubahan</Label>
                                    <p className="text-slate-900 border-l-4 border-indigo-500 pl-4 font-bold leading-relaxed">{request.proposed}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="font-black text-[10px] uppercase tracking-widest text-slate-400">Alasan Mahasiswa</Label>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 italic text-slate-600 text-sm leading-relaxed">
                                    &quot;{request.reason}&quot;
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-white overflow-hidden border-t-8 border-indigo-950">
                        <CardHeader>
                            <CardTitle>Evaluasi Prodi</CardTitle>
                            <CardDescription>Berikan keputusan dan catatan untuk permohonan ini.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <Label className="font-black text-xs uppercase tracking-widest text-slate-400">Catatan / Alasan Keputusan</Label>
                                <Textarea
                                    placeholder="Jelaskan alasan persetujuan atau penolakan..."
                                    className="min-h-[120px] rounded-2xl focus:ring-primary/20 bg-slate-50/50"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="bg-slate-50/50 p-8 flex flex-wrap gap-4">
                            <Button
                                onClick={() => handleAction('APPROVED')}
                                disabled={loading}
                                className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 font-bold gap-2 text-lg"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                                Setujui Perubahan
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleAction('REJECTED')}
                                disabled={loading}
                                className="flex-1 h-14 font-bold gap-2 text-lg"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-5 w-5" />}
                                Tolak Permohonan
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="w-full md:w-80 space-y-6 shrink-0">
                    <Card className="border-none shadow-sm bg-indigo-50 border-indigo-100">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase text-indigo-900/50 flex items-center gap-2">
                                <Info className="h-4 w-4" /> Kebijakan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-xs text-indigo-900/70 leading-relaxed font-medium">
                            Perubahan topik/judul biasanya disetujui jika alasan teknis (data, metodologi) kuat. Perubahan pembimbing memerlukan pertimbangan ketersediaan kuota dosen lain.
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

import { cn } from "@/lib/utils";
