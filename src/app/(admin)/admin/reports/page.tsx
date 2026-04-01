"use client";

import { useMemo } from "react";
import { Printer, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { useProdi } from "@/features/skripsi-tema";
import { semproService } from "@/features/sempro/services/sempro.service";
import { defenseService } from "@/features/defense/services/defense.service";
import { useQuery } from "@tanstack/react-query";
import { PageTitle } from "@/components/ui/page-title";
import { toast } from "sonner";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ReportTemplate } from "@/components/shared/report-template";

export default function ExportReportPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const reportType = (searchParams.get("type") as "SEMPRO" | "SIDANG") || "SEMPRO";
    const selectedProdi = searchParams.get("prodi") || "ALL";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const batchNumber = searchParams.get("batch") || "";

    const updateParams = (newParams: Record<string, string | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === "" || (key === "prodi" && value === "ALL") || (key === "type" && value === "SEMPRO")) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        router.push(`${pathname}?${params.toString()}`);
    };

    const { data: prodiList } = useProdi();

    const { data: scheduleData, isLoading, refetch } = useQuery({
        queryKey: ["export-schedule", reportType, selectedProdi, startDate, endDate],
        queryFn: async () => {
            const params = {
                prodi: selectedProdi === "ALL" ? undefined : selectedProdi,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                status: "SCHEDULED", // Only export scheduled ones
                limit: 100 // Assume reasonable limit for report
            };

            if (reportType === "SEMPRO") {
                const res = await semproService.listSempro(params);
                return res.data.data.data;
            } else {
                const res = await defenseService.listDefense(params);
                return res.data.data.data;
            }
        },
        enabled: false // Trigger manually or with button
    });

    useEffect(() => {
        if (searchParams.get("autoRun") === "true" && startDate && endDate) {
            refetch();
        }
    }, [searchParams, startDate, endDate, refetch]);

    const handleGenerate = () => {
        if (!startDate || !endDate) {
            toast.error("Silakan pilih rentang tanggal");
            return;
        }
        refetch();
    };

    const handlePrint = () => {
        const params = new URLSearchParams({
            type: reportType,
            prodi: selectedProdi,
            batch: batchNumber,
            startDate,
            endDate
        });
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
        setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 60000);
    };

    const prodiName = useMemo(() => {
        if (selectedProdi === "ALL") return "SEMUA PROGRAM STUDI";
        const prodi = prodiList?.find((p: { kode_jurusan: string; nama_prodi: string }) => p.kode_jurusan === selectedProdi);
        return prodi ? prodi.nama_prodi.toUpperCase() : "PROGRAM STUDI";
    }, [selectedProdi, prodiList]);


    return (
        <div className="w-11/12 mx-auto space-y-10 py-10 pb-20 print:w-full print:p-0 print:m-0">
            <div className="print:hidden">
                <PageTitle title="Export Penjadwalan" />

                <Card className="border-none shadow-2xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="bg-slate-900 text-white p-8">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="h-1 w-10 bg-indigo-500 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Reporting Engine</span>
                        </div>
                        <CardTitle className="text-3xl font-black tracking-tight">Generate Schedule Report</CardTitle>
                        <CardDescription className="text-slate-400 font-bold">Pilih kriteria untuk mengekspor jadwal seminar atau sidang.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Laporan</Label>
                                <Select value={reportType} onValueChange={(val) => { if (val) updateParams({ type: val as "SEMPRO" | "SIDANG" }) }}>
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold transition-all focus:ring-indigo-100">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="SEMPRO" className="font-bold">SEMINAR PROPOSAL</SelectItem>
                                        <SelectItem value="SIDANG" className="font-bold">SIDANG SKRIPSI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Program Studi</Label>
                                <Select value={selectedProdi} onValueChange={(val) => updateParams({ prodi: val || "ALL" })}>
                                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold transition-all focus:ring-indigo-100">
                                        <SelectValue placeholder="Semua Prodi" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                                        <SelectItem value="ALL" className="font-bold">SEMUA PRODI</SelectItem>
                                        {prodiList?.map((p: { prodi_id: string; kode_jurusan: string; nama_prodi: string }) => (
                                            <SelectItem key={p.prodi_id} value={p.kode_jurusan} className="font-bold">
                                                {p.nama_prodi}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Batch Number</Label>
                                <Input
                                    placeholder="e.g. 1"
                                    value={batchNumber}
                                    onChange={(e) => updateParams({ batch: e.target.value })}
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold focus:ring-indigo-100"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => updateParams({ startDate: e.target.value })}
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold focus:ring-indigo-100"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tanggal Selesai</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => updateParams({ endDate: e.target.value })}
                                    className="h-14 rounded-2xl border-slate-200 bg-slate-50 font-bold focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex items-end">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={isLoading}
                                    className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-200 transition-all active:scale-95 gap-2"
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    Generate Report
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {scheduleData && scheduleData.length > 0 && (
                <div className="space-y-6">
                    <div className="flex justify-end gap-3 print:hidden">
                        <Button
                            variant="outline"
                            onClick={handlePrint}
                            className="h-12 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest gap-2 bg-white shadow-sm hover:bg-slate-50 transition-all border-slate-200"
                        >
                            <Printer className="h-4 w-4" /> Print Report
                        </Button>
                    </div>

                    <ReportTemplate
                        scheduleData={scheduleData}
                        reportType={reportType}
                        prodiName={prodiName}
                        startDate={startDate}
                        batchNumber={batchNumber}
                    />
                </div>
            )}

            {scheduleData && scheduleData.length === 0 && (
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white p-20 text-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                        <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Tidak Ada Jadwal Ditemukan</h3>
                    <p className="text-slate-500 max-w-md mx-auto font-medium italic">
                        Coba sesuaikan rentang tanggal atau kriteria filter lainnya.
                    </p>
                </Card>
            )}
        </div>
    );
}
