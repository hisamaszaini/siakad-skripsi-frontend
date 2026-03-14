import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useAllDefenseQuery } from "./useDefenseQueries";

export const useDefenseManagement = (role?: "ADMIN" | "LECTURER") => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ field: string; order: "asc" | "desc" }>({
    field: "created_at",
    order: "desc",
  });
  
  const { data: defenseData, isLoading } = useAllDefenseQuery({
    q: debouncedSearch,
    status: filterStatus === "ALL" ? "" : filterStatus,
    page,
    limit: 10,
    sortField: sort.field,
    sortOrder: sort.order,
  }, role);

  const handleSort = (field: string) => {
    setSort((prev) => ({
      field,
      order: prev.field === field && prev.order === "desc" ? "asc" : "desc",
    }));
  };

  return {
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    sort,
    handleSort,
    defenseData,
    isLoading,
  };
};
