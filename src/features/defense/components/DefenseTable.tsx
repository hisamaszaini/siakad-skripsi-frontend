import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye, CheckCircle2, Clock, XCircle,
  AlertCircle, Calendar, Loader2, ArrowUpDown, ArrowUp, ArrowDown, Award
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { DefenseRegistration } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface DefenseTableProps {
  data: DefenseRegistration[];
  isLoading: boolean;
  sortField: string;
  sortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  role: "ADMIN" | "LECTURER";
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
      return <Badge variant="outline" className="font-mono text-xs font-bold">{status}</Badge>;
  }
};

export function DefenseTable({ data, isLoading, sortField, sortOrder, onSort, role }: DefenseTableProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="min-w-[1000px]">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-none text-slate-400">
              <TableHead className="w-[80px] h-14 font-black uppercase text-[10px] tracking-widest pl-8 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('created_at')}>
                <div className="flex items-center gap-1">
                  No
                  {sortField === 'created_at' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[110px] h-14 font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('nim')}>
                <div className="flex items-center gap-1">
                  NIM
                  {sortField === 'nim' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('mahasiswa')}>
                <div className="flex items-center gap-1">
                  Mahasiswa
                  {sortField === 'mahasiswa' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('judul')}>
                <div className="flex items-center gap-1">
                  Judul Skripsi
                  {sortField === 'judul' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Waktu</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest">Ruang</TableHead>
              <TableHead className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => onSort('status')}>
                <div className="flex items-center gap-1">
                  Status
                  {sortField === 'status' ? (
                    sortOrder === 'asc' ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                  ) : (
                    <ArrowUpDown className="h-3 w-3 opacity-30" />
                  )}
                </div>
              </TableHead>
              <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="h-72 text-center border-none">
                  <div className="flex flex-col items-center gap-2 justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-sm text-slate-400 animate-pulse font-bold tracking-tight">Menyelaraskan Data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length > 0 ? data.map((item, index) => (
              <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="font-mono text-xs font-bold pl-8 py-5 text-slate-500">{index + 1}</TableCell>
                <TableCell className="font-mono text-xs font-bold py-5 text-slate-500">{item.nim}</TableCell>
                <TableCell className="font-bold text-slate-700 py-5">{item.nama_mahasiswa}</TableCell>
                <TableCell className="max-w-xs py-5">
                  <p className="italic text-slate-500 text-sm truncate font-medium">{item.judul || "Belum ada judul"}</p>
                </TableCell>
                <TableCell className="py-5">
                  {item.tanggal ? (
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-600">
                        {format(new Date(item.tanggal), "dd MMM yyyy", { locale: idLocale })}
                      </span>
                      <span className="text-xs font-black text-indigo-500 uppercase tracking-tight">
                        {format(new Date(item.tanggal), "HH:mm")} WIB
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-slate-300 uppercase italic">Belum Dijadwalkan</span>
                  )}
                </TableCell>
                <TableCell className="py-5">
                  {item.tanggal ? (
                    <span className="text-xs font-bold text-slate-700">{item.ruang || "-"}</span>
                  ) : (
                    <span className="text-xs font-bold text-slate-300">-</span>
                  )}
                </TableCell>
                <TableCell className="py-5">{statusBadge(item.status)}</TableCell>
                <TableCell className="text-right pr-8 py-5">
                  <Link href={`/${role.toLowerCase()}/defense/${item.id}`}>
                    <Button
                      size="sm"
                      variant={(role === "ADMIN" && item.status === "REGISTERED") || (role === "LECTURER" && item.status === "SCHEDULED") ? "default" : "ghost"}
                      className={cn(
                        "rounded-xl font-bold gap-2 transition-all duration-300",
                        ((role === "ADMIN" && item.status === "REGISTERED") || (role === "LECTURER" && item.status === "SCHEDULED"))
                          ? "shadow-md bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {role === "ADMIN" ? (
                        item.status === "REGISTERED" ? <Calendar className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                      ) : (
                        item.status === "SCHEDULED" ? <Award className="h-4 w-4" /> : <Eye className="h-4 w-4" />
                      )}
                      {role === "ADMIN" ? (
                        item.status === "REGISTERED" ? "Jadwalkan" : "Detail"
                      ) : (
                        item.status === "SCHEDULED" ? "Beri Nilai" : "Detail"
                      )}
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-slate-400 italic font-medium">
                  Belum ada data pendaftar sidang.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
