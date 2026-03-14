import { useState } from "react";
import { useAllProposalsQuery } from "./useProposalQueries";
import { useDebounce } from "@/hooks/use-debounce";

export const useProposalManagement = () => {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useAllProposalsQuery({
    q: debouncedSearch,
    status: filterStatus,
    page,
    limit: 10,
    sortField,
    sortOrder,
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  return {
    proposals: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
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
