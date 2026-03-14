import { useQuery } from "@tanstack/react-query";
import { temaService } from "../services/tema.service";

export const useThemes = (kodeJurusan?: string) => {
  return useQuery({
    queryKey: ["themes", kodeJurusan],
    queryFn: async () => {
      const response = await temaService.getAllThemes(kodeJurusan === "ALL" ? undefined : kodeJurusan);
      return response.data.data;
    },
  });
};

export const useTheme = (id: string | null) => {
  return useQuery({
    queryKey: ["theme", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await temaService.getThemeById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useProdi = () => {
  return useQuery({
    queryKey: ["prodi"],
    queryFn: async () => {
      const response = await temaService.getProdi();
      return response.data.data;
    },
  });
};
