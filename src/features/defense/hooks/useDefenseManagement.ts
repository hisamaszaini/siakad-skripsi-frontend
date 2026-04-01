import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import { useAllDefenseQuery } from "./useDefenseQueries";

export const useDefenseManagement = (role?: "ADMIN" | "LECTURER") => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("q") || "";
  const filterStatus = searchParams.get("status") || "ALL";
  const selectedProdi = searchParams.get("prodi") || "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const sortField = searchParams.get("sortField") || "created_at";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
  const limit = Number(searchParams.get("limit")) || 10;

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateParams = useCallback((newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "ALL" || (key === "page" && value === 1)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    const queryString = params.toString();
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ q: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, search, updateParams]);

  const { data: defenseData, isLoading } = useAllDefenseQuery({
    q: search,
    status: filterStatus === "ALL" ? "" : filterStatus,
    prodi: selectedProdi === "ALL" ? "" : selectedProdi,
    page,
    limit,
    sortField,
    sortOrder,
  }, role);

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "desc" ? "asc" : "desc";
    updateParams({ sortField: field, sortOrder: newOrder });
  };

  return {
    search: searchInput,
    setSearch: setSearchInput,
    filterStatus,
    setFilterStatus: (status: string) => updateParams({ status, page: 1 }),
    selectedProdi,
    setSelectedProdi: (prodi: string) => updateParams({ prodi, page: 1 }),
    page,
    setPage: (newPage: number) => updateParams({ page: newPage }),
    sortField,
    sortOrder,
    handleSort,
    defenseData,
    isLoading,
    limit,
    setLimit: (v: number) => updateParams({ limit: v, page: 1 }),
  };
};
