import { useState, useEffect, useCallback } from "react";
import { useAllProposalsQuery } from "./useProposalQueries";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export const useProposalManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("q") || "";
  const filterStatus = searchParams.get("status") || "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const sortField = searchParams.get("sortField") || "created_at";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateParams = useCallback((newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === "" ||
        (key === "status" && value === "ALL") ||
        (key === "page" && value === 1) ||
        (key === "sortField" && value === "created_at") ||
        (key === "sortOrder" && value === "desc")
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
        if (key === "limit") params.set("page", "1"); // Reset to page 1 on limit change
      }
    });

    const newQuery = params.toString();
    const currentQuery = searchParams.toString();
    if (newQuery !== currentQuery) {
      router.push(`${pathname}${newQuery ? `?${newQuery}` : ""}`);
    }
  }, [searchParams, pathname, router]);

  // Sync debounced search to URL
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ q: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, search, updateParams]);

  const { data, isLoading } = useAllProposalsQuery({
    q: search,
    status: filterStatus,
    page,
    limit,
    sortField,
    sortOrder,
  });

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "desc" ? "asc" : "desc";
    updateParams({ sortField: field, sortOrder: newOrder });
  };

  return {
    proposals: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    search: searchInput,
    setSearch: setSearchInput,
    filterStatus,
    setFilterStatus: (v: string) => updateParams({ status: v, page: 1 }),
    page,
    setPage: (v: number) => updateParams({ page: v }),
    sortField,
    sortOrder,
    limit,
    setLimit: (v: number) => updateParams({ limit: v, page: 1 }),
    handleSort,
  };
};
