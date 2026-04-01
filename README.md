# 🎓 SIAKAD SKRIPSI (Frontend)

Sistem Informasi Akademik Manajemen Skripsi berbasis Web yang modern, inklusif, dan responsif. Dirancang dengan estetika "Minimalist Premium" untuk memudahkan pengelolaan siklus skripsi mahasiswa.

---

## ✨ Fitur Utama

### 👨‍🎓 Mahasiswa
- **Dashboard Progres**: Visualisir perjalanan skripsi dalam satu tampilan.
- **Pengajuan Proposal**: Sistem submit judul dan tema skripsi secara digital.
- **Log Bimbingan Digital**: Catatan aktivitas bimbingan yang transparan dan tervalidasi.
- **Pendaftaran Ujian**: Manajemen pendaftaran Sempro & Sidang Skripsi.

### 👨‍🏫 Dosen
- **Verifikasi Usulan Judul**: Peninjauan usulan judul skripsi mahasiswa.
- **Verifikasi Log**: Validasi aktivitas bimbingan mahasiswa dengan satu klik.
- **Tindak Lanjut Progres**: Memberikan arahan dan feedback langsung pada log mahasiswa.
- **Manajemen Jadwal**: Pantau jadwal ujian (Sempro/Sidang) yang ditetapkan prodi.

### 🏛️ Prodi / Admin
- **Verifikasi Proposal**: Peninjauan judul dan pemilihan pembimbing mahasiswa.
- **Plotting Jadwal**: Pengaturan waktu, ruangan, dan tim penguji ujian.
- **Manajemen Tema**: Pengelolaan database topik/tema skripsi per angkatan.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Runtime**: [Bun](https://bun.sh/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & Shadcn UI
- **State Management & Data Fetching**: TanStack Query (React Query) v5
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

---

## 🚀 Memulai

### 1. Instalasi
Pastikan Anda sudah menginstal [Bun](https://bun.sh/).

```bash
bun install
```

### 2. Konfigurasi
Sesuaikan URL Backend pada file `.env`:
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:4000/v1
```

### 3. Menjalankan Server
```bash
bun run dev
```

---

## 📂 Struktur Proyek

Aplikasi ini menggunakan pola **Feature-Based Architecture** untuk skalabilitas maksimal:
- `src/features`: Logika bisnis per modul (Guidance, Proposal, Defense, dll).
- `src/components/ui`: Library komponen UI atomik berbasis Shadcn.
- `src/hooks`: Custom hooks global.
- `src/schemas`: Validasi form menggunakan Zod.

---

## 💎 UI/UX Standards
- **Premium Headers**: Penggunaan side-aligned icons & absolute close button pada modal.
- **Tactile Interaction**: Animasi mikro pada tombol dengan feedback fisik (`hover:scale-[1.02]`, `active:scale-95`).
- **Minimalist Palette**: Dominasi Indigo-600 & Slate-50 dengan sentuhan aksen Emerald/Amber.

---

