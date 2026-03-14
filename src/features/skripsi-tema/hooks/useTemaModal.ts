import { create } from "zustand";

interface TemaModalStore {
  isOpen: boolean;
  type: "CREATE" | "UPDATE" | "DELETE" | null;
  selectedId: string | null;
  onOpen: (type: "CREATE" | "UPDATE" | "DELETE", id?: string) => void;
  onClose: () => void;
}

export const useTemaModal = create<TemaModalStore>((set) => ({
  isOpen: false,
  type: null,
  selectedId: null,
  onOpen: (type: "CREATE" | "UPDATE" | "DELETE", id?: string) => 
    set({ isOpen: true, type, selectedId: id || null }),
  onClose: () => set({ isOpen: false, type: null, selectedId: null }),
}));
