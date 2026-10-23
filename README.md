# Escape Parking Challenge

Game puzzle parkir mobil edukatif berbasis web. Susun langkah agar kendaraan keluar dari area parkir sesuai level yang dipilih.

## Tech Stack

- React 19 (TypeScript)
- Vite 6
- Tailwind CSS v4
- Framer Motion / Motion

## Cara Menjalankan

### Prerequisites
- **Node.js** 18+ (disarankan LTS)
- npm (sudah termasuk saat instal Node.js)

### 1. Masuk ke direktori project
```bash
cd escape-parking-challenge
```

### 2. Instal dependensi
```bash
npm install
```

### 3. Jalankan mode development
```bash
npm run dev
```
Buka di browser: **http://localhost:3000/escape-parking-challenge/**

> Base path project: `/escape-parking-challenge/` (lihat `vite.config.ts`).

### 4. Build untuk produksi
```bash
npm run build
```
Hasil build ada di folder `dist/`.

### 5. Jalankan hasil build secara lokal
```bash
npm run preview
```
Lalu buka URL yang muncul di terminal, biasanya:
**http://localhost:4173/escape-parking-challenge/**

### ⚠️ Jangan buka `dist/index.html` dengan drag-and-drop ke browser
Membuka file lewat protokol `file://` akan gagal (CORS / asset tidak termuat). Selalu sajikan `dist/` lewat HTTP, misalnya `npm run preview`, atau deploy ke hosting web.

## Script Lain

| Perintah | Keterangan |
| --- | --- |
| `npm run lint` | Cek TypeScript tanpa emit |
| `npm run clean` | Hapus artefak build |
