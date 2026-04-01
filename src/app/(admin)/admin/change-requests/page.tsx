"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/ui/page-title";

export default function AdminChangeRequestsPage() {
    const [requests] = useState([
        { id: "1", nim: "20210555", nama: "Sidqi Arifin", type: "TOPIC", date: "2026-03-10", status: "PENDING" },
        { id: "2", nim: "20210088", nama: "Rizky Ramadan", type: "SUPERVISOR", date: "2026-03-09", status: "PENDING" },
    ]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <PageTitle title="Kelola Perubahan Pembimbing" />
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Permohonan Perubahan</h1>
                <p className="text-slate-500 italic">Kelola permohonan mahasiswa terkait perubahan judul, topik, atau dosen pembimbing.</p>
            </div>

            <Card className="border-none shadow-sm overflow-hidden border-l-4 border-l-amber-500">
                <CardHeader className="bg-amber-50/50 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-amber-900 text-lg">Perlu Tindakan</CardTitle>
                        <CardDescription className="text-amber-700/60">Segera tinjau permohonan berikut untuk menjaga kelancaran akademik.</CardDescription>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-amber-500 opacity-20" />
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[120px] font-black uppercase text-[10px] tracking-widest pl-8 py-5">NIM</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-5">Mahasiswa</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-5">Jenis Perubahan</TableHead>
                                <TableHead className="font-black uppercase text-[10px] tracking-widest py-5">Diterima</TableHead>
                                <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8 py-5">Opsi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((item) => (
                                <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-mono text-xs font-bold pl-8 py-5 text-slate-400">{item.nim}</TableCell>
                                    <TableCell className="py-5 font-bold text-slate-700">{item.nama}</TableCell>
                                    <TableCell className="py-5">
                                        <Badge variant="secondary" className={cn(
                                            "font-black text-[9px] tracking-widest px-3",
                                            item.type === 'TOPIC' ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-700"
                                        )}>
                                            {item.type === 'TOPIC' ? "JUDUL / TOPIK" : "DOSEN PEMBIMBING"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-5 text-sm text-slate-400 italic">{item.date}</TableCell>
                                    <TableCell className="text-right pr-8 py-5">
                                        <Link href={`/admin/change-requests/${item.id}`}>
                                            <Button size="sm" variant="ghost" className="font-bold text-indigo-600 hover:bg-indigo-50 gap-2">
                                                <FileText className="h-4 w-4" /> Tinjau Detail
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

import { cn } from "@/lib/utils";
