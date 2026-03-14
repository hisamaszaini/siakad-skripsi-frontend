"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, AlertCircle, Save, Loader2, Calendar, UserPlus, MapPin, Clock, FileText, ExternalLink, Users } from "lucide-react";
import { useSemproByIdQuery, useScheduleSemproMutation } from "@/features/sempro";
import { useProposalByIdQuery, useSearchLecturersMutation } from "@/features/proposal";
import { Badge } from "@/components/ui/badge";
import { SingleSelect } from "@/components/ui/single-select";
import { Lecturer } from "@/types";
import { PageTitle } from "@/components/ui/page-title";

export default function AdminSemproDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    
    const { data: sempro, isLoading: loadingSempro } = useSemproByIdQuery(id);
    const { mutateAsync: schedule, isPending: submitting } = useScheduleSemproMutation();

    const [form, setForm] = useState({
        tanggal: "",
        jam: "",
        ruang: "",
        penguji_ketua: "",
        penguji_1: "",
        penguji_2: ""
    });

    const { data: proposal } = useProposalByIdQuery(sempro?.skripsi_id || null);
    const { mutateAsync: searchLecturers } = useSearchLecturersMutation();

    const mainSupervisor = proposal?.supervisors?.find((s) => s.role === 'MAIN');
    const coSupervisor = proposal?.supervisors?.find((s) => s.role === 'CO');

    const [initialized, setInitialized] = useState(false);
    if (sempro && !initialized) {
        setForm({
            tanggal: sempro.tanggal ? sempro.tanggal.slice(0, 10) : "",
            jam: sempro.jam || "",
            ruang: sempro.ruang || "",
            penguji_ketua: sempro.penguji_ketua || "",
            penguji_1: sempro.penguji_1 || "",
            penguji_2: sempro.penguji_2 || ""
        });
        setInitialized(true);
    }

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await schedule({
                id: id,
                data: form
            });
            router.push("/admin/sempro");
        } catch (_err) {
            // Error handled by mutation toast
        }
    };

    if (loadingSempro) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Memuat Data Pendaftaran...</p>
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
                    <p className="text-slate-500 font-medium">Data pendaftaran tidak tersedia atau sudah dihapus.</p>
                </div>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl px-8 font-bold">Kembali</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <PageTitle title="Detail Seminar Proposal" />
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold uppercase text-[10px] tracking-widest">
                <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar
            </Button>

            <div className="grid lg:grid-cols-3 gap-8 pb-12">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 sm:p-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Student Profile</span>
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight uppercase text-slate-900">Profil Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 sm:p-10 space-y-10">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                                <div className="h-32 w-32 rounded-[2.5rem] bg-indigo-950 flex items-center justify-center text-white shadow-2xl overflow-hidden shrink-0 border-4 border-white">
                                    <span className="font-black text-5xl">{sempro.nama_mahasiswa?.charAt(0)}</span>
                                </div>
                                <div className="space-y-2 text-center sm:text-left">
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">{sempro.nama_mahasiswa}</h2>
                                    <p className="text-indigo-600 font-black text-lg tracking-[0.2em] uppercase">{sempro.nim}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-black px-4 py-2 rounded-xl border-none">
                                            Status: {sempro.status}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 font-black px-4 py-2 rounded-xl border-none">
                                            SEMINAR PROPOSAL
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-1 w-4 bg-indigo-600 rounded-full" />
                                    <Label className="uppercase text-[10px] tracking-[0.2em] font-black text-slate-400">Judul Proposal</Label>
                                </div>
                                <p className="text-xl font-black text-slate-800 leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-1">{sempro.judul}</p>
                            </div>

                            <div className="grid sm:grid-cols-1 gap-4 pt-6 border-t border-slate-50">
                                <Label className="uppercase text-[10px] tracking-widest font-black text-slate-400 mb-2 block">Dokumen Pendaftaran</Label>
                                {sempro.file_path ? (
                                    <a 
                                        href={sempro.file_path} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="h-20 flex items-center px-6 font-black gap-4 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-slate-900 hover:text-white transition-all shadow-sm group w-full md:w-fit"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 group-hover:text-slate-500 font-black">Berkas Proposal</p>
                                            <p className="text-sm">Dokumen Lengkap</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 opacity-20 ml-auto group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ) : (
                                    <div className="h-20 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-400 font-black text-xs uppercase italic tracking-widest">
                                        Dokumen belum tersedia
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <form onSubmit={handleSchedule}>
                        <Card className="border-none shadow-[0_20px_50px_rgba(30,41,59,0.15)] bg-white border-t-8 border-indigo-600 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 sm:p-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Seminar Setup</span>
                                </div>
                                <CardTitle className="font-black text-xl uppercase text-slate-900 tracking-tight">Penetapan Jadwal</CardTitle>
                                <CardDescription className="font-bold text-slate-500">Tentukan tim penguji dan jadwal pelaksanaan.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 sm:px-10 space-y-8 pb-4">
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1">Tanggal Ujian</Label>
                                    <Input 
                                        type="date" 
                                        className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-black px-6 focus-visible:ring-indigo-600/20 text-slate-900" 
                                        required 
                                        value={form.tanggal}
                                        onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1">Jam Mulai</Label>
                                        <Input 
                                            type="time" 
                                            className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-black px-6 focus-visible:ring-indigo-600/20 text-slate-900" 
                                            required 
                                            value={form.jam}
                                            onChange={(e) => setForm({ ...form, jam: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1">Ruangan</Label>
                                        <Input 
                                            placeholder="Lab Komputer" 
                                            className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-black px-6 focus-visible:ring-indigo-600/20 text-slate-900" 
                                            required 
                                            value={form.ruang}
                                            onChange={(e) => setForm({ ...form, ruang: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t border-slate-100">
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1 flex items-center gap-2">
                                            <Users className="h-3 w-3" /> Ketua Penguji (Default: Pembimbing Utama)
                                        </Label>
                                        <SingleSelect
                                            value={form.penguji_ketua}
                                            onChange={(val) => setForm({ ...form, penguji_ketua: val })}
                                            placeholder={mainSupervisor ? `Default: ${mainSupervisor.nama_dosen || mainSupervisor.nama}` : "Pilih Ketua Penguji..."}
                                            className="rounded-2xl h-14 bg-slate-50 border-slate-100 font-bold"
                                            options={sempro.penguji_ketua && sempro.nama_penguji_ketua ? [{
                                                label: sempro.nama_penguji_ketua,
                                                value: sempro.penguji_ketua,
                                                description: sempro.penguji_ketua
                                            }] : []}
                                            onSearch={async (q) => {
                                                const res = await searchLecturers(q);
                                                return (res || []).map((d: Lecturer) => ({
                                                    label: d.nama,
                                                    value: d.nik,
                                                    description: d.nik
                                                }));
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1 flex items-center gap-2">
                                            <Users className="h-3 w-3" /> Anggota Penguji 1 (Default: Pembimbing Pendamping)
                                        </Label>
                                        <SingleSelect
                                            value={form.penguji_1}
                                            onChange={(val) => setForm({ ...form, penguji_1: val })}
                                            placeholder={coSupervisor ? `Default: ${coSupervisor.nama_dosen || coSupervisor.nama}` : "Pilih Anggota Penguji 1..."}
                                            className="rounded-2xl h-14 bg-slate-50 border-slate-100 font-bold"
                                            options={sempro.penguji_1 && sempro.nama_penguji_1 ? [{
                                                label: sempro.nama_penguji_1,
                                                value: sempro.penguji_1,
                                                description: sempro.penguji_1
                                            }] : []}
                                            onSearch={async (q) => {
                                                const res = await searchLecturers(q);
                                                return (res || []).map((d: Lecturer) => ({
                                                    label: d.nama,
                                                    value: d.nik,
                                                    description: d.nik
                                                }));
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1 flex items-center gap-2">
                                            <UserPlus className="h-3 w-3" /> Anggota Penguji 2 (Dosen Pembahas)
                                        </Label>
                                        <SingleSelect
                                            value={form.penguji_2}
                                            onChange={(val) => setForm({ ...form, penguji_2: val })}
                                            placeholder="Pilih Dosen Pembahas..."
                                            className="rounded-2xl h-14 bg-slate-50 border-slate-100 font-bold"
                                            options={sempro.penguji_2 && sempro.nama_penguji_2 ? [{
                                                label: sempro.nama_penguji_2,
                                                value: sempro.penguji_2,
                                                description: sempro.penguji_2
                                            }] : []}
                                            onSearch={async (q) => {
                                                const res = await searchLecturers(q);
                                                return (res || []).map((d: Lecturer) => ({
                                                    label: d.nama,
                                                    value: d.nik,
                                                    description: d.nik
                                                }));
                                            }}
                                        />
                                        <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">Dosen penguji luar tim pembimbing</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 sm:p-10 pt-4">
                                <Button 
                                    type="submit" 
                                    className="w-full h-16 rounded-[1.5rem] bg-indigo-600 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all gap-3" 
                                    disabled={submitting || ['PASSED', 'REVISE', 'FAILED'].includes(sempro.status)}
                                >
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    {['PASSED', 'REVISE', 'FAILED'].includes(sempro.status) ? "Sudah Dinilai" : "Konfirmasi Jadwal"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
}
