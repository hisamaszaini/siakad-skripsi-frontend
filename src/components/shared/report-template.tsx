"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";

interface ScheduleItem {
    id: string | number;
    nim?: string;
    nama_mahasiswa?: string;
    judul?: string;
    ruang?: string;
    tanggal?: string;
    jam?: string;
}

interface ReportTemplateProps {
    scheduleData: ScheduleItem[];
    reportType: "SEMPRO" | "SIDANG";
    prodiName: string;
    startDate: string;
    batchNumber: string;
}

export function ReportTemplate({
    scheduleData,
    reportType,
    prodiName,
    startDate,
    batchNumber
}: ReportTemplateProps) {
    // Grouping by date
    const groupedByDate = useMemo(() => {
        if (!scheduleData) return {} as Record<string, ScheduleItem[]>;
        return scheduleData.reduce((acc: Record<string, ScheduleItem[]>, curr: ScheduleItem) => {
            const date = curr.tanggal || "NOT_SET";
            if (!acc[date]) acc[date] = [];
            acc[date].push(curr);
            return acc;
        }, {} as Record<string, ScheduleItem[]>);
    }, [scheduleData]);

    const sortedDates = Object.keys(groupedByDate).sort();

    const dayColors = [
        "#ffffff", // White
        "#e2e8f0", // Slate 200
        "#bfdbfe", // Blue 200
        "#c7d2fe", // Indigo 200
        "#a7f3d0", // Emerald 200
        "#fde68a", // Amber 200
        "#fecdd3"  // Rose 200
    ];

    return (
        <div className="bg-white print:p-0 font-serif w-full min-h-screen">


            <div className="p-8 md:p-12 print:p-4 font-sans">
                <div className="text-center space-y-2 mb-10 border-b-2 border-slate-900 pb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                        JADWAL {reportType === "SEMPRO" ? "SEMINAR PROPOSAL" : "SIDANG SKRIPSI"}
                    </h1>
                    <p className="text-xl font-bold uppercase text-slate-900">PROGRAM STUDI {prodiName}</p>
                    <p className="text-lg font-bold text-slate-800">
                        {startDate && format(new Date(startDate), "MMMM yyyy", { locale: idLocale }).toUpperCase()} BATCH {batchNumber || "-"}
                    </p>
                </div>

                <div className="overflow-hidden border border-slate-900 rounded-sm">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-200 border-b border-slate-900">
                                <th className="p-3 border-r border-slate-900 text-center text-xs font-bold uppercase w-12 text-slate-900">No</th>
                                <th className="p-3 border-r border-slate-900 text-left text-xs font-bold uppercase w-16 text-slate-900">NIM</th>
                                <th className="p-3 border-r border-slate-900 text-left text-xs font-bold uppercase w-48 text-slate-900">Nama</th>
                                <th className="p-3 border-r border-slate-900 text-left text-xs font-bold uppercase text-slate-900">Judul</th>
                                <th className="p-3 border-r border-slate-900 text-center text-xs font-bold uppercase w-24 text-slate-900">Ruangan</th>
                                <th className="p-3 border-r border-slate-900 text-center text-xs font-bold uppercase w-44 text-slate-900">Hari / Tanggal</th>
                                <th className="p-3 text-center text-xs font-bold uppercase w-24 text-slate-900">Pukul</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDates.map((date, dateIdx) => {
                                const dateRows = groupedByDate[date];
                                const bgColor = dayColors[dateIdx % dayColors.length];

                                return dateRows.map((item: ScheduleItem, itemIdx: number) => {
                                    // Calculate global index
                                    let globalIdx = 0;
                                    for (let i = 0; i < dateIdx; i++) {
                                        globalIdx += groupedByDate[sortedDates[i]].length;
                                    }
                                    globalIdx += itemIdx + 1;

                                    return (
                                        <tr
                                            key={item.id}
                                            style={{
                                                backgroundColor: bgColor,
                                                boxShadow: `inset 0 0 0 1000px ${bgColor}`,
                                                WebkitPrintColorAdjust: 'exact'
                                            } as React.CSSProperties}
                                            className="border-b border-slate-900 last:border-b-0"
                                        >
                                            <td className="p-3 border-r border-slate-900 text-center text-xs text-slate-900">{globalIdx}</td>
                                            <td className="p-3 border-r border-slate-900 text-xs font-medium text-slate-800">{item.nim}</td>
                                            <td className="p-3 border-r border-slate-900 text-xs font-bold uppercase text-slate-900">{item.nama_mahasiswa}</td>
                                            <td className="p-3 border-r border-slate-900 text-xs leading-relaxed italic text-slate-800">&quot;{item.judul}&quot;</td>
                                            <td className="p-3 border-r border-slate-900 text-center text-xs font-bold text-slate-900">{item.ruang || "-"}</td>
                                            <td className="p-3 border-r border-slate-900 text-center text-xs text-slate-900">
                                                {item.tanggal ? format(new Date(item.tanggal), "EEEE, dd MMMM yyyy", { locale: idLocale }) : "-"}
                                            </td>
                                            <td className="p-3 text-center text-xs font-bold text-slate-900">
                                                {item.tanggal ? format(new Date(item.tanggal), "HH:mm") : "-"}
                                            </td>
                                        </tr>
                                    );
                                });
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
