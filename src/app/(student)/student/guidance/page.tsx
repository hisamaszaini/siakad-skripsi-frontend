"use client";

import { useStudentGuidance, StudentGuidanceTable } from "@/features/guidance";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FileText, MessageSquare, Info, Edit3 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PageTitle } from "@/components/ui/page-title";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { FormProvider } from "react-hook-form";
import { GuidanceLogForm } from "@/features/guidance";

const ROLE_TABS = [
    { key: 'ALL', label: 'Semua' },
    { key: 'MAIN', label: 'Pembimbing 1' },
    { key: 'CO', label: 'Pembimbing 2' },
];

export default function StudentGuidancePage() {

    const {
        thesis,
        logs,
        filteredLogs,
        logsLoading,
        isSubmitting,
        isEditing,
        openAddLog,
        setOpenAddLog,
        openEditLog,
        roleFilter,
        setRoleFilter,
        supervisorOptions,
        addForm,
        editForm,
        onSubmitAdd,
        onSubmitEdit,
        openEditDialog,
        closeEditDialog
    } = useStudentGuidance();

    if (logsLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    <p className="font-black text-slate-400 animate-pulse text-[10px] uppercase tracking-widest">Memuat Log Bimbingan...</p>
                </div>
            </div>
        );
    }

    const isGuidanceAllowed = !!thesis && thesis.status !== "SUBMITTED" && thesis.status !== "REJECTED";

    return (
        <div className="w-11/12 mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <PageTitle title="Log Bimbingan Saya" />
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-indigo-600 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Activity Track</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
                        Log <span className="text-indigo-600">Bimbingan</span>
                    </h1>
                </div>

                <div className="hidden md:block">
                    <Dialog open={openAddLog} onOpenChange={setOpenAddLog}>
                        <DialogTrigger render={
                            <Button
                                disabled={!isGuidanceAllowed}
                                className="h-14 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-200/50 transition-all hover:-translate-y-1 active:scale-95 gap-3 disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none disabled:translate-y-0"
                            >
                                <Plus className="h-5 w-5" />
                                Tambah Log Baru
                            </Button>
                        } />
                        <DialogContent showCloseButton={false} className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
                            <FormProvider {...addForm}>
                                <GuidanceLogForm
                                    onSubmit={onSubmitAdd}
                                    isLoading={isSubmitting}
                                    onCancel={() => setOpenAddLog(false)}
                                    showSupervisor={true}
                                    supervisorOptions={supervisorOptions}
                                    submitText="Submit Log Catatan"
                                    submitColor="indigo"
                                    title="Record Guidance"
                                    description="Catat aktivitas bimbingan terbaru untuk divalidasi pembimbing."
                                    icon={<Plus className="h-6 w-6" />}
                                />
                            </FormProvider>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <Card className="md:col-span-4 border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden relative text-white group bg-gradient-to-br from-indigo-600 to-indigo-900 p-8">
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                        <div className="h-10 w-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-200 mb-1">TOTAL BIMBINGAN</p>
                            <p className="text-5xl font-black tracking-tighter">{logs.length} <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest ml-1">LOGS</span></p>
                        </div>
                    </div>
                    <FileText className="absolute -bottom-8 -right-8 h-40 w-40 opacity-5 group-hover:rotate-12 group-hover:scale-110 transition-all duration-700" />
                </Card>

                <div className="md:col-span-8 bg-white shadow-xl shadow-slate-100/50 border border-slate-50 rounded-[2.5rem] p-10 flex items-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Info className="h-24 w-24 -rotate-12" />
                    </div>
                    <div className="relative z-10 flex gap-6 items-start">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <MessageSquare className="h-7 w-7" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Konsistensi adalah Kunci.</h3>
                            <p className="text-slate-500 font-medium text-sm leading-relaxed italic">
                                &quot;Jangan lupa mencatat setiap diskusi penting bersama pembimbingmu. Data log ini akan menjadi prasyarat untuk pendaftaran Seminar Proposal.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="space-y-6 pt-4">
                {!isGuidanceAllowed && (
                    <Card className="border-none bg-amber-50/50 shadow-sm rounded-[2rem] overflow-hidden mb-6">
                        <CardContent className="p-6 flex items-start gap-4">
                            <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                                <Info className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-amber-900 uppercase text-[10px] tracking-widest leading-none">Akses Terbatas</h4>
                                <p className="text-sm font-medium text-amber-700/80 leading-relaxed italic">
                                    Kamu belum bisa menambah log bimbingan. Fitur ini akan aktif setelah usulan proposal disetujui (ACC) dan pembimbing telah ditetapkan.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Timeline Aktivitas</h3>
                    </div>

                    <FilterTabs
                        tabs={ROLE_TABS}
                        activeKey={roleFilter}
                        onChange={(key) => setRoleFilter(key as 'ALL' | 'MAIN' | 'CO')}
                    />
                </div>

                <StudentGuidanceTable
                    logs={filteredLogs}
                    onEdit={openEditDialog}
                    onAddClick={() => setOpenAddLog(true)}
                    isAddDisabled={!isGuidanceAllowed}
                />

                {/* Edit/Revisi Dialog */}
                {openEditLog && (
                    <Dialog open={!!openEditLog} onOpenChange={(open) => !open && closeEditDialog()}>
                        <DialogContent showCloseButton={false} className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl">
                            <FormProvider {...editForm}>
                                <GuidanceLogForm
                                    onSubmit={onSubmitEdit}
                                    isLoading={isEditing}
                                    onCancel={closeEditDialog}
                                    submitText="Simpan Perubahan & Ajukan Ulang"
                                    submitColor="amber"
                                    title="Perbaiki Log Bimbingan"
                                    description="Perbarui log yang ditolak untuk diajukan kembali ke pembimbing."
                                    icon={<Edit3 className="h-6 w-6" />}
                                />
                            </FormProvider>
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
