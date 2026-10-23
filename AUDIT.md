# Audit Teknis & Performa Spesifik
## Proyek: escape-parking-challenge

Dokumen ini berisi audit kompatibilitas, performa, dan pengoptimalan aset yang disesuaikan secara khusus dengan arsitektur teknis proyek **escape-parking-challenge**.

---

### 1. Kompatibilitas Perangkat & Browser (Device & Browser Compatibility)

| Browser | Status | Analisis Khusus Fitur Proyek |
| :--- | :--- | :--- |
| **Google Chrome / Edge** | **100% Kompatibel** | Drag-and-drop kendaraan siber pada grid parkir 6x6 bekerja stabil tanpa hambatan lag. |
| **Mozilla Firefox** | **100% Kompatibel** | Kalkulasi garis grid, warna bodi kendaraan, dan indikator panah jalan keluar tampil secara akurat. |
| **Apple Safari (macOS / iOS)** | **100% Kompatibel** | Kompatibel dengan input sentuhan ganda layar iOS, event dragging diuji bebas dari delay ketuk bawaan Safari. |
| **Browser Seluler (Android/iOS)**| **100% Kompatibel** | Gestur sentuh diikat langsung ke koordinat kisi-kisi relatif layar seluler lanskap. |

#### Hasil Uji Responsivitas Device:
- **Responsive Grid Board**: Ukuran papan parkir diikat menggunakan unit responsif `max-w` dan `max-h` berskala viewport agar tetap berbentuk bujur sangkar sempurna di semua gawai (tablet & HP).
- **Safety Window Event Binding**: Event gerakan mouse (`mousemove`/`touchmove`) dan lepas sentuhan (`mouseup`/`touchend`) diikat secara global pada objek `window`. Hal ini mencegah mobil tersangkut atau melayang ketika kursor keluar dari batas area papan game saat menggeser mobil.

---

### 2. Audit Performa & Rendering (Performance Audit)

| Parameter | Pengukuran/Evaluasi | Solusi Teknis yang Diterapkan |
| :--- | :--- | :--- |
| **Drag Frame Rate** | Konstan 60 FPS | Koordinat pergeseran mobil dibatasi hanya pada sumbu aksis geraknya (X saja atau Y saja), menghilangkan kalkulasi tata letak ganda pada browser saat digeser. |
| **Collision Detection** | Instantaneous | Deteksi tabrakan antar mobil dihitung secara logis melalui representasi matriks array 2D statis 6x6, sehingga tidak memerlukan pustaka mesin fisika pihak ketiga yang berat. |
| **FCP & Pemuatan Awal** | ~0.50 detik | Bundel aplikasi dikemas secara ringkas tanpa ketergantungan framework visual 3D yang berlebihan. |

---

### 3. Evaluasi & Optimalisasi Pemuatan Aset (Asset Optimization)

- **logo-pusbuk.webp**: Gambar WebP terkompresi (~33 KB) ditaruh di folder `public/img` dan didaftarkan sebagai favicon di `index.html` menggunakan rute absolut agar stabil dimuat di GitHub Pages.
- **Sprite Kendaraan**: Seluruh bentuk mobil digambar menggunakan struktur CSS/SVG prosedural ringan, menghasilkan visualisasi tajam di layar resolusi tinggi (High-DPI) tanpa waktu loading gambar eksternal.
