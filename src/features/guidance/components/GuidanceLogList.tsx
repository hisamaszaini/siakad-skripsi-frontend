import { GuidanceLog } from "@/types";
import { StatusBadge, GUIDANCE_STATUS_CONFIG } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, User, FileText, CheckCircle2, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuidanceLogListProps {
  logs: GuidanceLog[];
  showStudent?: boolean;
  showActions?: boolean;
  onVerify?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function GuidanceLogList({
  logs,
  showStudent = false,
  showActions = false,
  onVerify,
  onEdit,
}: GuidanceLogListProps) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">Belum ada log bimbingan</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VERIFIED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "REJECTED":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {logs.map((log) => {
        const statusConfig = GUIDANCE_STATUS_CONFIG[log.status] || {
          label: log.status,
          variant: "secondary",
        };

        return (
          <Card
            key={log.id}
            className={cn(
              "transition-all hover:shadow-md",
              log.status === "VERIFIED" && "border-l-4 border-l-emerald-500",
              log.status === "REJECTED" && "border-l-4 border-l-red-500",
              log.status === "PENDING" && "border-l-4 border-l-amber-500"
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(log.tanggal), "dd MMMM yyyy")}
                    </span>
                    {showStudent && log.nama_dosen && (
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {log.nama_dosen}
                        {log.role_dosen && (
                          <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full">
                            {log.role_dosen}
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500">Materi</span>
                      <p className="text-sm font-bold text-slate-900 leading-tight italic">{log.materi}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-indigo-500">Saran / Progres</span>
                      <p className="text-xs font-medium text-slate-600 leading-relaxed">{log.saran}</p>
                    </div>
                  </div>

                  {log.catatan && (
                    <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                      <strong>Catatan:</strong> {log.catatan}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <StatusBadge
                    label={statusConfig.label}
                    variant={statusConfig.variant}
                    size="sm"
                  />
                  {getStatusIcon(log.status)}
                </div>
              </div>

              {showActions && log.status === "PENDING" && (
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit?.(log.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onVerify?.(log.id)}
                  >
                    Verifikasi
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
