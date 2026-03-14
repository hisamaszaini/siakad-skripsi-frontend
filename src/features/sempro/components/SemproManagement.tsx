"use client";

import { useSemproManagement } from "../hooks/useSemproManagement";
import { SemproTable } from "./SemproTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, FileText, Clock, CheckCircle2, Calendar, XCircle, AlertCircle, ChevronLeft, ChevronRight, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SemproRegistration } from "@/types";

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
    page,
    setPage,
    sortField,
    sortOrder,
    handleSort,
  } = useSemproManagement(role);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <FileText className="h-8 w-8 text-indigo-600" />
          {role === "ADMIN" ? "Penjadwalan Seminar Proposal" : "Seminar Proposal"}
        </h1>
        <p className="text-slate-500 italic font-medium">
          {role === "ADMIN"
            ? "Monitor dan kelola pendaftaran serta penilaian Seminar Proposal mahasiswa."
            : "Daftar pengujian dan penilaian Seminar Proposal mahasiswa."}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Pendaftar" value={total} icon={Clock} colorClass="from-slate-800 to-black shadow-slate-900/20" />
        <StatCard title="Terjadwal" value={sempros.filter((s: SemproRegistration) => s.status === 'SCHEDULED' || s.status === 'REGISTERED').length} icon={Calendar} colorClass="from-indigo-600 to-blue-700 shadow-indigo-500/20" />
        <StatCard title="Lulus" value={sempros.filter((s: SemproRegistration) => s.status === 'PASSED').length} icon={CheckCircle2} colorClass="from-emerald-500 to-teal-600 shadow-emerald-500/20" />
        <StatCard title="Revisi" value={sempros.filter((s: SemproRegistration) => s.status === 'REVISE').length} icon={AlertCircle} colorClass="from-amber-500 to-orange-600 shadow-amber-500/20" />
        <StatCard title="Gagal" value={sempros.filter((s: SemproRegistration) => s.status === 'FAILED').length} icon={XCircle} colorClass="from-rose-500 to-red-600 shadow-rose-500/20" />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 flex-wrap bg-slate-100/50 p-2 rounded-2xl w-fit">
        {[
          { key: "ALL", label: "Semua" },
          { key: "REGISTERED", label: "Terdaftar" },
          { key: "SCHEDULED", label: "Terjadwal" },
          { key: "PASSED", label: "Lulus" },
          { key: "REVISE", label: "Revisi" },
          { key: "FAILED", label: "Gagal" },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filterStatus === key ? "default" : "ghost"}
            size="sm"
            onClick={() => { setFilterStatus(key); setPage(1); }}
            className={cn(
              "rounded-xl font-bold text-xs transition-all",
              filterStatus === key
                ? "shadow-md bg-indigo-600 hover:bg-indigo-700 text-white"
                : "text-slate-600 hover:bg-white"
            )}
          >
            {label}
          </Button>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl sm:rounded-[2rem]">
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
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100/50 hidden sm:block">
            Total Temuan: <span className="text-indigo-600">{total}</span>
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

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 px-8 rounded-[2rem] shadow-sm border border-slate-50 font-medium">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
            Halaman <span className="text-indigo-600">{page}</span> dari {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-bold gap-1 text-slate-600 border-slate-100"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = page;
                if (page <= 3) pageNum = i + 1;
                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = page - 2 + i;

                if (pageNum < 1 || pageNum > totalPages) return null;

                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "w-9 h-9 rounded-xl font-black transition-all",
                      page === pageNum ? "bg-indigo-600 shadow-md shadow-indigo-100" : "text-slate-400 border-slate-50 font-bold"
                    )}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl font-bold gap-1 text-slate-600 border-slate-100"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
