"use client";

import * as React from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  disabledDates?: (date: Date) => boolean;
}

export function DatePicker({
  date,
  setDate,
  placeholder = "Pilih tanggal",
  className,
  disabled = false,
  disabledDates,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={"outline"}
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal h-14 rounded-2xl bg-slate-50 border-slate-100 px-6 focus:ring-indigo-600/20",
              !date && "text-muted-foreground",
              className
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-indigo-600" />
            {date ? (
              format(date, "PPP", { locale: id })
            ) : (
              <span className="font-medium">{placeholder}</span>
            )}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-[2rem] overflow-hidden" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          locale={id}
          initialFocus
          disabled={disabledDates}
          className="p-4"
        />
      </PopoverContent>
    </Popover>
  );
}
