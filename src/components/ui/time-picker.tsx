"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value: string; // "HH:mm"
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  disabled = false,
  className,
}: TimePickerProps) {
  const [hour, minute] = React.useMemo(() => {
    if (!value) return ["08", "00"];
    const parts = value.split(":");
    return [parts[0].padStart(2, "0"), parts[1]?.padStart(2, "0") || "00"];
  }, [value]);

  const setHour = (h: string | null) => {
    if (h) onChange(`${h}:${minute}`);
  };

  const setMinute = (m: string | null) => {
    if (m) onChange(`${hour}:${m}`);
  };

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, "0"));

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 focus:ring-indigo-600/20 gap-2",
              !value && "text-muted-foreground",
              className
            )}
          >
            <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
            <span className="font-bold text-slate-900">{value || "08:00"}</span>
          </Button>
        }
      />
      <PopoverContent className="w-48 p-4 border-none shadow-2xl rounded-[2rem] bg-white flex flex-col gap-4" align="start">
        <div className="flex items-center justify-between gap-2">
            <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">Jam</span>
                <Select value={hour} onValueChange={setHour}>
                    <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 border-slate-100 font-bold justify-center">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                        {hours.map((h) => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <span className="font-black text-slate-300 pt-5">:</span>
            <div className="flex-1 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-center">Menit</span>
                <Select value={minute} onValueChange={setMinute}>
                    <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 border-slate-100 font-bold justify-center">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                        {minutes.map((m) => (
                            <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
