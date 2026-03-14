"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, RefreshCcw, Loader2, Info, ArrowLeft, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/ui/page-title";

export default function StudentChangeRequestPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState<string>("TOPIC");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success("Permohonan perubahan berhasil dikirim. Menunggu tinjauan Prodi.");
            router.push("/student");
        } catch (err) {
            toast.error("Gagal mengirim permohonan.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Pengajuan Perubahan Pembimbing" />
            {/* Minimalist Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Services: Change Request</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Pusat <span className="text-indigo-600">Layanan</span>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <form onSubmit={handleSubmit}>
                        <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[3rem] overflow-hidden">
                            <CardHeader className="p-10 pb-6 border-b border-slate-50">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Adjustment Form</span>
                                </div>
                                <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Formulir Perubahan</CardTitle>
                                <CardDescription className="text-sm font-medium text-slate-500">Pilih kategori perubahan dan lengkapi detail pendukung.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-10">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Kategori Perubahan</Label>
                                    <Select value={type} onValueChange={(val) => val && setType(val)} required>
                                        <SelectTrigger className="h-16 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-6 font-bold focus:ring-indigo-600/20 transition-all">
                                            <SelectValue placeholder="Pilih Jenis" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                            <SelectItem value="TOPIC" className="font-bold py-4 rounded-xl cursor-pointer">
                                                PERUBAHAN JUDUL & TOPIK
                                            </SelectItem>
                                            <SelectItem value="SUPERVISOR" className="font-bold py-4 rounded-xl cursor-pointer text-indigo-600">
                                                PERUBAHAN DOSEN PEMBIMBING
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Alasan Pengajuan <span className="text-red-500">*</span></Label>
                                        <Textarea
                                            placeholder="Jelaskan narasinya di sini..."
                                            className="min-h-[160px] rounded-[1.5rem] border-slate-100 bg-slate-50/50 p-6 font-medium focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 transition-all leading-relaxed"
                                            required
                                        />
                                    </div>

                                    {type === 'TOPIC' && (
                                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 ml-1">Usulan Judul / Topik Baru</Label>
                                            <div className="relative">
                                                <Textarea
                                                    placeholder="Tuliskan judul baru..."
                                                    className="min-h-[100px] rounded-[1.5rem] border-indigo-100 bg-indigo-50/10 p-6 font-bold text-indigo-900 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 transition-all"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {type === 'SUPERVISOR' && (
                                        <div className="p-6 rounded-[2rem] bg-red-50 border border-red-100 flex gap-5 text-red-900 animate-in slide-in-from-top-4 duration-500">
                                            <AlertCircle className="h-6 w-6 shrink-0 text-red-500" />
                                            <p className="text-xs font-bold leading-relaxed italic opacity-80">
                                                Perhatian: Mengajukan penggantian pembimbing akan berdampak pada peninjauan ulang seluruh progres bimbingan Anda. Pastikan telah dikonsultasikan dengan Dosen Wali.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 pt-0">
                                <Button
                                    type="submit"
                                    className="w-full h-16 rounded-[1.5rem] bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all gap-3"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCcw className="h-5 w-5" />}
                                    Kirim Permohonan
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-100/50 bg-indigo-950 text-white rounded-[2.5rem] p-8 overflow-hidden relative group">
                        <div className="relative z-10 space-y-6">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-md">
                                <Info className="h-6 w-6 text-indigo-300" />
                            </div>
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300 opacity-80">Ketentuan Layanan</p>
                                <ul className="space-y-4">
                                    <li className="flex gap-3 text-xs font-bold leading-relaxed">
                                        <div className="h-1 w-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                        Maksimal 1 kali pengajuan selama skripsi.
                                    </li>
                                    <li className="flex gap-3 text-xs font-bold leading-relaxed">
                                        <div className="h-1 w-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                        Wajib mencantumkan alasan akademis yang kuat.
                                    </li>
                                    <li className="flex gap-3 text-xs font-bold leading-relaxed">
                                        <div className="h-1 w-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
                                        Melalui verifikasi Kaprodi.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <HelpCircle className="absolute -bottom-6 -right-6 h-32 w-32 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                    </Card>

                    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Butuh Bantuan?</p>
                        <p className="text-xs font-bold text-slate-900 leading-relaxed">
                            Jika Anda mengalami kendala teknis atau butuh informasi lebih lanjut, silakan hubungi bagian Administrasi Akademik.
                        </p>
                        <Button variant="link" className="p-0 h-auto text-indigo-600 font-black text-[10px] uppercase tracking-widest">
                            Hubungi Admin
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
