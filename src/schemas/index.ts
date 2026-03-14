import { z } from "zod";

export const ProposalSchema = z.object({
  judul: z
    .string()
    .min(10, "Judul minimal 10 karakter")
    .max(500, "Judul maksimal 500 karakter"),
  tema: z.string().min(1, "Pilih tema/topik"),
  customTema: z.string().optional(),
  sks_total: z
    .number()
    .min(1, "Total SKS tidak boleh kosong")
    .max(200, "Total SKS tidak valid"),
  pembimbing_usulan_id: z.string().optional(),
});

export type ProposalFormData = z.infer<typeof ProposalSchema>;

export const GuidanceLogSchema = z.object({
  skripsi_id: z.string().optional(),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  kegiatan: z
    .string()
    .min(10, "Isi kegiatan minimal 10 karakter")
    .max(2000, "Isi kegiatan maksimal 2000 karakter"),
  dosen_id: z.string().min(1, "Pilih dosen pembimbing"),
  status: z.enum(["PENDING", "VERIFIED", "REJECTED"]).optional(),
});

export type GuidanceLogFormData = z.infer<typeof GuidanceLogSchema>;

export const VerifyGuidanceSchema = z.object({
  status: z.enum(["VERIFIED", "REJECTED"]),
  catatan: z.string().max(500).optional(),
});

export type VerifyGuidanceFormData = z.infer<typeof VerifyGuidanceSchema>;

export const SemproRegistrationSchema = z.object({
  skripsi_id: z.string().min(1, "Proposal wajib dipilih"),
  transkrip: z.string().optional(),
});

export type SemproRegistrationFormData = z.infer<typeof SemproRegistrationSchema>;

export const SemproScheduleSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jam: z.string().min(1, "Jam wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
});

export type SemproScheduleFormData = z.infer<typeof SemproScheduleSchema>;

export const SemproEvaluationSchema = z.object({
  nilai: z.number().min(0).max(100),
  status: z.enum(["PASSED", "FAILED", "REVISE"]),
  catatan: z.string().max(1000).optional(),
});

export type SemproEvaluationFormData = z.infer<typeof SemproEvaluationSchema>;

export const DefenseRegistrationSchema = z.object({
  skripsi_id: z.string().min(1, "Proposal wajib dipilih"),
  transkrip: z.string().optional(),
});

export type DefenseRegistrationFormData = z.infer<typeof DefenseRegistrationSchema>;

export const DefenseScheduleSchema = z.object({
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  jam: z.string().min(1, "Jam wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
});

export type DefenseScheduleFormData = z.infer<typeof DefenseScheduleSchema>;

export const DefenseEvaluationSchema = z.object({
  nilai: z.number().min(0).max(100),
  status: z.enum(["PASSED", "FAILED", "REVISE"]),
  catatan: z.string().max(1000).optional(),
});

export type DefenseEvaluationFormData = z.infer<typeof DefenseEvaluationSchema>;

export const AssignSupervisorsSchema = z.object({
  pembimbing1_id: z.string().min(1, "Pembimbing 1 wajib dipilih"),
  pembimbing2_id: z.string().optional(),
});

export type AssignSupervisorsFormData = z.infer<typeof AssignSupervisorsSchema>;

export const VerifyProposalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "REVISION"]),
  catatan: z.string().max(1000).optional(),
});

export type VerifyProposalFormData = z.infer<typeof VerifyProposalSchema>;
