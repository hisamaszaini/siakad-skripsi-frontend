"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  limit?: number;
  onLimitChange?: (limit: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function DataTablePagination({
  page,
  totalPages,
  totalItems,
  onPageChange,
  limit,
  onLimitChange,
  isLoading = false,
  className,
}: DataTablePaginationProps) {
  if (isLoading) return null;

  const actualTotalPages = Math.max(1, totalPages);

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-center justify-between bg-white p-6 px-8 rounded-[2rem] shadow-sm border border-slate-50 gap-4 mt-4",
      className
    )}>
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 order-2 sm:order-1">
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center sm:text-left">
          Halaman <span className="text-indigo-600">{page}</span> dari {actualTotalPages} • <span className="font-bold text-slate-500">Total {totalItems} data</span>
        </p>

        {onLimitChange && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Per Halaman:</span>
            <Select
              value={limit?.toString() || "10"}
              onValueChange={(val) => val && onLimitChange(parseInt(val))}
            >
              <SelectTrigger className="h-8 w-16 rounded-xl border-slate-100 bg-slate-50/50 font-black text-xs focus:ring-indigo-600/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-none shadow-xl min-w-16">
                {[10, 20, 50].map((l) => (
                  <SelectItem key={l} value={l.toString()} className="font-bold text-xs">{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl font-bold gap-1 text-slate-600 border-slate-100 hover:bg-slate-50"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </Button>

        <div className="flex gap-1">
          {Array.from({ length: Math.min(5, actualTotalPages) }, (_, i) => {
            let pageNum = page;
            if (actualTotalPages <= 5) pageNum = i + 1;
            else if (page <= 3) pageNum = i + 1;
            else if (page >= actualTotalPages - 2) pageNum = actualTotalPages - 4 + i;
            else pageNum = page - 2 + i;

            if (pageNum < 1 || pageNum > actualTotalPages) return null;

            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                className={cn(
                  "w-9 h-9 rounded-xl font-black transition-all",
                  page === pageNum
                    ? "bg-indigo-600 shadow-md shadow-indigo-100"
                    : "text-slate-400 border-slate-50 font-bold"
                )}
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="rounded-xl font-bold gap-1 text-slate-600 border-slate-100 hover:bg-slate-50"
          onClick={() => onPageChange(Math.min(actualTotalPages, page + 1))}
          disabled={page === actualTotalPages || actualTotalPages === 0}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
