import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface DataCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function DataCard({
  title,
  description,
  icon: Icon,
  children,
  className,
  action,
}: DataCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden",
        className
      )}
    >
      {(title || action) && (
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
            )}
            <div>
              {title && (
                <h3 className="font-semibold text-slate-900">{title}</h3>
              )}
              {description && (
                <p className="text-sm text-slate-500">{description}</p>
              )}
            </div>
          </div>
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-slate-100 p-6",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
      </div>
    </div>
  );
}
