
export interface Theme {
    id: string;
    name: string;
}

export interface User {
    id: string;
    nim?: string;
    nidn?: string;
    nama: string;
    role: 'STUDENT' | 'LECTURER' | 'PRODI';
}

export type ProposalStatus =
    | 'SUBMITTED'
    | 'REVISION'
    | 'APPROVED'
    | 'PLOTTED'
    | 'SEMPRO'
    | 'SKRIPSI'
    | 'SIDANG'
    | 'FINISHED'
    | 'REJECTED';

export interface Proposal {
    id: string;
    mhs_id: string;
    judul: string;
    tema: string | null;
    status: ProposalStatus;
    pembimbing_usulan_id?: string | null;
    pembimbing1_id?: string | null;
    pembimbing2_id?: string | null;
    sks_total: number;
    catatan?: string | null;
    created_at: string;
    updated_at: string;
    // joined fields from repository queries
    nim?: string;
    nama_mahasiswa?: string;
    nama_calon_pembimbing?: string | null;
    nik_calon_pembimbing?: string | null;
    nidn_calon_pembimbing?: string | null;
    nama_pembimbing1?: string;
    nama_pembimbing2?: string;
    supervisors?: Array<{
        dosen_id: string;
        nama: string;
        role: 'MAIN' | 'CO';
        status: string;
    }>;
}

export interface GuidanceLog {
    id: string;
    skripsi_id: string;
    dosen_id: string;
    tanggal: string;
    materi: string;
    saran: string;
    status: 'PENDING' | 'VERIFIED' | 'REJECTED';
    catatan: string | null;
    created_at: string;
    updated_at: string;
    nama_dosen?: string;
    role_dosen?: string;
}

export interface SemproRegistration {
    id: string;
    thesisId: string;
    status: 'PENDING' | 'SCHEDULED' | 'PASSED' | 'FAILED' | 'REVISE';
    date?: string;
    time?: string;
    location?: string;
    examiners: string[];
    grade?: number;
    notes?: string;
}

export interface DefenseRegistration {
    id: string;
    thesisId: string;
    status: 'PENDING' | 'SCHEDULED' | 'PASSED' | 'FAILED' | 'REVISE';
    date?: string;
    time?: string;
    location?: string;
    examiners: string[];
    grade?: number;
    notes?: string;
}

export interface ChangeRequest {
    id: string;
    thesisId: string;
    type: 'TOPIC' | 'SUPERVISOR';
    reason: string;
    proposedValue: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminNotes?: string;
    createdAt: string;
}
