import { useState, useMemo, useEffect, useCallback } from "react";
import { useThemes } from "./useTemaQueries";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";

export const useTemaManagement = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // URL States
  const search = searchParams.get("q") || "";
  const prodiFilter = searchParams.get("prodi") || "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const sortField = searchParams.get("sortField") || "name";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
  const limit = Number(searchParams.get("limit")) || 10;

  // Local state for immediate search input feedback
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateParams = useCallback((newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === "" ||
        (key === "prodi" && value === "ALL") ||
        (key === "page" && value === 1) ||
        (key === "sortField" && value === "name") ||
        (key === "sortOrder" && value === "asc")
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
        if (key === "limit") params.set("page", "1"); // Reset to page 1 on limit change
      }
    });

    // Avoid pushing if params haven't changed meaningfully
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

  const { data: themes = [], isLoading, error } = useThemes(prodiFilter);

  const filteredAndSortedData = useMemo(() => {
    let result = [...themes];

    // Search (using the URL search state to keep it consistent with the table data)
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.kode_jurusan.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      const valA = a[sortField as keyof typeof a] || "";
      const valB = b[sortField as keyof typeof b] || "";

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [themes, search, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAndSortedData.slice(start, start + limit);
  }, [filteredAndSortedData, page, limit]);

  const totalPages = Math.ceil(filteredAndSortedData.length / limit);

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    updateParams({ sortField: field, sortOrder: newOrder });
  };

  return {
    data: paginatedData,
    isLoading,
    error,
    searchQuery: searchInput, // Using local input for responsive typing
    setSearchQuery: setSearchInput,
    prodiFilter,
    setProdiFilter: (v: string) => updateParams({ prodi: v, page: 1 }),
    sortField,
    setSortField: (v: string) => updateParams({ sortField: v }),
    sortOrder,
    setSortOrder: (v: "asc" | "desc") => updateParams({ sortOrder: v }),
    page,
    setPage: (v: number) => updateParams({ page: v }),
    limit,
    setLimit: (v: number) => updateParams({ limit: v, page: 1 }),
    totalPages,
    totalItems: filteredAndSortedData.length,
    handleSort,
  };
};
