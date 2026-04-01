import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { useProposalsForSupervisorQuery } from "@/features/proposal";

export const useLecturerProposals = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const search = searchParams.get("q") || "";
    const filterStatus = searchParams.get("status") || "ALL";
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const sortField = searchParams.get("sortField") || "created_at";
    const sortOrder = (searchParams.get("sortOrder") as 'asc' | 'desc') || "desc";

    const [searchInput, setSearchInput] = useState(search);
    const debouncedSearch = useDebounce(searchInput, 500);

    const updateParams = useCallback((newParams: Record<string, string | number | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === "" || (key === "status" && value === "ALL") || (key === "page" && value === 1) || (key === "limit" && value === 10)) {
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


    const { data: proposalsData, isLoading } = useProposalsForSupervisorQuery({
        q: search,
        status: filterStatus === "ALL" ? undefined : filterStatus,
        page,
        limit,
        sortField,
        sortOrder
    });

    const handleSort = (field: string) => {
        const newOrder = sortField === field && sortOrder === 'desc' ? 'asc' : 'desc';
        updateParams({ sortField: field, sortOrder: newOrder });
    };

    const setFilterStatus = (status: string) => {
        updateParams({ status, page: 1 });
    };

    const setPage = (newPage: number) => {
        updateParams({ page: newPage });
    };

    const setLimit = (newLimit: number) => {
        updateParams({ limit: newLimit, page: 1 });
    };

    return {
        search: searchInput,
        setSearch: setSearchInput,
        filterStatus,
        setFilterStatus,
        page,
        setPage,
        limit,
        setLimit,
        sortField,
        sortOrder,
        handleSort,
        proposalsData,
        isLoading
    };
};
