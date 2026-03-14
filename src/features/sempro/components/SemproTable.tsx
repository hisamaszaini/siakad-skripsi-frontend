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
import { Eye, Calendar, ArrowUpDown, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
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
            <TableHead className="w-[110px] h-14 font-black uppercase text-[10px] tracking-widest pl-8 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort("nim")}>
              <div className="flex items-center gap-1">
                NIM 
                <ArrowUpDown className={cn("h-3 w-3 transition-opacity", sortField === "nim" ? "opacity-100" : "opacity-30")} />
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("mahasiswa")}
            >
              <div className="flex items-center gap-1">
                Mahasiswa 
                <ArrowUpDown className={cn("h-3 w-3 transition-opacity", sortField === "mahasiswa" ? "opacity-100" : "opacity-30")} />
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("judul")}
            >
              <div className="flex items-center gap-1">
                Judul Usulan 
                <ArrowUpDown className={cn("h-3 w-3 transition-opacity", sortField === "judul" ? "opacity-100" : "opacity-30")} />
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("status")}
            >
              <div className="flex items-center gap-1">
                Status 
                <ArrowUpDown className={cn("h-3 w-3 transition-opacity", sortField === "status" ? "opacity-100" : "opacity-30")} />
              </div>
            </TableHead>
            <TableHead 
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-1">
                Terdaftar 
                <ArrowUpDown className={cn("h-3 w-3 transition-opacity", sortField === "created_at" ? "opacity-100" : "opacity-30")} />
              </div>
            </TableHead>
            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8 py-5">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-40 text-center text-slate-400 italic font-medium border-none">
                Belum ada data pendaftar seminar.
              </TableCell>
            </TableRow>
          ) : (
            data.map((sempro) => (
              <TableRow key={sempro.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="font-mono text-xs font-bold pl-8 py-5 text-slate-400">
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
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" />
                    {format(new Date(sempro.created_at), "dd MMM yyyy", { locale: idLocale })}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8 py-5">
                  <Link href={`/${role.toLowerCase()}/sempro/${sempro.id}`}>
                    <Button
                      size="sm"
                      variant={sempro.status === "REGISTERED" ? "default" : "ghost"}
                      className={cn(
                        "rounded-xl font-bold gap-2 transition-all duration-300",
                        sempro.status === "REGISTERED" 
                          ? "shadow-md bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" 
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {sempro.status === "REGISTERED" ? <Calendar className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {sempro.status === "REGISTERED" ? "Jadwalkan" : "Detail"}
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
