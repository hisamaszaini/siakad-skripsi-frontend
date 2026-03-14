"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { GuidanceLogSchema, GuidanceLogFormData } from "@/schemas";
import { useSubmitGuidanceLogMutation } from "../hooks/useGuidanceMutation";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, BookOpen, Calendar, FileText } from "lucide-react";

interface GuidanceLogFormProps {
  onSuccess?: () => void;
}

export function GuidanceLogForm({ onSuccess }: GuidanceLogFormProps) {
  const { mutateAsync: submitLog, isPending: isLoading } = useSubmitGuidanceLogMutation();

  const form = useForm<GuidanceLogFormData>({
    resolver: zodResolver(GuidanceLogSchema),
    defaultValues: {
      tanggal: new Date().toISOString().split("T")[0],
      kegiatan: "",
      dosen_id: "",
      skripsi_id: "",
    },
  });

  async function onSubmit(values: GuidanceLogFormData) {
    try {
      await submitLog(values);
      form.reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook
    }
  }

  return (
    <Card className="border-none shadow-lg bg-white rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Tambah Log Bimbingan</CardTitle>
            <CardDescription className="text-sm text-slate-500">
              Catat kegiatan bimbingan Anda
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="tanggal"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-700">
                    <Calendar className="h-4 w-4 inline-block mr-1" />
                    Tanggal Bimbingan
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kegiatan"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-slate-700">
                    <BookOpen className="h-4 w-4 inline-block mr-1" />
                    Kegiatan Bimbingan
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan kegiatan bimbingan yang telah dilakukan..."
                      className="min-h-[150px] rounded-lg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    minimum 10 karakter, maksimum 2000 karakter
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-lg"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Log Bimbingan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
