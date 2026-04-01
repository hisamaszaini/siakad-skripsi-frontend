"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Printer, Calendar, Hash, GraduationCap, AlertCircle } from "lucide-react";
import { SingleSelect } from "@/components/ui/single-select";
import { useProdi } from "@/features/skripsi-tema";
import { toast } from "sonner";
import { DatePicker } from "@/components/ui/date-picker";
import { DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface ScheduleExportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "SEMPRO" | "SIDANG";
}

export function ScheduleExportDialog({ open, onOpenChange, type }: ScheduleExportDialogProps) {
    const { data: prodiList = [] } = useProdi();
    const [selectedProdi, setSelectedProdi] = useState("");
    const [batch, setBatch] = useState("");
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const handleExport = () => {
        if (!selectedProdi || !batch || !startDate || !endDate) {
            toast.error("Semua field wajib diisi", {
                icon: <AlertCircle className="h-4 w-4 text-red-500" />
            });
            return;
        }

        const params = new URLSearchParams({
            type,
            prodi: selectedProdi,
            batch,
            startDate: startDate ? new Date(startDate.setHours(0, 0, 0, 0)).toISOString() : "",
            endDate: endDate ? new Date(endDate.setHours(23, 59, 59, 999)).toISOString() : ""
        });

        // Use hidden iframe for printing to maintain A4 landscape and isolate styles
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = 'none';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        iframe.src = `/print/schedule?${params.toString()}`;
        document.body.appendChild(iframe);

        toast.success("Mempersiapkan dokumen cetak...", {
            icon: <Printer className="h-4 w-4 text-blue-500" />
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton={false} className="sm:max-w-[450px] rounded-[2.5rem] p-0 border-none shadow-2xl bg-white overflow-hidden">
                <DialogClose className="absolute right-6 top-6 h-10 w-10 rounded-full bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 text-slate-400 flex items-center justify-center transition-all outline-none focus:ring-2 focus:ring-slate-300 z-10">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Tutup</span>
                </DialogClose>
                <DialogHeader className="p-8 pb-1 space-y-4 pr-12">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                            <Printer className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                            <DialogTitle className="text-xl font-black tracking-tight">Export Jadwal {type === "SEMPRO" ? "Sempro" : "Sidang"}</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-slate-500 italic text-left">
                                Masukkan kriteria filter jadwal.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="mx-8 border-b border-slate-100/80" />

                <div className="p-8 space-y-6 font-sans">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <GraduationCap className="h-3 w-3" /> Program Studi
                        </Label>
                        <SingleSelect
                            value={selectedProdi}
                            onChange={setSelectedProdi}
                            options={prodiList.map((p: { nama_prodi: string; kode_jurusan: string }) => ({
                                label: p.nama_prodi,
                                value: p.kode_jurusan
                            }))}
                            placeholder="Pilih Program Studi..."
                            className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold hover:ring-blue-100"
                        />
                    </div>

                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                            <Hash className="h-3 w-3" /> Batch Number
                        </Label>
                        <Input
                            placeholder="Contoh: 1"
                            value={batch}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBatch(e.target.value)}
                            className="h-12 rounded-2xl bg-slate-50/50 border-slate-100 font-bold focus:ring-blue-100"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> Tgl Mulai
                            </Label>
                            <DatePicker
                                date={startDate}
                                setDate={(d) => {
                                    setStartDate(d);
                                    if (endDate && d && endDate < d) {
                                        setEndDate(undefined);
                                    }
                                }}
                                placeholder="Tanggal Mulai..."
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> Tgl Selesai
                            </Label>
                            <DatePicker
                                date={endDate}
                                setDate={setEndDate}
                                placeholder="Tanggal Selesai..."
                                disabledDates={(date) => !!startDate && date < startDate}
                                disabled={!startDate}
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 border-t border-slate-100 rounded-b-[2.5rem] flex flex-row items-center gap-4">
                    <Button
                        variant="default"
                        onClick={handleExport}
                        className="w-full h-14 rounded-[1.5rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] transition-all active:scale-95 gap-3 shadow-xl shadow-blue-100"
                    >
                        <Printer className="h-5 w-5" />
                        Cetak Jadwal
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
