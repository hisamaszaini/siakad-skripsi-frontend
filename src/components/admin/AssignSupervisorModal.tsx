"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, UserPlus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface AssignSupervisorModalProps {
    proposalId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function AssignSupervisorModal({ proposalId, open, onOpenChange, onSuccess }: AssignSupervisorModalProps) {
    const [loading, setLoading] = useState(false);
    const [supervisors, setSupervisors] = useState<{ dosen_id: string; role: string }[]>([
        { dosen_id: "", role: "MAIN" }
    ]);

    const addSupervisor = () => {
        if (supervisors.length < 2) {
            setSupervisors([...supervisors, { dosen_id: "", role: "CO" }]);
        }
    };

    const removeSupervisor = (index: number) => {
        setSupervisors(supervisors.filter((_, i) => i !== index));
    };

    const updateSupervisor = (index: number, field: keyof { dosen_id: string; role: string }, value: string) => {
        const newSups = [...supervisors];
        newSups[index][field] = value;
        setSupervisors(newSups);
    };

    const handleSubmit = async () => {
        if (supervisors.some(s => !s.dosen_id)) {
            return toast.error("Pilih dosen terlebih dahulu.");
        }

        setLoading(true);
        try {
            await api.post(`/proposals/${proposalId}/assign`, { supervisors });
            toast.success("Pembimbing berhasil ditetapkan.");
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || "Gagal menetapkan pembimbing.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold italic tracking-tight">Penetapan Pembimbing</DialogTitle>
                    <DialogDescription>Pilih dosen pembimbing utama dan pendamping untuk usulan ini.</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {supervisors.map((s, i) => (
                        <div key={i} className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-100 relative group">
                            <div className="flex justify-between items-center">
                                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Dosen {i + 1} ({s.role})</Label>
                                {i > 0 && (
                                    <Button variant="ghost" size="sm" onClick={() => removeSupervisor(i)} className="h-6 w-6 p-0 text-red-400 hover:text-red-500 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Select value={s.dosen_id || ""} onValueChange={(val: string | null) => updateSupervisor(i, "dosen_id", val || "")}>
                                <SelectTrigger className="bg-white rounded-lg">
                                    <SelectValue placeholder="Pilih Dosen..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1001">Dr. Hendra Saputra</SelectItem>
                                    <SelectItem value="1002">Prof. Dr. M. Arifin</SelectItem>
                                    <SelectItem value="1003">Budi Darmawan, M.T.</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    ))}

                    {supervisors.length < 2 && (
                        <Button variant="outline" className="w-full border-dashed border-2 py-6 rounded-xl font-bold bg-transparent text-slate-500 hover:text-primary hover:border-primary/50 gap-2" onClick={addSupervisor}>
                            <UserPlus className="h-4 w-4" /> Tambah Pembimbing Co
                        </Button>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-lg font-bold">Batal Navigasi</Button>
                    <Button onClick={handleSubmit} disabled={loading} className="rounded-lg font-bold px-8 shadow-lg shadow-primary/20">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan Penetapan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
