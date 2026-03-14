import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  action,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-3">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-300">/</span>}
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-slate-700 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-slate-900 font-medium">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}
