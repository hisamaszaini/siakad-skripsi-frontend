"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    useProposalByIdQuery,
    useAssignSupervisorsMutation,
    useManualUpdateStatusMutation,
    useDeleteProposalMutation,
    usePeriodsQuery,
    useThemesQuery,
    proposalService
} from "@/features/proposal";
import { useQueryClient } from "@tanstack/react-query";
import { Proposal, Lecturer, Supervisor, ProposalStatus } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SingleSelect } from "@/components/ui/single-select";
import {
    ChevronLeft, UserCheck, User, Hash, Clock, BookOpen,
    CheckCircle2, Loader2, GraduationCap, AlertCircle,
    Trash2, Save, MoreVertical, Plus,
    FileText,
    Briefcase,
    XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup
} from "@/components/ui/dropdown-menu";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PageTitle } from "@/components/ui/page-title";

const statusBadge = (status: ProposalStatus) => {
    switch (status) {
        case "SUBMITTED": return <Badge variant="secondary" className="bg-amber-100 text-amber-700 font-bold tracking-tight px-3 py-1 rounded-full"><Clock className="h-3 w-3 mr-1" /> Menunggu Dosen</Badge>;
        case "REVISION": return <Badge variant="secondary" className="bg-orange-100 text-orange-700 font-bold tracking-tight px-3 py-1 rounded-full"><AlertCircle className="h-3 w-3 mr-1" /> Perlu Revisi</Badge>;
        case "APPROVED": return <Badge className="bg-emerald-100 text-emerald-800 font-bold tracking-tight px-3 py-1 rounded-full"><CheckCircle2 className="h-3 w-3 mr-1" /> Siap Plotting</Badge>;
        case "PLOTTED": return <Badge className="bg-indigo-100 text-indigo-700 font-bold tracking-tight px-3 py-1 rounded-full"><UserCheck className="h-3 w-3 mr-1" /> Bimbingan</Badge>;
        case "SEMPRO": return <Badge className="bg-blue-100 text-blue-700 font-bold tracking-tight px-3 py-1 rounded-full"><FileText className="h-3 w-3 mr-1" /> Seminar Proposal</Badge>;
        case "SKRIPSI": return <Badge className="bg-purple-100 text-purple-700 font-bold tracking-tight px-3 py-1 rounded-full"><Briefcase className="h-3 w-3 mr-1" /> Riset Skripsi</Badge>;
        case "SIDANG": return <Badge className="bg-rose-100 text-rose-700 font-bold tracking-tight px-3 py-1 rounded-full"><GraduationCap className="h-3 w-3 mr-1" /> Sidang Akhir</Badge>;
        case "FINISHED": return <Badge className="bg-green-600 text-white font-bold tracking-tight px-3 py-1 rounded-full"><CheckCircle2 className="h-3 w-3 mr-1" /> Lulus Selesai</Badge>;
        case "REJECTED": return <Badge variant="destructive" className="font-bold tracking-tight px-3 py-1 rounded-full"><XCircle className="h-3 w-3 mr-1" /> Ditolak</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default AdminProposalDetailPage;

function AdminProposalDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [loading, setLoading] = useState(false);
    const [pembimbing1Id, setPembimbing1Id] = useState("");
    const [pembimbing2Id, setPembimbing2Id] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        judul: "",
        tema: "",
        customTema: "",
        sks_total: 0,
        periode_id: "",
        status: "" as ProposalStatus
    });

    const queryClient = useQueryClient();
    const { data: proposal, isLoading } = useProposalByIdQuery(id);
    const { data: periodsData } = usePeriodsQuery();
    const periods = periodsData || [];
    const { data: themesData } = useThemesQuery(proposal?.mhs_id);
    const themes = themesData || [];

    const { mutateAsync: assignSupervisors } = useAssignSupervisorsMutation();
    const { mutateAsync: manualUpdateStatus } = useManualUpdateStatusMutation();
    const { mutateAsync: deleteProposal } = useDeleteProposalMutation();

    // Pre-fill Pembimbing 1 with the student's proposed supervisor when data loads
    const [initialized, setInitialized] = useState(false);
    if (proposal && !initialized) {
        if (proposal.pembimbing_usulan_id) {
            setPembimbing1Id(proposal.pembimbing_usulan_id);
        }

        // Determine if current theme is a predefined one or custom
        const isPredefined = themes.some(t => t.name === proposal.tema);

        setEditForm({
            judul: proposal.judul,
            tema: isPredefined ? (proposal.tema || "") : (proposal.tema ? "Lainnya" : ""),
            customTema: isPredefined ? "" : (proposal.tema || ""),
            sks_total: proposal.sks_total,
            periode_id: proposal.periode_id || "",
            status: proposal.status
        });
        setInitialized(true);
    }

    const handleAssign = async () => {
        if (!pembimbing1Id) {
            return toast.error("Pembimbing Utama wajib dipilih.");
        }
        if (pembimbing1Id === pembimbing2Id && pembimbing2Id) {
            return toast.error("Pembimbing 1 dan Pembimbing 2 tidak boleh orang yang sama.");
        }

        setLoading(true);
        try {
            const supervisors = [
                { dosen_id: pembimbing1Id, role: 'MAIN' }
            ];
            if (pembimbing2Id) {
                supervisors.push({ dosen_id: pembimbing2Id, role: 'CO' });
            }

            await assignSupervisors({
                id,
                data: { supervisors }
            });
        } catch (error) {
            // Toast handled by hook
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const finalTema = editForm.tema === "Lainnya" ? editForm.customTema : editForm.tema;
            const { customTema, ...payload } = editForm;

            await manualUpdateStatus({
                id,
                data: {
                    ...payload,
                    tema: finalTema
                }
            });
            setIsEditing(false);
        } catch (error) {
            // Toast handled by hook
        } finally {
            setLoading(false);
        }
    };

    const handleManualStatus = async (status: ProposalStatus) => {
        if (!confirm(`Apakah Anda yakin ingin mengubah status usulan ini menjadi ${status} secara manual?`)) return;

        try {
            await manualUpdateStatus({ id, data: { status } });
        } catch (error) {
            // Toast handled by hook
        }
    };

    const handleDelete = async () => {
        if (!confirm("PERINGATAN: Menghapus usulan akan menghilangkan seluruh data bimbingan dan riwayat terkait. Hapus?")) return;

        try {
            await deleteProposal(id);
            router.push("/admin/proposals");
        } catch (error) {
            // Toast handled by hook
        }
    };

    const searchLecturers = async (query: string) => {
        const res = await proposalService.searchLecturers(query);
        return (res.data || []).map((d: Lecturer) => ({
            label: d.nama?.trim(),
            value: String(d.nik),
            description: `NIK: ${d.nik}${d.nidn ? ` • NIDN: ${d.nidn}` : ""}`,
        }));
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!proposal) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <p className="text-lg font-bold">Proposal tidak ditemukan.</p>
                <Button variant="ghost" onClick={() => router.back()}>Kembali</Button>
            </div>
        );
    }

    const canPlotting = proposal.status === "APPROVED";
    const alreadyPlotted = ["PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED"].includes(proposal.status);

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500 max-w-5xl pb-12">
            <PageTitle title="Detail Usulan Skripsi" />
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => router.back()} className="gap-2 text-slate-500 hover:text-slate-900 rounded-xl">
                    <ChevronLeft className="h-4 w-4" /> Kembali
                </Button>

                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger render={
                            <Button variant="outline" size="icon" className="rounded-xl">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        } />
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>Aksi Cepat (Override)</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-amber-600 font-bold focus:bg-amber-50 rounded-lg" onClick={() => handleManualStatus("REVISION")}>
                                    <AlertCircle className="h-4 w-4 mr-2" /> Set ke Perlu Revisi
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-emerald-700 font-bold focus:bg-emerald-50 rounded-lg" onClick={() => handleManualStatus("APPROVED")}>
                                    <CheckCircle2 className="h-4 w-4 mr-2" /> Set ke Siap Plotting
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-indigo-600 font-bold focus:bg-indigo-50 rounded-lg" onClick={() => handleManualStatus("PLOTTED")}>
                                    <UserCheck className="h-4 w-4 mr-2" /> Set ke Bimbingan
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem className="text-red-600 font-black focus:bg-red-50 rounded-lg" onClick={handleDelete}>
                                    <Trash2 className="h-4 w-4 mr-2" /> Hapus Usulan
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-6">
                    {/* Proposal Detail Card */}
                    <Card className="border-none shadow-sm overflow-hidden rounded-3xl">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 p-8">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-indigo-600 font-black text-[10px] tracking-widest uppercase py-0.5">PROPOSAL ID: #{id.slice(-4).toUpperCase()}</Badge>
                                        {statusBadge(proposal.status)}
                                    </div>
                                    <CardTitle className="text-2xl font-black leading-tight text-slate-900 italic tracking-tight underline decoration-indigo-200 decoration-4 underline-offset-4">
                                        &quot;{proposal.judul}&quot;
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 font-medium">
                                        <Clock className="h-3.5 w-3.5" />
                                        Diajukan pada {format(new Date(proposal.created_at), "dd MMMM yyyy", { locale: idLocale })}
                                        {proposal.periode_id && (
                                            <span className="ml-2 font-black text-indigo-600 px-2 py-0.5 bg-indigo-50 rounded-md text-[10px] uppercase">Periode: {proposal.periode_id}</span>
                                        )}
                                    </CardDescription>
                                </div>
                                <Button
                                    variant={isEditing ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => isEditing ? handleUpdate() : setIsEditing(true)}
                                    className={isEditing ? "bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 h-11 px-6 font-black italic shadow-lg shadow-emerald-100" : "rounded-xl gap-2 h-11 px-6 font-black italic text-indigo-600 border-indigo-100 hover:bg-indigo-50"}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isEditing ? <Save className="h-4 w-4" /> : <FileText className="h-4 w-4" />)}
                                    {isEditing ? "SIMPAN PERUBAHAN" : "EDIT USULAN"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
                            {isEditing ? (
                                <>
                                    <div className="col-span-2 space-y-4">
                                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Judul Skripsi</Label>
                                        <textarea
                                            className="w-full min-h-[100px] rounded-2xl border border-indigo-100 bg-indigo-50/10 p-4 font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all outline-none"
                                            value={editForm.judul}
                                            onChange={(e) => setEditForm({ ...editForm, judul: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-4">
                                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Tema Penelitian <span className="text-red-500">*</span></Label>
                                        <RadioGroup
                                            onValueChange={(val) => setEditForm({ ...editForm, tema: val })}
                                            value={editForm.tema}
                                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                        >
                                            {(themes || []).map((theme) => (
                                                <div key={theme.id} className="relative">
                                                    <RadioGroupItem value={theme.name} id={`theme-${theme.id}`} className="peer sr-only" />
                                                    <Label
                                                        htmlFor={`theme-${theme.id}`}
                                                        className="flex items-center p-4 rounded-2xl bg-white border border-slate-100 font-bold text-xs cursor-pointer peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-900 transition-all hover:border-indigo-200"
                                                    >
                                                        {theme.name}
                                                    </Label>
                                                </div>
                                            ))}
                                            <div className="relative">
                                                <RadioGroupItem value="Lainnya" id="theme-other" className="peer sr-only" />
                                                <Label
                                                    htmlFor="theme-other"
                                                    className="flex items-center p-4 rounded-2xl bg-white border border-slate-100 font-bold text-xs cursor-pointer peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-900 transition-all hover:border-indigo-200"
                                                >
                                                    Tema Lainnya
                                                </Label>
                                            </div>
                                        </RadioGroup>

                                        {editForm.tema === "Lainnya" && (
                                            <Input
                                                placeholder="Sebutkan tema spesifik penelitian..."
                                                value={editForm.customTema}
                                                onChange={(e) => setEditForm({ ...editForm, customTema: e.target.value })}
                                                className="h-12 rounded-2xl border-indigo-100 bg-indigo-50/10 px-6 font-bold text-indigo-900 focus-visible:ring-indigo-600/20 animate-in slide-in-from-top-2 duration-300"
                                            />
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Periode Akademik</Label>
                                        <SingleSelect
                                            value={editForm.periode_id}
                                            onChange={(val) => setEditForm({ ...editForm, periode_id: val })}
                                            options={(periods || []).map(p => ({
                                                label: `${p.tahun_ajaran} - ${p.semester}`,
                                                value: p.periode_id,
                                                description: `ID: ${p.periode_id}`
                                            }))}
                                            placeholder="Pilih Periode..."
                                            className="h-12 rounded-xl border-indigo-100 bg-indigo-50/10 font-bold"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Total SKS</Label>
                                        <Input
                                            type="number"
                                            value={editForm.sks_total}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, sks_total: parseInt(e.target.value) || 0 })}
                                            className="h-12 rounded-xl border-indigo-100 bg-indigo-50/10 font-bold"
                                        />
                                    </div>
                                    <div className="col-span-2 space-y-4">
                                        <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Status Usulan</Label>
                                        <SingleSelect
                                            value={editForm.status}
                                            onChange={(val) => setEditForm({ ...editForm, status: val as ProposalStatus })}
                                            options={[
                                                "SUBMITTED", "REVISION", "APPROVED", "PLOTTED", "SEMPRO", "SKRIPSI", "SIDANG", "FINISHED", "REJECTED", "NONACTIVE"
                                            ].map(s => ({ label: s, value: s }))}
                                            placeholder="Pilih Status..."
                                            className="h-12 rounded-xl border-indigo-100 bg-indigo-50/10 font-bold"
                                        />
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-2 pt-4">
                                        <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsEditing(false)}>Batal</Button>
                                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-black italic px-8" onClick={handleUpdate} disabled={loading}>
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            SIMPAN
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-slate-50 rounded-2xl p-5 space-y-1.5 border border-slate-100">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Tema Penelitian</p>
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            <BookOpen className="h-4 w-4 text-indigo-400" />
                                            {proposal.tema || "—"}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-5 space-y-1.5 border border-slate-100">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Beban Kredit</p>
                                        <p className="font-bold text-slate-800 flex items-center gap-2">
                                            <Hash className="h-4 w-4 text-indigo-400" />
                                            {proposal.sks_total} SKS
                                        </p>
                                    </div>
                                </>
                            )}
                            {!isEditing && proposal.nama_calon_pembimbing && (
                                <div className="bg-indigo-50/50 rounded-3xl p-6 space-y-2 col-span-2 border border-indigo-100 shadow-inner">
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-indigo-400">Usulan Pembimbing dari Mahasiswa</p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <GraduationCap className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <div>
                                            <p className="font-black text-indigo-900">{proposal.nama_calon_pembimbing?.trim()}</p>
                                            <p className="text-xs text-indigo-500 font-mono italic">NIK: {proposal.nik_calon_pembimbing}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Plotting UI */}
                    {canPlotting && (
                        <Card className="border-none shadow-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <CardHeader className="bg-indigo-600 text-white p-8">
                                <CardTitle className="flex items-center gap-3 text-xl font-black italic">
                                    <UserCheck className="h-6 w-6" />
                                    Penetapan Dosen Pembimbing
                                </CardTitle>
                                <CardDescription className="text-indigo-100 font-medium opacity-80 mt-2">
                                    Pilih pembimbing resmi yang akan mendampingi riset hingga sidang akhir.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8 bg-white">
                                <div className="space-y-4">
                                    <Label className="font-black text-xs uppercase tracking-widest text-slate-400">
                                        Pembimbing 1 (Utama) <span className="text-red-500">*</span>
                                    </Label>
                                    <SingleSelect
                                        value={pembimbing1Id}
                                        onChange={setPembimbing1Id}
                                        onSearch={searchLecturers}
                                        options={proposal.pembimbing_usulan_id ? [{
                                            value: proposal.pembimbing_usulan_id,
                                            label: proposal.nama_calon_pembimbing?.trim() || proposal.pembimbing_usulan_id,
                                            description: `NIK: ${proposal.nik_calon_pembimbing}`
                                        }] : []}
                                        placeholder="Cari nama atau NIK dosen..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="font-black text-xs uppercase tracking-widest text-slate-400">
                                        Pembimbing 2 (Pendamping) <span className="text-slate-300 font-normal italic">(opsional)</span>
                                    </Label>
                                    <SingleSelect
                                        value={pembimbing2Id}
                                        onChange={setPembimbing2Id}
                                        onSearch={searchLecturers}
                                        placeholder="Pilih pembimbing pendamping jika diperlukan..."
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="bg-slate-50 p-8 flex justify-end gap-3 border-t border-slate-100">
                                <Button
                                    onClick={handleAssign}
                                    disabled={loading || !pembimbing1Id}
                                    className="bg-indigo-600 hover:bg-indigo-700 font-black italic gap-2 px-10 h-12 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                >
                                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                                    Simpan & Terbitkan SK
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Display Supervisors if allotted */}
                    {alreadyPlotted && proposal.supervisors && proposal.supervisors.length > 0 && (
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="p-8 pb-0">
                                <CardTitle className="text-lg font-black italic flex items-center gap-2 text-indigo-700">
                                    <UserCheck className="h-5 w-5" /> Pembimbing SK Terdaftar
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 grid gap-4">
                                {proposal.supervisors.map((s: Supervisor, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-indigo-50/30 rounded-2xl border border-indigo-100">
                                        <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-indigo-50 font-black text-indigo-600">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-black text-slate-800 leading-none mb-1">{s.nama}</p>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                                                {s.role === "MAIN" ? "Pembimbing Utama" : "Pembimbing Pendamping"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Student Mini Profile */}
                    <Card className="border-none shadow-sm rounded-3xl bg-indigo-600 text-white overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-xl">
                                    <User className="h-10 w-10 text-white" />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200 mb-1 opacity-70">Identitas Mahasiswa</p>
                                    <h3 className="text-2xl font-black italic leading-tight">{proposal.nama_mahasiswa}</h3>
                                    <p className="text-lg font-mono text-indigo-100 opacity-60">{proposal.nim}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Guideline */}
                    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white border border-slate-100">
                        <CardHeader className="p-6 border-b border-slate-50">
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Siklus Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 text-xs font-bold leading-relaxed">
                            <div className="flex gap-3 text-amber-600 italic">
                                <Clock className="h-4 w-4 shrink-0" />
                                <span>Menunggu — Tunggu verifikasi dosen pilihan.</span>
                            </div>
                            <div className="flex gap-3 text-emerald-600 italic">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                <span>Plotting — Dosen setuju, Admin tentukan SK.</span>
                            </div>
                            <div className="flex gap-3 text-indigo-600 italic">
                                <UserCheck className="h-4 w-4 shrink-0" />
                                <span>Bimbingan — Log bimbingan aktif & dapat diisi.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};