"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, ArrowUpDown, ArrowUp, ArrowDown, Clock, CheckCircle2, AlertCircle, XCircle, Award } from "lucide-react";
import { SemproRegistration } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SemproTableProps {
  data: SemproRegistration[];
  onSort: (field: string) => void;
  sortField: string;
  _sortOrder: "asc" | "desc";
  role?: "ADMIN" | "LECTURER";
}

const statusBadge = (status: string) => {
  switch (status) {
    case "REGISTERED":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 font-bold"><Clock className="h-3 w-3" />Terdaftar</Badge>;
    case "SCHEDULED":
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 gap-1 font-bold"><Calendar className="h-3 w-3" />Terjadwal</Badge>;
    case "PASSED":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1 font-bold"><CheckCircle2 className="h-3 w-3" />Lulus</Badge>;
    case "REVISE":
      return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1 font-bold"><AlertCircle className="h-3 w-3" />Revisi</Badge>;
    case "FAILED":
      return <Badge variant="destructive" className="gap-1 font-bold"><XCircle className="h-3 w-3" />Gagal</Badge>;
    default:
      return <Badge variant="outline" className="font-mono text-[10px] font-black">{status}</Badge>;
  }
};

export function SemproTable({
  data,
  onSort,
  sortField,
  _sortOrder,
  role = "ADMIN",
}: SemproTableProps) {
  return (
    <div className="min-w-[1000px]">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-none text-slate-400">
            <TableHead className="w-[80px] h-14 font-black uppercase text-[10px] tracking-widest pl-8 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort("created_at")}>
              <div className="flex items-center gap-1">
                No 
                {sortField === "created_at" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead className="w-[110px] h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort("nim")}>
              <div className="flex items-center gap-1">
                NIM 
                {sortField === "nim" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("mahasiswa")}
            >
              <div className="flex items-center gap-1">
                Mahasiswa 
                {sortField === "mahasiswa" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("judul")}
            >
              <div className="flex items-center gap-1">
                Judul Usulan 
                {sortField === "judul" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("status")}
            >
              <div className="flex items-center gap-1">
                Status 
                {sortField === "status" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("tanggal")}
            >
              <div className="flex items-center gap-1">
                Waktu
                {sortField === "tanggal" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest">
              Ruang
            </TableHead>
            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8 py-5">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-40 text-center text-slate-400 italic font-medium border-none">
                Belum ada data pendaftar seminar.
              </TableCell>
            </TableRow>
          ) : (
            data.map((sempro, index) => (
              <TableRow key={sempro.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="font-mono text-xs font-bold pl-8 py-5 text-slate-400">
                  {index + 1}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold py-5 text-slate-400">
                  {sempro.nim}
                </TableCell>
                <TableCell className="py-5 font-bold text-slate-700">
                  {sempro.nama_mahasiswa}
                </TableCell>
                <TableCell className="py-5 max-w-xs">
                  <p className="italic text-slate-500 text-sm truncate font-medium">{sempro.judul || "Belum ada judul"}</p>
                </TableCell>
                <TableCell className="py-5">
                  {statusBadge(sempro.status)}
                </TableCell>
                <TableCell className="py-5">
                  {sempro.tanggal ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-600">
                        {format(new Date(sempro.tanggal), "dd MMM yyyy", { locale: idLocale })}
                      </span>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tight">
                        {format(new Date(sempro.tanggal), "HH:mm")} WIB
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-300 uppercase italic">Belum Dijadwalkan</span>
                  )}
                </TableCell>
                <TableCell className="py-5">
                  {sempro.tanggal ? (
                    <span className="text-xs font-bold text-slate-700">{sempro.ruang || "-"}</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right pr-8 py-5">
                  <Link href={`/${role.toLowerCase()}/sempro/${sempro.id}`}>
                    <Button
                      size="sm"
                      variant={(role === "ADMIN" && sempro.status === "REGISTERED") || (role === "LECTURER" && sempro.status === "SCHEDULED") ? "default" : "ghost"}
                      className={cn(
                        "rounded-xl font-bold gap-2 transition-all duration-300",
                        ((role === "ADMIN" && sempro.status === "REGISTERED") || (role === "LECTURER" && sempro.status === "SCHEDULED"))
                          ? "shadow-md bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" 
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {role === "ADMIN" ? (
                        sempro.status === "REGISTERED" ? <Calendar className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                      ) : (
                        sempro.status === "SCHEDULED" ? <Award className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                      )}
                      {role === "ADMIN" ? (
                        sempro.status === "REGISTERED" ? "Jadwalkan" : "Detail"
                      ) : (
                        sempro.status === "SCHEDULED" ? "Beri Nilai" : "Detail"
                      )}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
