import { useState, useMemo } from "react";
import { useThemes } from "./useTemaQueries";

export const useTemaManagement = () => {
  const [prodiFilter, setProdiFilter] = useState<string>("ALL");
  const { data: themes = [], isLoading, error } = useThemes(prodiFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const filteredAndSortedData = useMemo(() => {
    let result = [...themes];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.kode_jurusan.toLowerCase().includes(q)
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
  }, [themes, searchQuery, prodiFilter, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredAndSortedData.slice(start, start + limit);
  }, [filteredAndSortedData, page, limit]);

  const totalPages = Math.ceil(filteredAndSortedData.length / limit);

  return {
    data: paginatedData,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    prodiFilter,
    setProdiFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    setLimit,
    totalPages,
    totalItems: filteredAndSortedData.length,
  };
};
