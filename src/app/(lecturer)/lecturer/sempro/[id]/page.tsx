"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SingleSelect } from "@/components/ui/single-select";
import { ChevronLeft, ClipboardCheck, AlertCircle, Save, Loader2, User, Calendar, BookOpen, Fingerprint, FileText, ExternalLink, Book, IdCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSemproByIdQuery, useEvaluateSemproMutation } from "@/features/sempro";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PageTitle } from "@/components/ui/page-title";

export default function LecturerSemproResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();

    const { data: sempro, isLoading: loadingSempro } = useSemproByIdQuery(id);
    const { mutateAsync: evaluate, isPending: submitting } = useEvaluateSemproMutation();

    const [form, setForm] = useState({
        nilai: "",
        status: "" as "PASSED" | "FAILED" | "REVISE",
        catatan: ""
    });

    const [initialized, setInitialized] = useState(false);
    if (sempro && !initialized) {
        setForm({
            nilai: sempro.nilai?.toString() || "",
            status: (["PASSED", "FAILED", "REVISE"].includes(sempro.status) ? sempro.status : "") as "PASSED" | "FAILED" | "REVISE",
            catatan: sempro.catatan || ""
        });
        setInitialized(true);
    }

    const handleSaveResult = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await evaluate({
                id: id,
                data: {
                    nilai: Number(form.nilai),
                    status: form.status,
                    catatan: form.catatan
                }
            });
            router.push("/lecturer/sempro");
        } catch (_err) {
            // Error handled by mutation toast
        }
    };

    if (loadingSempro) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Memuat Data Seminar...</p>
            </div>
        );
    }

    if (!sempro) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-slate-900">Data Tidak Ditemukan</h3>
                    <p className="text-slate-500 font-medium">Data pendaftaran seminar tidak tersedia atau sudah dihapus.</p>
                </div>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl px-8 font-bold">Kembali</Button>
            </div>
        );
    }

    const getRole = () => {
        if (!sempro || !user) return "PENGUJI";
        const userNik = user.nik || user.id;
        if (sempro.penguji_ketua === userNik) return "KETUA PENGUJI";
        if (sempro.penguji_1 === userNik) return "ANGGOTA PENGUJI 1";
        if (sempro.penguji_2 === userNik) return "ANGGOTA PENGUJI 2";
        return "TIM PENGUJI";
    };

    const exam = {
        id: id,
        student: sempro.nama_mahasiswa || "Mahasiswa",
        nim: sempro.nim || "-",
        judul: sempro.judul || "Judul belum tersedia",
        date: sempro.tanggal ? format(new Date(sempro.tanggal), "eeee, dd MMMM yyyy", { locale: idLocale }) : "Jadwal belum ditentukan",
        time: sempro.jam ? `${sempro.jam} WIB` : "",
        role: getRole(),
        file_path: sempro.file_path
    };

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Berita Acara Seminar" />
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-blue-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Penilaian Ujian</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Berita <span className="text-blue-600">Acara</span>
                    </h1>
                </div>

                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-xl h-12 px-6"
                >
                    <ChevronLeft className="h-4 w-4" /> Kembali
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Student Info */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden pt-0 gap-0 ring-0">
                        <div className="h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative rounded-t-[2.5rem]">
                            <div className="absolute -bottom-12 left-8">
                                <div className="h-24 w-24 rounded-[2rem] bg-white p-2 shadow-xl">
                                    <div className="w-full h-full rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600">
                                        <User className="h-10 w-10" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <CardContent className="pt-16 pb-10 px-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{exam.student}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 mt-1">
                                        <IdCard className="h-3.5 w-3.5" />
                                        <span className="font-mono text-xs font-bold uppercase">{exam.nim}</span>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <Book className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Judul Proposal</p>
                                            <p className="text-lg font-black text-slate-800 leading-tight mt-0.5">{exam.judul}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Waktu Seminar</p>
                                            <p className="text-base font-black text-slate-800 leading-tight mt-0.5">{exam.date}</p>
                                            <p className="text-base font-bold text-blue-600 uppercase tracking-tighter mt-0.5">{exam.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                            <ClipboardCheck className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Peran Anda</p>
                                            <p className="text-base font-bold text-blue-600 uppercase tracking-tighter mt-0.5">{exam.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50">
                                    <a
                                        href={exam.file_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex w-full h-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50/50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold gap-3"
                                    >
                                        <FileText className="h-5 w-5" />
                                        <span>Preview Proposal</span>
                                        <ExternalLink className="h-3 w-3 opacity-50" />
                                    </a>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Assessment Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSaveResult}>
                        <Card className="border-none shadow-xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden pt-0 gap-0 ring-0">
                            <div className="h-40 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative rounded-t-[2.5rem]">
                                <div className="absolute bottom-10 left-10">
                                    <CardTitle className="text-3xl font-black text-white tracking-tight">Lembar Penilaian</CardTitle>
                                    <p className="text-blue-100 font-bold text-xs uppercase tracking-widest mt-1 opacity-80">Silakan masukkan hasil ujian.</p>
                                </div>
                            </div>
                            <CardContent className="p-10 space-y-10">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Keputusan Akhir</label>
                                        <SingleSelect
                                            value={form.status}
                                            onChange={(val) => setForm({ ...form, status: val as "PASSED" | "FAILED" | "REVISE" })}
                                            className="h-16 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-8 font-black focus:ring-indigo-600/20 hover:border-indigo-400 hover:bg-white transition-all text-slate-900 shadow-sm shadow-indigo-100/20"
                                            options={[
                                                { label: "LULUS (DITERIMA)", value: "PASSED", description: "Mahasiswa dinyatakan lulus seminar" },
                                                { label: "LULUS DENGAN REVISI", value: "REVISE", description: "Mahasiswa lulus dengan perbaikan dokumen" },
                                                { label: "TIDAK LULUS (DITOLAK)", value: "FAILED", description: "Mahasiswa harus mendaftar ulang seminar" }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nilai Angka (0-100)</label>
                                        <Input
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="85"
                                            value={form.nilai}
                                            onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                                            className="h-16 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-8 font-extrabold text-lg focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 hover:border-indigo-400 hover:bg-white transition-all"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Catatan Revisi / Masukan</label>
                                    <Textarea
                                        placeholder="Tuliskan poin-poin revisi yang harus diperbaiki oleh mahasiswa..."
                                        value={form.catatan}
                                        onChange={(e) => setForm({ ...form, catatan: e.target.value })}
                                        className="min-h-[220px] rounded-[2rem] border-slate-100 bg-slate-50/50 p-8 font-medium focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 hover:border-indigo-400 hover:bg-white transition-all leading-relaxed"
                                        required
                                    />
                                </div>

                                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex gap-4 text-amber-900">
                                    <AlertCircle className="h-6 w-6 shrink-0 text-amber-500" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 opacity-60">Penting</p>
                                        <p className="text-xs font-bold leading-relaxed italic">
                                            Nilai dan hasil akhir yang Anda masukkan akan menjadi pertimbangan utama dalam kelulusan proposal mahasiswa. Pastikan data sudah benar sebelum menyimpan.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-10 py-auto">
                                <Button
                                    type="submit"
                                    className="w-full h-20 rounded-[2rem] bg-blue-600 hover:bg-blue-800 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-200 transition-all gap-3"
                                    disabled={submitting}
                                >
                                    {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Save className="h-6 w-6" />}
                                    Simpan Berita Acara
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
}
