"use client";

import { useTemaManagement } from "../hooks/useTemaManagement";
import { useTemaModal } from "../hooks/useTemaModal";
import { useDeleteTheme } from "../hooks/useTemaMutation";
import { useProdi } from "../hooks/useTemaQueries";
import { TemaTable } from "./TemaTable";
import { TemaModal } from "./TemaModal";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Loader2, GraduationCap, FileText, LucideIcon } from "lucide-react";
import { SingleSelect } from "@/components/ui/single-select";
import {
  ConfirmDialog,
} from "@/components/ui/confirm-dialog";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: number, icon: LucideIcon, colorClass: string }) => (
  <Card className="border-none shadow-2xl rounded-[2rem] overflow-hidden relative text-white group h-32">
    <div className={cn("absolute inset-0 bg-gradient-to-br group-hover:scale-110 transition-transform duration-700", colorClass)} />
    <CardContent className="p-6 relative z-10 flex items-center justify-between h-full">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{title}</p>
        <p className="text-3xl font-black tracking-tighter">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:rotate-12 transition-transform duration-500">
        <Icon className="h-6 w-6 text-white" />
      </div>
    </CardContent>
  </Card>
);

export function TemaManagement() {
  const {
    data,
    isLoading,
    searchQuery,
    setSearchQuery,
    prodiFilter,
    setProdiFilter,
    sortField,
    sortOrder,
    totalItems,
    page,
    setPage,
    totalPages,
    handleSort,
    limit,
    setLimit,
  } = useTemaManagement();

  const { onOpen } = useTemaModal();
  const { data: prodiList = [] } = useProdi();
  const deleteMutation = useDeleteTheme();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (deleteConfirmId) {
      await deleteMutation.mutateAsync(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1 w-8 bg-indigo-600 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Manajemen Tema Skripsi</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
              Manajemen <span className="text-indigo-600">Tema Skripsi</span>
            </h1>
          </div>
        </div>
        <Button
          onClick={() => onOpen("CREATE")}
          className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 rounded-2xl h-12 px-6 font-bold transition-all active:scale-95 gap-2"
        >
          <Plus className="h-5 w-5" /> Tambah Tema
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-4xl">
        <StatCard title="Total Tema" value={totalItems} icon={FileText} colorClass="from-slate-800 to-black shadow-slate-900/20" />
        <StatCard title="Jurusan" value={prodiList.length} icon={GraduationCap} colorClass="from-indigo-600 to-blue-700 shadow-indigo-500/20" />
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl sm:rounded-[2rem]">
        <div className="bg-white border-b border-slate-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Cari tema atau kode jurusan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 border-slate-200 rounded-2xl focus:border-indigo-400 focus:ring-indigo-100 bg-slate-50/30 font-medium"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <Filter className="h-3 w-3" /> Filter:
            </div>
            <SingleSelect
              value={prodiFilter}
              onChange={(v) => setProdiFilter(v || "ALL")}
              options={[
                { label: "Semua Jurusan", value: "ALL" },
                ...prodiList.map((p) => ({
                  label: p.nama_prodi,
                  value: p.kode_jurusan,
                })),
              ]}
              placeholder="Semua Jurusan"
              className="w-full md:w-64 h-12 rounded-2xl border-slate-200 bg-slate-50/30 shadow-sm font-bold"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <p className="text-slate-400 font-bold tracking-tight animate-pulse uppercase text-[10px]">Menyelaraskan Data Tema...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TemaTable
                data={data}
                prodiList={prodiList}
                onEdit={(theme) => onOpen("UPDATE", theme.id)}
                onDelete={(id) => setDeleteConfirmId(id)}
                onSort={handleSort}
                sortField={sortField}
                _sortOrder={sortOrder}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
        isLoading={isLoading}
      />

      <TemaModal />

      <ConfirmDialog
        open={!!deleteConfirmId}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Hapus Tema"
        description="Apakah Anda yakin ingin menghapus tema ini? Tindakan ini tidak dapat dibatalkan."
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
