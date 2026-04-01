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
import { Eye, UserCheck, ArrowUpDown, ArrowUp, ArrowDown, Clock, CheckCircle2, AlertCircle, XCircle, FileText, Briefcase, GraduationCap } from "lucide-react";
import { Proposal, ProposalStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ProposalTableProps {
  data: Proposal[];
  onSort: (field: string) => void;
  sortField: string;
  _sortOrder: "asc" | "desc";
  page?: number;
  limit?: number;
}

const statusBadge = (status: ProposalStatus) => {
  switch (status) {
    case "SUBMITTED":
      return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 gap-1 font-bold"><Clock className="h-3 w-3" />Menunggu Dosen</Badge>;
    case "REVISION":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 gap-1 font-bold"><AlertCircle className="h-3 w-3" />Perlu Revisi</Badge>;
    case "APPROVED":
      return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 gap-1 font-bold"><CheckCircle2 className="h-3 w-3" />Siap Plotting</Badge>;
    case "PLOTTED":
      return <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 gap-1 font-bold"><UserCheck className="h-3 w-3" />Pembimbing Ditetapkan</Badge>;
    case "SEMPRO":
      return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 gap-1 font-bold"><FileText className="h-3 w-3" />Seminar Proposal</Badge>;
    case "SKRIPSI":
      return <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1 font-bold"><Briefcase className="h-3 w-3" />Pengerjaan Skripsi</Badge>;
    case "SIDANG":
      return <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 gap-1 font-bold"><GraduationCap className="h-3 w-3" />Sidang Akhir</Badge>;
    case "FINISHED":
      return <Badge className="bg-green-600 text-white hover:bg-green-700 gap-1 font-bold"><CheckCircle2 className="h-3 w-3" />Selesai</Badge>;
    case "REJECTED":
      return <Badge variant="destructive" className="gap-1 font-bold"><XCircle className="h-3 w-3" />Ditolak</Badge>;
    default:
      return <Badge variant="outline" className="font-mono text-[10px] font-black">{status}</Badge>;
  }
};

export function ProposalTable({
  data,
  onSort,
  sortField,
  _sortOrder,
  page,
  limit,
}: ProposalTableProps) {
  return (
    <div className="min-w-[1000px]">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-none text-slate-400">
            <TableHead className="w-[60px] font-black uppercase text-[10px] tracking-widest pl-8 text-center">
              No
            </TableHead>
            <TableHead className="w-[120px] h-14 font-black uppercase text-[10px] tracking-widest">
              NIM
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
            <TableHead className="font-black uppercase text-[10px] tracking-widest py-5">
              Judul Skripsi
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
              onClick={() => onSort("created_at")}
            >
              <div className="flex items-center gap-1">
                Tanggal 
                {sortField === "created_at" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
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
              <TableCell colSpan={7} className="h-40 text-center text-slate-400 italic font-medium border-none">
                Belum ada data usulan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((proposal, index) => (
              <TableRow key={proposal.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="pl-8 py-5 text-center font-bold text-slate-400 text-xs">
                  {page && limit ? (page - 1) * limit + index + 1 : index + 1}
                </TableCell>
                <TableCell className="font-mono text-xs font-bold py-5 text-slate-400">
                  {proposal.nim}
                </TableCell>
                <TableCell className="py-5 font-bold text-slate-700">
                  {proposal.nama_mahasiswa}
                </TableCell>
                <TableCell className="py-5 max-w-xs">
                  <p className="italic text-slate-500 text-sm truncate font-medium">{proposal.judul}</p>
                </TableCell>
                <TableCell className="py-5">
                  {statusBadge(proposal.status as ProposalStatus)}
                </TableCell>
                <TableCell className="py-5">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                    <Clock className="h-3 w-3" />
                    {format(new Date(proposal.created_at), "dd MMM yyyy", { locale: idLocale })}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8 py-5">
                  <Link href={`/admin/proposals/${proposal.id}`}>
                    <Button
                      size="sm"
                      variant={proposal.status === "APPROVED" ? "default" : "ghost"}
                      className={cn(
                        "rounded-xl font-bold gap-2 transition-all duration-300",
                        proposal.status === "APPROVED" 
                          ? "shadow-md bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100" 
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {proposal.status === "APPROVED" ? <UserCheck className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {proposal.status === "APPROVED" ? "Plotting" : "Detail"}
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
