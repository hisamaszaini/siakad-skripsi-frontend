"use client";

import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useProdi } from "@/features/skripsi-tema";
import { semproService } from "@/features/sempro/services/sempro.service";
import { defenseService } from "@/features/defense/services/defense.service";
import { ReportTemplate } from "@/components/shared/report-template";
import { useMemo, useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";

function PrintScheduleContent() {
    const searchParams = useSearchParams();
    const reportType = (searchParams.get("type") as "SEMPRO" | "SIDANG") || "SEMPRO";
    const selectedProdi = searchParams.get("prodi") || "ALL";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";
    const batchNumber = searchParams.get("batch") || "";

    const { data: prodiList } = useProdi();

    const { data: scheduleData, isLoading } = useQuery({
        queryKey: ["print-schedule", reportType, selectedProdi, startDate, endDate],
        queryFn: async () => {
            const params = {
                prodi: selectedProdi === "ALL" ? undefined : selectedProdi,
                startDate: startDate || undefined,
                endDate: endDate || undefined,
                status: "SCHEDULED",
                limit: 100
            };

            if (reportType === "SEMPRO") {
                const res = await semproService.listSempro(params);
                return res.data.data.data;
            } else {
                const res = await defenseService.listDefense(params);
                return res.data.data.data;
            }
        }
    });

    const prodiName = useMemo(() => {
        if (selectedProdi === "ALL") return "SEMUA PROGRAM STUDI";
        const prodi = prodiList?.find((p: { kode_jurusan: string; nama_prodi: string }) => p.kode_jurusan === selectedProdi);
        return prodi ? prodi.nama_prodi.toUpperCase() : "PROGRAM STUDI";
    }, [selectedProdi, prodiList]);

    useEffect(() => {
        if (!isLoading && scheduleData && scheduleData.length > 0) {
            const timer = setTimeout(() => {
                window.print();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isLoading, scheduleData]);

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-white print:hidden">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!scheduleData || scheduleData.length === 0) {
        return (
            <div className="p-20 text-center font-serif bg-white print:hidden">
                <h1 className="text-2xl font-bold">Tidak ada data untuk dicetak.</h1>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <ReportTemplate
                scheduleData={scheduleData}
                reportType={reportType}
                prodiName={prodiName}
                startDate={startDate}
                batchNumber={batchNumber}
            />
        </div>
    );
}

export default function PrintSchedulePage() {
    return (
        <Suspense fallback={null}>
            <PrintScheduleContent />
        </Suspense>
    );
}
