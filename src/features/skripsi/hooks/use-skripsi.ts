import useSWR from "swr";
import { SkripsiAPI } from "../services/skripsi.service";
import { Proposal, GuidanceLog, ChangeRequest, Theme } from "@/types/skripsi";

export function useMyThesis() {
    const { data, error, isLoading, mutate } = useSWR<Proposal>('/my-thesis', () =>
        SkripsiAPI.getMyThesis().then(res => res.data.data)
    );

    return {
        thesis: data,
        isLoading,
        isError: error,
        mutate
    };
}

export function useProposalsForSupervisor() {
    const { data, error, isLoading, mutate } = useSWR<Proposal[]>('/proposals/supervisor', () =>
        SkripsiAPI.getProposalsForSupervisor().then(res => res.data.data)
    );

    return {
        proposals: data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useAllProposals() {
    const { data, error, isLoading, mutate } = useSWR<Proposal[]>('/proposals', () =>
        SkripsiAPI.getAllProposals().then(res => res.data.data)
    );

    return {
        proposals: data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useMyGuidanceLogs() {
    const { data, error, isLoading, mutate } = useSWR<GuidanceLog[]>(
        '/my-guidance-logs',
        () => SkripsiAPI.getMyGuidanceLogs().then(res => res.data.data)
    );

    return {
        logs: data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useGuidanceLogs(thesisId?: string) {
    const { data, error, isLoading, mutate } = useSWR<GuidanceLog[]>(
        thesisId ? `/guidance-logs/${thesisId}` : null,
        () => thesisId ? SkripsiAPI.getGuidanceLogs(thesisId).then(res => res.data.data) : Promise.resolve([])
    );

    return {
        logs: data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useAllGuidanceLogsForLecturer() {
    const { data, error, isLoading, mutate } = useSWR<GuidanceLog[]>(
        '/guidance-logs',
        () => SkripsiAPI.getAllGuidanceLogsForLecturer().then(res => res.data.data)
    );

    return {
        logs: data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useChangeRequests() {
    const { data, error, isLoading, mutate } = useSWR<ChangeRequest[]>('/change-requests', () =>
        SkripsiAPI.getAllChangeRequests().then(res => res.data.data)
    );

    return {
        requests: data || [],
        isLoading,
        isError: error,
        mutate
    };
}

export function useThemes() {
    const { data, error, isLoading, mutate } = useSWR<Theme[]>('/themes', () =>
        SkripsiAPI.getThemes().then(res => res.data.data)
    );

    return {
        themes: data || [],
        isLoading,
        isError: error,
        mutate
    };
}
