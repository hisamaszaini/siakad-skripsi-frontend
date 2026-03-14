import * as z from "zod";

export const themeSchema = z.object({
  name: z.string().min(1, "Nama tema wajib diisi"),
  kode_jurusan: z.string().min(1, "Kode jurusan wajib diisi"),
});

export type ThemeFormData = z.infer<typeof themeSchema>;
