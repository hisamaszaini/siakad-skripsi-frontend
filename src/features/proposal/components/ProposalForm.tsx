"use client";

import { useProposalForm } from "../hooks/useProposalForm";
import { Button } from "@/components/ui/button";
import { SingleSelect } from "@/components/ui/single-select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { proposalService } from "../services/proposal.service";
import { Loader2, GraduationCap, ArrowLeft, Info } from "lucide-react";
import { Lecturer, Theme, ProposalFormData } from "@/types";
import { useRouter } from "next/navigation";

export function ProposalForm() {
  const router = useRouter();
  const { 
    form, 
    isRevision, 
    loadingThemes, 
    loadingThesis, 
    themes, 
    thesis, 
    onSubmit 
  } = useProposalForm();

  if (loadingThesis) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-slate-400 font-bold tracking-tight animate-pulse uppercase text-[10px]">Menyelaraskan Data Usulan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-8 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Step 01: Initiation</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-none">
            Pengajuan <span className="text-indigo-600">{isRevision ? "Revisi" : "Proposal"}</span>
          </h1>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="font-black text-[10px] uppercase tracking-widest gap-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all rounded-xl h-12 px-6"
        >
          <ArrowLeft className="h-4 w-4" /> Batal
        </Button>
      </div>

      {isRevision && (
        <div className="p-8 rounded-[2.5rem] bg-amber-50 border border-amber-100 flex gap-6 text-amber-900 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="h-12 w-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0">
            <Info className="h-6 w-6 text-amber-600" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-widest text-amber-600">Informasi Revisi</p>
            <p className="text-sm font-bold leading-relaxed">
              Pengajuan Anda sebelumnya ditolak. Anda hanya diperbolehkan untuk merevisi <span className="underline decoration-2 underline-offset-4">Judul</span> dan <span className="underline decoration-2 underline-offset-4">Tema</span>. Data calon pembimbing telah dikunci sesuai pengajuan sebelumnya.
            </p>
            {thesis?.catatan && (
              <div className="mt-4 p-4 rounded-xl bg-white/50 border border-amber-200/50 italic text-[13px]">
                <span className="font-black text-amber-700 not-italic mr-2">Catatan Dosen:</span>
                {thesis.catatan}
              </div>
            )}
          </div>
        </div>
      )}

      <Card className="border-none shadow-2xl shadow-slate-200/60 bg-white rounded-[3rem] overflow-hidden">
        <CardHeader className="p-10 pb-6 border-b border-slate-50">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1 w-6 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Thesis Initiation Form</span>
          </div>
          <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Data Usulan Skripsi</CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500">
            Pastikan judul dan tema sudah sesuai dengan rencana penelitian Anda.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <FormField<ProposalFormData>
                control={form.control}
                name="judul"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Judul Skripsi <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tuliskan judul lengkap skripsi Anda di sini..."
                        {...field}
                        className="min-h-[120px] rounded-[1.5rem] border-slate-100 bg-slate-50/50 p-6 font-bold text-slate-900 focus-visible:ring-indigo-600/20 focus-visible:border-indigo-600 transition-all leading-relaxed"
                      />
                    </FormControl>
                    <FormDescription className="text-[10px] font-bold text-slate-400 ml-1">
                      Gunakan Bahasa Indonesia yang formal dan baku.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-6">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Pilihan Tema / Topik <span className="text-red-500">*</span>
                </Label>
                {loadingThemes ? (
                  <div className="flex items-center gap-3 p-8 border border-slate-50 rounded-[2rem] bg-slate-50/30 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    <span className="text-xs font-black text-slate-400 tracking-widest uppercase">Sinkronisasi Tema...</span>
                  </div>
                ) : (
                  <FormField<ProposalFormData>
                    control={form.control}
                    name="tema"
                    render={({ field }) => (
                      <FormItem className="space-y-4">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                          >
                            {themes.map((theme: Theme) => (
                              <FormItem key={theme.id} className="relative">
                                <FormControl>
                                  <RadioGroupItem value={theme.name} className="peer sr-only" />
                                </FormControl>
                                <FormLabel className="flex items-center p-5 rounded-2xl bg-white border border-slate-100 font-bold text-sm cursor-pointer peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-900 transition-all hover:border-indigo-200">
                                  {theme.name}
                                </FormLabel>
                              </FormItem>
                            ))}
                            <FormItem className="relative">
                              <FormControl>
                                <RadioGroupItem value="Lainnya" className="peer sr-only" />
                              </FormControl>
                              <FormLabel className="flex items-center p-5 rounded-2xl bg-white border border-slate-100 font-bold text-sm cursor-pointer peer-data-[state=checked]:border-indigo-600 peer-data-[state=checked]:bg-indigo-50 peer-data-[state=checked]:text-indigo-900 transition-all hover:border-indigo-200">
                                Tema Lainnya
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("tema") === "Lainnya" && (
                  <FormField<ProposalFormData>
                    control={form.control}
                    name="customTema"
                    render={({ field }) => (
                      <FormItem className="animate-in slide-in-from-top-4 duration-500">
                        <FormControl>
                          <Input
                            placeholder="Sebutkan tema spesifik penelitian Anda..."
                            maxLength={30}
                            {...field}
                            className="h-14 rounded-2xl border-indigo-100 bg-indigo-50/10 px-6 font-bold text-indigo-900 focus-visible:ring-indigo-600/20"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <FormField<ProposalFormData>
                  control={form.control}
                  name="sks_total"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Total SKS Tempuh <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            className="h-14 rounded-[1.5rem] border-slate-100 bg-slate-50/50 px-6 font-black text-slate-900 focus-visible:ring-indigo-600/20"
                            onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">SKS</div>
                        </div>
                      </FormControl>
                      <FormDescription className="text-[9px] font-bold text-slate-400 ml-1">
                        Minimal 120 SKS untuk mengajukan skripsi.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField<ProposalFormData>
                  control={form.control}
                  name="pembimbing_usulan_id"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Calon Pembimbing (Opsional)
                      </FormLabel>
                      <FormControl>
                        <SingleSelect
                          value={String(field.value ?? "")}
                          onChange={field.onChange}
                          onSearch={async (query) => {
                            if (query.length < 2) return [];
                            const res = await proposalService.searchLecturers(query) as { data?: Lecturer[] };
                            return (res.data || []).map((t: Lecturer) => ({
                              label: t.nama,
                              value: String(t.nik),
                              description: t.nidn ? `NIDN: ${t.nidn}` : `NIK: ${t.nik}`
                            }));
                          }}
                          placeholder="Cari Dosen..."
                          searchPlaceholder="Ketik Nama atau NIK..."
                          disabled={isRevision}
                          className="h-14 rounded-[1.5rem] border-slate-100 bg-slate-50/50"
                        />
                      </FormControl>
                      <FormDescription className="text-[9px] font-bold text-slate-400 ml-1">
                        Dosen yang telah Anda hubungi / sepakati.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 flex gap-6 text-indigo-900 relative overflow-hidden group">
                <Info className="h-8 w-8 shrink-0 text-indigo-600" />
                <div className="space-y-1 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 opacity-60">Pernyataan Kejujuran</p>
                  <p className="text-xs font-bold leading-relaxed italic">
                    Dengan mengklik submit, saya menyatakan bahwa data yang saya masukkan adalah benar dan judul yang diajukan bukan merupakan hasil plagiasi.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-16 rounded-[1.5rem] bg-indigo-950 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-100 transition-all gap-3"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && <Loader2 className="h-5 w-5 animate-spin" />}
                <GraduationCap className="h-5 w-5" />
                {isRevision ? "Submit Revisi Proposal" : "Submit Proposal Skripsi"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
