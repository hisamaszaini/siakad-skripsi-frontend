"use client";

import { useFormContext } from "react-hook-form";
import { GuidanceLogFormData } from "@/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SingleSelect } from "@/components/ui/single-select";
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "@/components/ui/dialog";

interface GuidanceLogFormProps {
    onSubmit: (values: GuidanceLogFormData) => void;
    isLoading: boolean;
    onCancel: () => void;
    showSupervisor?: boolean;
    supervisorOptions?: { label: string; value: string }[];
    submitText: string;
    submitColor?: "indigo" | "amber";
    title?: string;
    description?: string;
    icon?: React.ReactNode;
}

export function GuidanceLogForm({
    onSubmit,
    isLoading,
    onCancel,
    showSupervisor = false,
    supervisorOptions = [],
    submitText,
    submitColor = "indigo",
    title,
    description,
    icon
}: GuidanceLogFormProps) {
    const { register, watch, setValue, formState: { errors }, handleSubmit } = useFormContext<GuidanceLogFormData>();

    const colorClasses = {
        indigo: "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-100",
        amber: "bg-amber-600 hover:bg-amber-700 hover:scale-[1.02] active:scale-95 shadow-xl shadow-amber-100"
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="relative">
            {title && (
                <>
                    <DialogClose render={
                        <Button variant="ghost" className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:scale-110 active:scale-95 text-slate-400 transition-all outline-none focus:ring-2 focus:ring-slate-300">
                            <X className="h-5 w-5" />
                            <span className="sr-only">Tutup</span>
                        </Button>
                    } />
                    <DialogHeader className="p-8 pb-6 border-b border-slate-100/80 pr-16">
                        <div className="flex items-center gap-4">
                            {icon && (
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-inner shrink-0",
                                    submitColor === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"
                                )}>
                                    {icon}
                                </div>
                            )}
                            <div className="space-y-1 text-left">
                                <DialogTitle className="text-xl font-black text-slate-900 tracking-tight leading-none">{title}</DialogTitle>
                                {description && (
                                    <DialogDescription className="text-xs font-medium text-slate-500 italic mt-1.5">
                                        {description}
                                    </DialogDescription>
                                )}
                            </div>
                        </div>
                    </DialogHeader>
                </>
            )}
            <div className="p-8 space-y-6">
                {showSupervisor && (
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Dosen Pembimbing <span className="text-red-500">*</span>
                        </Label>
                        <SingleSelect
                            value={watch("dosen_id")}
                            onChange={(val) => setValue("dosen_id", val, { shouldValidate: true })}
                            options={supervisorOptions}
                            placeholder="Pilih dosen pembimbing..."
                            className={cn("w-full h-14 rounded-2xl border-slate-200", errors.dosen_id && "border-red-500")}
                        />
                        {errors.dosen_id && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-widest animate-in slide-in-from-top-1">
                                {errors.dosen_id.message as string}
                            </p>
                        )}
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Materi Pembahasan <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            {...register("materi")}
                            placeholder="Materi yang dibahas (min. 5 karakter)..."
                            className={cn(
                                "h-14 rounded-2xl border border-slate-200 bg-white px-6 font-bold focus:border-indigo-500 focus:ring-indigo-500/20 transition-all font-sans",
                                errors.materi && "border-red-500"
                            )}
                        />
                        {errors.materi && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-widest animate-in slide-in-from-top-1">
                                {errors.materi.message as string}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                            Saran / Tindak Lanjut <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            {...register("saran")}
                            placeholder="Saran dari pembimbing (min. 10 karakter)..."
                            className={cn(
                                "min-h-[140px] rounded-2xl border border-slate-200 bg-white p-6 font-medium focus:border-indigo-500 focus:ring-indigo-500/20 transition-all leading-relaxed",
                                errors.saran && "border-red-500"
                            )}
                        />
                        {errors.saran && (
                            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-widest animate-in slide-in-from-top-1">
                                {errors.saran.message as string}
                            </p>
                        )}
                    </div>
                </div>

                <div className="space-y-2 pb-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Waktu Bimbingan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        type="datetime-local"
                        {...register("tanggal")}
                        className={cn(
                            "h-14 rounded-2xl border border-slate-200 bg-white px-6 font-bold focus:border-indigo-500 focus:ring-indigo-500/20 transition-all",
                            errors.tanggal && "border-red-500"
                        )}
                    />
                    {errors.tanggal && (
                        <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 uppercase tracking-widest animate-in slide-in-from-top-1">
                            {errors.tanggal.message as string}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex flex-row items-center sm:justify-center gap-3 rounded-b-[2.5rem]">
                <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 h-16 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm border-slate-200 active:scale-95 hover:scale-[1.02]"
                    onClick={onCancel}
                >
                    Batal
                </Button>
                <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className={cn(
                        "flex-[1.5] h-16 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50",
                        colorClasses[submitColor]
                    )}
                >
                    {isLoading ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> ...</>
                    ) : (
                        submitText
                    )}
                </Button>
            </div>
        </form>
    );
}
