"use client";

import { useState, useEffect } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Option {
    label: string;
    value: string;
    description?: string;
}

interface SingleSelectProps {
    value?: string;
    onChange: (value: string) => void;
    onSearch?: (query: string) => Promise<Option[]>;
    options?: Option[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    loadingText?: string;
    disabled?: boolean;
    className?: string;
}

export function SingleSelect({
    value,
    onChange,
    onSearch,
    options: initialOptions = [],
    placeholder = "Pilih opsi...",
    searchPlaceholder = "Cari opsi...",
    emptyText = "Opsi tidak ditemukan.",
    loadingText = "Sedang mencari...",
    disabled = false,
    className,
}: SingleSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [options, setOptions] = useState<Option[]>(initialOptions);
    const [searching, setSearching] = useState(false);

    const [initialLoaded, setInitialLoaded] = useState(false);
    
    // Synchronize options prop with internal state
    useEffect(() => {
        setOptions(initialOptions);
    }, [initialOptions]);

    // Load initial options when popover first opens
    useEffect(() => {
        if (open && !initialLoaded && onSearch && options.length === 0) {
            setInitialLoaded(true);
            setSearching(true);
            onSearch("").then((results) => {
                setOptions(results);
            }).catch(console.error).finally(() => setSearching(false));
        }
    }, [open, initialLoaded, onSearch, options.length]);

    // Debounced search on query change (skip empty to avoid double-call on first open)
    useEffect(() => {
        if (!onSearch || searchQuery === "") return;

        const handleSearch = async () => {
            setSearching(true);
            try {
                const results = await onSearch(searchQuery);
                setOptions(results);
            } catch (e) {
                console.error(e);
            } finally {
                setSearching(false);
            }
        };

        const timeout = setTimeout(handleSearch, 400);
        return () => clearTimeout(timeout);
    }, [searchQuery, onSearch]);

    const displayValue = value
        ? options.find((t) => t.value === value)?.label || value
        : placeholder;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        role="combobox"
                        disabled={disabled}
                        className={cn(
                            "w-full justify-between h-8 text-left font-normal bg-white",
                            !value && "text-muted-foreground",
                            className
                        )}
                    >
                        <span className="truncate">{displayValue}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                }
            />
            <PopoverContent className="w-(--anchor-width) p-0" align="start">
                <Command shouldFilter={!onSearch}>
                    <CommandInput
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                    />
                    <CommandList>
                        {searching && <CommandEmpty>{loadingText}</CommandEmpty>}
                        {!searching && options.length === 0 && (
                            <CommandEmpty>{emptyText}</CommandEmpty>
                        )}
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    value={option.value}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue === value ? "" : currentValue);
                                        setOpen(false);
                                    }}
                                    // Use data-checked to trigger the built-in Check icon in command.tsx
                                    data-checked={value === option.value}
                                    className={cn(
                                        "cursor-pointer transition-colors px-3",
                                        option.description ? "py-2" : "py-1.5"
                                    )}
                                >
                                    <div className="flex flex-col flex-1 overflow-hidden">
                                        <span className="font-medium text-[13px] leading-tight truncate">
                                            {option.label}
                                        </span>
                                        {option.description && (
                                            <span className="text-[11px] text-muted-foreground mt-1 truncate">
                                                {option.description}
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
