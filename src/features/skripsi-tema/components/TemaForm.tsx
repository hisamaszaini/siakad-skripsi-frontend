"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { themeSchema, ThemeFormData } from "../schemas/tema.schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Theme } from "@/types";
import { SingleSelect } from "@/components/ui/single-select";
import { useProdi } from "../hooks/useTemaQueries";

interface TemaFormProps {
  initialData?: Theme | null;
  onSubmit: (data: ThemeFormData) => void;
  isLoading?: boolean;
}

export function TemaForm({ initialData, onSubmit, isLoading }: TemaFormProps) {
  const form = useForm<ThemeFormData>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      name: initialData?.name || "",
      kode_jurusan: initialData?.kode_jurusan || "",
    },
  });

  const { data: prodiList = [] } = useProdi();

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        kode_jurusan: initialData.kode_jurusan,
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Tema</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Kecerdasan Buatan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kode_jurusan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jurusan</FormLabel>
              <FormControl>
                <SingleSelect
                  value={field.value}
                  onChange={field.onChange}
                  options={prodiList.map((p) => ({
                    label: p.nama_prodi,
                    value: p.kode_jurusan,
                  }))}
                  placeholder="Pilih Jurusan"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Tema"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
