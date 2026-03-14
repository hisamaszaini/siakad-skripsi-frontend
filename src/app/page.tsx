import Link from "next/link";
import { GraduationCap, ArrowRight, BookOpen, ShieldCheck, UserCheck, Users, Briefcase, Zap, Globe, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const roles = [
    {
      title: "Mahasiswa",
      role: "Portal Mahasiswa",
      description: "Ajukan usulan skripsi, catat log bimbingan, dan pantau progres kelulusan Anda secara real-time.",
      icon: GraduationCap,
      href: "/student",
      color: "blue",
      features: ["Pengajuan Usulan", "Log Bimbingan Digital", "Pendaftaran Sidang"]
    },
    {
      title: "Dosen",
      role: "Portal Pembimbing",
      description: "Lakukan verifikasi usulan, validasi bimbingan, dan berikan penilaian seminar serta sidang skripsi.",
      icon: UserCheck,
      href: "/lecturer",
      color: "blue",
      features: ["Verifikasi Usulan", "Validasi Log Bimbingan", "Penilaian Penguji"]
    },
    {
      title: "Admin Prodi",
      role: "Sistem Administrasi",
      description: "Kelola data usulan, tetapkan pembimbing & penguji, serta monitor statistik skripsi secara terpusat.",
      icon: ShieldCheck,
      href: "/admin",
      color: "blue",
      features: ["Penetapan Pembimbing", "Plotting Jadwal", "Statistik & Laporan"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-600">
      <PageTitle title="Home" />

      {/* Dynamic Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
      </div>

      <header className="px-8 py-6 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transform hover:rotate-12 transition-transform">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl text-slate-900 tracking-tighter leading-none italic uppercase">SIAKAD</span>
            <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase opacity-80">Skripsi</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <div className="h-4 w-[1px] bg-slate-200" />
          <Link href="#roles">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] uppercase tracking-widest h-10 px-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95">
              Portal Akses
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-24 pb-16 text-center lg:pt-32">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Zap className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Digital Transformation in Academia</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Platform Digital <br />
            <span className="text-blue-600 italic">Eksplorasi Skripsi.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12 animate-in fade-in duration-1000 delay-300">
            Integrasi alur manajemen skripsi mulai dari usulan judul, bimbingan berkala, hingga penetapan kelulusan dalam satu pintu digital yang efisien.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            <Link href="#roles">
              <Button size="lg" className="h-16 px-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/20 gap-3 group">
                Mulai Sekarang <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Roles Section */}
        <section id="roles" className="container mx-auto px-6 py-24">
          <div className="flex flex-col items-center mb-16 space-y-4">
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
            <h2 className="text-4xl font-black text-slate-900 tracking-tight text-center">Tentukan <span className="text-blue-600">Portal</span> Anda</h2>
            <p className="text-slate-400 font-bold text-center text-sm uppercase tracking-widest">Pilih peran Anda untuk masuk ke sistem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((item, i) => (
              <Link key={i} href={item.href} className="group">
                <div className="h-full bg-white rounded-[3rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100/50 group-hover:shadow-2xl group-hover:shadow-blue-600/10 group-hover:-translate-y-4 transition-all duration-700 flex flex-col items-start relative overflow-hidden">
                  <div className={cn(
                    "h-20 w-20 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner transition-transform duration-700 group-hover:rotate-12",
                    item.color === 'blue' ? "bg-blue-50 text-blue-600" :
                      item.color === 'indigo' ? "bg-indigo-50 text-indigo-600" : "bg-slate-900 text-white"
                  )}>
                    <item.icon className="h-10 w-10" />
                  </div>

                  <div className="space-y-4 mb-10">
                    <div className="space-y-1">
                      <p className={cn(
                        "text-[10px] font-black uppercase tracking-widest opacity-60",
                        item.color === 'blue' ? "text-blue-600" :
                          item.color === 'indigo' ? "text-indigo-600" : "text-slate-400"
                      )}>{item.role}</p>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none italic">{item.title}</h3>
                    </div>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-4 w-full mt-auto">
                    {item.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          item.color === 'blue' ? "bg-blue-600" :
                            item.color === 'indigo' ? "bg-indigo-600" : "bg-slate-900"
                        )} />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className={cn(
                    "absolute bottom-0 right-0 p-10 opacity-0 group-hover:opacity-10 transition-opacity duration-1000",
                    item.color === 'blue' ? "text-blue-600" :
                      item.color === 'indigo' ? "text-indigo-600" : "text-white"
                  )}>
                    <item.icon className="h-32 w-32 rotate-[-15deg] translate-x-12 translate-y-12" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-100 py-24">
        <div className="container mx-auto px-6">
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em]">© 2026 SIAKAD SYSTEM • VERSION 1.0</p>
            <div className="flex gap-8 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
              <span>Made with Excellence</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
