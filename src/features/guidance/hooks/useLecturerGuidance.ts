import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import { 
  VerifyGuidanceSchema, VerifyGuidanceFormData,
  GuidanceLogSchema, GuidanceLogFormData 
} from "@/schemas";
import { 
  useAllGuidanceLogsQuery, 
  useVerifyGuidanceLogMutation, 
  useEditGuidanceLogMutation, 
  useAccSemproMutation, 
  useAccSidangMutation 
} from "../index"; // Assuming these are exported from index

export const useLecturerGuidance = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const search = searchParams.get("q") || "";
  const filterStatus = searchParams.get("status") || "ALL";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const sortField = searchParams.get("sortField") || "tanggal";
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 500);

  const updateParams = useCallback((newParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === "ALL" || (key === "page" && value === 1) || (key === "limit" && value === 10)) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  useEffect(() => {
    if (debouncedSearch !== search) {
      updateParams({ q: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, search, updateParams]);


  const { data: logsData, isLoading } = useAllGuidanceLogsQuery({
    q: search,
    status: filterStatus !== "ALL" ? filterStatus : undefined,
    page,
    limit,
    sortField,
    sortOrder,
  });

  const handleSort = (field: string) => {
    const newOrder = sortField === field && sortOrder === "desc" ? "asc" : "desc";
    updateParams({ sortField: field, sortOrder: newOrder });
  };

  // Verification Form
  const verifyForm = useForm<VerifyGuidanceFormData>({
    resolver: zodResolver(VerifyGuidanceSchema),
    defaultValues: {
      status: "VERIFIED",
      catatan: "",
    },
  });

  // Edit Form
  const editForm = useForm<GuidanceLogFormData>({
    resolver: zodResolver(GuidanceLogSchema),
    defaultValues: {
      tanggal: "",
      materi: "",
      saran: "",
      dosen_id: "",
    },
  });

  const { mutate: verifyLog, isPending: isVerifying } = useVerifyGuidanceLogMutation();
  const { mutate: editLog, isPending: isEditing } = useEditGuidanceLogMutation();
  const { mutate: accSempro, isPending: isAccSemproPending } = useAccSemproMutation();
  const { mutate: accSidang, isPending: isAccSidangPending } = useAccSidangMutation();

  return {
    // State
    search: searchInput,
    setSearch: setSearchInput,
    filterStatus,
    setFilterStatus: (status: string) => updateParams({ status, page: 1 }),
    page,
    setPage: (newPage: number) => updateParams({ page: newPage }),
    limit,
    setLimit: (newLimit: number) => updateParams({ limit: newLimit, page: 1 }),
    sortField,
    sortOrder,
    handleSort,
    logsData,
    isLoading,
    
    // Forms
    verifyForm,
    editForm,
    
    // Mutations
    verifyLog,
    isVerifying,
    editLog,
    isEditing,
    accSempro,
    isAccSemproPending,
    accSidang,
    isAccSidangPending,
  };
};
