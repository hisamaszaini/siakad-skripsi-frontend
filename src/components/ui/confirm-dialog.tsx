import {
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "danger" | "warning" | "success";
  loading?: boolean;
}

const variantConfig = {
  default: {
    icon: Info,
    iconClass: "text-blue-600 bg-blue-50 border-blue-100",
    confirmButton: "bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-200",
  },
  danger: {
    icon: AlertTriangle,
    iconClass: "text-red-500 bg-red-50 border-red-100",
    confirmButton: "bg-red-500 hover:bg-red-600 text-white shadow-xl shadow-red-200",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-500 bg-amber-50 border-amber-100",
    confirmButton: "bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-200",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-500 bg-emerald-50 border-emerald-100",
    confirmButton: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-200",
  },
};

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  variant = "default",
  loading = false,
}: ConfirmDialogProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] rounded-[2rem] p-0 border-none shadow-2xl bg-white overflow-hidden" showCloseButton={false}>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-50" />
        <DialogHeader className="p-8 pb-1">
          <div className="flex flex-col items-center text-center gap-5">
            <div
              className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center border-2 ${config.iconClass} animate-in zoom-in duration-300`}
            >
              <Icon className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl font-black text-slate-900 tracking-tight leading-tight">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <div className="mx-8 border-b border-slate-100/50" />
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-row items-center sm:justify-center gap-3 rounded-b-[2rem]">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-600 transition-all shadow-sm border-slate-200 hover:border-slate-300 hover:bg-slate-200"
          >
            {cancelText}
          </Button>
          <Button
            className={`flex-[1.5] h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-95 ${config.confirmButton}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
