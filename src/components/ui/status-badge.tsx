import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-800",
        secondary: "bg-slate-100 text-slate-600",
        success: "bg-emerald-100 text-emerald-700",
        warning: "bg-amber-100 text-amber-700",
        destructive: "bg-red-100 text-red-700",
        info: "bg-blue-100 text-blue-700",
        purple: "bg-violet-100 text-violet-700",
        pending: "bg-yellow-100 text-yellow-700",
        scheduled: "bg-blue-100 text-blue-700",
        passed: "bg-green-100 text-green-700",
        failed: "bg-red-100 text-red-700",
        revise: "bg-orange-100 text-orange-700",
        verified: "bg-emerald-100 text-emerald-700",
        rejected: "bg-red-100 text-red-700",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
  VariantProps<typeof statusVariants> {
  label: string;
}

export function StatusBadge({
  className,
  variant,
  size,
  label,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusVariants({ variant, size, className }))}
      {...props}
    >
      {label}
    </span>
  );
}

export const PROPOSAL_STATUS_CONFIG: Record<
  string,
  { label: string; variant: StatusBadgeProps["variant"] }
> = {
  SUBMITTED: { label: "Menunggu Verifikasi", variant: "pending" },
  APPROVED: { label: "Disetujui Calon Pembimbing", variant: "success" },
  PLOTTED: { label: "Pembimbing Ditetapkan", variant: "success" },
  REJECTED: { label: "Ditolak", variant: "destructive" },
  REVISION: { label: "Perlu Revisi", variant: "warning" },
};

export const GUIDANCE_STATUS_CONFIG: Record<
  string,
  { label: string; variant: StatusBadgeProps["variant"] }
> = {
  PENDING: { label: "Menunggu", variant: "pending" },
  VERIFIED: { label: "Diverifikasi", variant: "verified" },
  REJECTED: { label: "Ditolak", variant: "rejected" },
};

export const SEMPRO_STATUS_CONFIG: Record<
  string,
  { label: string; variant: StatusBadgeProps["variant"] }
> = {
  PENDING: { label: "Menunggu", variant: "pending" },
  SCHEDULED: { label: "Terjadwal", variant: "scheduled" },
  PASSED: { label: "Lulus", variant: "passed" },
  FAILED: { label: "Gagal", variant: "failed" },
  REVISE: { label: "Revisi", variant: "revise" },
};

export const DEFENSE_STATUS_CONFIG: Record<
  string,
  { label: string; variant: StatusBadgeProps["variant"] }
> = {
  PENDING: { label: "Menunggu", variant: "pending" },
  SCHEDULED: { label: "Terjadwal", variant: "scheduled" },
  PASSED: { label: "Lulus", variant: "passed" },
  FAILED: { label: "Gagal", variant: "failed" },
  REVISE: { label: "Revisi", variant: "revise" },
};
