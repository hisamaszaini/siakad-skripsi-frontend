import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
  size?: "sm" | "md";
}

export function FilterTabs({ tabs, activeKey, onChange, className, size = "md" }: FilterTabsProps) {
  return (
    <div className={cn("flex gap-2 flex-wrap bg-slate-100/50 p-2 rounded-2xl w-fit", className)}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={cn(
            "rounded-xl font-black uppercase tracking-widest transition-all",
            size === "sm" ? "px-4 py-2 text-[8px]" : "px-6 py-2.5 text-[10px]",
            activeKey === key
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-400 hover:text-slate-600"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
