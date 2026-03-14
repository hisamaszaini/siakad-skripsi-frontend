export type ProposalStatus =
  | "SUBMITTED"
  | "REVISION"
  | "APPROVED"
  | "PLOTTED"
  | "SEMPRO"
  | "SKRIPSI"
  | "SIDANG"
  | "FINISHED"
  | "REJECTED"
  | "NONACTIVE";

export type GuidanceLogStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type SemproStatus = "REGISTERED" | "SCHEDULED" | "PASSED" | "FAILED" | "REVISE";

export type DefenseStatus = "REGISTERED" | "SCHEDULED" | "PASSED" | "FAILED" | "REVISE";

export type UserRole = "STUDENT" | "LECTURER" | "PRODI" | "ADMIN";

export type SupervisorRole = "MAIN" | "CO";

export interface User {
  id: string;
  nim?: string;
  nidn?: string;
  nama: string;
  role: UserRole;
}

export interface Theme {
  id: string;
  kode_jurusan: string;
  name: string;
  created_at: string;
}

export interface Supervisor {
  dosen_id: string;
  nama: string;
  nama_dosen?: string;
  role: SupervisorRole;
  status: string;
  acc_sempro?: boolean;
  acc_sidang?: boolean;
}

export interface Proposal {
  id: string;
  mhs_id: string;
  judul: string;
  tema: string | null;
  status: ProposalStatus;
  pembimbing_usulan_id?: string | null;
  sks_total: number;
  catatan?: string | null;
  created_at: string;
  updated_at: string;
  nim?: string;
  nama_mahasiswa?: string;
  nama_calon_pembimbing?: string | null;
  nik_calon_pembimbing?: string | null;
  nidn_calon_pembimbing?: string | null;
  supervisors?: Supervisor[];
  periode_id?: string | null;
}

export interface Period {
  periode_id: string;
  tahun_ajaran: string;
  semester: string;
}

export interface GuidanceLog {
  id: string;
  skripsi_id: string;
  dosen_id: string;
  tanggal: string;
  kegiatan: string;
  status: GuidanceLogStatus;
  catatan: string | null;
  created_at: string;
  updated_at: string;
  nama_dosen?: string;
  role_dosen?: string;
  nama_mahasiswa?: string;
  nim?: string;
  skripsi_status?: ProposalStatus;
  acc_sempro?: boolean;
  acc_sidang?: boolean;
}

export interface SemproRegistration {
  id: string;
  skripsi_id: string;
  status: SemproStatus;
  tanggal?: string;
  jam?: string;
  ruang?: string;
  pengujis?: string[];
  nilai?: number;
  catatan?: string;
  penguji_ketua?: string;
  penguji_1?: string;
  penguji_2?: string;
  nama_penguji_ketua?: string;
  nama_penguji_1?: string;
  nama_penguji_2?: string;
  created_at: string;
  updated_at: string;
  nama_mahasiswa?: string;
  nim?: string;
  judul?: string;
  file_path?: string;
  nilai_akhir?: number;
  grade?: string;
}

export interface DefenseRegistration {
  id: string;
  skripsi_id: string;
  status: DefenseStatus;
  tanggal?: string;
  jam?: string;
  ruang?: string;
  pengujis?: string[];
  nilai?: number;
  catatan?: string;
  penguji_ketua?: string;
  penguji_1?: string;
  penguji_2?: string;
  nama_penguji_ketua?: string;
  nama_penguji_1?: string;
  nama_penguji_2?: string;
  created_at: string;
  updated_at: string;
  nama_mahasiswa?: string;
  nim?: string;
  judul?: string;
  draft_path?: string;
  turnitin_path?: string;
  nilai_akhir?: number;
  grade?: string;
}

export interface ChangeRequest {
  id: string;
  skripsi_id: string;
  type: "TOPIC" | "SUPERVISOR";
  reason: string;
  proposed_value: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  catatan_admin?: string;
  created_at: string;
  updated_at: string;
  file_path?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Lecturer {
  nik: string;
  nidn?: string;
  nama: string;
}

export interface Student {
  nim: string;
  nama: string;
  prodi?: string;
  angkatan?: number;
}

export interface Prodi {
  prodi_id: string;
  nama_prodi: string;
  fakultas_id: string;
  kode_jurusan: string;
}

export interface ProposalFormData {
  judul: string;
  tema: string;
  customTema?: string;
  sks_total: number;
  pembimbing_usulan_id?: string;
}

export interface GuidanceLogFormData {
  skripsi_id?: string;
  dosen_id: string;
  tanggal: string;
  kegiatan: string;
  status?: "PENDING" | "VERIFIED" | "REJECTED";
}

export interface VerifyGuidanceFormData {
  status: "VERIFIED" | "REJECTED";
  catatan?: string;
}

export interface SemproRegistrationFormData {
  skripsi_id: string;
  transkrip?: string;
}

export interface SemproScheduleFormData {
  tanggal: string;
  jam: string;
  ruang: string;
  penguji_ketua?: string;
  penguji_1?: string;
  penguji_2?: string;
}

export interface SemproEvaluationFormData {
  nilai: number;
  status: "PASSED" | "FAILED" | "REVISE";
  catatan?: string;
}

export interface DefenseRegistrationFormData {
  skripsi_id: string;
  transkrip?: string;
}

export interface DefenseScheduleFormData {
  tanggal: string;
  jam: string;
  ruang: string;
  penguji_ketua?: string;
  penguji_1?: string;
  penguji_2?: string;
}

export interface DefenseEvaluationFormData {
  nilai: number;
  status: "PASSED" | "FAILED" | "REVISE";
  catatan?: string;
}

export interface AssignSupervisorsFormData {
  supervisors: {
    dosen_id: string;
    role: string;
  }[];
}

export interface VerifyProposalFormData {
  status?: "APPROVED" | "REJECTED" | "REVISION";
  catatan?: string;
  judul?: string;
}

export interface MyThesisResponse {
  current: Proposal | null;
  history: Proposal[];
}
