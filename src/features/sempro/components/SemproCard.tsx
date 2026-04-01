import { SemproRegistration } from "@/types";
import { StatusBadge, SEMPRO_STATUS_CONFIG } from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale/id";
import { Calendar, MapPin, Clock, GraduationCap, FileText, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRegisterSemproMutation } from "../hooks/useSemproMutation";

interface SemproCardProps {
  sempro: SemproRegistration;
  showStudent?: boolean;
}

export function SemproCard({ sempro }: SemproCardProps) {
  const statusConfig = SEMPRO_STATUS_CONFIG[sempro.status] || {
    label: sempro.status,
    variant: "secondary" as const,
  };

  return (
    <Card className={cn(
      "overflow-hidden border-none shadow-xl rounded-3xl group transition-all duration-500 hover:shadow-2xl",
      sempro.status === "SCHEDULED" && "bg-gradient-to-br from-white to-indigo-50/30",
      sempro.status === "PASSED" && "bg-gradient-to-br from-white to-emerald-50/30",
    )}>
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6",
              sempro.status === "PASSED" ? "bg-emerald-100 text-emerald-600" : "bg-indigo-100 text-indigo-600"
            )}>
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Seminar Proposal</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mt-1">Status Akademik</p>
            </div>
          </div>
          <StatusBadge label={statusConfig.label} variant={statusConfig.variant} />
        </div>

        {sempro.judul && (
          <div className="mb-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm transition-colors group-hover:border-indigo-100">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Judul Penelitian</p>
            <p className="text-sm font-bold text-slate-700 leading-relaxed italic">{sempro.judul}</p>
          </div>
        )}

        {sempro.status === "SCHEDULED" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400">Tanggal</span>
                <span className="text-xs font-bold text-slate-700">
                  {sempro.tanggal ? format(new Date(sempro.tanggal), "dd MMM yyyy", { locale: idLocale }) : "-"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <Clock className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400">Waktu</span>
                <span className="text-xs font-bold text-slate-700">{sempro.jam || "-"} WIB</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                <MapPin className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400">Ruangan</span>
                <span className="text-xs font-bold text-slate-700 truncate">{sempro.ruang || "-"}</span>
              </div>
            </div>
          </div>
        )}

        {(sempro.nilai_akhir || sempro.grade) && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Hasil Evaluasi</p>
                <p className="text-2xl font-black">{sempro.grade || "-"}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Skor Akhir</p>
                <p className="text-3xl font-black text-indigo-400">{sempro.nilai_akhir || "0"}</p>
              </div>
            </div>
          </div>
        )}

        {sempro.catatan && (
          <div className="mt-6 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-amber-600 tracking-tight">Catatan Penguji</p>
              <p className="text-sm font-medium text-amber-800 leading-relaxed">{sempro.catatan}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SemproRegistrationFormProps {
  skripsiId: string;
  onSuccess?: () => void;
}

export function SemproRegistrationForm({ skripsiId, onSuccess }: SemproRegistrationFormProps) {
  const { mutateAsync: register, isPending } = useRegisterSemproMutation();

  const handleRegister = async () => {
    try {
      const formData = new FormData();
      formData.append("skripsi_id", skripsiId);
      await register(formData);
      onSuccess?.();
    } catch {
      // Error handled by mutation toast
    }
  };

  return (
    <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative group">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      <CardContent className="p-12 relative z-10 text-center space-y-8">
        <div className="h-24 w-24 rounded-[2.5rem] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 shadow-2xl">
          <FileText className="h-10 w-10 text-white" />
        </div>

        <div className="space-y-3">
          <h3 className="text-3xl font-black tracking-tight">Daftar Seminar Proposal</h3>
          <p className="text-indigo-100 font-medium max-w-sm mx-auto leading-relaxed opacity-80">
            Pastikan berkas proposal Anda sudah siap untuk dipresentasikan di hadapan tim penguji.
          </p>
        </div>

        <Button
          onClick={handleRegister}
          disabled={isPending}
          className="h-16 px-10 bg-white text-indigo-600 hover:bg-slate-900 hover:text-white rounded-2xl font-black text-lg shadow-2xl transition-all duration-500 gap-3 group/btn"
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              Daftar Sekarang
              <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-2 transition-transform" />
            </>
          )}
        </Button>

        <div className="pt-4 flex items-center justify-center gap-6 opacity-40 text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2 italic">Verifikasi Berkas</span>
          <div className="h-1 w-1 rounded-full bg-white" />
          <span className="flex items-center gap-2 italic">Penjadwalan Otomatis</span>
        </div>
      </CardContent>
    </Card>
  );
}
