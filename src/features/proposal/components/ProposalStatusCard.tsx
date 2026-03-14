import { Proposal } from "@/types";
import { PROPOSAL_STATUS_CONFIG } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProposalStatusCardProps {
  proposal: Proposal;
}

export function ProposalStatusCard({ proposal }: ProposalStatusCardProps) {
  const statusConfig = PROPOSAL_STATUS_CONFIG[proposal.status] || {
    label: proposal.status,
    variant: "secondary" as const,
  };

  const statusColor =
    proposal.status === "REJECTED" ? "red" :
      proposal.status === "APPROVED" || proposal.status === "PLOTTED" ? "emerald" :
        "indigo";

  const StatusIcon =
    proposal.status === "REJECTED" ? XCircle :
      proposal.status === "APPROVED" || proposal.status === "PLOTTED" ? CheckCircle2 :
        proposal.status === "REVISION" ? AlertCircle :
          Clock;

  return (
    <div className={cn(
      "p-6 rounded-3xl border-l-[6px] flex gap-5 items-center bg-white shadow-sm transition-all",
      statusColor === "red" ? "border-l-red-600" : statusColor === "emerald" ? "border-l-emerald-600" : "border-l-indigo-600"
    )}>
      <div className={cn(
        "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0",
        statusColor === "red" ? "bg-red-50 text-red-600" : statusColor === "emerald" ? "bg-emerald-50 text-emerald-600" : "bg-indigo-50 text-indigo-600"
      )}>
        <StatusIcon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status Saat Ini</p>
        <h3 className="text-lg font-black text-slate-900">{statusConfig.label}</h3>
      </div>
    </div>
  );
}

interface ProposalDetailCardProps {
  proposal: Proposal;
}

export function ProposalDetailCard({ proposal }: ProposalDetailCardProps) {
  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Judul Skripsi</span>
          <h2 className="text-2xl font-black text-slate-900 leading-tight">
            &quot;{proposal.judul}&quot;
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Tema / Topik</span>
            <p className="text-slate-900 font-bold">{proposal.tema || "-"}</p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Total SKS</span>
            <p className="text-slate-900 font-bold">{proposal.sks_total} SKS</p>
          </div>
        </div>

        {proposal.status === "PLOTTED" && proposal.supervisors && proposal.supervisors.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2 block">Dosen Pembimbing</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...proposal.supervisors].sort((a, _b) => a.role === "MAIN" ? -1 : 1).map((s, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <span className="text-indigo-600 font-black text-xs">
                      {s.nama.trim().charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wide mb-0.5">
                      {s.role === "MAIN" ? "Pembimbing 1" : "Pembimbing 2"}
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">{s.nama.trim()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {proposal.status !== "PLOTTED" && proposal.nama_calon_pembimbing?.trim() && (
          <div className="pt-4 border-t border-slate-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4 block">Usulan Calon Pembimbing</span>
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-amber-50/50 border border-amber-100">
              <div className="h-12 w-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0 text-amber-600 font-black text-lg">
                {proposal.nama_calon_pembimbing.trim().charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-900 leading-none mb-1">{proposal.nama_calon_pembimbing.trim()}</p>
                <p className="text-xs text-slate-400 font-bold tracking-wider">
                  NIK: {proposal.nik_calon_pembimbing} {proposal.nidn_calon_pembimbing && ` • NIDN: ${proposal.nidn_calon_pembimbing}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {proposal.catatan && (
          <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Catatan Proses</span>
            </div>
            <p className="text-sm font-medium text-orange-950/80 leading-relaxed whitespace-pre-wrap italic">
              &quot;{proposal.catatan}&quot;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
