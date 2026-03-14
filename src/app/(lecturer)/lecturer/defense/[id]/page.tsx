"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/ui/single-select";
import { ChevronLeft, Award, Loader2, FileText, CheckCircle2, XCircle, User, Fingerprint, Calendar, AlertCircle, GraduationCap, ExternalLink, IdCard, Book, ClipboardCheck } from "lucide-react";
import { useDefenseByIdQuery, useEvaluateDefenseMutation } from "@/features/defense";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { PageTitle } from "@/components/ui/page-title";

export default function LecturerDefenseResultPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user } = useAuth();
    const { data: defense, isLoading: loadingDefense } = useDefenseByIdQuery(id);
    const { mutateAsync: evaluate, isPending: submitting } = useEvaluateDefenseMutation();

    const [form, setForm] = useState({
        nilai: "",
        status: "" as "PASSED" | "FAILED" | "REVISE",
        catatan: ""
    });

    const [initialized, setInitialized] = useState(false);
    if (defense && !initialized) {
        setForm({
            nilai: defense.nilai?.toString() || "",
            status: (["PASSED", "FAILED", "REVISE"].includes(defense.status) ? defense.status : "") as "PASSED" | "FAILED" | "REVISE",
            catatan: defense.catatan || ""
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
            router.push("/lecturer/defense");
        } catch (_err) {
            // Error handled by useMutation toast
        }
    };

    if (loadingDefense) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-blue-950" />
                <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Memuat Data Sidang...</p>
            </div>
        );
    }

    if (!defense) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
                <div className="h-20 w-20 rounded-3xl bg-red-50 flex items-center justify-center text-red-500">
                    <AlertCircle className="h-10 w-10" />
                </div>
                <div className="text-center space-y-2">
                    <h3 className="text-xl font-black text-slate-900">Data Tidak Ditemukan</h3>
                    <p className="text-slate-500 font-medium">Data pendaftaran sidang tidak tersedia atau sudah dihapus.</p>
                </div>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl px-8 font-bold">Kembali</Button>
            </div>
        );
    }

    const getRole = () => {
        if (!defense || !user) return "PENGUJI";
        const userNik = user.nik || user.id;
        if (defense.penguji_ketua === userNik) return "KETUA PENGUJI";
        if (defense.penguji_1 === userNik) return "ANGGOTA PENGUJI 1";
        if (defense.penguji_2 === userNik) return "ANGGOTA PENGUJI 2";
        return "TIM PENGUJI";
    };

    const exam = {
        id: id,
        student: defense.nama_mahasiswa || "Mahasiswa",
        nim: defense.nim || "-",
        judul: defense.judul || "Judul belum tersedia",
        date: defense.tanggal ? format(new Date(defense.tanggal), "eeee, dd MMMM yyyy", { locale: idLocale }) : "Jadwal belum ditentukan",
        time: defense.jam ? `${defense.jam} WIB` : "",
        role: getRole(),
        draft_path: defense.draft_path,
        turnitin_path: defense.turnitin_path
    };

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-12">
            <PageTitle title="Berita Acara Sidang" />
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-blue-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Validasi Kelulusan</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Sidang <span className="text-blue-600">Akhir</span>
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
                    <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden pt-0 gap-0 ring-0">
                        <div className="h-40 bg-gradient-to-br from-blue-950 via-slate-900 to-black relative rounded-t-[2.5rem]">
                            <div className="absolute -bottom-12 left-8">
                                <div className="h-24 w-24 rounded-[2rem] bg-white p-2 shadow-xl border-4 border-white">
                                    <div className="w-full h-full rounded-[1.5rem] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-950">
                                        <Award className="h-10 w-10" />
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
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Judul Skripsi</p>
                                            <p className="text-lg font-black text-slate-800 leading-tight mt-0.5">{exam.judul}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Waktu Sidang</p>
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

                                <div className="space-y-3 pt-4">
                                    {exam.draft_path && (
                                        <a
                                            href={exam.draft_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-2xl border border-blue-50 bg-blue-50/30 text-blue-700 hover:bg-slate-900 hover:text-white font-black text-xs transition-all shadow-sm group"
                                        >
                                            <FileText className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                                            <span className="flex-1">Draft Final Skripsi</span>
                                            <ExternalLink className="h-3 w-3 opacity-30 group-hover:opacity-100" />
                                        </a>
                                    )}
                                    {exam.turnitin_path && (
                                        <a
                                            href={exam.turnitin_path}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-50 bg-emerald-50/30 text-emerald-700 hover:bg-slate-900 hover:text-white font-black text-xs transition-all shadow-sm group"
                                        >
                                            <FileText className="h-5 w-5 opacity-70 group-hover:opacity-100" />
                                            <span className="flex-1">Hasil Turnitin</span>
                                            <ExternalLink className="h-3 w-3 opacity-30 group-hover:opacity-100" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Assessment Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSaveResult}>
                        <Card className="border-none shadow-2xl shadow-slate-200/50 bg-white rounded-[2.5rem] overflow-hidden pt-0 gap-0 ring-0">
                            <div className="h-40 bg-gradient-to-br from-blue-950 via-slate-900 to-black relative rounded-t-[2.5rem]">
                                <div className="absolute bottom-10 left-10">
                                    <CardTitle className="text-3xl font-black text-white tracking-tight tracking-[-0.03em]">Evaluasi Akhir</CardTitle>
                                    <p className="text-blue-300 font-bold text-xs uppercase tracking-widest mt-1 opacity-80">Terminal Yudisium Mahasiswa</p>
                                </div>
                            </div>
                            <CardHeader className="p-10 pb-6 border-b border-slate-50 hidden">
                                <CardTitle className="text-3xl font-black text-slate-900 tracking-tight tracking-[-0.03em]">Evaluasi Akhir</CardTitle>
                                <CardDescription className="text-[13px] font-bold text-slate-500 leading-relaxed max-w-lg">
                                    Input nilai akumulasi and hasil sidang untuk yudisium mahasiswa. Data akan diproses secara permanen ke transkrip.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-12">
                                <div className="grid md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Keputusan Hasil Sidang</label>
                                        <SingleSelect
                                            value={form.status}
                                            onChange={(val) => setForm({ ...form, status: val as "PASSED" | "FAILED" | "REVISE" })}
                                            className="h-16 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-8 font-black focus:ring-indigo-600/20 hover:border-indigo-400 hover:bg-white transition-all text-slate-900 shadow-sm shadow-indigo-100/20"
                                            options={[
                                                { label: "LULUS SEPENUHNYA", value: "PASSED", description: "Mahasiswa dinyatakan lulus sidang akhir" },
                                                { label: "LULUS DENGAN REVISI", value: "REVISE", description: "Lulus dengan kewajiban revisi naskah" },
                                                { label: "TIDAK LULUS (GAGAL)", value: "FAILED", description: "Mahasiswa dinyatakan tidak lulus sidang" }
                                            ]}
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nilai Gabungan (0-100)</label>
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                max="100"
                                                placeholder="0.00"
                                                value={form.nilai}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, nilai: e.target.value })}
                                                className="h-16 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-8 font-black text-3xl focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 hover:border-indigo-400 hover:bg-white transition-all text-slate-900 shadow-sm"
                                                required
                                            />
                                            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-400 opacity-30 text-xs">SKOR</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Catatan Berita Acara (Rangkuman & Yudisium)</label>
                                    <Textarea
                                        placeholder="Tuliskan rangkuman hasil sidang, catatan revisi, and pertimbangan kelulusan secara mendalam..."
                                        value={form.catatan}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, catatan: e.target.value })}
                                        className="min-h-[250px] rounded-[2rem] border-slate-100 bg-slate-50/50 p-8 font-bold text-slate-900 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 hover:border-indigo-400 hover:bg-white transition-all leading-relaxed placeholder:font-medium shadow-sm"
                                        required
                                    />
                                </div>

                                <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100/50 flex gap-6 text-indigo-950 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-indigo-100/50 to-transparent pointer-events-none" />
                                    <div className="h-12 w-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                                        <AlertCircle className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 opacity-60">Peringatan Validasi</p>
                                        <p className="text-[13px] font-bold leading-relaxed italic pr-12">
                                            Data yang divalidasi akan langsung masuk ke pangkalan data akademik and tidak dapat diubah kembali tanpa melalui prosedur senat prodi.
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
                                    {submitting ? <Loader2 className="h-6 w-6 animate-spin" /> : <Award className="h-6 w-6" />}
                                    TERBITKAN BERITA ACARA SIDANG
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
}
