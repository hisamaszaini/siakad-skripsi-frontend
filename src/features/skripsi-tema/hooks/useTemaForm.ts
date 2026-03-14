import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { themeSchema, ThemeFormData } from "../schemas/tema.schema";
import { useEffect } from "react";
import { Theme } from "@/types";

export const useTemaForm = (initialData?: Theme | null) => {
  const form = useForm<ThemeFormData>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      name: "",
      kode_jurusan: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        kode_jurusan: initialData.kode_jurusan,
      });
    } else {
      form.reset({
        name: "",
        kode_jurusan: "",
      });
    }
  }, [initialData, form]);

  return form;
};
