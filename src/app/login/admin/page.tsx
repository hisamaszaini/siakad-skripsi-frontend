"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Lock } from "lucide-react";
import { toast } from "sonner";
import { loginAction } from "@/features/auth/services/auth.service";
import { PageTitle } from "@/components/ui/page-title";

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !password) {
            toast.error("ID Admin dan Password wajib diisi");
            return;
        }

        setLoading(true);
        try {
            const result = await loginAction({ role: "PRODI", userId, password });

            if (!result.success) {
                toast.error(result.error);
                setLoading(false);
                return;
            }

            toast.success("Login Admin berhasil!");

            if (result.user) {
                localStorage.setItem("user_data", JSON.stringify(result.user));
            }

            router.push("/admin");

        } catch (error) {
            console.error(error);
            toast.error("Terjadi kesalahan sistem. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-white overflow-hidden font-sans">
            <PageTitle title="Login Admin" />

            {/* Premium Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-blue-600/[0.03] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-blue-600/[0.03] rounded-full blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="container relative z-10 px-4 flex flex-col items-center">
                {/* Back to Home Link */}
                <Link
                    href="/"
                    className="group mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-blue-600 transition-all duration-300"
                >
                    <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                    Kembali ke Beranda
                </Link>

                {/* Login Card with Glassmorphism */}
                <div className="w-full max-w-[600px] animate-in fade-in zoom-in-95 duration-700">
                    <div className="bg-white rounded-[2.5rem] p-12 shadow-[0_32px_64px_-12px_rgba(37,99,235,0.12)] border border-slate-200/60 backdrop-blur-sm relative overflow-hidden group">

                        {/* Subtle inner glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/[0.02] pointer-events-none" />

                        <div className="relative z-10 space-y-10">
                            {/* Header */}
                            <div className="space-y-4 text-center">
                                <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/10 group-hover:scale-110 transition-transform duration-500">
                                    <Lock className="h-8 w-8" />
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Administration Panel</p>
                                    <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic uppercase">System Admin.</h1>
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLogin} className="space-y-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <Label htmlFor="userId" className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] pl-1">
                                            Username / NIK
                                        </Label>
                                        <Input
                                            id="userId"
                                            placeholder="Masukkan Username..."
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="password" className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] pl-1">
                                            Password
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-14 bg-slate-50 border-slate-200 rounded-2xl px-6 font-bold text-slate-900 placeholder:text-slate-300 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white font-black text-[12px] uppercase tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all group/btn disabled:opacity-70"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "Login"
                                    )}
                                </Button>
                            </form>

                            {/* Footer */}
                            <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">
                                SIAKAD SYSTEM • RESTRICTED ACCESS AREA<br />
                                © 2026 INFORMATICS ENGINEERING
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
