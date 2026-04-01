"use client";

import { useState, use, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, FileText, UserPlus, Save, ExternalLink, AlertCircle, Users, Loader2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDefenseByIdQuery, useScheduleDefenseMutation } from "@/features/defense";
import { useProposalByIdQuery, useSearchLecturersMutation } from "@/features/proposal";
import { useGuidanceLogs, GuidanceLogList } from "@/features/guidance";
import { SingleSelect } from "@/components/ui/single-select";
import { Lecturer } from "@/types";
import { PageTitle } from "@/components/ui/page-title";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { parseISO, format } from "date-fns";

export default function AdminDefenseDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { data: defense, isLoading: loadingDefense } = useDefenseByIdQuery(id);
    const { mutateAsync: schedule, isPending: submitting } = useScheduleDefenseMutation();

    const [form, setForm] = useState({
        tanggal: "",
        jam: "",
        ruang: "",
        penguji_ketua: "",
        penguji_1: "",
        penguji_2: ""
    });

    const { data: proposal } = useProposalByIdQuery(defense?.skripsi_id || null);
    const { mutateAsync: searchLecturers } = useSearchLecturersMutation();

    const { logs: guidanceLogs, isLoading: loadingGuidance } = useGuidanceLogs(defense?.skripsi_id || undefined);

    const mainSupervisor = proposal?.supervisors?.find((s) => s.role === 'MAIN');
    const coSupervisor = proposal?.supervisors?.find((s) => s.role === 'CO');

    const mainLogs = useMemo(() =>
        guidanceLogs.filter(log => log.dosen_id === mainSupervisor?.dosen_id),
        [guidanceLogs, mainSupervisor]);

    const coLogs = useMemo(() =>
        guidanceLogs.filter(log => log.dosen_id === coSupervisor?.dosen_id),
        [guidanceLogs, coSupervisor]);

    const [initialized, setInitialized] = useState(false);
    if (defense && !initialized) {
        setForm({
            tanggal: defense.tanggal ? (typeof defense.tanggal === 'string' ? defense.tanggal.slice(0, 10) : "") : "",
            jam: defense.jam || "",
            ruang: defense.ruang || "",
            penguji_ketua: defense.penguji_ketua || "",
            penguji_1: defense.penguji_1 || "",
            penguji_2: defense.penguji_2 || ""
        });
        setInitialized(true);
    }

    const handleSearchLecturers = useCallback(async (q: string) => {
        if (q.length > 0 && q.length < 2) return [];
        try {
            const res = await searchLecturers(q);
            return (res || []).map((d: Lecturer) => ({
                label: d.nama,
                value: d.nik,
                description: d.nidn ? `NIDN: ${d.nidn}` : `NIK: ${d.nik}`
            }));
        } catch (err) {
            console.error("Search failed", err);
            return [];
        }
    }, [searchLecturers]);

    const pengujiKetuaOptions = useMemo(() =>
        defense?.penguji_ketua && defense?.nama_penguji_ketua ? [{
            label: defense.nama_penguji_ketua,
            value: defense.penguji_ketua,
            description: `NIK: ${defense.penguji_ketua}`
        }] : []
        , [defense]);

    const penguji1Options = useMemo(() =>
        defense?.penguji_1 && defense?.nama_penguji_1 ? [{
            label: defense.nama_penguji_1,
            value: defense.penguji_1,
            description: `NIK: ${defense.penguji_1}`
        }] : []
        , [defense]);

    const penguji2Options = useMemo(() =>
        defense?.penguji_2 && defense?.nama_penguji_2 ? [{
            label: defense.nama_penguji_2,
            value: defense.penguji_2,
            description: `NIK: ${defense.penguji_2}`
        }] : []
        , [defense]);

    const handleSchedule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                tanggal: `${form.tanggal}T${form.jam}:00`
            };
            await schedule({
                id: id,
                data: payload
            });
            router.push("/admin/defense");
        } catch {
            // Error handled by useMutation toast
        }
    };

    if (loadingDefense) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[100vh] space-y-4 pb-32">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-950" />
                <p className="font-bold text-slate-500 animate-pulse uppercase tracking-widest text-xs">Memuat Data Pendaftar...</p>
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
                    <p className="text-slate-500 font-medium">Data pendaftaran tidak tersedia atau sudah dihapus.</p>
                </div>
                <Button onClick={() => router.back()} variant="outline" className="rounded-xl px-8 font-bold">Kembali</Button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <PageTitle title="Detail Sidang Skripsi" />
            <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold uppercase text-[10px] tracking-widest">
                <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar
            </Button>

            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 pb-12 items-start">
                <div className="lg:col-span-2 lg:row-start-1 order-1 w-full">
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
                                    <span className="font-black text-5xl">{defense.nama_mahasiswa?.charAt(0)}</span>
                                </div>
                                <div className="space-y-2 text-center sm:text-left">
                                    <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">{defense.nama_mahasiswa}</h2>
                                    <p className="text-indigo-600 font-black text-lg tracking-[0.2em] uppercase">{defense.nim}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-6">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-black px-4 py-2 rounded-xl border-none">
                                            Status: {defense.status}
                                        </Badge>
                                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 font-black px-4 py-2 rounded-xl border-none">
                                            SIAP SIDANG
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-10 border-t border-slate-50">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-1 w-4 bg-indigo-600 rounded-full" />
                                    <Label className="uppercase text-[10px] tracking-[0.2em] font-black text-slate-400">Judul Skripsi</Label>
                                </div>
                                <p className="text-xl font-black text-slate-800 leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-1">{defense.judul}</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 pt-6">
                                {defense.draft_path ? (
                                    <a
                                        href={defense.draft_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-20 flex items-center px-6 font-black gap-4 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-slate-900 hover:text-white transition-all shadow-sm group"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 group-hover:text-slate-500 font-black">Dokumen Utama</p>
                                            <p className="text-sm">Draft Final Skripsi</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 opacity-20 ml-auto group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ) : (
                                    <div className="h-20 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-400 font-black text-xs uppercase italic tracking-widest">
                                        Draft belum tersedia
                                    </div>
                                )}{defense.turnitin_path ? (
                                    <a
                                        href={defense.turnitin_path}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-20 flex items-center px-6 font-black gap-4 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-slate-900 hover:text-white transition-all shadow-sm group"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] uppercase tracking-widest text-slate-400 group-hover:text-slate-500 font-black">Validasi Plagiasi</p>
                                            <p className="text-sm">Hasil Turnitin</p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 opacity-20 ml-auto group-hover:opacity-100 transition-opacity" />
                                    </a>
                                ) : (
                                    <div className="h-20 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-slate-400 font-black text-xs uppercase italic tracking-widest">
                                        Turnitin belum ada
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2 lg:row-start-2 order-3 w-full">
                    <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 sm:p-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-1 w-6 bg-amber-500 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation & Notes</span>
                            </div>
                            <CardTitle className="text-2xl font-black tracking-tight uppercase text-slate-900">Riwayat Bimbingan</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 sm:p-10">
                            {loadingGuidance ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3 px-2">
                                            <div className="h-8 w-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <User className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Pembimbing Utama</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{mainSupervisor?.nama || "Belum Ditetapkan"}</p>
                                            </div>
                                            <Badge className="ml-auto bg-indigo-50 text-indigo-600 border-indigo-100 font-black text-[9px] uppercase tracking-widest rounded-lg">{mainLogs.length} Bimbingan</Badge>
                                        </div>
                                        <GuidanceLogList logs={mainLogs} />
                                    </div>

                                    {coSupervisor && (
                                        <div className="space-y-6 pt-10 border-t border-slate-100">
                                            <div className="flex items-center gap-3 px-2">
                                                <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                                    <UserPlus className="h-4 w-4" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Pembimbing Pendamping</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{coSupervisor?.nama || "Belum Ditetapkan"}</p>
                                                </div>
                                                <Badge className="ml-auto bg-amber-50 text-amber-600 border-amber-100 font-black text-[9px] uppercase tracking-widest rounded-lg">{coLogs.length} Bimbingan</Badge>
                                            </div>
                                            <GuidanceLogList logs={coLogs} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 lg:row-start-1 lg:row-span-2 order-2 w-full">
                    <form onSubmit={handleSchedule}>
                        <Card className="border-none shadow-[0_20px_50px_rgba(30,41,59,0.15)] bg-white border-t-8 border-indigo-950 rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="p-8 sm:p-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-1 w-6 bg-indigo-600 rounded-full" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Examination Setup</span>
                                </div>
                                <CardTitle className="font-black text-xl uppercase text-slate-900 tracking-tight">Penetapan Sidang</CardTitle>
                                <CardDescription className="font-bold text-slate-500">Tentukan tim penguji dan jadwal pelaksanaan.</CardDescription>
                            </CardHeader>
                            <CardContent className="px-8 sm:px-10 space-y-8 pb-4">
                                <div className="space-y-3">
                                    <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1">Tanggal Sidang</Label>
                                    <div className="relative">
                                        <DatePicker
                                            date={form.tanggal ? parseISO(form.tanggal) : undefined}
                                            setDate={(date) => setForm({ ...form, tanggal: date ? format(date, "yyyy-MM-dd") : "" })}
                                            placeholder="Pilih Tanggal Sidang"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1">Jam Mulai</Label>
                                        <TimePicker
                                            value={form.jam}
                                            onChange={(val: string) => setForm({ ...form, jam: val })}
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1">Ruangan</Label>
                                        <Input
                                            placeholder="R.301"
                                            className="h-14 rounded-2xl bg-slate-50 border-slate-100 font-black px-6 focus-visible:ring-indigo-600/20 text-slate-900"
                                            required
                                            value={form.ruang}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, ruang: e.target.value })}
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
                                            options={pengujiKetuaOptions}
                                            onSearch={handleSearchLecturers}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1 flex items-center gap-2">
                                            <UserPlus className="h-3 w-3" /> Anggota Penguji 1
                                        </Label>
                                        <SingleSelect
                                            value={form.penguji_1}
                                            onChange={(val) => setForm({ ...form, penguji_1: val })}
                                            placeholder="Pilih Penguji 1..."
                                            className="rounded-2xl h-14 bg-slate-50 border-slate-100 font-bold"
                                            options={penguji1Options}
                                            onSearch={handleSearchLecturers}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600 ml-1 flex items-center gap-2">
                                            <UserPlus className="h-3 w-3" /> Anggota Penguji 2
                                        </Label>
                                        <SingleSelect
                                            value={form.penguji_2}
                                            onChange={(val) => setForm({ ...form, penguji_2: val })}
                                            placeholder="Pilih Penguji 2..."
                                            className="rounded-2xl h-14 bg-slate-50 border-slate-100 font-bold"
                                            options={penguji2Options}
                                            onSearch={handleSearchLecturers}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="p-8 sm:p-10 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-16 rounded-[1.5rem] bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all gap-3"
                                    disabled={submitting || ['PASSED', 'REVISE', 'FAILED'].includes(defense.status)}
                                >
                                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    {['PASSED', 'REVISE', 'FAILED'].includes(defense.status) ? "SIDANG SELESAI" : "Simpan & Publish Jadwal"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </div>
    );
}
