"use client";

import { useSemproManagement } from "../hooks/useSemproManagement";
import { SemproTable } from "./SemproTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Clock, CheckCircle2, Calendar, XCircle, AlertCircle, LucideIcon, Filter, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { SemproRegistration } from "@/types";
import { useProdi } from "@/features/skripsi-tema";
import { SingleSelect } from "@/components/ui/single-select";
import { ScheduleExportDialog } from "@/components/shared/schedule-export-dialog";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { useState } from "react";
import { PageTitle } from "@/components/ui/page-title";

interface SemproManagementProps {
  role?: "ADMIN" | "LECTURER";
}

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

export function SemproManagement({ role = "ADMIN" }: SemproManagementProps) {
  const {
    sempros,
    total,
    totalPages,
    isLoading,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    selectedProdi,
    setSelectedProdi,
    page,
    setPage,
    sortField,
    sortOrder,
    handleSort,
    limit,
    setLimit,
  } = useSemproManagement(role);

  const [isExportOpen, setIsExportOpen] = useState(false);
  const { data: prodiList } = useProdi();

  return (
    <>
      <PageTitle title={role === "ADMIN" ? "Penjadwalan Seminar Proposal" : "Jadwal Seminar Proposal"} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{role === "ADMIN" ? "Penjadwalan Seminar Proposal" : "Panel Penguji"}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
            {role === "ADMIN" ? "Penjadwalan Seminar Proposal" : "Jadwal Penguji Seminar Proposal"} <span className="text-indigo-600">Mahasiswa</span>
          </h1>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Pendaftar" value={total} icon={Clock} colorClass="from-slate-800 to-black shadow-slate-900/20" />
        <StatCard title="Terjadwal" value={sempros.filter((s: SemproRegistration) => s.status === 'SCHEDULED' || s.status === 'REGISTERED').length} icon={Calendar} colorClass="from-indigo-600 to-blue-700 shadow-indigo-500/20" />
        <StatCard title="Lulus" value={sempros.filter((s: SemproRegistration) => s.status === 'PASSED').length} icon={CheckCircle2} colorClass="from-emerald-500 to-teal-600 shadow-emerald-500/20" />
        <StatCard title="Revisi" value={sempros.filter((s: SemproRegistration) => s.status === 'REVISE').length} icon={AlertCircle} colorClass="from-amber-500 to-orange-600 shadow-amber-500/20" />
        <StatCard title="Gagal" value={sempros.filter((s: SemproRegistration) => s.status === 'FAILED').length} icon={XCircle} colorClass="from-rose-500 to-red-600 shadow-rose-500/20" />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Filter Tabs */}
        <FilterTabs
          tabs={[
            { key: "ALL", label: "Semua" },
            { key: "REGISTERED", label: "Terdaftar" },
            { key: "SCHEDULED", label: "Terjadwal" },
            { key: "PASSED", label: "Lulus" },
            { key: "REVISE", label: "Revisi" },
            { key: "FAILED", label: "Gagal" },
          ]}
          activeKey={filterStatus}
          onChange={setFilterStatus}
        />

        {/* Prodi Filter (Admin Only) */}
        {role === "ADMIN" && (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <Filter className="h-3 w-3" /> Filter:
            </div>
            <SingleSelect
              value={selectedProdi}
              onChange={(val) => setSelectedProdi(val || "ALL")}
              options={[
                { label: "Semua Jurusan", value: "ALL" },
                ...(prodiList || []).map((p: { nama_prodi: string; kode_jurusan: string }) => ({
                  label: p.nama_prodi,
                  value: p.kode_jurusan,
                })),
              ]}
              placeholder="Semua Jurusan"
              className="w-full md:w-64 h-12 rounded-2xl border-slate-200 bg-white shadow-sm font-bold"
            />
            <Button
              onClick={() => setIsExportOpen(true)}
              variant="outline"
              className="h-12 rounded-2xl bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm px-6 font-bold gap-2 active:scale-95 transition-all shrink-0"
            >
              <Printer className="h-4 w-4 text-indigo-600" />
              <span className="hidden sm:inline">Export Jadwal</span>
            </Button>
          </div>
        )}
      </div>

      <ScheduleExportDialog
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        type="SEMPRO"
      />

      <Card className="border-none shasw-sm overflow-hidden rounded-3xl sm:rounded-[2rem]">
        <div className="bg-white border-b border-slate-50 p-6 sm:p-8 flex items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Cari NIM, Nama, atau Judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 border-slate-200 rounded-2xl focus:border-indigo-400 focus:ring-indigo-100 bg-slate-50/30 font-medium w-full"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <p className="text-slate-400 font-bold tracking-tight animate-pulse uppercase text-[10px]">Menyelaraskan Data Seminar...</p>
            </div>
          ) : (
            <div className="overflow-x-auto scollbar-hide font-medium">
              <SemproTable
                data={sempros}
                onSort={handleSort}
                sortField={sortField}
                _sortOrder={sortOrder}
                role={role}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        totalItems={total}
        onPageChange={setPage}
        limit={limit}
        onLimitChange={setLimit}
        isLoading={isLoading}
      />
    </>
  );
}
