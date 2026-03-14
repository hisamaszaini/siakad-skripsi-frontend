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
  DialogFooter,
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
    iconClass: "text-blue-600 bg-blue-100",
    confirmButton: "bg-slate-900 hover:bg-slate-800",
  },
  danger: {
    icon: AlertTriangle,
    iconClass: "text-red-600 bg-red-100",
    confirmButton: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    icon: AlertTriangle,
    iconClass: "text-amber-600 bg-amber-100",
    confirmButton: "bg-amber-600 hover:bg-amber-700",
  },
  success: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 bg-emerald-100",
    confirmButton: "bg-emerald-600 hover:bg-emerald-700",
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center ${config.iconClass}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            className={config.confirmButton}
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
