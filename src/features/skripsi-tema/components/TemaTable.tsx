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
import { Edit, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Theme, Prodi } from "@/types";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";

interface TemaTableProps {
  data: Theme[];
  prodiList?: Prodi[];
  onEdit: (theme: Theme) => void;
  onDelete: (id: string) => void;
  onSort: (field: string) => void;
  sortField: string;
  _sortOrder: "asc" | "desc";
}

export function TemaTable({
  data,
  prodiList = [],
  onEdit,
  onDelete,
  onSort,
  sortField,
  _sortOrder,
}: TemaTableProps) {
  return (
    <div className="min-w-[800px]">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent border-none text-slate-400">
            <TableHead className="w-[80px] h-14 font-black uppercase text-[10px] tracking-widest pl-8 transition-colors">
              No
            </TableHead>
            <TableHead
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("name")}
            >
              <div className="flex items-center gap-1">
                Nama Tema
                {sortField === "name" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead
              className="font-black uppercase text-[10px] tracking-widest cursor-pointer hover:text-indigo-600 transition-colors"
              onClick={() => onSort("kode_jurusan")}
            >
              <div className="flex items-center gap-1">
                Jurusan
                {sortField === "kode_jurusan" ? (
                  _sortOrder === "asc" ? <ArrowUp className="h-3 w-3 text-indigo-600" /> : <ArrowDown className="h-3 w-3 text-indigo-600" />
                ) : (
                  <ArrowUpDown className="h-3 w-3 opacity-30" />
                )}
              </div>
            </TableHead>
            <TableHead className="font-black uppercase text-[10px] tracking-widest">
              Dibuat Pada
            </TableHead>
            <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8">
              Aksi
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center text-slate-400 italic font-medium border-none">
                Tidak ada data tema ditemukan.
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="font-mono text-xs font-bold pl-8 py-5 text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </TableCell>
                <TableCell className="py-5 font-bold text-slate-700">
                  {item.name}
                </TableCell>
                <TableCell className="py-5 font-bold text-slate-700">
                  {prodiList.find(p => p.kode_jurusan === item.kode_jurusan)?.nama_prodi || item.kode_jurusan}
                </TableCell>
                <TableCell className="py-5 font-bold text-slate-700">
                  {format(new Date(item.created_at), "dd MMM yyyy", { locale: idLocale })}
                </TableCell>
                <TableCell className="text-right pr-8 py-5">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
