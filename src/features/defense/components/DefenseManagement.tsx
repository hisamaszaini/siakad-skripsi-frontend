import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, CheckCircle2, Clock, XCircle,
  AlertCircle, Calendar, ChevronLeft,
  ChevronRight, GraduationCap, LucideIcon
} from "lucide-react";
import { useDefenseManagement } from "../hooks/useDefenseManagement";
import { DefenseTable } from "./DefenseTable";
import { cn } from "@/lib/utils";
import { DefenseRegistration } from "@/types";

interface DefenseManagementProps {
  role: "ADMIN" | "LECTURER";
}

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string; value: number; icon: LucideIcon; colorClass: string }) => (
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

export function DefenseManagement({ role }: DefenseManagementProps) {
  const {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    sort,
    handleSort,
    defenseData,
    isLoading
  } = useDefenseManagement(role);

  const defenses: DefenseRegistration[] = defenseData?.data || [];
  const total = defenseData?.total || 0;
  const totalPages = defenseData?.totalPages || 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-1 w-8 bg-indigo-600 rounded-full" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
            {role === "ADMIN" ? "Sistem Informasi Skripsi" : "Panel Penguji"}
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-indigo-600" />
          Sidang Skripsi
        </h1>
        <p className="text-slate-500 italic font-medium">
          {role === "ADMIN" 
            ? "Monitor dan kelola pendaftaran serta penilaian Sidang Akhir Skripsi mahasiswa."
            : "Jadwal pengujian dan penilaian Sidang Skripsi mahasiswa."}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Sidang" value={total} icon={Clock} colorClass="from-slate-800 to-black shadow-slate-900/20" />
        <StatCard title="Terjadwal" value={defenses.filter(s => s.status === 'SCHEDULED' || s.status === 'REGISTERED').length} icon={Calendar} colorClass="from-indigo-600 to-blue-700 shadow-indigo-500/20" />
        <StatCard title="Lulus" value={defenses.filter(s => s.status === 'PASSED').length} icon={CheckCircle2} colorClass="from-emerald-500 to-teal-600 shadow-emerald-500/20" />
        <StatCard title="Revisi" value={defenses.filter(s => s.status === 'REVISE').length} icon={AlertCircle} colorClass="from-amber-500 to-orange-600 shadow-amber-500/20" />
        <StatCard title="Gagal" value={defenses.filter(s => s.status === 'FAILED').length} icon={XCircle} colorClass="from-rose-500 to-red-600 shadow-rose-500/20" />
      </div>

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
            className={`rounded-xl font-bold text-xs transition-all ${filterStatus === key ? "shadow-md bg-indigo-600" : "text-slate-600 hover:bg-white"}`}
          >
            {label}
          </Button>
        ))}
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl sm:rounded-[2rem]">
        <CardHeader className="bg-white border-b border-slate-50 pb-6 px-4 sm:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari NIM, Nama, atau Judul..."
              className="pl-10 h-11 border-slate-200 rounded-2xl focus-visible:ring-indigo-500 w-full font-medium"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DefenseTable 
            data={defenses} 
            isLoading={isLoading} 
            _sort={sort} 
            onSort={handleSort} 
            role={role} 
          />
        </CardContent>
      </Card>

      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 px-8 rounded-[2rem] shadow-sm border border-slate-50">
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
