import { z } from 'zod';

export const ProposalSchema = z.object({
    judul: z.string().min(10, 'Judul minimal 10 karakter'),
    tema: z.string().min(1, 'Tema wajib dipilih'),
    customTema: z.string().max(30, 'Tema tambahan maksimal 30 karakter').optional(),
    sks_total: z.number().min(120, 'Minimal 120 SKS untuk mengajukan skripsi'),
    pembimbing_usulan_id: z.string().optional(),
});

export type ProposalFormData = z.infer<typeof ProposalSchema>;

export const GuidanceLogSchema = z.object({
    dosen_id: z.string().min(1, 'Dosen Pembimbing wajib dipilih'),
    tanggal: z.string().min(1, 'Tanggal bimbingan wajib diisi'),
    kegiatan: z.string().min(10, 'Aktivitas bimbingan minimal 10 karakter'),
});

export type GuidanceLogFormData = z.infer<typeof GuidanceLogSchema>;

export const VerificationSchema = z.object({
    status: z.enum(['VERIFIED', 'REJECTED']),
    notes: z.string().optional(),
});

export type VerificationFormData = z.infer<typeof VerificationSchema>;

export const SupervisorAssignmentSchema = z.object({
    pembimbing1Id: z.string().min(1, 'Dosen Pembimbing 1 wajib dipilih'),
    pembimbing2Id: z.string().optional(),
});

export type SupervisorAssignmentFormData = z.infer<typeof SupervisorAssignmentSchema>;

export const SemproResultSchema = z.object({
    status: z.enum(['PASSED', 'FAILED', 'REVISE']),
    grade: z.number().min(0).max(100),
    notes: z.string().optional(),
});

export type SemproResultFormData = z.infer<typeof SemproResultSchema>;

export const DefenseResultSchema = z.object({
    status: z.enum(['GRADUATED', 'GRADUATED_REVISE', 'FAILED']),
    grade: z.number().min(0).max(100),
    notes: z.string().optional(),
});

export type DefenseResultFormData = z.infer<typeof DefenseResultSchema>;

export const ChangeRequestSchema = z.object({
    type: z.enum(['TOPIC', 'SUPERVISOR']),
    reason: z.string().min(20, 'Alasan minimal 20 karakter'),
    proposedValue: z.string().min(5, 'Nilai usulan minimal 5 karakter'),
});

export type ChangeRequestFormData = z.infer<typeof ChangeRequestSchema>;
