import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/v1';

// Setup axios instance with interceptor for token
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const cookies = document.cookie.split('; ');
        const tokenCookie = cookies.find(row => row.startsWith('auth_token='));
        const token = tokenCookie ? tokenCookie.split('=')[1] : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const SkripsiAPI = {
    // Proposal
    submitProposal: (data: Record<string, unknown>) => api.post('/skripsi/usulan', data),
    getMyThesis: () => api.get('/skripsi/skripsi-saya'),
    getProposalsForSupervisor: () => api.get('/skripsi/usulan/pembimbing'),
    getAllProposals: () => api.get('/skripsi/usulan'),
    getProposalById: (id: string) => api.get(`/skripsi/usulan/${id}`),
    verifyProposal: (id: string, data: { status: string; catatan?: string }) => api.post(`/skripsi/usulan/${id}/verifikasi`, data),
    assignSupervisors: (id: string, data: { pembimbing_1_id: string; pembimbing_2_id?: string }) => api.post(`/skripsi/usulan/${id}/plotting`, data),
    
    // Guidance
    submitGuidanceLog: (data: Record<string, unknown>) => api.post('/bimbingan/log-saya', data),
    getMyGuidanceLogs: () => api.get('/bimbingan/log-saya'),
    getGuidanceLogs: (skripsiId: string) => api.get(`/bimbingan/log-bimbingan/${skripsiId}`),
    getAllGuidanceLogsForLecturer: () => api.get('/bimbingan/log-bimbingan'),
    verifyGuidanceLog: (id: string, data: { status: string; catatan?: string }) => api.put(`/bimbingan/log-bimbingan/${id}/verifikasi`, data),
    editGuidanceLog: (id: string, data: Record<string, unknown>) => api.put(`/bimbingan/log-bimbingan/${id}`, data),
    accSempro: (id: string) => api.post(`/bimbingan/persetujuan-sempro/${id}`),
    accSidang: (id: string) => api.post(`/bimbingan/persetujuan-sidang/${id}`),

    // Sempro
    registerSempro: (data: Record<string, unknown>) => api.post('/sempro/daftar', data),
    getMySempro: () => api.get('/sempro/saya'),
    listSempro: () => api.get('/sempro/daftar-peserta'),
    scheduleSempro: (id: string, data: Record<string, unknown>) => api.put(`/sempro/${id}/jadwal`, data),
    evaluateSempro: (id: string, data: Record<string, unknown>) => api.put(`/sempro/${id}/penilaian`, data),

    // Sidang
    registerSidang: (data: Record<string, unknown>) => api.post('/sidang/daftar', data),
    getMySidang: () => api.get('/sidang/saya'),
    listSidang: () => api.get('/sidang/daftar-peserta'),
    scheduleSidang: (id: string, data: Record<string, unknown>) => api.put(`/sidang/${id}/jadwal`, data),
    evaluateSidang: (id: string, data: Record<string, unknown>) => api.put(`/sidang/${id}/penilaian`, data),

    // Helpers
    searchLecturers: (q: string) => api.get('/skripsi/dosen', { params: { q } }),
    getThemes: (mhsId?: string) => api.get('/skripsi-tema', { params: { mhsId } }),
    getAllChangeRequests: () => api.get('/change-requests'),
};
