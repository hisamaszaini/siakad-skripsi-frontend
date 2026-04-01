import { useProposalManagement } from "../hooks/useProposalManagement";
import { ProposalTable } from "./ProposalTable";
import { Input } from "@/components/ui/input";
import { Search, Loader2, Briefcase, Clock, CheckCircle2, UserCheck, LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { cn } from "@/lib/utils";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { Proposal } from "@/types";

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

export function ProposalManagement() {
  const {
    proposals,
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
    limit,
    setLimit,
  } = useProposalManagement();

  const typedProposals = proposals as Proposal[];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500 pb-12">
      <div className="flex flex-col gap-2">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Manajemen Usulan Skripsi</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
            Manajemen <span className="text-indigo-600">Usulan Skripsi</span>
          </h1>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Usulan" value={total} icon={Briefcase} colorClass="from-slate-800 to-black shadow-slate-900/20" />
        <StatCard title="Menunggu" value={typedProposals.filter(p => p.status === 'SUBMITTED').length} icon={Clock} colorClass="from-amber-600 to-orange-700 shadow-amber-500/20" />
        <StatCard title="Siap Plotting" value={typedProposals.filter(p => p.status === 'APPROVED').length} icon={UserCheck} colorClass="from-indigo-600 to-blue-700 shadow-indigo-500/20" />
        <StatCard title="Selesai" value={typedProposals.filter(p => p.status === 'FINISHED').length} icon={CheckCircle2} colorClass="from-emerald-500 to-teal-600 shadow-emerald-500/20" />
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Status Filter Tabs */}
        <FilterTabs
          tabs={[
            { key: "ALL", label: "Semua" },
            { key: "SUBMITTED", label: "Baru" },
            { key: "APPROVED", label: "Siap Plotting" },
            { key: "PLOTTED", label: "Bimbingan" },
            { key: "SEMPRO", label: "Sempro" },
            { key: "SKRIPSI", label: "Skripsi" },
            { key: "SIDANG", label: "Sidang" },
            { key: "FINISHED", label: "Lulus" },
            { key: "REJECTED", label: "Ditolak" },
          ]}
          activeKey={filterStatus}
          onChange={setFilterStatus}
        />
      </div>

      <Card className="border-none shadow-sm overflow-hidden rounded-3xl sm:rounded-[2rem]">
        <div className="bg-white border-b border-slate-50 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <Input
              placeholder="Cari nama, NIM, atau judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 border-slate-200 rounded-2xl focus:border-indigo-400 focus:ring-indigo-100 bg-slate-50/30 font-medium"
            />
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
              <p className="text-slate-400 font-bold tracking-tight animate-pulse uppercase text-[10px]">Menyelaraskan Data Usulan...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ProposalTable
                data={proposals}
                onSort={handleSort}
                sortField={sortField}
                _sortOrder={sortOrder}
                page={page}
                limit={limit}
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
    </div>
  );
}
