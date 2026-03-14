import { useState } from "react";
import { useAllSemproQuery } from "./useSemproQueries";
import { useDebounce } from "@/hooks/use-debounce";

export const useSemproManagement = (role?: "ADMIN" | "LECTURER") => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, error } = useAllSemproQuery({
    q: debouncedSearch,
    status: filterStatus === "ALL" ? "" : filterStatus,
    page,
    limit: 10,
    sortField,
    sortOrder,
  }, role);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return {
    sempros: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    sortField,
    sortOrder,
    handleSort,
  };
};
