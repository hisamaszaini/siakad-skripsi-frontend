"use client";

import { useFormContext } from "react-hook-form";
import { VerifyGuidanceFormData } from "@/schemas";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, X, Loader2 } from "lucide-react";
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface GuidanceVerifyFormProps {
    onSubmit: (values: VerifyGuidanceFormData) => void;
    isLoading: boolean;
    onCancel: () => void;
    title: string;
    description: string;
    icon?: React.ReactNode;
}

export function GuidanceVerifyForm({
    onSubmit,
    isLoading,
    onCancel,
    title,
    description,
    icon
}: GuidanceVerifyFormProps) {
    const form = useFormContext<VerifyGuidanceFormData>();

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <DialogClose render={
                <Button
                    variant="ghost"
                    className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 text-slate-400 transition-all outline-none focus:ring-2 focus:ring-slate-300 z-50"
                >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Tutup</span>
                </Button>
            } />

            <DialogHeader className="p-8 pb-6 border-b border-slate-100/80 pr-16 bg-white shrink-0">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner shrink-0 border border-indigo-100 animate-in zoom-in duration-500">
                            {icon}
                        </div>
                    )}
                    <div className="space-y-1 text-left">
                        <DialogTitle className="text-xl font-black text-slate-900 tracking-tight leading-none truncate">
                            {title}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-medium text-slate-500 italic mt-1.5 truncate">
                            {description}
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <div className="p-8 space-y-8">
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-4">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block text-center">
                                Tentukan Status <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="flex gap-4">
                                    <Button
                                        type="button"
                                        variant={field.value === 'VERIFIED' ? 'default' : 'outline'}
                                        className={cn(
                                            "flex-1 h-16 rounded-2xl font-black gap-2 transition-all active:scale-95 hover:scale-[1.02]",
                                            field.value === 'VERIFIED'
                                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 text-white"
                                                : "text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200"
                                        )}
                                        onClick={() => field.onChange('VERIFIED')}
                                    >
                                        <CheckCircle2 className="h-5 w-5" /> SETUJUI
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={field.value === 'REJECTED' ? 'default' : 'outline'}
                                        className={cn(
                                            "flex-1 h-16 rounded-2xl font-black gap-2 transition-all active:scale-95 hover:scale-[1.02]",
                                            field.value === 'REJECTED'
                                                ? "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 text-white"
                                                : "text-slate-400 border-slate-100 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-200"
                                        )}
                                        onClick={() => field.onChange('REJECTED')}
                                    >
                                        <XCircle className="h-5 w-5" /> TOLAK
                                    </Button>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="catatan"
                    render={({ field }) => (
                        <FormItem className="space-y-2">
                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                                Catatan Bimbingan
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Berikan arahan atau alasan penolakan..."
                                    className="min-h-[140px] rounded-2xl border-slate-200 bg-slate-50/30 p-6 font-medium focus:border-indigo-500 focus:ring-indigo-100 transition-all leading-relaxed"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-row items-center sm:justify-center gap-3 rounded-b-[2.5rem]">
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-white hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm border-slate-200 active:scale-95 hover:scale-[1.02]"
                    onClick={onCancel}
                >
                    Batal
                </Button>
                <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-indigo-100 active:scale-95 hover:scale-[1.02] text-white disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        "PROSES"
                    )}
                </Button>
            </div>
        </form>
    );
}
